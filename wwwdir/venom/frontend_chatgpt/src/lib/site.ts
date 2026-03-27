export type ClientProfile = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  company: string;
  role: string;
  location: string;
  timezone: string;
  creditBalance: number;
};

export type FeatureGroup = {
  title: string;
  badge: string;
  description: string;
  bullets: string[];
};

export type PlatformLayer = {
  title: string;
  description: string;
  bullets: string[];
};

export type UseCase = {
  title: string;
  description: string;
  outcomes: string[];
};

export type PricingPlan = {
  slug: string;
  name: string;
  badge: string;
  price: string;
  cadence: string;
  infrastructure: string;
  summary: string;
  bestFor: string;
  included: string[];
  note: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type ServiceRecord = {
  id: string;
  name: string;
  category: string;
  status: string;
  region: string;
  cycle: string;
  nextDue: string;
  protocols: string[];
  viewers: string;
  load: string;
  uptime: string;
  ip: string;
  origin: string;
  amount?: string;
  summary: string;
};

export type InvoiceRecord = {
  id: string;
  status: string;
  total: string;
  balance: string;
  issuedOn: string;
  dueOn: string;
  gateway: string;
  items: Array<{ label: string; amount: string }>;
};

export type QuoteRecord = {
  id: string;
  status: string;
  total: string;
  validUntil: string;
  summary: string;
  scope: string[];
};

export type OrderRecord = {
  id: string;
  status: string;
  total: string;
  placedOn: string;
  summary: string;
};

export type TicketMessage = {
  author: string;
  role: string;
  body: string;
  timestamp: string;
};

export type TicketRecord = {
  id: string;
  subject: string;
  department: string;
  priority: string;
  status: string;
  updatedAt: string;
  excerpt: string;
  messages: TicketMessage[];
};

export type DomainRecord = {
  id: string;
  domain: string;
  status: string;
  registrar: string;
  expiresOn: string;
  autorenew: boolean;
  lock: boolean;
  nameservers: string[];
  purpose: string;
};

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  scope: string;
};

export type PaymentMethodRecord = {
  id: string;
  label: string;
  type: string;
  lastFour: string;
  expires: string;
  isDefault: boolean;
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  body: string[];
};

export type KnowledgeCategory = {
  id: string;
  title: string;
  summary: string;
  articleCount: number;
};

export type KnowledgeArticle = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  updatedAt: string;
  body: string[];
  views: number;
};

export type CatalogProductRecord = {
  id: string;
  name: string;
  description: string;
  type: string;
  pricing: Array<{ label: string; amount: string }>;
  highlight: string;
};

export type CartItem = {
  id: string;
  label: string;
  cycle: string;
  unitPrice: string;
  quantity: number;
  total: string;
};

export const brand = {
  name: "VENOM CODES",
  tagline: "Advanced IPTV Control Platform & Streaming Solutions",
  mission:
    "A premium client and operator experience for teams that need streaming control, WHMCS-connected commercial workflows, and infrastructure that scales without compromise."
};

export const marketingNavigation = [
  { label: "Platform", href: "/#platform" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Knowledgebase", href: "/knowledgebase" },
  { label: "Announcements", href: "/announcements" }
];

export const sidebarNavigation = [
  {
    title: "Command",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Services", href: "/services" },
      { label: "Domains", href: "/domains" },
      { label: "Support", href: "/support" }
    ]
  },
  {
    title: "Commercial",
    items: [
      { label: "Billing", href: "/billing" },
      { label: "Quotes", href: "/billing/quotes" },
      { label: "Orders", href: "/billing/orders" },
      { label: "Cart", href: "/cart" }
    ]
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/account/profile" },
      { label: "Contacts", href: "/account/contacts" },
      { label: "Security", href: "/account/security" },
      { label: "Payment methods", href: "/account/payments" }
    ]
  }
];

