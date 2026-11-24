import { Phase } from './types'

const phase2: Phase = {
  n: 2,
  slug: 'phase-2',
  title: 'Infrastructure with Terraform',
  short:
    'Create the Azure platform as code: cluster, registry, vault and identity, with remote state.',
  intro:
    'Everything below the cluster is code: AKS, the registry, Key Vault, DNS and the identities that let GitHub and pods talk to Azure without a single stored secret.',
  tags: ['Terraform', 'AKS', 'ACR', 'Key Vault', 'Azure'],
  topics: ['AKS', 'ACR', 'Key Vault', 'Workload Identity', 'Azure DNS', 'Blob state'],
  status: 'published',
  goalText:
    'A repeatable Azure platform that you can destroy and rebuild: three node pools, a private registry, a vault with RBAC, workload identity for pods, GitHub OIDC for the pipeline and DNS for the domain, all in Terraform with remote state in a separate resource group.',
  outcomes: [
    {
      title: 'Remote state',
      text: 'A separate resource group and private storage account, so destroying the platform never touches the state.',
      badge: 'Done',
    },
    {
      title: 'AKS with three node pools',
      text: 'system (tainted for add-ons), apps for workloads, monitoring (tainted) for observability.',
      badge: 'Done',
    },
    {
      title: 'Registry and vault',
      text: 'ACR Basic with admin disabled; Key Vault with RBAC and soft delete.',
      badge: 'Done',
    },
    {
      title: 'Identity without secrets',
      text: 'Workload identity for pods and GitHub OIDC for the pipeline. No client secret exists.',
      badge: 'Done',
    },
    {
      title: 'DNS',
      text: 'An Azure DNS zone for the domain with Terraform-managed records.',
      badge: 'Done',
    },
  ],
  stepsNote:
    'The first apply planned and created 29 resources, and a second plan showed no changes.',
  steps: [
    {
      title: 'Check the tools and sign in with MFA',
      text: 'Confirm versions and log in. If your tenant requires MFA for management operations, use the claims login command the error prints.',
      code: '$ az version\n$ terraform version      # needs >= 1.6.0\n$ az login\n$ az account show -o table',
      check: 'the subscription you expect is the active one.',
    },
    {
      title: 'Create the remote state',
      text: 'A separate resource group, a private storage account and a container, using your Azure AD token instead of an account key. In Git Bash, stop path rewriting first.',
      code: '$ export MSYS_NO_PATHCONV=1\n$ az group create rg-paktech-tfstate\n$ az storage container create --auth-mode login ...',
      check: 'terraform init succeeds and connects to the azurerm backend.',
    },
    {
      title: 'Validate, plan, read the plan, apply',
      text: 'Read the plan before you apply it. Save it to a file so apply runs exactly what you reviewed.',
      code: '$ terraform init\n$ terraform fmt -recursive\n$ terraform validate\n$ terraform plan -out tfplan\n$ terraform apply tfplan',
      check:
        'the plan says 29 to add, 0 to change, 0 to destroy, and a second plan shows no changes.',
    },
    {
      title: 'Verify the platform',
      text: 'Check the node pools and taints, the registry settings and the vault, then read the outputs.',
      code: '$ kubectl get nodes -L workload,agentpool\n$ az acr show -n paktechacr --query "{sku:sku.name,admin:adminUserEnabled}" -o table\n$ terraform output',
      check: 'three pools are present, ACR admin is false, and the DNS name servers are printed.',
    },
    {
      title: 'Stop the cluster when you are not working',
      text: 'The lab cluster costs money while it runs, so stop it between sessions.',
      code: '$ az aks stop  -g rg-paktech-prod -n aks-paktech-prod\n$ az aks start -g rg-paktech-prod -n aks-paktech-prod',
      check: 'powerState.code reads Stopped, then Running after a start.',
    },
  ],
  flowIntro: 'Infrastructure changes follow the same read-then-apply path every time.',
  flow: [
    { title: 'Edit', text: 'Terraform files' },
    { title: 'Validate', text: 'fmt and validate' },
    { title: 'Plan', text: 'Save to a file' },
    { title: 'Review', text: 'Read every change' },
    { title: 'Apply', text: 'Apply the saved plan' },
  ],
  rollback:
    'Revert the change in Git and apply again, or destroy only the resources you added. The state lives outside the platform, so it survives a destroy.',
  figures: [
    {
      src: '/static/images/paktech-chat/p2-resource-map.png',
      alt: 'Resource map: what Terraform creates and how the pieces connect',
      caption: 'Figure: what Terraform creates and how the pieces connect.',
    },
  ],
  issues: [
    {
      problem: 'The bootstrap script stopped with AADSTS50076',
      cause:
        'The tenant requires MFA for management operations, and the old login token had no MFA claim.',
      fix: 'Ran the claims login command the error printed, completed MFA and re-ran the script.',
    },
    {
      problem: 'terraform init failed with 403 listing blobs',
      cause:
        'Git Bash rewrote the /subscriptions/... scope into a Windows path, so a role assignment silently failed, and the script hid the error with 2>/dev/null.',
      fix: 'MSYS_NO_PATHCONV=1, create the assignment by hand, and stop hiding errors in the script.',
    },
  ],
  tradeoffs: [
    {
      title: 'Where PostgreSQL and Redis run',
      chose: 'In the cluster, as StatefulSets',
      why: 'It gives hands-on experience with storage, identity and backups.',
      cost: 'You own upgrades and recovery. In production I would use managed services.',
    },
    {
      title: 'Registry tier',
      chose: 'ACR Basic with admin disabled',
      why: 'It is cheap for a lab, and access goes through identities instead of a shared password.',
      cost: 'No geo-replication or private link on this tier.',
    },
  ],
  qa: [
    {
      q: 'Why keep Terraform state in a separate resource group?',
      a: 'So destroying or rebuilding the platform cannot delete the state that describes it, and access to state can be controlled separately.',
    },
    {
      q: 'How does the pipeline authenticate to Azure without a secret?',
      a: 'GitHub issues a short-lived OIDC token for the workflow, and Azure trusts it through a federated credential scoped to the repository and branch or environment.',
    },
    {
      q: 'Why three node pools?',
      a: 'Isolation. Tainted system and monitoring pools keep add-ons and observability load from competing with the chat workloads.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase2
