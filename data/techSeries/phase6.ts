import { Phase } from './types'

const phase6: Phase = {
  n: 6,
  slug: 'phase-6',
  title: 'Observability',
  short:
    'See what the system is doing: metrics, dashboards and alerts that tell you before users do.',
  intro:
    'Phase 5 made three tools produce signals: Falco events, Trivy reports and Gatekeeper violations. This phase makes those signals, and the application behaviour, visible and actionable.',
  tags: ['Prometheus', 'Grafana', 'AlertManager', 'Slack', 'Kubernetes'],
  topics: ['Prometheus', 'Grafana', 'AlertManager', 'Slack alerts', 'Multiprocess metrics'],
  status: 'published',
  goalText:
    'Platform and application metrics in one place, dashboards stored in Git, and alerts that reach Slack. Every alert rule is proven by causing the condition, not by trusting that it loaded.',
  outcomes: [
    {
      title: 'Platform metrics',
      text: 'kube-prometheus-stack on the monitoring node pool; Argo CD, cert-manager, Gatekeeper, Falco and Trivy Operator are targets.',
      badge: 'Live',
    },
    {
      title: 'Application metrics',
      text: 'Request counts and latency by route, WebSocket connections, messages and connection attempts by result.',
      badge: 'Live',
    },
    {
      title: 'Dashboards in Git',
      text: 'Grafana dashboards stored as ConfigMaps, reviewed like code.',
      badge: 'Live',
    },
    {
      title: 'Alert rules',
      text: 'ApiScrapeDown, ApiHighErrorRate, ApiHighLatencyP95, WebSocketRejectionsHigh and EdgeHighErrorRate.',
      badge: 'Live',
    },
    {
      title: 'Slack delivery',
      text: 'AlertManager sends firing and resolved messages to Slack.',
      badge: 'Live',
    },
  ],
  steps: [
    {
      title: 'Create the Slack webhook secret',
      text: 'Keep the webhook URL out of Git. AlertManager reads it from a Secret.',
      code: '$ read -rsp "Slack webhook URL: " HOOK; echo\n$ kubectl -n monitoring create secret generic alertmanager-slack --from-literal=url="$HOOK"\n$ unset HOOK',
      check: 'the secret exists and the AlertManager pod starts without configuration errors.',
    },
    {
      title: 'Enable application scraping per environment',
      text: 'Switch on metrics with a chart flag. It creates a PodMonitor and a NetworkPolicy so Prometheus can reach the api. Merge the image first, then the flag.',
      code: '# environments/dev/values.yaml\nmetrics:\n  enabled: true',
      check: 'the api target is UP in Prometheus and ApiScrapeDown does not fire.',
    },
    {
      title: 'Check the alert rules loaded',
      text: 'A rule that is missing from the cluster cannot fire.',
      code: '$ kubectl get prometheusrule -n monitoring\n$ kubectl -n monitoring port-forward svc/kube-prometheus-stack-alertmanager 9093',
      check: 'all five application rules are listed and healthy.',
    },
    {
      title: 'Prove an alert by causing it',
      text: 'Apply a temporary rule with kubectl (not Git) that fires when a WebSocket is open, open a chat room in a browser tab and watch it reach Slack. Close the tab for the resolved message.',
      code: '$ kubectl apply -f test-rule.yaml\n# open a chat room, wait for the Slack message, close the tab\n$ kubectl delete prometheusrule paktech-alert-test -n monitoring',
      check:
        'the firing message and the resolved message both arrive, and the test rule is deleted afterwards.',
    },
  ],
  flowIntro: 'How a signal travels from a pod to a person.',
  flow: [
    { title: 'Scrape', text: 'Prometheus pulls /metrics' },
    { title: 'Evaluate', text: 'Alert rules' },
    { title: 'Route', text: 'AlertManager' },
    { title: 'Notify', text: 'Slack' },
    { title: 'Display', text: 'Grafana dashboards' },
  ],
  rollback:
    'Set metrics.enabled back to false and merge. Argo CD removes the PodMonitor and the NetworkPolicy; the app itself is unaffected.',
  figures: [
    {
      src: '/static/images/paktech-chat/p6-monitoring-flow.png',
      alt: 'How Phase 6 fits together: scrape, evaluate, alert, display',
      caption: 'Figure: scrape, evaluate, alert, display.',
    },
    {
      src: '/static/images/paktech-chat/p6-grafana-application.png',
      alt: 'The application dashboard: connections, messages, request rate, latency and errors by route',
      caption: 'Figure: the application dashboard.',
    },
    {
      src: '/static/images/paktech-chat/p6-alert-rules.png',
      alt: 'The five application alert rules, all healthy',
      caption: 'Figure: the five application alert rules.',
    },
    {
      src: '/static/images/paktech-chat/p6-slack-alerts.png',
      alt: 'Slack alerts: a real node alert, the resolved message and the WebSocket test alert',
      caption: 'Figure: alerts arriving in Slack.',
    },
  ],
  issues: [
    {
      problem: 'Metrics values jumped between scrapes',
      cause:
        'gunicorn runs two uvicorn workers, so each process had its own counters and scrapes alternated between them.',
      fix: 'prometheus-client multiprocess mode: PROMETHEUS_MULTIPROC_DIR=/tmp/prometheus on the emptyDir, plus gunicorn hooks that wipe the directory on start and mark dead workers.',
    },
    {
      problem: '/api/v1/health was recorded as /health',
      cause:
        'With this Starlette version, the route path in the request scope is relative to the router.',
      fix: 'Rebuild the label from the original path and path parameters, and pin it with a regression test.',
    },
    {
      problem: 'A false ApiScrapeDown after enabling metrics',
      cause: 'The flag was enabled before the image that exposes /metrics was running.',
      fix: 'Order matters: the image first, then the flag.',
    },
  ],
  tradeoffs: [
    {
      title: 'Metric labels',
      chose: 'Route template, never the real path',
      why: 'One series per route instead of one per room keeps the cardinality low.',
      cost: 'You lose per-room detail in metrics. Logs are for that.',
    },
    {
      title: 'Latency alert and AI routes',
      chose: 'Exclude AI routes from the p95 rule',
      why: 'Calls to the Anthropic API are legitimately slow and would make the alert noisy.',
      cost: 'A slow AI route needs its own, separate rule.',
    },
  ],
  qa: [
    {
      q: 'How do you expose Prometheus metrics from a multi-worker Python app?',
      a: 'Use prometheus-client multiprocess mode with a writable directory, clean it on start and mark workers dead when they exit, otherwise each scrape sees one worker.',
    },
    {
      q: 'How do you know an alert works?',
      a: 'Cause the condition. A temporary rule fired from a real WebSocket in a browser tab exercised the gauge, the scrape, the rule, AlertManager and the Slack template together.',
    },
    {
      q: 'Why label requests by route template?',
      a: 'To keep cardinality bounded. A label per real path creates a series per room or per user and overloads Prometheus.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase6