export const heroStats = [
  { label: "Self-developed core", value: "100%", detail: "No clone panel, no wrapper architecture, no borrowed control surface." },
  { label: "Streaming protocols", value: "6", detail: "HTTP, RTMP, RTSP, RTP, UDP, and MMS support under one model." },
  { label: "Commercial tiers", value: "3", detail: "Pilot, Professional, and Enterprise expansion paths." },
  { label: "Scale path", value: "1 → ∞", detail: "Start with one main node and grow into distributed load balancing." }
];

export const featureGroups: FeatureGroup[] = [
  {
    title: "Security and anti-abuse",
    badge: "Security first",
    description:
      "Protect revenue and content integrity with layered access controls built for real operator risk profiles.",
    bullets: [
      "VPN, proxy, and data-center IP detection",
      "Fingerprint protection to reduce redistribution",
      "IP locks, country rules, and device limits",
      "Built-in rate limits and abuse throttling"
    ]
  },
  {
    title: "Streaming operations",
    badge: "Delivery control",
    description:
      "Manage ingestion, optimization, and content readiness across live channels, VOD libraries, and radio streams.",
    bullets: [
      "Multi-protocol delivery surfaces",
      "Transcoding workflows for device and bandwidth fit",
      "TV archive and timeshift support",
      "TMDB-powered metadata enrichment"
    ]
  },
  {
    title: "Multi-server infrastructure",
    badge: "Elastic topology",
    description:
      "Move from a single-node deployment to a distributed footprint without replacing the control surface.",
    bullets: [
      "Load balancing across edge capacity",
      "GeoIP and ISP-aware smart routing",
      "Horizontal expansion with redundancy",
      "Operational health signals for nodes and traffic"
    ]
  },
  {
    title: "Commercial ecosystem",
    badge: "WHMCS aligned",
    description:
      "Present billing, account, support, and provisioning journeys inside a premium SPA while sensitive logic stays on the backend boundary.",
    bullets: [
      "Client area surfaces for services and invoices",
      "Support workflows aligned with WHMCS operations",
      "Catalog and cart experiences for plan selection",
      "No privileged credentials exposed to the browser"
    ]
  }
];

export const platformLayers: PlatformLayer[] = [
  {
    title: "Central management panel",
    description: "Control servers, packages, security posture, and subscriber operations from one operator-grade surface.",
    bullets: [
      "Server management and monitoring",
      "Subscriber and package administration",
      "Platform-wide operational settings"
    ]
  },
  {
    title: "Content management layer",
    description: "Coordinate live TV, VOD, radio, categories, and metadata without fragmenting the workflow.",
    bullets: [
      "Live channels and series libraries",
      "Radio streams and category structure",
      "Automated metadata enrichment"
    ]
  },
  {
    title: "Streaming and processing layer",
    description: "Prepare streams for delivery with compatibility, conversion, and quality adaptation under one model.",
    bullets: [
      "Protocol compatibility management",
      "Format conversion and transcoding",
      "Quality adaptation by connection profile"
    ]
  },
  {
    title: "Distribution and security layer",
    description: "Route traffic intelligently while enforcing defensive protections against misuse and unauthorized access.",
    bullets: [
      "Traffic routing and load balancing",
      "Server health and geographic distribution",
      "Suspicious access and misuse prevention"
    ]
  }
];

