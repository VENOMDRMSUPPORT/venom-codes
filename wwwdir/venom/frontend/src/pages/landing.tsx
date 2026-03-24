import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import {
  Tv,
  Zap,
  Shield,
  Headphones,
  Globe,
  CreditCard,
  ChevronRight,
  Play,
  CheckCircle2,
  Star,
} from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <VenomLogo size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#support" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher compact className="hidden sm:flex" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-36 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <VenomLogo size="xl" showSlogan horizontal={false} />
          </div>
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-4 py-1.5">
            Premium IPTV Service
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            Stream Everything.<br />
            <span className="text-primary">No Limits.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Access thousands of live channels, VOD content, and sports events — all in one place.
            Ultra-fast servers. Crystal-clear quality. Instant activation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="font-bold text-base px-8 h-14 gap-2 shadow-lg shadow-primary/25">
                Start Streaming <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline" className="font-bold text-base px-8 h-14 gap-2">
                <Play className="w-4 h-4" /> View Plans
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {[
              { icon: CheckCircle2, label: "Instant Activation" },
              { icon: CheckCircle2, label: "24/7 Support" },
              { icon: CheckCircle2, label: "Cancel Anytime" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why Choose VENOM CODES?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for serious streamers who demand reliability, speed, and an unbeatable catalog.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast Servers",
                desc: "Our global CDN ensures zero buffering and instant channel switching, even during peak hours.",
              },
              {
                icon: Tv,
                title: "10,000+ Channels",
                desc: "Live TV, sports, news, movies, and series from around the world. Updated daily.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Military-grade encryption protects your data. No logs. No throttling.",
              },
              {
                icon: Globe,
                title: "Multi-Device Support",
                desc: "Works on Smart TVs, Firestick, MAG boxes, Android, iOS, and any IPTV player.",
              },
              {
                icon: CreditCard,
                title: "Flexible Billing",
                desc: "Monthly, quarterly, and yearly plans. Pay with cards, crypto, or PayPal.",
              },
              {
                icon: Headphones,
                title: "24/7 Expert Support",
                desc: "Our team is always on standby. Average response time under 15 minutes.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border/40 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No contracts. Pick a plan and start streaming instantly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Basic",
                price: "9.99",
                cycle: "/mo",
                features: ["1 Connection", "10,000+ Channels", "HD Quality", "Email Support"],
                highlight: false,
              },
              {
                name: "Premium",
                price: "17.99",
                cycle: "/mo",
                features: ["2 Connections", "10,000+ Channels", "FHD & 4K Quality", "VOD Library", "Priority Support"],
                highlight: true,
              },
              {
                name: "Ultimate",
                price: "24.99",
                cycle: "/mo",
                features: ["4 Connections", "10,000+ Channels", "4K UHD Quality", "Full VOD Library", "24/7 Live Chat"],
                highlight: false,
              },
            ].map(({ name, price, cycle, features, highlight }) => (
              <div
                key={name}
                className={`relative rounded-2xl p-6 border transition-all ${
                  highlight
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                    : "border-border/40 bg-card hover:border-primary/20"
                }`}
              >
                {highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold text-xs px-3">
                    Most Popular
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground font-medium mb-1">{name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">${price}</span>
                  <span className="text-muted-foreground text-sm">{cycle}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${highlight ? "text-primary" : "text-muted-foreground/50"}`} />
                      <span className={highlight ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full font-bold" variant={highlight ? "default" : "outline"}>
                    Get {name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marcus T.", text: "Best IPTV service I've ever used. Zero buffering, crystal clear quality. Worth every penny.", stars: 5 },
              { name: "Joanna R.", text: "Setup was instant, channels loaded immediately. The support team answered in minutes.", stars: 5 },
              { name: "Ahmed K.", text: "4K quality is insane. My whole family uses it across 3 devices simultaneously.", stars: 5 },
            ].map(({ name, text, stars }) => (
              <div key={name} className="bg-card border border-border/40 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{text}"</p>
                <p className="text-sm font-bold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start Streaming?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of satisfied subscribers. Get set up in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="font-bold text-base px-10 h-14 gap-2 shadow-lg shadow-primary/25">
                Create Account <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="font-bold text-base px-10 h-14 text-muted-foreground hover:text-foreground">
                Already a member? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <VenomLogo size="sm" />
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="/knowledgebase" className="hover:text-foreground transition-colors">Help Center</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VENOM CODES. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
