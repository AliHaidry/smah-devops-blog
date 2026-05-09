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
    title: 'Unified Marketing Platform — Observability Stack',
    description:
      'End-to-end log aggregation and observability pipeline for a multi-server production marketing platform, consolidating metrics and logs into a single Grafana dashboard.',
    longDescription:
      'Designed and implemented a complete observability stack from scratch for the Unified Marketing Platform running across 10+ Linux servers. The pipeline collects, ships, stores, and visualises logs and metrics in real time — giving the operations team full visibility into system health without manual log-diving.',
    category: 'Observability',
    company: 'Curve Digital Solutions',
    role: 'Senior DevOps Engineer',
    period: 'Aug 2025 – Present',
    stack: ['Prometheus', 'Fluent Bit', 'Kafka', 'Promtail', 'Loki', 'Grafana', 'Linux', 'Ansible'],
    impact: '100% Ops Satisfaction',
    impactDetail: 'Full observability across 10+ production servers with zero blind spots',
    architecture: [
      'Fluent Bit agents collect logs from all Linux servers',
      'Logs streamed through Kafka for reliable, scalable transport',
      'Promtail ships logs into Loki for storage and querying',
      'Prometheus scrapes metrics from all services',
      'Grafana dashboards unify logs and metrics in one pane of glass',
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
]

export default projectsData