export const useCases: UseCase[] = [
  {
    title: "Commercial IPTV services",
    description: "Launch and manage a live service with channels, VOD, and radio content through one premium operator surface.",
    outcomes: ["Fast proof of concept", "Subscriber-ready control surface", "Clear path to production scale"]
  },
  {
    title: "Hospitality and compounds",
    description: "Deliver television and streaming media across internal networks with central oversight and policy control.",
    outcomes: ["Internal distribution control", "Operational simplicity", "Consistent guest experience"]
  },
  {
    title: "Enterprise distribution",
    description: "Coordinate training channels, announcements, and media delivery across branches and operating regions.",
    outcomes: ["Branch-ready distribution", "Unified governance", "Security-aware access rules"]
  },
  {
    title: "Multi-region operators",
    description: "Expand into distributed routing and load balancing without replacing the platform foundation.",
    outcomes: ["Regional resilience", "Traffic-aware scaling", "Future-safe infrastructure"]
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    slug: "pilot",
    name: "VENOM Pilot",
    badge: "Evaluation",
    price: "$50",
    cadence: "per week",
    infrastructure: "1 main server",
    summary: "Trial the platform in a live environment before committing to a production rollout.",
    bestFor: "Early validation, launch rehearsal, and proof-of-concept deployment.",
    included: [
      "Core control panel access",
      "Basic technical support",
      "Updates during the active subscription"
    ],
    note: "Start small, validate quickly, and test operational fit without replatforming later."
  },
  {
    slug: "professional",
    name: "VENOM Professional",
    badge: "Production",
    price: "$100",
    cadence: "per month",
    infrastructure: "1 main server + 1 load balancer",
    summary: "A balanced commercial setup for production teams that need reliability and room to grow.",
    bestFor: "Small and mid-sized operators running live production environments.",
    included: [
      "Live TV, VOD, and radio workflows",
      "Full platform panel access",
      "Specialized technical support",
      "Ongoing updates"
    ],
    note: "Built for operators who need a dependable day-one footprint with expansion headroom."
  },
  {
    slug: "enterprise",
    name: "VENOM Enterprise",
    badge: "Unlimited scale",
    price: "$300",
    cadence: "per month",
    infrastructure: "1 main server + unlimited load balancers",
    summary: "A flexible rollout path for organizations planning multi-region delivery and long-term capacity growth.",
    bestFor: "Large organizations, multi-region services, and long-horizon infrastructure planning.",
    included: [
      "Unlimited load balancer expansion",
      "Multi-region support posture",
      "Priority technical support",
      "Full platform access"
    ],
    note: "Designed for distributed delivery, high-flexibility scale, and strategic growth planning."
  }
];

export const supportChannels = [
  { label: "Documentation", value: "Knowledgebase and infrastructure guides" },
  { label: "Email support", value: "support@venom-codes.test" },
  { label: "Ticket system", value: "Structured issue and escalation workflows" },
  { label: "Client area", value: "Secure commercial operations and account access" }
];

export const responseTimes = [
  { plan: "Pilot", time: "24–48 hours" },
  { plan: "Professional", time: "12–24 hours" },
  { plan: "Enterprise", time: "4–8 hours priority" }
];

export const faqItems = [
  {
    question: "Is VENOM CODES a rebranded third-party panel?",
    answer:
      "No. VENOM CODES is self-developed in-house, which preserves architectural ownership, roadmap control, and security discipline."
  },
  {
    question: "Can the infrastructure grow beyond a single server?",
    answer:
      "Yes. The rollout path starts with one main node and expands to distributed multi-server setups with dedicated load balancing and geo-aware routing."
  },
  {
    question: "Which content workflows does the platform support?",
    answer:
      "The core product covers live channels, video-on-demand libraries, radio streams, archive and timeshift functionality, plus metadata enrichment workflows."
  },
  {
    question: "Where does WHMCS fit in this experience?",
    answer:
      "The portal is designed for a WHMCS-integrated ecosystem: billing, account, catalog, and support journeys live in a premium SPA while sensitive logic remains on the backend boundary."
  }
];

export const previewClient: ClientProfile = {
  id: "CL-1208",
  firstname: "Nadia",
  lastname: "Amin",
  email: "nadia@operator.example",
  status: "Active",
  company: "Atlas Broadcast Group",
  role: "Operations Director",
  location: "Cairo, Egypt",
  timezone: "Africa/Cairo",
  creditBalance: 485.75
};

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Active services", value: "08", detail: "Streaming and routing nodes under management" },
  { label: "Open invoices", value: "02", detail: "Commercial actions awaiting payment" },
  { label: "Support queue", value: "03", detail: "Tickets currently in motion" },
  { label: "Credit balance", value: "$485.75", detail: "Available account credit for billing events" }
];

