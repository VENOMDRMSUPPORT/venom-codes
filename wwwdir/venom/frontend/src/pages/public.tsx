import React, { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import {
  useGetAnnouncements,
  useGetAnnouncement,
  useGetKnowledgebaseCategories,
  useGetKbCategory,
  useGetKbArticle,
  getSearchKnowledgebaseQueryOptions,
  useGetProducts,
  useGetProductAddons,
  useAddCartItem,
} from "@workspace/api-client";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export function AnnouncementsList() {
  const { data, isLoading, isError } = useGetAnnouncements();

  return (
    <DashboardLayout title="News & Announcements">
      <div className="space-y-4">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-6 rounded-2xl space-y-3">
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Skeleton className="h-5 w-2/3 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-5/6 bg-white/10" />
          </div>
        ))}

        {isError && (
          <div className="glass p-8 rounded-2xl text-center text-red-400">
            Failed to load announcements. Please try again later.
          </div>
        )}

        {!isLoading && !isError && (!data?.announcements || data.announcements.length === 0) && (
          <div className="glass p-12 rounded-2xl text-center text-white/50">
            No announcements at this time.
          </div>
        )}

        {data?.announcements?.map(a => (
          <Link key={a.id} href={`/announcements/${a.id}`}>
            <div className="glass p-6 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
              <span className="text-xs text-primary font-semibold uppercase tracking-widest">{a.date}</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-3 group-hover:text-primary transition-colors">{a.title}</h3>
              <div
                className="text-white/60 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{ __html: a.announcement || "" }}
              />
              <span className="mt-4 inline-block text-xs font-semibold text-primary">Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function AnnouncementDetail() {
  const [, params] = useRoute("/announcements/:id");
  const id = params?.id ?? "";
  const { data, isLoading, isError } = useGetAnnouncement(id);

  return (
    <DashboardLayout title="Announcement">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/announcements">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              ← Back to Announcements
            </button>
          </Link>
        </div>

        {isLoading && (
          <div className="glass p-8 rounded-2xl space-y-4">
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Skeleton className="h-8 w-3/4 bg-white/10" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
            </div>
          </div>
        )}

        {isError && (
          <div className="glass p-8 rounded-2xl text-center text-red-400">
            Failed to load announcement.
          </div>
        )}

        {data && (
          <div className="glass p-8 rounded-2xl">
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">{data.date}</span>
            <h1 className="text-3xl font-bold text-white mt-3 mb-6">{data.title}</h1>
            <div
              className="text-white/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.announcement || "" }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export function KnowledgebaseIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isLoading: loadingIndex, isError: errorIndex } = useGetKnowledgebaseCategories();
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    ...getSearchKnowledgebaseQueryOptions({ q: submittedQuery }),
    enabled: submittedQuery.length > 0,
  });

  const categories = data?.categories ?? [];
  const featuredArticles = data?.featuredArticles ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setSubmittedQuery(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSubmittedQuery("");
  };

  return (
    <DashboardLayout title="Knowledgebase">
      <div className="space-y-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search knowledgebase articles..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-primary/20"
          >
            Search
          </button>
          {submittedQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 border border-white/10 text-white/60 hover:text-white rounded-lg text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {submittedQuery && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              Results for "{submittedQuery}"
            </h2>
            {loadingSearch && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass p-4 rounded-xl">
                    <Skeleton className="h-5 w-2/3 bg-white/10 mb-2" />
                    <Skeleton className="h-3 w-full bg-white/10" />
                  </div>
                ))}
              </div>
            )}
            {!loadingSearch && searchResults && searchResults.length === 0 && (
              <div className="glass p-8 rounded-2xl text-center text-white/50">
                No articles found matching "{submittedQuery}".
              </div>
            )}
            {!loadingSearch && searchResults && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map(article => (
                  <Link key={article.id} href={`/knowledgebase/${article.categoryId}/${article.id}`}>
                    <div className="glass p-4 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">{article.title}</h3>
                      <div
                        className="text-white/50 text-xs mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!submittedQuery && (
          <div className="space-y-10">
            {loadingIndex && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-3">
                      <Skeleton className="h-5 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-full bg-white/10" />
                      <Skeleton className="h-3 w-16 bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorIndex && (
              <div className="glass p-8 rounded-2xl text-center text-red-400">
                Failed to load knowledgebase.
              </div>
            )}

            {!loadingIndex && !errorIndex && featuredArticles.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Popular Articles</h2>
                <div className="space-y-3">
                  {featuredArticles.map(article => (
                    <Link key={article.id} href={`/knowledgebase/${article.categoryId}/${article.id}`}>
                      <div className="glass p-4 rounded-xl hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm">{article.title}</h3>
                          {article.views != null && (
                            <span className="text-white/40 text-xs">{article.views} views</span>
                          )}
                        </div>
                        <span className="text-primary text-sm shrink-0 ml-4">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loadingIndex && !errorIndex && (
              <div>
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Browse Categories</h2>
                {categories.length === 0 && (
                  <div className="glass p-12 rounded-2xl text-center text-white/50">
                    No knowledgebase categories found.
                  </div>
                )}
                {categories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map(c => (
                      <Link key={c.id} href={`/knowledgebase/${c.id}`}>
                        <div className="glass p-6 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group h-full flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors leading-tight">
                              {c.name}
                            </h3>
                            {c.articleCount != null && (
                              <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20 text-xs">
                                {c.articleCount}
                              </Badge>
                            )}
                          </div>
                          {c.description && (
                            <p className="text-white/50 text-sm flex-1">{c.description}</p>
                          )}
                          <span className="mt-4 text-xs font-semibold text-primary">Browse →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export function KnowledgebaseCategoryPage() {
  const [, params] = useRoute("/knowledgebase/:categoryId");
  const categoryId = params?.categoryId ?? "";
  const { data, isLoading, isError } = useGetKbCategory(categoryId);

  return (
    <DashboardLayout title={data?.category?.name || "Knowledgebase"}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/knowledgebase">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              ← Back to Knowledgebase
            </button>
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2 bg-white/10 mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass p-5 rounded-xl">
                <Skeleton className="h-5 w-2/3 bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="glass p-8 rounded-2xl text-center text-red-400">
            Failed to load category.
          </div>
        )}

        {!isLoading && data && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">{data.category.name}</h2>
              {data.category.description && (
                <p className="text-white/50 mt-2">{data.category.description}</p>
              )}
            </div>

            {data.articles.length === 0 && (
              <div className="glass p-10 rounded-2xl text-center text-white/50">
                No articles in this category yet.
              </div>
            )}

            <div className="space-y-3">
              {data.articles.map(article => (
                <Link key={article.id} href={`/knowledgebase/${categoryId}/${article.id}`}>
                  <div className="glass p-5 rounded-xl hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      {article.views != null && (
                        <span className="text-white/40 text-xs mt-1 block">{article.views} views</span>
                      )}
                    </div>
                    <span className="text-primary text-sm shrink-0 ml-4">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export function KnowledgebaseArticlePage() {
  const [, params] = useRoute("/knowledgebase/:categoryId/:articleId");
  const categoryId = params?.categoryId ?? "";
  const articleId = params?.articleId ?? "";
  const { data, isLoading, isError } = useGetKbArticle(categoryId, articleId);

  return (
    <DashboardLayout title={data?.title || "Article"}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-3 text-sm">
          <Link href="/knowledgebase">
            <button className="text-white/40 hover:text-white/70 transition-colors">
              Knowledgebase
            </button>
          </Link>
          <span className="text-white/20">/</span>
          <Link href={`/knowledgebase/${categoryId}`}>
            <button className="text-primary hover:text-primary/80 transition-colors">
              ← Back to Category
            </button>
          </Link>
        </div>

        {isLoading && (
          <div className="glass p-8 rounded-2xl space-y-4">
            <Skeleton className="h-8 w-2/3 bg-white/10" />
            <Skeleton className="h-3 w-24 bg-white/10" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
            </div>
          </div>
        )}

        {isError && (
          <div className="glass p-8 rounded-2xl text-center text-red-400">
            Failed to load article.
          </div>
        )}

        {data && (
          <div className="glass p-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white mb-3">{data.title}</h1>
            {(data.views != null || data.createdAt) && (
              <div className="flex items-center gap-4 mb-8 text-white/40 text-xs pb-6 border-b border-white/10">
                {data.views != null && <span>{data.views} views</span>}
                {data.createdAt && <span>Published {data.createdAt}</span>}
              </div>
            )}
            <div
              className="text-white/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const BILLING_CYCLES = ["monthly", "quarterly", "semiannually", "annually", "biennially", "triennially"] as const;
type BillingCycle = typeof BILLING_CYCLES[number];

const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  semiannually: "Semi-Annual",
  annually: "Annual",
  biennially: "Biennial",
  triennially: "Triennial",
};

function getPriceForCycle(pricing: Record<string, unknown>, cycle: BillingCycle): string | null {
  const cycleData = pricing[cycle] as Record<string, unknown> | undefined;
  if (!cycleData) return null;
  const price = String(cycleData["price"] ?? cycleData["value"] ?? "");
  if (!price || price === "-1" || price === "0.00") return null;
  return price;
}

function getAvailableCycles(pricing: Record<string, unknown>): BillingCycle[] {
  return BILLING_CYCLES.filter(c => getPriceForCycle(pricing, c) !== null);
}

function ProductCard({ product }: {
  product: { id: string; name: string; description?: string; pricing?: Record<string, unknown>; type?: string };
}) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const pricing = product.pricing ?? {};
  const availableCycles = getAvailableCycles(pricing);
  const [cycle, setCycle] = useState<BillingCycle>(availableCycles[0] ?? "monthly");
  const [showDesc, setShowDesc] = useState(false);
  const [domain, setDomain] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const addToCart = useAddCartItem();
  const { data: productAddons = [] } = useGetProductAddons(product.id);

  const currentPrice = getPriceForCycle(pricing, cycle);
  const requiresDomain = product.type === "hostingaccount" || product.type === "reselleraccount";

  function toggleAddon(addonId: string) {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  }

  function handleAddToCart() {
    if (requiresDomain && !domain.trim()) {
      toast({ title: "Domain required", description: "Please enter a domain name before adding to cart.", variant: "destructive" });
      return;
    }
    addToCart.mutate(
      {
        data: {
          productId: product.id,
          billingCycle: cycle,
          quantity: 1,
          domain: domain || undefined,
          addons: selectedAddons.map((id) => ({ id, quantity: 1 })),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
          navigate("/cart");
        },
        onError: () => {
          toast({
            title: "Failed to add to cart",
            description: "Unable to add product. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="glass rounded-3xl p-8 flex flex-col border border-white/5 hover:border-primary/30 transition-all">
      <div className="flex-1">
        <h3 className="font-bold text-2xl text-white mb-2">{product.name}</h3>

        {product.description && (
          <div className="mb-6">
            <p className={`text-muted-foreground text-sm leading-relaxed ${!showDesc ? "line-clamp-3" : ""}`}>
              {product.description.replace(/<[^>]+>/g, "")}
            </p>
            {product.description.length > 120 && (
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
              >
                {showDesc ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> More</>}
              </button>
            )}
          </div>
        )}

        {availableCycles.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Billing Cycle</p>
            <div className="flex flex-wrap gap-2">
              {availableCycles.map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    cycle === c
                      ? "bg-primary text-white border-primary"
                      : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white"
                  }`}
                >
                  {CYCLE_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentPrice && (
          <div className="mb-6">
            <p className="text-3xl font-bold font-mono text-white">
              ${currentPrice}
              <span className="text-base text-muted-foreground font-normal ml-1">
                / {CYCLE_LABELS[cycle].toLowerCase()}
              </span>
            </p>
          </div>
        )}

        {requiresDomain && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Domain Name</p>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="bg-black/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/60"
            />
          </div>
        )}

        {productAddons.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Add-ons</p>
            <div className="space-y-2">
              {productAddons.map((addon) => (
                <label key={addon.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-white group-hover:text-primary transition-colors">{addon.name}</span>
                  {addon.pricing?.[cycle]?.price && (
                    <span className="text-xs text-muted-foreground ml-auto">+${addon.pricing[cycle].price}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <Button
          className="w-full gap-2 font-bold h-12 text-base"
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
        >
          {addToCart.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          {addToCart.isPending ? "Adding to Cart…" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

export function Catalog() {
  const { data: products, isLoading, isError, refetch } = useGetProducts();
  const [search, setSearch] = useState("");

  const filtered = (products ?? []).filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Order Services">
      <div className="mb-6">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-primary/60"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-8 rounded-3xl space-y-4">
              <Skeleton className="h-6 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10 mt-6" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="glass p-8 rounded-2xl text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-red-400">Failed to load products.</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="glass p-16 rounded-2xl text-center">
          <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {search ? "No products match your search." : "No products available."}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
