export interface Project {
  title: string
  description: string
  longDescription: string
  category: 'Observability' | 'Automation' | 'CI/CD' | 'Cloud' | 'IaC' | 'Personal'
  company: string
  role: string
  period: string
  stack: string[]
  impact: string
  impactDetail: string
  architecture?: string[]
  href?: string
  github?: string
  status: 'Production' | 'Completed' | 'In Progress'
}

const projectsData: Project[] = [
  {
    title: 'Unified Marketing Platform — Observability & Monitoring Stack',
    description:
      'A production-grade, 4-phase observability platform built from scratch — covering infrastructure metrics, multi-service application monitoring, real-time log stream processing, and a hardened HTTPS-secured Grafana portal with intelligent alerting.',
    longDescription:
      'Designed and operationalised a complete observability platform for a multi-server Linux production environment. The architecture spans 4 phases: core metrics with Prometheus and Node Exporter, parallel expansion with application exporters and a Kafka-based log pipeline, advanced stream processing for high-volume logs with Apache Flink, and platform hardening with SSL termination, alert routing, and GitOps-managed configuration.',
    category: 'Observability',
    company: 'Curve Digital Solutions',
    role: 'Senior DevOps Engineer',
    period: 'Aug 2025 – Present',
    stack: [
      'Prometheus',
      'Grafana',
      'Loki',
      'Fluent Bit',
      'Kafka',
      'Promtail',
      'Alertmanager',
      'Apache Flink',
      'Nginx',
      'Node Exporter',
      'Linux',
      'Ansible',
    ],
    impact: '100% Ops Visibility',
    impactDetail:
      '10+ production servers — metrics, logs, and alerts unified in one HTTPS-secured portal',
    architecture: [
      'Phase 1 — Core metrics: Prometheus + Node Exporter deployed on the controller node; Grafana connected as data source; Alertmanager wired for email alerts; foundational rules for InstanceDown, HighCPU, and DiskFill',
      'Cross-platform telemetry: Node Exporter on Linux servers (CentOS, AlmaLinux, Ubuntu), Windows Exporter on Windows VMs, and Node Exporter deployed inside Hyper-V managed VMs — giving unified infrastructure visibility across all three environments in a single Grafana dashboard',
      'Phase 2A — Application exporters: Nginx Exporter (stub_status), MySQL Exporter, BIND Exporter, and Windows Exporter deployed per server — all scraped via a unified prometheus.yml with 6 scrape jobs',
      'Phase 2B — Log pipeline: Fluent Bit collects systemd journal logs → ships to Kafka (KRaft mode, no ZooKeeper) → Promtail consumes from central-logs topic → pushes to Loki → visible in Grafana Explore',
      'Phase 3 — Stream processing: Apache Flink deployed for high-volume PMTA log processing; dedicated Kafka topic with 4 partitions; Flink aggregates delivery/bounce metrics per domain per minute and exposes to Prometheus; critical events routed directly to Loki',
      'Phase 4 — Platform hardening: Nginx reverse proxy with wildcard SSL terminates all traffic; Grafana, Prometheus (/prometheus/), and Alertmanager (/alertmanager/) all served over HTTPS; all internal ports closed externally via iptables',
      'Alertmanager routing by severity: critical → PagerDuty, warning → Slack; inhibit rules suppress warning noise when critical fires for the same alert',
      'GitOps: all configs (prometheus.yml, alertmanager.yml, loki-config.yml, fluent-bit.conf, Grafana dashboard JSON) version-controlled in Git; Ansible playbooks deploy exporters to new hosts',
      'Self-monitoring: Prometheus scrapes itself, Alertmanager, Grafana, Loki, and Kafka — the monitoring stack monitors itself',
    ],
    status: 'Production',
  },
  {
    title: 'Ansible Playbook Orchestration — Server Deployment Automation',
    description:
      'A database-driven Python orchestration framework that automates the full lifecycle of a managed Linux server — from bare provisioning to a hardened, application-ready production host across multiple Linux distributions.',
    longDescription:
      'Built a production-grade orchestration system that replaces manual server setup with a fully automated, database-driven pipeline. A Python control plane reads deployment state from MySQL, bootstraps SSH access, and executes 21 ordered Ansible playbooks across 6 deployment stages — covering hardware validation, security hardening, service installation, and application transfer.',
    category: 'Automation',
    company: 'Curve Digital Solutions',
    role: 'DevOps Engineer → Senior DevOps Engineer',
    period: 'Aug 2024 – Present',
    stack: [
      'Python',
      'Ansible',
      'MySQL',
      'Linux',
      'Bash',
      'Nginx',
      'Redis',
      'Prometheus',
      'Fluentd',
      'PowerShell',
    ],
    impact: '24 Automated Steps',
    impactDetail: 'Full server lifecycle — bare metal to production-ready in one command',
    architecture: [
      'Operator triggers playbook_orchestrator_active.py with target server IDs — one thread spun per server',
      'Orchestrator reads deployment state from MySQL (servers, deployment_steps, playbooks tables) and bootstraps passwordless SSH with automatic credential rotation',
      'Per-server Ansible inventory generated dynamically; Python pre-checks and bootstraps on managed nodes automatically',
      '21 Ansible playbooks executed in priority order across 6 stages: hardware validation → security cleanup → system config → service installation → final checks → app transfer',
      'Every playbook result written back to MySQL (status, logs, timestamps) — full audit trail per server per step',
      'Critical playbook failures trigger immediate abort; non-critical failures skip with warning and continue',
      'After DS:1–5 complete, server auto-promoted to active and app-transfer orchestrator invoked automatically',
      'Post-deployment firewall orchestrator triggered automatically on successful app transfer',
    ],
    status: 'Production',
  },
  {
    title: 'Hyper-V VM Lifecycle Automation',
    description:
      'Full automation of Windows Server 2022 Hyper-V infrastructure — covering DHCP, NAT, DNS, WinRM, firewall rules, VM provisioning, suspend/resume, and user management via PowerShell.',
    longDescription:
      'Built a comprehensive PowerShell automation framework that manages the complete VM lifecycle on Hyper-V. Eliminated all manual provisioning steps — from network configuration to VM creation — reducing infrastructure setup from hours to minutes.',
    category: 'Automation',
    company: 'Curve Digital Solutions',
    role: 'Senior DevOps Engineer',
    period: 'Aug 2025 – Present',
    stack: ['PowerShell', 'Hyper-V', 'Windows Server 2022', 'DHCP', 'DNS', 'NAT', 'WinRM'],
    impact: 'Zero Manual Provisioning',
    impactDetail: 'VM lifecycle fully automated — image creation to deletion',
    architecture: [
      'PowerShell modules manage DHCP, NAT, DNS and firewall rules',
      'VM image creation automated with custom base templates',
      'Suspend, resume, and deletion handled via script pipelines',
      'WinRM configured for remote management across all VMs',
      'User access and permissions managed programmatically',
    ],
    status: 'Production',
  },
  {
    title: 'Jenkins CI/CD Pipeline — Unified Marketing Platform',
    description:
      'End-to-end CI/CD pipeline integrating Jenkins, GitHub, Docker Hub, and Ansible playbooks — automating build, test, and deployment across development and production environments.',
    longDescription:
      'Designed and maintained Jenkins pipelines that automate the full software delivery lifecycle for the Unified Marketing Platform. Integrated GitHub webhooks for trigger-based builds, Docker Hub for image management, and Ansible for configuration-driven deployments.',
    category: 'CI/CD',
    company: 'Curve Digital Solutions',
    role: 'DevOps Engineer',
    period: 'Aug 2024 – Jul 2025',
    stack: ['Jenkins', 'GitHub', 'Docker', 'Docker Hub', 'Ansible', 'Python', 'MySQL', 'Linux'],
    impact: '25% Faster Releases',
    impactDetail: 'Automated builds replaced manual deployments across all environments',
    architecture: [
      'GitHub webhooks trigger Jenkins on every push to main',
      'Jenkins builds and tags Docker images automatically',
      'Images pushed to Docker Hub for versioned storage',
      'Ansible playbooks handle environment-specific deployments',
      'Python scripts automate pre and post-deployment tasks',
    ],
    status: 'Completed',
  },
  {
    title: 'Azure Sandbox & FinOps Framework',
    description:
      'Led the deployment and administration of an Azure learning environment for LOBs to experiment with POCs — including a FinOps cost governance framework that saved $1,200/month.',
    longDescription:
      'Acted as product owner for the Azure Sandbox environment at TD Bank, enabling Lines of Business to safely experiment with Azure services. Built a FinOps framework using resource tagging to track, allocate, and optimise cloud spend across engineering teams.',
    category: 'Cloud',
    company: 'TD Bank Group',
    role: 'IT Ops Specialist',
    period: 'Feb 2022 – May 2024',
    stack: [
      'Azure',
      'Azure Functions',
      'Azure VMs',
      'Azure Storage',
      'Terraform',
      'Datadog',
      'PowerShell',
    ],
    impact: '$1,200/mo Saved',
    impactDetail: '100% LOB satisfaction — all POCs completed successfully',
    architecture: [
      'Azure Web Services, VMs and Storage provisioned per LOB request',
      'Resource tags applied at deployment for cost allocation',
      'FinOps dashboards track spend per team in real time',
      'Azure Functions automate sandbox cleanup and cost alerts',
      'Datadog monitors infrastructure health and usage metrics',
    ],
    status: 'Completed',
  },
  {
    title: 'AWS CI/CD Pipeline — mobileLIVE',
    description:
      'Implemented a full CI/CD pipeline on AWS using Elastic Beanstalk, CodeDeploy, CodePipeline and CodeBuild — plus foundational Terraform modules for infrastructure provisioning.',
    longDescription:
      'During my internship at mobileLIVE, contributed to implementing the CI/CD pipeline for an in-house project on AWS. Also developed reusable Terraform modules that reduced manual infrastructure work significantly.',
    category: 'CI/CD',
    company: 'mobileLIVE',
    role: 'Intern DevOps Engineer',
    period: 'Jan 2020 – Sep 2020',
    stack: [
      'AWS',
      'Elastic Beanstalk',
      'CodeDeploy',
      'CodePipeline',
      'CodeBuild',
      'Terraform',
      'CloudWatch',
    ],
    impact: '25% Deployment Efficiency',
    impactDetail: 'Terraform modules reduced manual workload by 40%',
    architecture: [
      'CodePipeline orchestrates the full build-test-deploy workflow',
      'CodeBuild compiles and tests application on every commit',
      'Elastic Beanstalk manages application environment scaling',
      'CodeDeploy handles zero-downtime deployments',
      'Terraform modules provision reusable AWS infrastructure',
    ],
    status: 'Completed',
  },
  {
    title: 'GCP Kubernetes Deployment',
    description:
      'Containerised and deployed applications on GCP using Docker, Kubernetes, and Helm — achieving a 70% improvement in deployment speed through standardised chart-based releases.',
    longDescription:
      'Collaborated with the mobileLIVE team to containerise application workloads and deploy them on GCP via Kubernetes. Used Helm charts to standardise deployments and reduce configuration drift across environments.',
    category: 'IaC',
    company: 'mobileLIVE',
    role: 'Intern DevOps Engineer',
    period: 'Jan 2020 – Sep 2020',
    stack: ['GCP', 'Kubernetes', 'Docker', 'Helm', 'YAML', 'kubectl'],
    impact: '70% Faster Deployments',
    impactDetail: 'Helm charts standardised releases across all environments',
    architecture: [
      'Docker images built and tagged per application version',
      'Kubernetes manifests manage pod scheduling and scaling',
      'Helm charts template environment-specific configurations',
      'kubectl pipelines automate rollout and rollback',
      'GCP provides managed Kubernetes cluster infrastructure',
    ],
    status: 'Completed',
  },
  {
    title: 'paktech-hello — GitOps CI/CD on Azure Kubernetes Service',
    description:
      'A end-to-end GitOps implementation on Azure — provisioning AKS, ACR, and Argo CD via Terraform, then wiring GitHub Actions CI and Argo CD pull-based delivery so every code push automatically builds, tags, and reconciles a live Flask application on Kubernetes.',
    longDescription:
      'Built a complete GitOps pipeline following the Microsoft Architecture Center Scenario 3 blueprint. The project demonstrates production-grade practices: two-repo separation, keyless OIDC authentication, declarative infrastructure with Terraform, and continuous reconciliation with Argo CD — all the way to a live public-IP Flask application on AKS.',
    category: 'Personal',
    company: 'PakTechLimited',
    role: 'Personal Project',
    period: '2025',
    stack: [
      'Azure',
      'AKS',
      'Terraform',
      'Argo CD',
      'GitHub Actions',
      'Docker',
      'Python',
      'Flask',
      'Kubernetes',
      'ACR',
      'Helm',
      'OIDC',
    ],
    impact: 'Full GitOps Loop',
    impactDetail: 'Code push → CI → ACR → GitOps repo → Argo CD → live AKS in ~7 minutes',
    architecture: [
      'Two-repo separation: paktech-hello (app code, Dockerfile, GitHub Actions CI) and paktech-hello-gitops (Kubernetes YAML manifests) — app CI and cluster state are fully independent lifecycles',
      'Terraform provisions all Azure infrastructure in one apply: Resource Group, ACR, AKS cluster (Standard_B2s), Argo CD via Helm release, OIDC federation for GitHub Actions — no manual Azure portal clicks',
      'GitHub Actions CI pipeline runs three jobs in sequence: lint (Ruff + Black) → build & push Docker image to ACR (tagged with run-number + short SHA) → update image tag in GitOps repo via authenticated commit',
      'OIDC keyless authentication: GitHub Actions federates to Azure using short-lived tokens — no client secrets or passwords stored anywhere in the pipeline',
      'Argo CD polls the GitOps repo every 3 minutes, detects image tag drift, and applies a zero-downtime rolling update to AKS automatically — cluster never exposes its API to CI',
      'selfHeal: true enforces GitOps compliance — any manual kubectl change is reverted by Argo CD within minutes, Git remains the single source of truth',
      'Live Flask app exposes /health, /ready, and /info endpoints with pod name, node name, version, and timestamp — Kubernetes-native health probes wired to readiness and liveness checks',
      'Full rollback path: git revert on GitOps repo → Argo CD syncs previous deployment.yaml → previous image tag restored on cluster automatically',
    ],
    github: 'https://github.com/PakTechLimited/paktech-hello',
    status: 'Completed',
  },
]

export default projectsData