export const services: ServiceRecord[] = [
  {
    id: "svc-main-eu",
    name: "Main Cluster / Europe Core",
    category: "Streaming core",
    status: "Active",
    region: "Frankfurt",
    cycle: "Monthly",
    nextDue: "2026-04-18",
    protocols: ["HTTP", "RTMP", "RTSP"],
    viewers: "18.4k concurrent",
    load: "63% average",
    uptime: "99.98%",
    ip: "185.220.14.42",
    origin: "core-eu-01.venom.internal",
    amount: "$300.00",
    summary: "Primary processing and origin layer for live channels and premium VOD delivery."
  },
  {
    id: "svc-edge-mea",
    name: "Edge Balancer / MEA West",
    category: "Load balancing",
    status: "Healthy",
    region: "Riyadh",
    cycle: "Monthly",
    nextDue: "2026-04-18",
    protocols: ["HTTP", "UDP"],
    viewers: "9.1k concurrent",
    load: "47% average",
    uptime: "99.96%",
    ip: "31.13.54.80",
    origin: "lb-mea-02.venom.internal",
    amount: "$120.00",
    summary: "Regional load balancer coordinating route distribution for low-latency playback."
  },
  {
    id: "svc-radio-archive",
    name: "Radio and Archive Relay",
    category: "Archive workflow",
    status: "Provisioning",
    region: "Amsterdam",
    cycle: "Weekly",
    nextDue: "2026-03-30",
    protocols: ["HTTP", "MMS", "RTP"],
    viewers: "1.2k concurrent",
    load: "28% average",
    uptime: "99.92%",
    ip: "104.223.18.16",
    origin: "archive-radio-01.venom.internal",
    amount: "$80.00",
    summary: "Timeshift and radio delivery surface being prepared for wider audience activation."
  }
];

export const invoices: InvoiceRecord[] = [
  {
    id: "INV-2045",
    status: "Unpaid",
    total: "$300.00",
    balance: "$300.00",
    issuedOn: "2026-03-18",
    dueOn: "2026-04-01",
    gateway: "Bank transfer",
    items: [{ label: "VENOM Enterprise", amount: "$300.00" }]
  },
  {
    id: "INV-2034",
    status: "Paid",
    total: "$100.00",
    balance: "$0.00",
    issuedOn: "2026-02-18",
    dueOn: "2026-03-01",
    gateway: "Saved card",
    items: [{ label: "VENOM Professional", amount: "$100.00" }]
  },
  {
    id: "INV-1988",
    status: "Partially paid",
    total: "$450.00",
    balance: "$150.00",
    issuedOn: "2026-01-12",
    dueOn: "2026-01-31",
    gateway: "Wire transfer",
    items: [
      { label: "Main cluster refresh", amount: "$300.00" },
      { label: "Regional edge upgrade", amount: "$150.00" }
    ]
  }
];

export const quotes: QuoteRecord[] = [
  {
    id: "Q-7701",
    status: "Pending review",
    total: "$650.00",
    validUntil: "2026-04-10",
    summary: "Enterprise rollout uplift with dedicated migration assistance.",
    scope: ["Unlimited edge balancers", "Migration workshop", "Priority activation"]
  },
  {
    id: "Q-7642",
    status: "Accepted",
    total: "$180.00",
    validUntil: "2026-03-28",
    summary: "Professional plan upgrade plus radio archive workflow.",
    scope: ["Professional monthly footprint", "Archive enablement"]
  }
];

export const orders: OrderRecord[] = [
  {
    id: "ORD-9128",
    status: "Active",
    total: "$300.00",
    placedOn: "2026-03-18",
    summary: "Enterprise commercial subscription running on the primary account."
  },
  {
    id: "ORD-9037",
    status: "Provisioning",
    total: "$150.00",
    placedOn: "2026-03-22",
    summary: "Additional archive workflow capacity with deployment coordination in progress."
  }
];

