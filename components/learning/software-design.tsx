'use client'

import { useState } from 'react'
import { C, Card, SHead, Checklist } from './shared'

// ── Naming Taxonomy ───────────────────────────────────────────────────────────
export default function NamingTaxonomy() {
  const rules = [
    {
      type: 'Variables',
      color: C.amber,
      rule: 'Name for meaning, not type.',
      good: ['user_email', 'is_authenticated', 'items_in_cart', 'retry_count'],
      bad: ['str1', 'flag', 'count', 'data'],
    },
    {
      type: 'Functions',
      color: C.green,
      rule: 'Functions are verbs — they do something.',
      good: ['get_user_by_id()', 'validate_checkout_form()', 'send_welcome_email()'],
      bad: ['process()', 'handle_it()', 'do_stuff()'],
    },
    {
      type: 'Classes',
      color: C.blue,
      rule: 'Classes are nouns — they represent a thing.',
      good: ['PaymentProcessor', 'UserSession', 'OrderRepository'],
      bad: ['Manager', 'Handler', 'Processor'],
    },
    {
      type: 'Booleans',
      color: C.purple,
      rule: 'Booleans read as questions.',
      good: ['is_admin', 'has_paid', 'can_edit', 'was_notified'],
      bad: ['status', 'flag', 'active', 'value'],
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rules.map((r) => (
        <Card key={r.type} accent={r.color}>
          <div className="mb-1 text-sm font-bold" style={{ color: r.color }}>
            {r.type}
          </div>
          <div className="mb-3 text-xs text-zinc-500 italic">{r.rule}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div
                className="mb-1 font-mono text-[9px] tracking-widest uppercase"
                style={{ color: C.green }}
              >
                GOOD
              </div>
              {r.good.map((g) => (
                <div key={g} className="mb-0.5 font-mono text-[11px] text-zinc-300">
                  {g}
                </div>
              ))}
            </div>
            <div>
              <div
                className="mb-1 font-mono text-[9px] tracking-widest uppercase"
                style={{ color: C.red }}
              >
                AVOID
              </div>
              {r.bad.map((b) => (
                <div key={b} className="mb-0.5 font-mono text-[11px] text-zinc-500 line-through">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── SOLID Explorer ────────────────────────────────────────────────────────────
export function SOLIDExplorer() {
  const principles = [
    {
      letter: 'S',
      name: 'Single Responsibility',
      color: C.amber,
      tagline: 'A class should have one reason to change.',
      desc: 'Every class, function, and module should do exactly one thing and do it well. If a class handles both business logic and database access, changes to the database force changes to the business logic — coupling you never wanted.',
      bad: `class User:\n    def save_to_db(self):          # DB concern\n        db.execute("INSERT ...")\n    def send_welcome_email(self):  # Email concern\n        smtp.send(self.email, ...)\n    def to_json(self):             # Serialisation concern\n        return json.dumps(...)`,
      good: `class User:\n    pass  # just the domain object\n\nclass UserRepository:    # DB concern\n    def save(self, user: User): ...\n\nclass UserNotifier:      # Email concern\n    def send_welcome(self, user): ...\n\nclass UserSerializer:    # Serialisation\n    def to_json(self, user): ...`,
    },
    {
      letter: 'O',
      name: 'Open/Closed',
      color: C.green,
      tagline: 'Open for extension. Closed for modification.',
      desc: 'Adding new behaviour should extend existing code — not modify it. Modification risks breaking existing, tested functionality. Abstractions and polymorphism make this possible.',
      bad: `def calculate_discount(user, amount):\n    if user.type == "premium":\n        return amount * 0.9\n    elif user.type == "student":\n        return amount * 0.85\n    # New type = modify existing code ← risky`,
      good: `class DiscountPolicy(ABC):\n    @abstractmethod\n    def apply(self, amount: float) -> float: ...\n\nclass PremiumDiscount(DiscountPolicy):\n    def apply(self, amount): return amount * 0.9\n\nclass StudentDiscount(DiscountPolicy):\n    def apply(self, amount): return amount * 0.85\n\n# New type = new class, zero changes above ✓`,
    },
    {
      letter: 'L',
      name: 'Liskov Substitution',
      color: C.blue,
      tagline: 'Subclasses must be usable wherever the parent is used.',
      desc: "If S is a subtype of T, objects of T may be replaced with S without breaking correctness. If you override a method, the override must honour the parent's contract — same inputs, compatible outputs.",
      bad: `class Bird:\n    def fly(self): ...\n\nclass Penguin(Bird):\n    def fly(self):\n        raise NotImplementedError("Can't fly!")\n        # Any code using Bird.fly() breaks with Penguin ← `,
      good: `class Bird:\n    def move(self): ...  # general contract\n\nclass FlyingBird(Bird):\n    def move(self): self.fly()\n    def fly(self): ...\n\nclass Penguin(Bird):\n    def move(self): self.swim()\n    def swim(self): ...\n# All Birds can 'move' — no broken contracts ✓`,
    },
    {
      letter: 'I',
      name: 'Interface Segregation',
      color: C.purple,
      tagline: "Don't force clients to depend on methods they don't use.",
      desc: "Fat interfaces force implementing classes to define methods they don't need. Split large interfaces into smaller, focused ones. No empty methods. No NotImplementedError hacks.",
      bad: `class Animal(ABC):\n    @abstractmethod\n    def fly(self): ...   # dogs can't fly\n\n    @abstractmethod\n    def bark(self): ...  # birds don't bark\n\nclass Dog(Animal):\n    def fly(self): pass  # forced empty method ← `,
      good: `class Flyable(ABC):\n    @abstractmethod\n    def fly(self): ...\n\nclass Barkable(ABC):\n    @abstractmethod\n    def bark(self): ...\n\nclass Dog(Barkable):\n    def bark(self): ...  # only what it does ✓`,
    },
    {
      letter: 'D',
      name: 'Dependency Inversion',
      color: C.red,
      tagline: 'Depend on abstractions, not concretions.',
      desc: 'High-level modules (business logic) should not depend on low-level modules (database, email). Both should depend on abstractions. This makes business logic testable in isolation.',
      bad: `class OrderService:\n    def __init__(self):\n        self.db = PostgreSQLDatabase()   # concrete ←\n        self.mailer = SendGridMailer()   # concrete ←\n        # Can't test without real DB + real email!`,
      good: `class OrderService:\n    def __init__(\n        self,\n        db: OrderRepository,        # abstraction ✓\n        mailer: NotificationService # abstraction ✓\n    ):\n        self.db = db\n        self.mailer = mailer\n# Tests inject fakes. Production injects real impls.`,
    },
  ]
  const [active, setActive] = useState(0)
  const p = principles[active]

  return (
    <div className="my-6">
      <div className="mb-5 flex gap-3">
        {principles.map((pr, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-11 w-11 rounded-sm border-2 font-mono text-lg font-bold transition-all duration-150"
            style={{
              borderColor: i === active ? pr.color : '#3f3f46',
              background: i === active ? `${pr.color}20` : 'transparent',
              color: i === active ? pr.color : '#71717a',
            }}
          >
            {pr.letter}
          </button>
        ))}
      </div>
      <Card accent={p.color}>
        <div className="mb-4 flex items-start gap-4">
          <div
            className="font-mono text-5xl leading-none font-bold"
            style={{ color: `${p.color}30` }}
          >
            {p.letter}
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: p.color }}>
              {p.name} Principle
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-wide text-zinc-500">
              &quot;{p.tagline}&quot;
            </div>
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div
              className="mb-1 font-mono text-[9px] tracking-[2px] uppercase"
              style={{ color: C.red }}
            >
              ✗ Violating
            </div>
            <pre
              className="overflow-x-auto rounded-r-sm p-3 font-mono text-[11px] leading-relaxed"
              style={{ background: '#09090b', borderLeft: `3px solid ${C.red}`, color: '#a1a1aa' }}
            >
              {p.bad}
            </pre>
          </div>
          <div>
            <div
              className="mb-1 font-mono text-[9px] tracking-[2px] uppercase"
              style={{ color: C.green }}
            >
              ✓ Applying
            </div>
            <pre
              className="overflow-x-auto rounded-r-sm p-3 font-mono text-[11px] leading-relaxed"
              style={{
                background: '#09090b',
                borderLeft: `3px solid ${C.green}`,
                color: '#a1a1aa',
              }}
            >
              {p.good}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Pattern Explorer ──────────────────────────────────────────────────────────
export function PatternExplorer() {
  const categories = [
    {
      name: 'Creational',
      color: C.amber,
      patterns: [
        {
          name: 'Factory Method',
          when: 'You need to create objects but the subclass decides which class.',
          code: `class NotificationFactory:\n    @staticmethod\n    def create(type: str) -> Notification:\n        match type:\n            case "email": return EmailNotification()\n            case "sms":   return SMSNotification()\n            case "push":  return PushNotification()`,
        },
        {
          name: 'Builder',
          when: 'An object needs many optional config params — avoids telescoping constructors.',
          code: `query = (QueryBuilder("orders")\n    .join("users", on="user_id")\n    .where("status = 'pending'")\n    .order_by("created_at DESC")\n    .limit(100)\n    .build())`,
        },
      ],
    },
    {
      name: 'Structural',
      color: C.blue,
      patterns: [
        {
          name: 'Adapter',
          when: 'Make two incompatible interfaces work together without changing either.',
          code: `class LegacyTrackerAdapter(Analytics):\n    """Wraps old library to match new interface"""\n    def track(self, event: Event):\n        # translate new interface → old interface\n        self.legacy.log_event(\n            event.name, event.properties\n        )`,
        },
        {
          name: 'Decorator',
          when: 'Add behaviour to an object dynamically without subclassing.',
          code: `@require_auth\n@log_execution_time\n@cache(ttl=300)\ndef get_user_dashboard(request):\n    # each decorator adds a behaviour layer\n    # without changing the core function\n    ...`,
        },
      ],
    },
    {
      name: 'Behavioural',
      color: C.green,
      patterns: [
        {
          name: 'Observer',
          when: 'One object changes state and others need to react — without tight coupling.',
          code: `bus = EventBus()\nbus.subscribe("order.placed", send_confirmation)\nbus.subscribe("order.placed", update_inventory)\nbus.subscribe("order.placed", notify_warehouse)\n# Adding a new reaction = one line\n# Zero changes elsewhere ✓`,
        },
        {
          name: 'Strategy',
          when: 'A family of interchangeable algorithms — select the right one at runtime.',
          code: `class Sorter:\n    def __init__(self, strategy: SortStrategy):\n        self.strategy = strategy  # inject the algo\n\ndev_sorter  = Sorter(BubbleSort())   # simple, debuggable\nprod_sorter = Sorter(TimSort())      # fast, real workloads\n# Swap algorithms without touching the client ✓`,
        },
      ],
    },
  ]
  const [cat, setCat] = useState(0)
  const [pat, setPat] = useState(0)
  const current = categories[cat]
  const currentPat = current.patterns[Math.min(pat, current.patterns.length - 1)]

  return (
    <div className="my-6">
      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setCat(i)
              setPat(0)
            }}
            className="rounded-sm border px-3 py-1.5 text-xs transition-all duration-150"
            style={{
              borderColor: i === cat ? c.color : '#3f3f46',
              background: i === cat ? `${c.color}18` : 'transparent',
              color: i === cat ? c.color : '#71717a',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="mb-4 flex gap-2">
        {current.patterns.map((p, i) => (
          <button
            key={i}
            onClick={() => setPat(i)}
            className="rounded-sm border px-3 py-1 font-mono text-[11px] transition-all duration-150"
            style={{
              borderColor: i === pat ? current.color : '#3f3f46',
              background: i === pat ? `${current.color}18` : 'transparent',
              color: i === pat ? current.color : '#71717a',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      <Card accent={current.color}>
        <div className="mb-1 text-base font-bold" style={{ color: current.color }}>
          {currentPat.name}
        </div>
        <div className="mb-3 font-mono text-[10px] tracking-wide text-zinc-500">
          USE WHEN: {currentPat.when}
        </div>
        <pre
          className="overflow-x-auto rounded-r-sm p-3 font-mono text-[11.5px] leading-relaxed"
          style={{
            background: '#09090b',
            borderLeft: `3px solid ${current.color}`,
            color: '#a1a1aa',
          }}
        >
          {currentPat.code}
        </pre>
      </Card>
    </div>
  )
}

// ── Architecture Explorer ─────────────────────────────────────────────────────
type ArchLayer = { name: string; color: string; desc: string }
type ArchDef = { name: string; color: string; tagline: string; desc: string; layers: ArchLayer[] }

export function ArchitectureExplorer() {
  const architectures: Record<string, ArchDef> = {
    clean: {
      name: 'Clean Architecture',
      color: C.amber,
      tagline: 'Business logic at the centre, infrastructure at the edges.',
      desc: 'Dependencies point inward. The domain layer knows nothing about databases, HTTP, or frameworks. This makes your domain logic independently testable and infrastructure replaceable.',
      layers: [
        {
          name: 'Domain / Entities',
          color: C.amber,
          desc: 'Core business rules. Pure code. No framework imports. No DB imports.',
        },
        {
          name: 'Use Cases',
          color: C.green,
          desc: 'Application-specific business rules. Orchestrates domain entities.',
        },
        {
          name: 'Interface Adapters',
          color: C.blue,
          desc: 'Converts data between use cases and the outside world. Controllers, presenters, repositories.',
        },
        {
          name: 'Frameworks & Drivers',
          color: '#52525b',
          desc: 'Outermost ring. Web framework, database, external APIs. Replaceable.',
        },
      ],
    },
    hexagonal: {
      name: 'Hexagonal Architecture',
      color: C.blue,
      tagline: 'Ports and adapters. Drive from outside, depend on inside.',
      desc: 'The application core exposes ports (interfaces). The outside world connects via adapters. Same core driven by HTTP, CLI, or test harness.',
      layers: [
        {
          name: 'Driving Adapters',
          color: C.blue,
          desc: 'HTTP controller, CLI, test harness, message queue consumer.',
        },
        {
          name: 'Driving Ports',
          color: C.cyan,
          desc: 'Interfaces your app exposes to drivers. PlaceOrderPort, GetUserPort.',
        },
        {
          name: 'Application Core',
          color: C.amber,
          desc: 'Your domain and use cases. No outside dependencies.',
        },
        {
          name: 'Driven Ports',
          color: C.green,
          desc: 'Interfaces the app requires: OrderRepository, PaymentGateway.',
        },
        {
          name: 'Driven Adapters',
          color: '#34d399',
          desc: 'Implementations: PostgresRepo, StripeGateway, SendGridSender.',
        },
      ],
    },
    ddd: {
      name: 'Domain-Driven Design',
      color: C.purple,
      tagline: 'Model the domain. Speak the language of the business.',
      desc: 'Your code should mirror the real-world domain it models. Use the same language as domain experts. Organise around bounded contexts — each with its own model.',
      layers: [
        {
          name: 'Bounded Context',
          color: C.purple,
          desc: 'A boundary within which a domain model is defined. "Order" means different things in checkout vs fulfilment.',
        },
        {
          name: 'Ubiquitous Language',
          color: C.amber,
          desc: 'Shared language between developers and domain experts. Code uses the same terms as the business.',
        },
        {
          name: 'Aggregate',
          color: C.green,
          desc: 'A cluster of domain objects treated as a single unit. An Order aggregate contains OrderItems, ShippingAddress.',
        },
        {
          name: 'Value Objects',
          color: C.blue,
          desc: 'Defined by their value, not identity. Money(100, "USD") == Money(100, "USD"). Immutable.',
        },
      ],
    },
  }
  const [active, setActive] = useState('clean')
  const arch = architectures[active]

  return (
    <div className="my-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(architectures).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setActive(k)}
            className="rounded-sm border px-3 py-1.5 text-xs transition-all duration-150"
            style={{
              borderColor: k === active ? v.color : '#3f3f46',
              background: k === active ? `${v.color}18` : 'transparent',
              color: k === active ? v.color : '#71717a',
            }}
          >
            {v.name}
          </button>
        ))}
      </div>
      <Card accent={arch.color}>
        <div className="mb-1 text-base font-bold" style={{ color: arch.color }}>
          {arch.name}
        </div>
        <div className="mb-3 font-mono text-[10px] tracking-wide text-zinc-500">
          &quot;{arch.tagline}&quot;
        </div>
        <p className="mb-4 text-sm leading-relaxed text-zinc-400">{arch.desc}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {arch.layers.map((l) => (
            <div key={l.name} className="rounded-sm border border-zinc-700 bg-zinc-900 p-3">
              <div className="mb-1 text-xs font-bold" style={{ color: l.color }}>
                {l.name}
              </div>
              <div className="text-[11px] leading-snug text-zinc-500">{l.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Testing Pyramid ───────────────────────────────────────────────────────────
export function TestingPyramid() {
  const layers = [
    {
      label: 'E2E Tests',
      pct: 10,
      color: C.red,
      desc: 'Full system tests. Slow, brittle, expensive. Test critical user journeys only. Keep very few.',
    },
    {
      label: 'Integration Tests',
      pct: 25,
      color: C.amber,
      desc: 'Test components together. DB + service, API + handler. Slower than unit, faster than E2E.',
    },
    {
      label: 'Unit Tests',
      pct: 65,
      color: C.green,
      desc: 'Test a single unit in isolation. Fast, deterministic, cheap. The bulk of your suite.',
    },
  ]
  return (
    <div className="my-6 rounded-sm border border-zinc-700 bg-zinc-900 p-5">
      <div className="mb-4 font-mono text-[9px] tracking-[3px] text-zinc-500 uppercase">
        Testing Pyramid — ideal distribution
      </div>
      <div className="mb-4 space-y-3">
        {layers.map((l) => (
          <div key={l.label} className="flex items-center gap-3">
            <div className="w-36 flex-shrink-0 font-mono text-xs text-zinc-400">{l.label}</div>
            <div className="h-5 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full"
                style={{ width: `${l.pct}%`, background: l.color }}
              />
            </div>
            <div className="w-8 flex-shrink-0 font-mono text-[11px]" style={{ color: l.color }}>
              {l.pct}%
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {layers.map((l) => (
          <div key={l.label} className="flex gap-3 text-xs">
            <div
              className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
              style={{ background: l.color }}
            />
            <div className="leading-snug text-zinc-400">{l.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Code Smells ───────────────────────────────────────────────────────────────
export function CodeSmells() {
  const smells = [
    {
      name: 'Long Method',
      color: C.red,
      sign: 'Method > 20 lines, needs comments to separate sections',
      fix: "Extract smaller named methods. If you need a comment to separate sections, that's a method boundary.",
    },
    {
      name: 'God Class',
      color: C.red,
      sign: 'One class knows or does everything',
      fix: 'Apply SRP. Extract collaborators. A class should fit on one screen and have one reason to change.',
    },
    {
      name: 'Deep Nesting',
      color: C.amber,
      sign: 'if/for/try nested 3+ levels deep',
      fix: 'Early returns (guard clauses). Extract inner loops to functions. Invert conditionals.',
    },
    {
      name: 'Primitive Obsession',
      color: C.amber,
      sign: 'Using strings/ints for rich concepts: user_id as int, email as str',
      fix: 'Create value objects: UserId, EmailAddress. They carry validation and prevent accidental misuse.',
    },
    {
      name: 'Feature Envy',
      color: C.blue,
      sign: 'Method uses more data from another class than its own',
      fix: 'Move the method to the class whose data it envies. Data and behaviour belong together.',
    },
    {
      name: 'Shotgun Surgery',
      color: C.purple,
      sign: 'One change requires edits in 10+ different files',
      fix: 'Cohesion problem. Move related code together. A change should touch one file, not ten.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {smells.map((s) => (
        <Card key={s.name} accent={s.color}>
          <div className="mb-1 text-sm font-bold" style={{ color: s.color }}>
            {s.name}
          </div>
          <div className="mb-2 font-mono text-[9px] tracking-wide text-zinc-600">
            SIGN: {s.sign}
          </div>
          <div className="leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-300">Fix: </span>
            {s.fix}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── API Design Comparison ─────────────────────────────────────────────────────
export function APIDesignComparison() {
  const apis = [
    {
      name: 'REST',
      color: C.amber,
      desc: 'HTTP verbs + nouns. Stateless. Universal. Safe default for most public APIs and CRUD resources.',
    },
    {
      name: 'GraphQL',
      color: C.blue,
      desc: 'Client queries exactly the data it needs. Single endpoint. Great for mobile, complex frontends, multiple client types.',
    },
    {
      name: 'gRPC',
      color: C.green,
      desc: 'Binary protocol (protobuf). Strongly typed. Fast. Best for service-to-service internal APIs and polyglot microservices.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      {apis.map((a) => (
        <Card key={a.name} accent={a.color}>
          <div className="mb-2 text-sm font-bold" style={{ color: a.color }}>
            {a.name}
          </div>
          <div className="leading-relaxed text-zinc-400">{a.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Craft Checklist ───────────────────────────────────────────────────────────
export function CraftChecklist() {
  return (
    <Checklist
      storageKey="craft-checklist"
      items={[
        'Can explain "why not what" comments with concrete before/after examples',
        'Refactored opaque naming to expressive naming in a real project',
        'Can explain all 5 SOLID principles and identify a violation in a real codebase',
        'Applied Open/Closed to extend behaviour without modifying existing code',
        'Used Dependency Inversion to make a class testable without real infrastructure',
        'Identified and applied 3 design patterns by recognising the problem they solve',
        'Designed or refactored a system using Clean or Hexagonal Architecture',
        'Written a unit test suite with >80% coverage for a real module',
        'Practised TDD on a feature — wrote the failing test before any implementation',
        'Identified 3 code smells in a real codebase and refactored them',
        'Applied guard clauses to flatten deeply nested code',
        'Designed a REST API with correct verbs, status codes, and structured errors',
        'API is versioned and returns actionable error objects with request_id',
        'Completed the Gilded Rose refactoring kata',
      ]}
    />
  )
}
