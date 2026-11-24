import { Phase } from './types'

const phase4: Phase = {
  n: 4,
  slug: 'phase-4',
  title: 'CI/CD and DevSecOps',
  short:
    'A pipeline that tests, scans and ships: GitHub Actions with OIDC, security gates and a manual production approval.',
  intro:
    'CI/CD here is a gate before it is a conveyor belt. Every promotion is a pull request, and a change reaches a pod only after it has passed the checks.',
  tags: ['GitHub Actions', 'OIDC', 'Trivy', 'Semgrep', 'Checkov'],
  topics: ['GitHub Actions', 'OIDC', 'Trivy', 'Semgrep', 'Checkov', 'Branch protection'],
  status: 'published',
  goalText:
    'A delivery path with no stored cloud credentials: four parallel quality and security jobs on every pull request, images built in ACR Tasks and scanned by digest, the digest committed to the GitOps repository, and production behind an approval and a manual sync.',
  outcomes: [
    {
      title: 'Quality and security gates',
      text: 'backend, semgrep, frontend and iac jobs run in parallel on every pull request.',
      badge: 'Done',
    },
    {
      title: 'Build in the cloud, scan by digest',
      text: 'ACR Tasks builds the images; Trivy scans repo@digest, the exact bytes that will run.',
      badge: 'Done',
    },
    {
      title: 'Promotion by pull request',
      text: 'feature, develop, staging and main map to the three environments.',
      badge: 'Done',
    },
    {
      title: 'Approval gate for prod',
      text: 'A GitHub environment needs a reviewer, then a manual Argo CD sync.',
      badge: 'Done',
    },
    {
      title: 'Rehearsed rollback',
      text: 'rollback.yml restores the previous values with one commit.',
      badge: 'Done',
    },
  ],
  steps: [
    {
      title: 'Open a pull request and read the checks',
      text: 'The four jobs run in parallel: backend (tests, Bandit, pip-audit), semgrep, frontend (lint, build, npm audit) and iac (Terraform validate, Checkov, Trivy config scan).',
      code: '$ gh pr create --fill\n$ gh pr checks',
      check: 'all four jobs are green before a merge is possible.',
    },
    {
      title: 'Let the build job do its work',
      text: 'On a push, the job logs in to Azure with OIDC, builds both images in ACR Tasks, resolves each digest and scans repo@digest with Trivy.',
      code: '$ gh run view\n$ az acr repository show-tags -n paktechacr --repository paktech-chat-api -o table',
      check: 'the new tag exists in the registry and the Trivy step passed.',
    },
    {
      title: 'Watch the gitops job commit the digest',
      text: 'The job commits the new digest to the GitOps repository. For dev and staging, Argo CD syncs automatically.',
      code: '$ kubectl -n paktech-chat-dev get pods -w\n$ kubectl get applications -n argocd',
      check: 'new pods start before the old ones stop, and the application is Synced.',
    },
    {
      title: 'Approve and promote to prod',
      text: 'The gitops job waits at the prod environment gate. After approval, read the two-line digest diff in Argo CD and sync by hand.',
      code: '# GitHub: approve the pending prod deployment\n# Argo CD: App Diff -> read the digest change -> Sync',
      check: 'the prod application is OutOfSync until you sync, then Healthy with the new digest.',
    },
    {
      title: 'Rehearse the rollback',
      text: 'Run the manual rollback workflow for dev with one step back, then roll forward again.',
      code: '# Actions -> rollback.yml -> Run workflow (environment dev, steps_back 1)',
      check:
        'a commit restores the previous tag, new pods start before old ones stop, and the app keeps working.',
    },
  ],
  flowIntro: 'The path from a push to a running pod, with the gate where prod waits for a human.',
  flow: [
    { title: 'Push', text: 'Pull request' },
    { title: 'Checks', text: 'Four parallel jobs' },
    { title: 'Build', text: 'ACR Tasks, OIDC' },
    { title: 'Scan', text: 'Trivy by digest' },
    { title: 'GitOps commit', text: 'Digest to Git' },
    { title: 'Argo CD', text: 'Auto, or manual in prod' },
  ],
  rollback:
    'Run rollback.yml. It restores the previous values file in the GitOps repository, and Argo CD redeploys the old image. Argo CD polls every 3 minutes, so use a hard refresh to speed it up.',
  figures: [
    {
      src: '/static/images/paktech-chat/p4-pipeline.png',
      alt: 'The pipeline from git push to a running pod',
      caption: 'Figure: the pipeline from git push to a running pod.',
    },
    {
      src: '/static/images/paktech-chat/p4-actions-green.png',
      alt: 'A green pipeline run: four checks in parallel, then build and gitops',
      caption: 'Figure: a green run. Four checks in parallel, then build and gitops.',
    },
    {
      src: '/static/images/paktech-chat/p4-prod-approval-gate.png',
      alt: 'The prod approval gate: gitops waits for a reviewer',
      caption: 'Figure: the production approval gate.',
    },
  ],
  issues: [
    {
      problem: 'The Trivy scan blocked the first image',
      cause:
        'python-jose 3.3.0, CVE-2024-33663 (critical, algorithm confusion in the JWT library). The base image had zero findings; the vulnerable code was my dependency.',
      fix: 'Merged the Dependabot bump to 3.5.0 after its checks passed, re-scanned, and verified a fresh login and chat on the new library.',
    },
    {
      problem: 'backend failed because black would reformat a file',
      cause: 'CI installed an unpinned, newer black than pre-commit uses.',
      fix: 'Pinned black, isort and bandit to the pre-commit versions.',
    },
    {
      problem: 'Bandit passed locally but failed in CI',
      cause:
        'Local Python 3.14 breaks Bandit 1.7.8, so it scanned zero files and looked clean. CI runs 3.11.',
      fix: 'Reviewed the two real findings and added targeted nosec comments with rule numbers.',
    },
    {
      problem: 'The Trivy step exited 1 with no message',
      cause:
        'The install script wrote to a read-only path and curl -s hid the error; then the pinned release asset returned 404 after the 2026 Trivy ecosystem supply-chain compromise.',
      fix: 'Stopped piping an install script from main. Download a pinned release by URL and verify a hard-coded SHA-256 before running it.',
    },
    {
      problem: 'GITOPS_TOKEN was visible on screen',
      cause: 'It was created as a repository variable, which is plain text.',
      fix: 'Deleted it, revoked the token and saved a new one under Secrets.',
    },
  ],
  tradeoffs: [
    {
      title: 'Where images are built',
      chose: 'ACR Tasks, not the runner',
      why: 'Nothing is built on the runner, the image never leaves Azure on the way to the registry, and the digest comes straight from ACR.',
      cost: 'Build logs live in two places and the build depends on ACR Tasks being available.',
    },
    {
      title: 'Production deployment',
      chose: 'Approval plus a manual sync',
      why: 'Two deliberate human steps for the environment that matters, with a readable two-line diff in between.',
      cost: 'Slower releases and a person who has to be there.',
    },
    {
      title: 'Tag or digest',
      chose: 'Digest everywhere',
      why: 'A tag can be moved after it was scanned; a digest cannot. The scan, the commit and the running pod refer to the same bytes.',
      cost: 'Less readable than tags, so the pipeline records both.',
    },
  ],
  qa: [
    {
      q: 'Why scan by digest instead of tag?',
      a: 'A tag is mutable. Scanning repo@digest guarantees the bytes you scanned are the bytes you deploy.',
    },
    {
      q: 'How does GitHub Actions deploy to Azure with no stored secret?',
      a: 'It requests a short-lived OIDC token for the workflow run, and Azure trusts it through a federated credential limited to the repository, branch or environment.',
    },
    {
      q: 'Tell me about a security gate that worked.',
      a: 'The first image the pipeline scanned was blocked for a critical JWT library CVE in a dependency of mine. I merged the upgrade after its checks, the scan passed, and I verified login. A scanner that has never failed a build is an unproven control.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase4