export const tickets: TicketRecord[] = [
  {
    id: "TCK-1184",
    subject: "Archive catch-up window needs extension",
    department: "Streaming operations",
    priority: "High",
    status: "In progress",
    updatedAt: "2026-03-24T15:30:00.000Z",
    excerpt: "The current archive retention window is not enough for weekend replay demand in Region A.",
    messages: [
      {
        author: "Nadia Amin",
        role: "Client",
        body: "Please increase the archive retention window from 48 to 72 hours for the sports pack cluster.",
        timestamp: "2026-03-24T11:20:00.000Z"
      },
      {
        author: "VENOM Operations",
        role: "Support",
        body: "We validated disk headroom and are preparing the retention policy update for tonight's maintenance slot.",
        timestamp: "2026-03-24T15:30:00.000Z"
      }
    ]
  },
  {
    id: "TCK-1170",
    subject: "Need dedicated contact role for finance approvals",
    department: "Billing",
    priority: "Medium",
    status: "Awaiting client",
    updatedAt: "2026-03-22T09:10:00.000Z",
    excerpt: "Finance wants invoice and quote approvals routed to a separate team member.",
    messages: [
      {
        author: "VENOM Billing",
        role: "Support",
        body: "Please share the email and permission scope for the finance contact so we can add the profile safely.",
        timestamp: "2026-03-22T09:10:00.000Z"
      }
    ]
  },
  {
    id: "TCK-1162",
    subject: "Regional balancer health review",
    department: "Infrastructure",
    priority: "Low",
    status: "Resolved",
    updatedAt: "2026-03-20T18:45:00.000Z",
    excerpt: "Review completed and no packet anomalies remain on the MEA balancer segment.",
    messages: [
      {
        author: "VENOM Infrastructure",
        role: "Support",
        body: "Routing table review completed. We cleaned old upstream weights and confirmed normal behavior under load.",
        timestamp: "2026-03-20T18:45:00.000Z"
      }
    ]
  }
];

export const domains: DomainRecord[] = [
  {
    id: "dom-01",
    domain: "portal.atlas-broadcast.net",
    status: "Active",
    registrar: "Internal registrar",
    expiresOn: "2027-01-14",
    autorenew: true,
    lock: true,
    nameservers: ["ns1.venom-edge.net", "ns2.venom-edge.net"],
    purpose: "Primary branded customer portal for subscriber-facing access."
  },
  {
    id: "dom-02",
    domain: "api.atlas-broadcast.net",
    status: "Active",
    registrar: "Internal registrar",
    expiresOn: "2026-12-04",
    autorenew: true,
    lock: true,
    nameservers: ["ns1.venom-edge.net", "ns2.venom-edge.net"],
    purpose: "Backend API entry point routed through the secure origin layer."
  },
  {
    id: "dom-03",
    domain: "catchup-regiona.example",
    status: "Transfer pending",
    registrar: "External transfer",
    expiresOn: "2026-07-22",
    autorenew: false,
    lock: false,
    nameservers: ["pending-transfer"],
    purpose: "Regional replay hostname currently being transferred into the managed account."
  }
];

export const contacts: ContactRecord[] = [
  {
    id: "ct-01",
    name: "Nadia Amin",
    email: "nadia@operator.example",
    role: "Operations director",
    scope: "Full account visibility, services, support, and billing approvals"
  },
  {
    id: "ct-02",
    name: "Khaled Fares",
    email: "finance@operator.example",
    role: "Finance controller",
    scope: "Invoices, quotes, payment methods, and renewal approvals"
  }
];

export const paymentMethods: PaymentMethodRecord[] = [
  {
    id: "pm-01",
    label: "Corporate Visa",
    type: "Card",
    lastFour: "4242",
    expires: "09/28",
    isDefault: true
  },
  {
    id: "pm-02",
    label: "Treasury Wire",
    type: "Bank transfer",
    lastFour: "8841",
    expires: "On demand",
    isDefault: false
  }
];

