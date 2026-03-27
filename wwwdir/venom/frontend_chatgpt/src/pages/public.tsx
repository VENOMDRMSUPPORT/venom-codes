import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Newspaper, ShoppingBag } from "lucide-react";
import { addCartItem, getAnnouncement, getKnowledgeArticle, getKnowledgeCategory, getKnowledgebaseIndex, listAnnouncements, listProducts } from "@/lib/api";
import {
  announcements as previewAnnouncements,
  catalogProducts as previewCatalogProducts,
  knowledgeArticles as previewKnowledgeArticles,
  knowledgeCategories as previewKnowledgeCategories
} from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";

function PublicShell({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="min-h-screen pb-10">
      <MarketingHeader />
      <main className="shell space-y-8 py-10 lg:py-14">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">Public resources</div>
          <h1 className="heading-xl max-w-4xl font-semibold text-[var(--foreground)]">{title}</h1>
          <p className="max-w-3xl text-base leading-8 text-muted">{body}</p>
        </div>
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}

export function AnnouncementsList() {
  const announcementsQuery = usePreviewQuery({
    queryKey: ["announcements"],
    queryFn: listAnnouncements,
    previewData: previewAnnouncements
  });

  const announcements = announcementsQuery.data ?? [];

  if (announcementsQuery.isLoading) {
    return (
      <PublicShell title="Announcements" body="Operator-facing updates, product positioning, and rollout commentary.">
        <DataState kind="loading" title="Loading announcements" message="Requesting the public announcement feed from the backend." />
      </PublicShell>
    );
  }

  if (announcementsQuery.isError) {
    return (
      <PublicShell title="Announcements" body="Operator-facing updates, product positioning, and rollout commentary.">
        <DataState kind="error" title="Unable to load announcements" message="The announcement feed was not returned by the backend." actionLabel="Retry" onAction={() => announcementsQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title="Announcements" body="Narrative-driven product updates that reinforce why VENOM CODES is positioned as a self-developed, premium operational platform.">
      <section className="grid gap-5 xl:grid-cols-3">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="rounded-[30px] p-6">
            <Newspaper className="size-6 text-cyan-400" />
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">{formatDate(announcement.publishedAt)}</div>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{announcement.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{announcement.summary}</p>
            <div className="mt-6">
              <ButtonLink href={`/announcements/${announcement.id}`} variant="outline" size="sm">
                Read update
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </PublicShell>
  );
}

export function AnnouncementDetail({ announcementId }: { announcementId: string }) {
  const previewData = previewAnnouncements.find((announcement) => announcement.id === announcementId) ?? previewAnnouncements[0];
  const announcementQuery = usePreviewQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => getAnnouncement(announcementId),
    previewData
  });

  const announcement = announcementQuery.data;

  if (announcementQuery.isLoading) {
    return (
      <PublicShell title="Announcement detail" body="Reading the selected update.">
        <DataState kind="loading" title="Loading announcement" message="Requesting the selected announcement from the backend." />
      </PublicShell>
    );
  }

  if (announcementQuery.isError || !announcement) {
    return (
      <PublicShell title="Announcement detail" body="Reading the selected update.">
        <DataState kind="error" title="Unable to load announcement" message="The selected announcement was not returned by the backend." actionLabel="Retry" onAction={() => announcementQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title={announcement.title} body={`Published ${formatDate(announcement.publishedAt)}`}>
      <Card className="shell-narrow rounded-[32px] p-8">
        <div className="space-y-6">
          {announcement.body.map((paragraph, index) => (
            <p key={index} className="text-base leading-8 text-muted">{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/announcements" variant="outline">Back to announcements</ButtonLink>
          <ButtonLink href="/knowledgebase">Open knowledgebase</ButtonLink>
        </div>
      </Card>
    </PublicShell>
  );
}

export function KnowledgebaseIndex() {
  const categoriesQuery = usePreviewQuery({
    queryKey: ["knowledgebase"],
    queryFn: getKnowledgebaseIndex,
    previewData: previewKnowledgeCategories
  });

  const categories = categoriesQuery.data ?? [];

  if (categoriesQuery.isLoading) {
    return (
      <PublicShell title="Knowledgebase" body="Reference material designed to keep product, architecture, and rollout language consistent.">
        <DataState kind="loading" title="Loading knowledgebase" message="Requesting knowledgebase categories from the backend." />
      </PublicShell>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <PublicShell title="Knowledgebase" body="Reference material designed to keep product, architecture, and rollout language consistent.">
        <DataState kind="error" title="Unable to load the knowledgebase" message="The knowledgebase index was not returned by the backend." actionLabel="Retry" onAction={() => categoriesQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title="Knowledgebase" body="Structured documentation and reference content that mirrors the platform narrative used across the landing page, portal, and billing flows.">
      <section className="grid gap-5 xl:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.id} className="rounded-[30px] p-6">
            <BookOpen className="size-6 text-cyan-400" />
            <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{category.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{category.summary}</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <Badge>{category.articleCount} articles</Badge>
              <ButtonLink href={`/knowledgebase/${category.id}`} variant="outline" size="sm">
                Open category
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </PublicShell>
  );
}

export function KnowledgebaseCategoryPage({ categoryId }: { categoryId: string }) {
  const previewCategory = previewKnowledgeCategories.find((category) => category.id === categoryId) ?? previewKnowledgeCategories[0];
  const previewArticles = previewKnowledgeArticles.filter((article) => article.categoryId === previewCategory.id);
  const categoryQuery = usePreviewQuery({
    queryKey: ["knowledge-category", categoryId],
    queryFn: () => getKnowledgeCategory(categoryId),
    previewData: { category: previewCategory, articles: previewArticles }
  });

  const payload = categoryQuery.data;

  if (categoryQuery.isLoading) {
    return (
      <PublicShell title="Knowledgebase category" body="Reading category guidance.">
        <DataState kind="loading" title="Loading category" message="Requesting the selected knowledgebase category from the backend." />
      </PublicShell>
    );
  }

  if (categoryQuery.isError || !payload) {
    return (
      <PublicShell title="Knowledgebase category" body="Reading category guidance.">
        <DataState kind="error" title="Unable to load category" message="The selected category was not returned by the backend." actionLabel="Retry" onAction={() => categoryQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title={payload.category.title} body={payload.category.summary}>
      <section className="grid gap-5 xl:grid-cols-2">
        {payload.articles.map((article) => (
          <Card key={article.id} className="rounded-[30px] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Updated {formatDate(article.updatedAt)}</div>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{article.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{article.summary}</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <Badge>{article.views} views</Badge>
              <ButtonLink href={`/knowledgebase/${payload.category.id}/${article.id}`} variant="outline" size="sm">
                Read article
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </PublicShell>
  );
}

export function KnowledgebaseArticlePage({ categoryId, articleId }: { categoryId: string; articleId: string }) {
  const previewCategory = previewKnowledgeCategories.find((category) => category.id === categoryId) ?? previewKnowledgeCategories[0];
  const previewArticle = previewKnowledgeArticles.find((article) => article.id === articleId) ?? previewKnowledgeArticles[0];
  const articleQuery = usePreviewQuery({
    queryKey: ["knowledge-article", categoryId, articleId],
    queryFn: () => getKnowledgeArticle(categoryId, articleId),
    previewData: { category: previewCategory, article: previewArticle }
  });

  const payload = articleQuery.data;

  if (articleQuery.isLoading) {
    return (
      <PublicShell title="Knowledgebase article" body="Reading the selected article.">
        <DataState kind="loading" title="Loading article" message="Requesting the selected knowledge article from the backend." />
      </PublicShell>
    );
  }

  if (articleQuery.isError || !payload) {
    return (
      <PublicShell title="Knowledgebase article" body="Reading the selected article.">
        <DataState kind="error" title="Unable to load article" message="The selected knowledge article was not returned by the backend." actionLabel="Retry" onAction={() => articleQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title={payload.article.title} body={`Updated ${formatDate(payload.article.updatedAt)}`}>
      <Card className="shell-narrow rounded-[32px] p-8">
        <div className="space-y-6">
          {payload.article.body.map((paragraph, index) => (
            <p key={index} className="text-base leading-8 text-muted">{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/knowledgebase/${payload.category.id}`} variant="outline">Back to category</ButtonLink>
          <ButtonLink href="/catalog">View catalog</ButtonLink>
        </div>
      </Card>
    </PublicShell>
  );
}

export function Catalog() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const previewMode = useAuthStore((state) => state.previewMode);
  const productsQuery = usePreviewQuery({
    queryKey: ["products"],
    queryFn: listProducts,
    previewData: previewCatalogProducts
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const add = useMutation({
    mutationFn: (productId: string) => addCartItem({ productId, quantity: 1 }),
    onSuccess: () => {
      setFeedback(previewMode ? "Preview mode keeps cart actions local. Live sessions can submit add-to-cart requests." : "Item added to the cart." );
    },
    onError: (mutationError) => {
      setFeedback(mutationError instanceof Error ? mutationError.message : "Unable to add the product to cart.");
    }
  });

  const products = productsQuery.data ?? [];

  if (productsQuery.isLoading) {
    return (
      <PublicShell title="Catalog" body="Browse the commercial catalog with better product storytelling and clearer pricing posture.">
        <DataState kind="loading" title="Loading product catalog" message="Requesting catalog products from the backend." />
      </PublicShell>
    );
  }

  if (productsQuery.isError) {
    return (
      <PublicShell title="Catalog" body="Browse the commercial catalog with better product storytelling and clearer pricing posture.">
        <DataState kind="error" title="Unable to load the catalog" message="The product catalog was not returned by the backend." actionLabel="Retry" onAction={() => productsQuery.refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell title="Catalog" body="The commercial catalog is now presented as a product collection, not a list of detached order form rows.">
      {feedback ? <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">{feedback}</div> : null}
      <section className="grid gap-5 xl:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="rounded-[30px] p-6">
            <ShoppingBag className="size-6 text-cyan-400" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{product.type}</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{product.name}</h2>
              </div>
              <Badge>{product.highlight}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>
            <div className="mt-6 space-y-3">
              {product.pricing.map((price) => (
                <div key={`${product.id}-${price.label}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 px-4 py-4 text-sm">
                  <span className="text-muted">{price.label}</span>
                  <span className="font-medium text-[var(--foreground)]">{price.amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => {
                  if (!isAuthenticated && !previewMode) {
                    window.location.href = "/login";
                    return;
                  }
                  add.mutate(product.id);
                }}
                disabled={add.isPending}
              >
                {add.isPending ? "Adding..." : "Add to cart"}
              </Button>
              <ButtonLink href="/cart" variant="outline">Open cart</ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </PublicShell>
  );
}
