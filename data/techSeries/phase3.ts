import { Phase } from './types'

const phase3: Phase = {
  n: 3,
  slug: 'phase-3',
  title: 'GitOps with Argo CD',
  short:
    'Make Git the source of truth: Argo CD deploys dev, staging and prod, with Gateway API and automatic TLS in front.',
  intro:
    'The cluster state lives in a second repository. Argo CD watches it and reconciles, and nobody applies manifests by hand.',
  tags: ['Argo CD', 'Helm', 'Envoy Gateway', 'cert-manager', 'Kubernetes'],
  topics: ['Argo CD', 'App of apps', 'Envoy Gateway', 'cert-manager', 'HPA', 'Network Policies'],
  status: 'published',
  goalText:
    'A GitOps loop where a commit is the only way to change the cluster: an Argo CD app-of-apps, a Helm chart with three environments, a Gateway API entry point and trusted HTTPS certificates that renew themselves.',
  outcomes: [
    {
      title: 'App of apps',
      text: 'One root Application points at child Applications for the platform and for each environment.',
      badge: 'Done',
    },
    {
      title: 'Helm chart',
      text: 'One chart, three values files: dev, staging and prod.',
      badge: 'Done',
    },
    {
      title: 'Gateway API',
      text: 'Envoy Gateway routes /api and /ws to the api and everything else to the web app.',
      badge: 'Done',
    },
    {
      title: 'Automatic TLS',
      text: "cert-manager issues and renews Let's Encrypt certificates.",
      badge: 'Done',
    },
    {
      title: 'Self-heal',
      text: 'Manual changes to the cluster are reverted to what Git says.',
      badge: 'Done',
    },
  ],
  steps: [
    {
      title: 'Build and push the images',
      text: 'az acr build uploads the source and builds inside Azure, so you do not need Docker on your machine.',
      code: '$ az acr build -r paktechacr -t paktech-chat-api:$TAG .\n$ az acr repository show-tags -n paktechacr --repository paktech-chat-api -o tsv',
      check: 'the tag appears for both the api and web repositories.',
    },
    {
      title: 'Lint and render the chart',
      text: 'Catch template mistakes before Argo CD finds them in the cluster.',
      code: '$ helm lint charts/paktech-chat -f environments/dev/values.yaml\n$ helm template dev charts/paktech-chat -f environments/dev/values.yaml | head -60',
      check: 'helm lint reports 0 charts failed and the template prints valid YAML.',
    },
    {
      title: 'Install Argo CD and apply the root app',
      text: 'This is the one thing you apply by hand. After it, Git drives everything.',
      code: '$ kubectl -n argocd rollout status deploy/argocd-server --timeout=5m\n$ kubectl apply -f bootstrap/root-app.yaml\n$ kubectl -n argocd get applications -w',
      check: 'the child applications appear and turn Synced and Healthy.',
    },
    {
      title: 'Check the gateway and the certificates',
      text: 'The edge resources must be programmed before TLS can be issued.',
      code: '$ kubectl get gatewayclass\n$ kubectl get gateway -n edge\n$ kubectl get certificate -A',
      check: 'the gateway is Programmed and every certificate is Ready.',
    },
    {
      title: 'Prove self-heal',
      text: 'Change the cluster by hand and watch Argo CD undo it.',
      code: '$ kubectl -n paktech-chat-dev patch deployment web -p \'{"spec":{"replicas":3}}\'\n$ kubectl -n paktech-chat-dev get deploy web -w',
      check: 'the deployment returns to one replica within seconds, with no Git change.',
    },
  ],
  flowIntro:
    'A change reaches the cluster only through Git. Sync waves order the work inside Argo CD.',
  flow: [
    { title: 'Commit', text: 'To the GitOps repo' },
    { title: 'Argo CD', text: 'Detects the change' },
    { title: 'Render', text: 'Helm chart + values' },
    { title: 'Sync', text: 'In wave order' },
    { title: 'Healthy', text: 'Pods ready' },
  ],
  rollback:
    'Revert the commit in the GitOps repository. Argo CD reconciles the cluster back to it.',
  figures: [
    {
      src: '/static/images/paktech-chat/p3-gitops-loop.png',
      alt: 'The GitOps loop: Git is the source of truth, Argo CD reconciles the cluster',
      caption: 'Figure: the GitOps loop.',
    },
    {
      src: '/static/images/paktech-chat/p3-request-path.png',
      alt: 'Request path through the gateway to the app',
      caption: 'Figure: the request path through Envoy Gateway. Only /api and /ws reach the api.',
    },
    {
      src: '/static/images/paktech-chat/p3-argocd-tiles.png',
      alt: 'Argo CD tiles: platform applications and the dev environment, all healthy',
      caption: 'Figure: Argo CD with the platform applications and the dev environment healthy.',
    },
    {
      src: '/static/images/paktech-chat/p3-chat-two-users.png',
      alt: 'Two users chatting in real time through the gateway',
      caption:
        'Figure: the browser proof. Two users, two windows, a message arriving live over wss.',
    },
  ],
  issues: [
    {
      problem: 'az acr build sat on "Packing source" for more than ten minutes',
      cause:
        'The upload included about 1 GB of node_modules and .next, because the CLI packer ignores trailing-slash folder rules in .dockerignore.',
      fix: 'Removed the trailing slashes and added a frontend .dockerignore. Builds dropped to about two minutes.',
    },
    {
      problem: 'The migrate Job crashed with "redis_port Input should be a valid integer"',
      cause:
        'Kubernetes injects service-link variables such as REDIS_PORT=tcp://..., and the app reads REDIS_PORT as a number.',
      fix: 'enableServiceLinks: false on every pod.',
    },
    {
      problem: 'cert-manager stayed OutOfSync while Healthy',
      cause:
        'The AKS admissions enforcer adds namespace selectors to every webhook, so Git never matches the live object.',
      fix: 'Read the exact fields in the Argo CD diff and ignored only those with jqPathExpressions.',
    },
    {
      problem: 'Certificates were Ready but browsers rejected them',
      cause: "The Gateway still used the Let's Encrypt staging issuer.",
      fix: 'Switched to the production issuer, deleted the four TLS secrets and let cert-manager reissue them.',
    },
  ],
  tradeoffs: [
    {
      title: 'Ingress controller or Gateway API',
      chose: 'Envoy Gateway with the Gateway API',
      why: 'ingress-nginx is being retired and the Gateway API is the direction Kubernetes is moving. It also makes it easy to expose only /api and /ws.',
      cost: 'Newer API, fewer examples, and a few more resources to understand.',
    },
    {
      title: 'Ignoring drift in Argo CD',
      chose: 'Ignore only the exact field that drifts',
      why: 'A broad ignore rule hides real drift along with the harmless kind.',
      cost: 'You have to read the diff and write a precise jqPathExpression.',
    },
  ],
  qa: [
    {
      q: 'What does GitOps change about how you deploy?',
      a: 'The repository is the only way in. Argo CD reconciles the cluster to it, reverts manual changes and gives you history and rollback for free.',
    },
    {
      q: 'What is the app-of-apps pattern for?',
      a: 'One root Application owns the child Applications, so bootstrapping a whole cluster is a single apply, and ordering is handled with sync waves.',
    },
    {
      q: 'An app is OutOfSync but Healthy. What do you do?',
      a: 'Read the diff. If a controller mutates a field you do not own, ignore that exact field. Never ignore more than the field that drifts.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase3