export const announcements: AnnouncementRecord[] = [
  {
    id: "self-developed-core",
    title: "Why the self-developed core matters for operators",
    summary: "Architectural ownership is the reason VENOM CODES can enforce security discipline and scale decisions without inheriting third-party baggage.",
    publishedAt: "2026-03-18",
    body: [
      "VENOM CODES positions itself as fully developed in-house. That matters because operators are not buying a relabeled panel; they are buying a roadmap and control model that can evolve under one architectural vision.",
      "For customers, that means security rules, scaling decisions, and product direction remain aligned instead of being constrained by an upstream product that was never designed for the same operating reality.",
      "This frontend rebuild reflects that same principle. The experience is deliberate, premium, and tailored for a custom platform rather than a generic hosting portal template."
    ]
  },
  {
    id: "from-pilot-to-enterprise",
    title: "A rollout path from pilot validation to enterprise scale",
    summary: "The commercial structure is intentionally simple: validate fast, move into production, then expand into multi-region capacity with unlimited load balancers.",
    publishedAt: "2026-03-12",
    body: [
      "The pricing model is built around operational maturity. Pilot provides a low-friction evaluation footprint, Professional offers a dependable production baseline, and Enterprise opens the door to distributed infrastructure growth.",
      "That progression gives teams a clear commercial narrative and prevents the portal from feeling like a generic order form disconnected from infrastructure reality.",
      "In the new frontend, those plan differences show up everywhere: onboarding, pricing, billing summaries, and upgrade language all reinforce the same strategic arc."
    ]
  },
  {
    id: "whmcs-without-template-fatigue",
    title: "WHMCS integration without template fatigue",
    summary: "Commercial workflows still connect to WHMCS, but the customer-facing experience no longer needs to look or feel like a stock client area.",
    publishedAt: "2026-03-05",
    body: [
      "The repository architecture is clear about responsibilities. Billing, provisioning, and sensitive account operations stay anchored to backend and WHMCS boundaries, while the frontend owns experience, clarity, and navigation quality.",
      "That separation lets the portal feel like a premium SaaS product while respecting the operational systems already in place behind the scenes.",
      "The redesign uses that boundary as a strength: refined surfaces in the browser, privileged logic on the server, and no accidental leakage of internal implementation details."
    ]
  }
];

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "platform-reference",
    title: "Platform reference",
    summary: "Core product posture, management model, and component responsibilities.",
    articleCount: 2
  },
  {
    id: "infrastructure-guide",
    title: "Infrastructure guide",
    summary: "Deployment topology, service layers, and operational structure.",
    articleCount: 2
  },
  {
    id: "security-guide",
    title: "Security guide",
    summary: "Abuse prevention, access controls, and operator security discipline.",
    articleCount: 1
  },
  {
    id: "deployment-guide",
    title: "Deployment guide",
    summary: "How rollout phases map to technical and commercial choices.",
    articleCount: 1
  }
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "operator-surface-overview",
    categoryId: "platform-reference",
    title: "Operator surface overview",
    summary: "A concise reference for the panel, the portal, and how each surface supports the control model.",
    updatedAt: "2026-03-20",
    views: 812,
    body: [
      "VENOM CODES is structured around clear operational surfaces. The central management layer handles services, subscribers, and settings, while the premium portal exposes client-facing workflows like billing, support, and account review.",
      "This division is not cosmetic. It keeps the operator experience sharp and the client experience focused while avoiding duplicated business logic in the browser.",
      "When you rebuild the frontend, the goal is not to mimic a generic admin panel. The goal is to present the right data at the right level of trust and responsibility."
    ]
  },
  {
    id: "content-and-processing-layers",
    categoryId: "platform-reference",
    title: "Content and processing layers",
    summary: "How live TV, VOD, radio, metadata, and stream preparation work together.",
    updatedAt: "2026-03-18",
    views: 621,
    body: [
      "The content layer is responsible for libraries, categories, and enrichment. The processing layer is responsible for compatibility, conversion, transcoding, and quality adaptation.",
      "Together they create a workflow that is operationally coherent for teams managing both catalog curation and live delivery reliability.",
      "The new frontend represents these layers through modular sections instead of burying them in feature bullet lists."
    ]
  },
  {
    id: "multi-server-topology",
    categoryId: "infrastructure-guide",
    title: "Multi-server topology",
    summary: "From a single main node to unlimited load balancer expansion without replatforming.",
    updatedAt: "2026-03-17",
    views: 703,
    body: [
      "The infrastructure story is one of progressive expansion. Operators can start with a simple footprint and then grow into geo-aware, load-balanced delivery without abandoning the original control foundation.",
      "That matters commercially because pricing, support expectations, and architecture all reinforce the same growth path.",
      "In the frontend, infrastructure language is woven into service cards, plan comparisons, and dashboard storytelling so users always understand the scale posture they are buying."
    ]
  },
  {
    id: "runtime-and-service-ops",
    categoryId: "infrastructure-guide",
    title: "Runtime and service operations",
    summary: "Operational guidance for understanding services, nodes, and maintenance posture.",
    updatedAt: "2026-03-16",
    views: 544,
    body: [
      "The runtime surface should show what matters to operators: route health, uptime posture, current load, due dates, and where an action belongs.",
      "For client-facing views, that means communicating service state clearly without exposing implementation details that only belong on the backend or private operator tools.",
      "A premium portal earns trust when it is explicit about state and restrained about what it should not reveal."
    ]
  },
  {
    id: "anti-abuse-controls",
    categoryId: "security-guide",
    title: "Anti-abuse controls",
    summary: "A practical summary of the protection layers available across the platform.",
    updatedAt: "2026-03-15",
    views: 472,
    body: [
      "VENOM CODES emphasizes VPN and proxy detection, fingerprint protections, IP locks, country restrictions, and anti-automation controls. Those are not marketing extras; they protect content rights and revenue discipline.",
      "The frontend should communicate these protections as posture and policy rather than pretending the browser itself is the enforcement layer.",
      "That is why the rebuilt UI frames security as visibility and control while leaving privileged execution to the backend."
    ]
  },
  {
    id: "rollout-phases",
    categoryId: "deployment-guide",
    title: "Rollout phases",
    summary: "How pilot, production, and enterprise expansion should be interpreted across sales and delivery teams.",
    updatedAt: "2026-03-14",
    views: 659,
    body: [
      "Pilot validates platform fit. Professional supports dependable production. Enterprise supports distributed scale and long-term growth planning.",
      "Treating those phases as a single story improves customer understanding and reduces friction during upgrades or renewals.",
      "The redesigned frontend uses shared language across landing, billing, and service views so the platform narrative remains consistent after sign-in."
    ]
  }
];

