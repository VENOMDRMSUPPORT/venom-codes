import { Link, useParams } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetAnnouncements, useGetAnnouncementDetail, useGetKnowledgebaseCategories, useGetKnowledgebaseCategory, useGetKnowledgebaseArticle, useGetCatalogProducts } from "@/api/client";
import { Book, Megaphone, Search, ChevronRight, FileText, ArrowRight, Calendar, Eye, Clock, AlertCircle, Loader2, ThumbsUp, Share2, Layers3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

// --- ANNOUNCEMENTS ---
export function AnnouncementsList() {
  const { data, isLoading, isError } = useGetAnnouncements();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Portal
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black mb-2">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-secondary/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load announcements. Please try again.</p>
          </div>
        ) : !data?.announcements || data.announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm mt-1">Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.announcements.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/announcements/${ann.id}`}>
                  <div className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {ann.title}
                        </h3>
                        {ann.date && (
                          <p className="text-sm text-muted-foreground mt-1">{ann.date}</p>
                        )}
                        {ann.summary && (
                          <p className="text-muted-foreground mt-2 line-clamp-2">{ann.summary}</p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: announcement, isLoading, isError } = useGetAnnouncementDetail(id ?? "");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/announcements" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Announcements
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load announcement. Please try again.</p>
          </div>
        ) : announcement ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                {(announcement.date || announcement.publishedAt) && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {announcement.date || announcement.publishedAt}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mb-4">{announcement.title}</h1>

              {announcement.summary && (
                <p className="text-xl text-muted-foreground">{announcement.summary}</p>
              )}
            </div>

            {announcement.content && (
              <div className="rounded-2xl bg-card border border-border p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {announcement.content}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Link href="/announcements">
                <Button variant="outline" className="gap-2">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  All Announcements
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

// --- KNOWLEDGEBASE ---
export function KnowledgebaseIndex() {
  const { data, isLoading, isError } = useGetKnowledgebaseCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Portal
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black mb-2">Help Center</h1>
          <p className="text-muted-foreground">Find answers and tutorials</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-secondary/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load help center. Please try again.</p>
          </div>
        ) : !data?.categories || data.categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No help articles yet</p>
            <p className="text-sm mt-1">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {data?.categories?.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/knowledgebase/${cat.id}`}>
                  <div className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-all group cursor-pointer h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.articleCount ?? 0} articles</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function KnowledgebaseCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, isError } = useGetKnowledgebaseCategory(id ?? "");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/knowledgebase" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Help Center
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load category. Please try again.</p>
          </div>
        ) : category ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-black mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {category.articles?.length ?? category.articleCount ?? 0} articles
              </p>
            </div>

            {category.articles && category.articles.length > 0 ? (
              <div className="space-y-3">
                {category.articles.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/knowledgebase/${category.id}/${article.id}`}>
                      <div className="rounded-xl bg-card border border-border p-5 hover:border-primary/30 transition-all group cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold group-hover:text-primary transition-colors mb-1">
                              {article.title}
                            </h3>
                            {article.summary && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                            )}
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          {article.views !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views} views
                            </span>
                          )}
                          {article.helpful !== undefined && (
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {article.helpful} helpful
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No articles in this category yet.</p>
              </div>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export function KnowledgebaseArticlePage() {
  const { id: categoryId, articleId } = useParams<{ id: string; articleId: string }>();
  const { data: article, isLoading, isError } = useGetKnowledgebaseArticle(categoryId ?? "", articleId ?? "");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/knowledgebase/${categoryId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Category
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load article. Please try again.</p>
          </div>
        ) : article ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-4">{article.title}</h1>

              {article.summary && (
                <p className="text-xl text-muted-foreground">{article.summary}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.views !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {article.views} views
                </span>
              )}
              {article.helpful !== undefined && (
                <span className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  {article.helpful} people found this helpful
                </span>
              )}
              {(article.createdAt || article.updatedAt) && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Updated {article.updatedAt || article.createdAt}
                </span>
              )}
            </div>

            {article.content && (
              <div className="rounded-2xl bg-card border border-border p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {article.content}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <Link href={`/knowledgebase/${categoryId}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to Category
                </Button>
              </Link>
              <Button variant="ghost" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Article
              </Button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

// --- CATALOG ---
export function Catalog() {
  const { data, isLoading, isError } = useGetCatalogProducts();

  return (
    <DashboardLayout title="Order New Service">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-2">Our Services</h1>
          <p className="text-muted-foreground">Choose from our premium IPTV packages</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load services. Please try again.</p>
          </div>
        ) : !data?.products || data.products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Layers3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No services available</p>
            <p className="text-sm mt-1">Check back later for new offerings.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {data?.products?.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-black text-primary">{product.price}</span>
                  <span className="text-muted-foreground">/{product.cycle}</span>
                </div>
                <Button className="w-full rounded-xl">Add to Cart</Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
