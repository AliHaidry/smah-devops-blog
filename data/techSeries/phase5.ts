import { Phase } from './types'

const phase5: Phase = {
  n: 5,
  slug: 'phase-5',
  title: 'Runtime and cluster security',
  short:
    'Assume an attacker gets a foothold and limit the damage: a locked-down control plane, admission policy, hardened pods, controlled egress and runtime detection.',
  intro:
    'Assume someone gets a foothold. Make that foothold small: lock the control plane, check what is admitted, harden the pods, control what they can talk to, and watch what they do.',
  tags: ['Kubernetes', 'Gatekeeper', 'Cilium', 'Falco', 'Trivy Operator'],
  topics: [
    'Gatekeeper',
    'Egress policies',
    'Read-only filesystem',
    'Image digests',
    'Falco',
    'Trivy Operator',
  ],
  status: 'published',
  goalText:
    'Phases 1 to 4 made the app correct, repeatable and automatically deployed. This phase asks what happens when something goes wrong or someone hostile gets in. A stolen kubeconfig, a vulnerable dependency or a bad image should each be stopped by a different layer.',
  outcomes: [
    {
      title: 'Network hardening',
      text: 'The API server and Key Vault answer only listed networks.',
      badge: 'Live',
    },
    {
      title: 'Admission control',
      text: 'Gatekeeper checks every pod against seven policies, all enforced with deny.',
      badge: 'Live',
    },
    {
      title: 'Pod hardening',
      text: 'Read-only root filesystem, no extra capabilities, images pinned by digest.',
      badge: 'Live',
    },
    {
      title: 'Egress control',
      text: 'Each workload may reach only what it needs, and no API token is mounted.',
      badge: 'Live',
    },
    {
      title: 'Runtime detection',
      text: 'Falco watches system calls; Trivy Operator keeps vulnerability reports.',
      badge: 'Live',
    },
  ],
  steps: [
    {
      title: 'Restrict who can reach the API server and Key Vault',
      text: 'Add authorized IP ranges and a Key Vault firewall in Terraform, then read the plan before you apply it.',
      code: '$ terraform init\n$ terraform plan -out p5.tfplan\n$ terraform show p5.tfplan | grep -E "will be|must be|forces replacement"\n$ terraform apply p5.tfplan',
      check:
        'kubectl get nodes from a network that is not on the list times out; yours still works.',
    },
    {
      title: 'Install Gatekeeper and roll policies out slowly',
      text: 'Each constraint moves through dryrun, warn and deny, and only after its audit list is empty.',
      code: "$ kubectl get constrainttemplates\n$ kubectl get constraints\n$ kubectl describe k8spspreadonlyrootfilesystem | sed -n '/Violations/,$p'",
      check: 'the audit shows zero violations before you raise the enforcement level.',
    },
    {
      title: 'Prove a policy both ways',
      text: 'Reject a pod that breaks the rule, for the reason you expect, and admit the real deployment. The test pod must be compliant in every other respect.',
      code: '$ kubectl -n paktech-chat-dev apply --dry-run=server -f test-pod-tag-only.yaml\n# Forbidden: uses an image without a digest\n$ kubectl -n paktech-chat-dev apply --dry-run=server -f test-pod-digest.yaml',
      check: 'the tag-only pod is rejected with the digest message and the digest pod is admitted.',
    },
    {
      title: 'Turn on egress policies in dev',
      text: 'Take a baseline of what every pod can reach, enable the flag, then run the same test again and compare.',
      code: '$ bash scripts/egress-test.sh paktech-chat-dev     # before\n$ kubectl get networkpolicy -n paktech-chat-dev\n$ bash scripts/egress-test.sh paktech-chat-dev     # after',
      check:
        'the metadata address and port 80 flip from OPEN to BLOCKED; postgres, redis and the app still work.',
    },
    {
      title: 'Stop mounting the Kubernetes API token',
      text: 'None of the app pods call the Kubernetes API, so the default service account token is pure risk.',
      code: '$ kubectl exec -n paktech-chat-dev deploy/api -- ls /var/run/secrets/kubernetes.io/serviceaccount\n# ls: cannot access ... No such file or directory',
      check: 'the pods start, secrets still mount, and the folder is gone.',
    },
    {
      title: 'Check Falco and the vulnerability reports',
      text: 'Run a throwaway pod that reads a sensitive file, then read what Falco and Trivy Operator saw.',
      code: '$ kubectl get pods -n falco -o wide\n$ kubectl logs -n falco -l app.kubernetes.io/name=falco --tail=20\n$ kubectl get vulnerabilityreports -n paktech-chat-dev -o wide',
      check:
        'Falco logs a sensitive-file event with pod, namespace and image, and the reports list your images.',
    },
  ],
  flowIntro:
    'Every control ships the same way: behind a flag that is off by default, so merging changes nothing until you enable it for one environment.',
  flow: [
    { title: 'Flag off', text: 'Merge, nothing changes' },
    { title: 'Dev', text: 'Baseline test first' },
    { title: 'Verify', text: 'After-test and app check' },
    { title: 'Staging', text: 'Same test, same check' },
    { title: 'Prod', text: 'Manual sync' },
  ],
  rollback:
    'Set the flag back to false (or lower the constraint to warn), merge, and Argo CD removes the policies.',
  figures: [
    {
      src: '/static/images/paktech-chat/p5-layers.png',
      alt: 'Five layers: API server, admission, pod hardening, network policies, runtime detection',
      caption: 'Figure: the five layers. Each one assumes the one above it failed.',
    },
  ],
  issues: [
    {
      problem: 'The API server was still reachable after the egress policies',
      cause:
        'Cilium evaluates policy on the translated backend address, so excluding the service range never matched.',
      fix: 'Stop mounting the service account token (automountServiceAccountToken: false), so a reachable API server is useless to a pod.',
    },
    {
      problem: 'Trivy Operator reported HIGH findings in my own images',
      cause:
        'Build tooling the runtime never uses: npm, corepack and yarn in the web image; setuptools and wheel in the api image.',
      fix: 'Remove the tooling in the final image, in the same layer as the install. The web image went from 10 HIGH to none.',
    },
    {
      problem: 'My "tooling removed" check printed success while Docker was stopped',
      cause: 'The check ended in || echo ok, so it passed when the command never ran.',
      fix: 'Run the command first, save its output, then grep the output.',
    },
    {
      problem: 'A test pod was rejected by the wrong policy',
      cause:
        'A native admission policy fires before the webhook, so a pod without a security context never reached Gatekeeper.',
      fix: 'Make the test pod compliant in every other respect, so only the rule under test can reject it.',
    },
  ],
  tradeoffs: [
    {
      title: 'Authorized IP ranges or a private cluster',
      chose: 'Authorized IP ranges',
      why: 'It is cheap, quick to roll back and needs no VPN or jump host for a one-person lab.',
      cost: 'The API endpoint stays public, so the allow-list must follow your IP when it changes.',
    },
    {
      title: 'Webhook fails open or fails closed',
      chose: 'Fail open',
      why: 'If the policy pod is down, the cluster can still be repaired.',
      cost: 'A short window with no admission checks, covered by audits and the other layers.',
    },
  ],
  qa: [
    {
      q: 'How do you secure a Kubernetes cluster beyond the defaults?',
      a: 'In layers: restrict the control plane, enforce policy at admission, harden the pods, limit traffic in both directions, pin images by digest, and watch at runtime. Each layer assumes another failed.',
    },
    {
      q: 'What does a default-deny egress policy break first?',
      a: 'DNS. Allow kube-dns explicitly, then the specific upstreams, and remember the metadata address and private ranges when you allow the internet.',
    },
    {
      q: 'How do you prove a network control works?',
      a: 'Run a before-and-after test from inside the pods, including paths that must stay open and paths that must close. Controls without a failing test are assumptions.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase5
