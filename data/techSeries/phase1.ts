import { Phase } from './types'

const phase1: Phase = {
  n: 1,
  slug: 'phase-1',
  title: 'Local development',
  short: 'Run the whole app on a laptop, hardened and tested, before any cloud is involved.',
  intro:
    'Every later control (network policies, admission rules, scans) assumes the application is not itself the weak point. So the code is hardened and tested first, on a laptop.',
  tags: ['FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Docker'],
  topics: ['FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Docker Compose', 'pre-commit'],
  status: 'published',
  goalText:
    'A real-time chat app that is correct before it ships: sessions that survive two browser tabs, WebSockets that authenticate on the first frame, schema changes that run once instead of racing, tests that mean something, and containers that run as non-root.',
  outcomes: [
    {
      title: 'Authentication',
      text: 'In-memory access token, httpOnly rotating refresh cookie, CSRF header and Origin allow-list.',
      badge: 'Done',
    },
    {
      title: 'WebSocket security',
      text: 'First frame must be an auth message; identity comes from the verified account; messages persist before they publish to Redis.',
      badge: 'Done',
    },
    {
      title: 'Migrations',
      text: 'Alembic replaces create_all, run once by a migrate Job instead of by every worker.',
      badge: 'Done',
    },
    {
      title: 'Tests',
      text: '122 tests and about 96% coverage with concurrency-aware coverage settings.',
      badge: 'Done',
    },
    {
      title: 'Containers',
      text: 'Backend and standalone Next.js images that run as non-root.',
      badge: 'Done',
    },
  ],
  steps: [
    {
      title: 'Run the stack locally',
      text: 'Start the API, web app, PostgreSQL and Redis together so every later phase has a known-good baseline.',
      code: '$ docker compose up --build -d\n$ docker compose ps\n$ docker compose logs migrate',
      check:
        'every container is healthy, the migrate service finished, and you can register, log in and chat between two browser windows.',
    },
    {
      title: 'Move schema changes to Alembic',
      text: 'create_all at startup is fine on a laptop and wrong with two gunicorn workers racing each other. Generate and apply migrations explicitly.',
      code: '$ alembic revision --autogenerate -m "describe the change"\n$ alembic upgrade head\n$ pytest tests/test_migrations.py',
      check:
        'a second run of upgrade head changes nothing, and the workers no longer touch the schema.',
    },
    {
      title: 'Run the tests with honest coverage',
      text: 'Configure coverage for greenlet and thread concurrency, otherwise async code looks untested.',
      code: '$ pytest --cov=app',
      check: 'all tests pass, and the coverage number stays the same when you run it twice.',
    },
    {
      title: 'Install the automatic checks',
      text: 'Run the same formatters and linters on every commit that CI will run later.',
      code: '$ pre-commit install\n$ pre-commit run --all-files',
      check: 'a badly formatted file is rewritten or rejected before it can be committed.',
    },
  ],
  flowIntro:
    'A change starts on a feature branch. The same checks run on your machine and, from Phase 4, in the pipeline, so there are no surprises on the pull request.',
  flow: [
    { title: 'Feature branch', text: 'Small change' },
    { title: 'Pre-commit', text: 'Format, lint, secrets' },
    { title: 'Tests', text: 'Unit and API' },
    { title: 'Compose', text: 'Run it for real' },
    { title: 'Pull request', text: 'Into develop' },
  ],
  rollback: 'Revert the commit. Nothing outside your laptop has changed yet.',
  figures: [
    {
      src: '/static/images/paktech-chat/p1-workflow.png',
      alt: 'Phase 1 workflow: feature branch, pre-commit, tests, docker compose, pull request, and the compose startup order',
      caption:
        'Figure: the loop I ran for every change, and the order docker compose starts the stack.',
    },
  ],
  issues: [
    {
      problem: 'Two browser tabs logged each other out',
      cause:
        'Both tabs refreshed at the same moment, each rotated the refresh cookie and revoked the other session.',
      fix: 'A single-flight refresh inside each tab and the Web Locks API across tabs, so only one refresh is ever in flight.',
    },
    {
      problem:
        'A client that left during the five-second auth window caused an unexpected ASGI error',
      cause: 'The server tried to close a WebSocket that was already closed.',
      fix: 'A small _close() helper that ignores already-closed sockets.',
    },
    {
      problem: 'Coverage showed 82% when most code was exercised',
      cause:
        'Coverage was not configured for greenlet and thread concurrency, so async code paths were not measured.',
      fix: 'Set the concurrency options in the coverage config. A coverage number is only as honest as its configuration.',
    },
  ],
  tradeoffs: [
    {
      title: 'Access token storage',
      chose: 'In memory only',
      why: 'A token that never touches localStorage cannot be read by an injected script, and the httpOnly refresh cookie restores the session on reload.',
      cost: 'A page reload needs one extra refresh call, and multi-tab behaviour needs the locking described above.',
    },
    {
      title: 'Schema management',
      chose: 'Alembic run by a migrate Job',
      why: 'Migrations run once, are versioned and can be reviewed. Workers never race on the schema.',
      cost: 'One more moving part to deploy and to keep ordered before the app.',
    },
  ],
  qa: [
    {
      q: 'Why harden the app before building any infrastructure?',
      a: 'Every later control assumes the application is not the weak point. A cluster full of policies does not help if the login flow can be bypassed.',
    },
    {
      q: 'How do you keep a JWT-based session safe in a single-page app?',
      a: 'Keep the short-lived access token in memory, restore the session from an httpOnly rotating refresh cookie, and protect the cookie endpoints with a custom header and an Origin allow-list on top of SameSite.',
    },
    {
      q: 'Why not create the tables at application startup?',
      a: 'With several workers they race each other. Run versioned migrations once, from a Job, before the new version starts.',
    },
  ],
  updated: 'Nov 2026',
}

export default phase1
