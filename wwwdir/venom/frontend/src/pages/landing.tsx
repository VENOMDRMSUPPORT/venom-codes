import React from "react";
import { Link } from "wouter";
import { useGetProducts } from "@workspace/api-client";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Server,
  Lock,
  Globe,
  Cpu,
  Layers,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  UserCircle2,
  Globe2,
  CircleHelp,
  BookOpen,
  Workflow,
  Tv,
  Building2,
  Newspaper,
  FileText,
  ExternalLink,
  BriefcaseBusiness,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Animated V Logo Component
// ─────────────────────────────────────────────────────────────

function AnimatedVLogo({ size = 80 }: { size?: number }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.4, height: size * 1.4 }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: [1, 1.02, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.svg
        width={size * 1.4}
        height={size * 1.4}
        viewBox="0 0 200 200"
        className="absolute inset-0"
        style={{ opacity: 0.45 }}
      >
        <defs>
          <linearGradient id="orbitalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#orbitalGrad)"
          strokeWidth="1.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      <motion.svg
        width={size * 1.2}
        height={size * 1.2}
        viewBox="0 0 200 200"
        className="absolute inset-0"
        style={{ opacity: 0.28 }}
      >
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          strokeDasharray="8 12"
          initial={{ rotate: 360 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="vMetalGrad" x1="52" y1="40" x2="146" y2="168" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--foreground) / 0.95)" />
            <stop offset="28%" stopColor="hsl(var(--primary) / 0.75)" />
            <stop offset="58%" stopColor="hsl(var(--foreground) / 0.98)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.72)" />
          </linearGradient>
          <linearGradient id="vPulseGrad" x1="100" y1="36" x2="100" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.2)" />
            <stop offset="48%" stopColor="hsl(var(--primary) / 0.95)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
          </linearGradient>
          <linearGradient id="vGrad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          </linearGradient>
          <filter id="vGlow">
            <feGaussianBlur stdDeviation="3.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="vSoft3D">
            <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="hsl(var(--primary))" floodOpacity="0.32" />
          </filter>
        </defs>

        <motion.path
          d="M60 40 L100 160 L140 40"
          fill="none"
          stroke="url(#vMetalGrad)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vSoft3D)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M60 40 L100 160 L140 40"
          fill="none"
          stroke="url(#vPulseGrad)"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 14"
          filter="url(#vGlow)"
          animate={
            isHovered
              ? { strokeDashoffset: [0, -90], opacity: [0.45, 1, 0.45] }
              : { strokeDashoffset: 0, opacity: 0.38 }
          }
          transition={isHovered ? { duration: 1.3, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
        />

        <motion.circle
          cx="100"
          cy="36"
          r="5"
          fill="hsl(var(--primary) / 0.6)"
          animate={isHovered ? { cy: [36, 162, 36], opacity: [0.15, 0.9, 0.15] } : { opacity: 0.15 }}
          transition={isHovered ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
        />
      </svg>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header Component
// ─────────────────────────────────────────────────────────────

const navAnchors = [
  { label: "Platform", sectionId: "features" },
  { label: "Solutions", sectionId: "capabilities" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "Support", sectionId: "support" },
] as const;

function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<(typeof navAnchors)[number]["sectionId"]>("features");
  const [hoveredSection, setHoveredSection] = React.useState<(typeof navAnchors)[number]["sectionId"] | null>(null);
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const [underlineStyle, setUnderlineStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = React.useRef<HTMLDivElement>(null);
  const navItemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  const updateUnderline = React.useCallback((targetSectionId: string) => {
    const navContainer = navContainerRef.current;
    const targetNode = navItemRefs.current[targetSectionId];
    if (!navContainer || !targetNode) return;

    const containerRect = navContainer.getBoundingClientRect();
    const targetRect = targetNode.getBoundingClientRect();
    setUnderlineStyle({
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      opacity: 1,
    });
  }, []);

  React.useEffect(() => {
    const updateSectionOnScroll = () => {
      setIsScrolled(window.scrollY > 30);

      let currentSection: (typeof navAnchors)[number]["sectionId"] = navAnchors[0].sectionId;
      navAnchors.forEach((item) => {
        const section = document.getElementById(item.sectionId);
        if (!section) return;
        if (window.scrollY + 180 >= section.offsetTop) {
          currentSection = item.sectionId;
        }
      });

      setActiveSection(currentSection);
      if (!hoveredSection) {
        updateUnderline(currentSection);
      }
    };

    updateSectionOnScroll();
    window.addEventListener("scroll", updateSectionOnScroll, { passive: true });
    window.addEventListener("resize", updateSectionOnScroll);
    return () => {
      window.removeEventListener("scroll", updateSectionOnScroll);
      window.removeEventListener("resize", updateSectionOnScroll);
    };
  }, [hoveredSection, updateUnderline]);

  React.useEffect(() => {
    if (!hoveredSection) {
      updateUnderline(activeSection);
    }
  }, [activeSection, hoveredSection, updateUnderline]);

  const topTierHeightClass = isScrolled ? "h-10" : "h-11";
  const mainTierHeightClass = isScrolled ? "h-17" : "h-21";

  const scrollToSection = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? "border-border/75 bg-background/72 backdrop-blur-[18px]" : "border-border/45 bg-background/45 backdrop-blur-[12px]"}`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent dark:from-emerald-400/8" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`hidden md:flex items-center justify-between border-b border-border/50 bg-background/10 text-xs text-muted-foreground transition-all duration-300 ${topTierHeightClass}`}
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
            Enterprise Streaming Platform
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-5">
              <button className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                <Globe2 className="w-3.5 h-3.5" />
                EN
              </button>
              <a href="#support" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                <CircleHelp className="w-3.5 h-3.5" />
                Support
              </a>
              <a href="/knowledgebase" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                Documentation
              </a>
            </div>

            <div className="h-4 w-px bg-border/80" />

            <button
              aria-label="Search"
              onClick={() => setSearchExpanded(value => !value)}
              className="inline-flex items-center justify-center rounded-lg border border-transparent p-1.5 hover:border-border hover:bg-background/70 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <AnimatePresence initial={false}>
              {searchExpanded && (
                <motion.input
                  key="search-expanded"
                  initial={{ opacity: 0, width: 0, y: -4 }}
                  animate={{ opacity: 1, width: 220, y: 0 }}
                  exit={{ opacity: 0, width: 0, y: -4 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  placeholder="Search platform docs..."
                  className="h-8 rounded-lg border border-border/80 bg-background/80 px-3 text-xs text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                />
              )}
            </AnimatePresence>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/55 px-2.5 py-1.5 hover:bg-background/75 transition-colors"
            >
              <span className="relative inline-flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-emerald-500/55 bg-emerald-500/10" />
                <span className="absolute h-4 w-4 rotate-45 border border-emerald-500/40 rounded-[3px]" />
                <UserCircle2 className="relative z-10 w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              </span>
              <span className="font-medium text-foreground">Account</span>
            </Link>
          </div>
        </div>

        <div className={`flex items-center justify-between transition-all duration-300 ${mainTierHeightClass}`}>
          <Link href="/" className="flex items-center gap-3.5 group py-2">
            <AnimatedVLogo size={isScrolled ? 42 : 52} />
            <div className="leading-none">
              <p className="text-[1.5rem] md:text-[1.95rem] font-display font-black tracking-[0.09em] text-foreground">
                <span className="text-emerald-500 dark:text-emerald-400">V</span>ENOM CODES
              </p>
              <p className="text-[10px] tracking-[0.4em] uppercase mt-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                STREAM • CONTROL • SCALE
              </p>
            </div>
          </Link>

          <nav
            ref={navContainerRef}
            onMouseLeave={() => {
              setHoveredSection(null);
              updateUnderline(activeSection);
            }}
            className="hidden lg:flex relative items-center gap-2"
          >
            <motion.div
              className="absolute -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              animate={{ left: underlineStyle.left, width: underlineStyle.width, opacity: underlineStyle.opacity }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
            {navAnchors.map((item) => (
              <a
                key={item.label}
                ref={(node) => {
                  navItemRefs.current[item.sectionId] = node;
                }}
                href={`#${item.sectionId}`}
                onClick={scrollToSection(item.sectionId)}
                onMouseEnter={() => {
                  setHoveredSection(item.sectionId);
                  updateUnderline(item.sectionId);
                }}
                className={`rounded-xl px-3 py-2 text-sm transition-all ${activeSection === item.sectionId ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeSwitcher compact className="hidden sm:flex" />
            <Link href="/register" className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl border border-white/30 bg-white/5 px-5 text-sm font-semibold text-foreground shadow-[0_8px_24px_rgba(10,10,10,0.2)] backdrop-blur-md">
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.75),rgba(16,185,129,0.1)_45%,transparent_72%)]"
                initial={{ scale: 0.2, opacity: 0 }}
                whileHover={{ scale: 2.25, opacity: 1 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="relative z-10">
                Platform Access
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <AnimatedVLogo size={100} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight">
            <span className="text-foreground">VENOM</span>{" "}
            <span className="text-primary">CODES</span>
          </h1>
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-muted-foreground mt-2">
            Stream · Control · Scale
          </p>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Professional-grade IPTV control platform built for operators who demand stability, 
          scalability, and complete operational control.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link href="/register">
            <Button size="lg" className="font-semibold text-base px-8 h-12 gap-2">
              Start Your Trial <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/order">
            <Button size="lg" variant="outline" className="font-semibold text-base px-8 h-12 gap-2">
              View Plans
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            "100% Self-Developed",
            "Multi-Server Support",
            "Enterprise Security",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Features Section
// ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: Shield,
    title: "Advanced Security",
    description: "VPN/proxy detection, fingerprint protection, IP-based locking, and anti-automation safeguards.",
  },
  {
    icon: Server,
    title: "Multi-Server Architecture",
    description: "Load balancing, smart geo-routing, horizontal scaling, and high availability redundancy.",
  },
  {
    icon: Globe,
    title: "Global Content Delivery",
    description: "Multi-protocol support including HTTP, RTMP, RTSP, RTP, UDP with transcoding engine.",
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Country restrictions, device limits, and smart access rules for subscriber management.",
  },
  {
    icon: Cpu,
    title: "Transcoding Engine",
    description: "Optimize content for any device or connection speed with adaptive quality settings.",
  },
  {
    icon: Layers,
    title: "Content Management",
    description: "Live TV, VOD, radio streams with TMDB integration for automatic metadata enrichment.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Built for <span className="text-primary">Operational Excellence</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature designed for real-world deployment with the stability and control operators need.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Capabilities Section
// ─────────────────────────────────────────────────────────────

const capabilities = [
  {
    title: "Load Balancing",
    description: "Distribute traffic intelligently across multiple servers based on geo-location, ISP, and current load.",
    stats: "99.99% Uptime",
  },
  {
    title: "Smart Routing",
    description: "GeoIP, ISP-based, and load-aware viewer distribution for optimal streaming performance.",
    stats: "Global CDN",
  },
  {
    title: "Stream Protection",
    description: "Fingerprint protection and anti-piracy measures to safeguard your content investment.",
    stats: "24/7 Monitoring",
  },
  {
    title: "Multi-Protocol",
    description: "Support for HTTP, RTMP, RTSP, RTP, UDP, and MMS protocols for maximum compatibility.",
    stats: "6 Protocols",
  },
];

function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Platform <span className="text-primary">Capabilities</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Technical infrastructure built for scale, security, and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{cap.title}</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {cap.stats}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic Pricing Section
// ─────────────────────────────────────────────────────────────

interface PricingCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    pricing: Record<string, unknown>;
  };
}

function PricingCard({ product }: PricingCardProps) {
  // Get the first available pricing period
  const pricingKeys = Object.keys(product.pricing);
  const period = pricingKeys[0];
  const pricing = product.pricing[period];
  if (!pricing || typeof pricing !== "object") return null;
  const resolvedPricing = pricing as { price?: number };

  // Determine cycle label
  const cycleLabel = period === "monthly" ? "/mo" : period === "quarterly" ? "/qtr" : period === "annually" ? "/yr" : "/period";

  // Get main price
  const mainPrice = typeof resolvedPricing.price === "number" ? resolvedPricing.price : 0;

  return (
    <div className="relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 group">
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-xs text-muted-foreground mb-4">
        {product.description || "Professional streaming platform"}
      </p>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-display font-black">${mainPrice.toFixed(2)}</span>
        <span className="text-muted-foreground text-sm">{cycleLabel}</span>
      </div>

      <Link href={`/order?product=${product.id}`}>
        <Button className="w-full font-semibold" variant="outline">
          View Details
        </Button>
      </Link>
    </div>
  );
}

function PricingSection() {
  const { data: catalog, isLoading, isError, refetch } = useGetProducts();

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Flexible <span className="text-primary">Pricing Plans</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the plan that matches your operational scale. All plans include core platform features.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <p className="text-destructive">Failed to load pricing plans.</p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && catalog?.products && catalog.products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.products.map((product) => (
              <PricingCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !isError && (!catalog?.products || catalog.products.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pricing plans available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Support / CTA Section
// ─────────────────────────────────────────────────────────────

function SupportSection() {
  return (
    <section id="support" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Ready to <span className="text-primary">Scale</span> Your Operations?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Join operators who trust VENOM CODES for stable, secure, and scalable streaming infrastructure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="font-semibold text-base px-10 h-12 gap-2">
              Create Account <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="ghost" className="font-semibold text-base px-10 h-12 text-muted-foreground hover:text-foreground">
              Already a Member? Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[
            { value: "24/7", label: "Support" },
            { value: "99.9%", label: "Uptime" },
            { value: "<15min", label: "Response" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-display font-bold text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer Component
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/90 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.12),transparent_36%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,0.13),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.09),transparent_32%)]" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-8 xl:gap-10 mb-12">
          <div className="xl:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <AnimatedVLogo size={52} />
              <div className="leading-none">
                <p className="text-2xl font-display font-black tracking-[0.1em]">
                  <span className="text-emerald-500 dark:text-emerald-400">V</span>ENOM
                </p>
                <p className="text-xs tracking-[0.45em] uppercase text-muted-foreground mt-1.5">CODES</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-5">
              The scalable core for next-generation IPTV.
              <br />
              Powered by precision.
            </p>

            <div className="max-w-md rounded-2xl border border-border/70 bg-background/40 p-2 transition-all duration-300 focus-within:border-emerald-500/45 focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_34px_rgba(16,185,129,0.22)]">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="h-10 flex-1 rounded-xl border border-border/60 bg-background/85 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-emerald-500/50 transition-colors"
                />
                <Button className="h-10 px-5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-95">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground">Platform</h4>
            <div className="w-6 h-0.5 rounded-full bg-emerald-500 mt-1.5 mb-4" />
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#features" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Features</a></li>
              <li><a href="#capabilities" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Workflow className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Scalability</a></li>
              <li><a href="#support" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Security</a></li>
              <li><Link href="/knowledgebase" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground">Solutions</h4>
            <div className="w-6 h-0.5 rounded-full bg-emerald-500 mt-1.5 mb-4" />
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#features" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Tv className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />OTT Providers</a></li>
              <li><a href="#capabilities" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />MSOs</a></li>
              <li><a href="#features" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Media Companies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground">Resources</h4>
            <div className="w-6 h-0.5 rounded-full bg-emerald-500 mt-1.5 mb-4" />
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/knowledgebase" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Documentation</Link></li>
              <li><a href="/announcements" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Case Studies</a></li>
              <li><a href="/announcements" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Newspaper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Blog</a></li>
              <li><a href="/knowledgebase" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Webinars</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground">Company</h4>
            <div className="w-6 h-0.5 rounded-full bg-emerald-500 mt-1.5 mb-4" />
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#capabilities" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />About Us</a></li>
              <li><a href="#support" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><BriefcaseBusiness className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Careers</a></li>
              <li><a href="mailto:support@venom-codes.test" className="inline-flex items-center gap-2 hover:text-foreground transition-all"><Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="relative mb-9 overflow-hidden rounded-2xl border border-emerald-500/35 bg-black/45 p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.35), transparent 40%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.2), transparent 44%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.08), transparent 35%)",
            }}
            animate={{ x: [-18, 16, -18], y: [12, -14, 12] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <p className="text-lg font-display font-semibold text-foreground">Ready to scale? Connect with our team.</p>
            <p className="text-sm text-muted-foreground mt-1">Architecture guidance and operational rollout support included.</p>
          </div>
          <Link href="/support/tickets/new" className="relative z-10">
            <Button className="h-11 px-6 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-95">
              Contact Sales
            </Button>
          </Link>
        </div>

        <div className="pt-7 border-t border-border/80 grid md:grid-cols-3 gap-4 items-center">
          <p className="text-xs text-muted-foreground md:text-left text-center">
            © {new Date().getFullYear()} VENOM CODES. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">SLA</a>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-3 text-muted-foreground">
            <a aria-label="LinkedIn" href="#" className="group relative w-9 h-9 overflow-hidden rounded-lg border border-border/80 inline-flex items-center justify-center text-muted-foreground transition-all hover:border-[#0A66C2]/60">
              <span className="absolute inset-0 bg-[#0A66C2] opacity-0 transition-opacity duration-200 group-hover:opacity-90" />
              <Linkedin className="relative z-10 w-4 h-4 transition-colors group-hover:text-white" />
            </a>
            <a aria-label="Twitter" href="#" className="group relative w-9 h-9 overflow-hidden rounded-lg border border-border/80 inline-flex items-center justify-center text-muted-foreground transition-all hover:border-[#111111]/60 dark:hover:border-[#1DA1F2]/60">
              <span className="absolute inset-0 bg-[#111111] dark:bg-[#1DA1F2] opacity-0 transition-opacity duration-200 group-hover:opacity-90" />
              <Twitter className="relative z-10 w-4 h-4 transition-colors group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Landing Page Component
// ─────────────────────────────────────────────────────────────

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CapabilitiesSection />
        <PricingSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