export const catalogProducts: CatalogProductRecord[] = [
  {
    id: "pilot",
    name: "VENOM Pilot",
    description: "Launch a controlled evaluation footprint for live validation and onboarding rehearsal.",
    type: "Streaming platform",
    pricing: [{ label: "Weekly", amount: "$50.00" }],
    highlight: "Best for proof-of-concept environments."
  },
  {
    id: "professional",
    name: "VENOM Professional",
    description: "Deploy a dependable production surface with one main server and one load balancer.",
    type: "Streaming platform",
    pricing: [{ label: "Monthly", amount: "$100.00" }],
    highlight: "Balanced for production operations."
  },
  {
    id: "enterprise",
    name: "VENOM Enterprise",
    description: "Scale into distributed infrastructure with unlimited load balancers and priority support posture.",
    type: "Streaming platform",
    pricing: [{ label: "Monthly", amount: "$300.00" }],
    highlight: "Designed for distributed multi-region growth."
  }
];

export const cartPreview: CartItem[] = [
  {
    id: "cart-01",
    label: "VENOM Professional",
    cycle: "Monthly",
    unitPrice: "$100.00",
    quantity: 1,
    total: "$100.00"
  },
  {
    id: "cart-02",
    label: "Archive workflow uplift",
    cycle: "One-time",
    unitPrice: "$80.00",
    quantity: 1,
    total: "$80.00"
  }
];
