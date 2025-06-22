"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  username: string;
  role: string;
};

type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  user: User;
  category: Category;
};

export default function ArticlePageClient() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Failed to load article data.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchArticle();
  }, [id]);

  useEffect(() => {
    async function fetchRelatedArticles() {
      if (article?.category.id) {
        try {
          const res = await api.get(
            `/articles?categoryId=${article.category.id}`
          );

          if (Array.isArray(res.data.data)) {
            const filteredArticles = res.data.data.filter(
              (item: Article) => item.id !== article.id
            );
            setRelatedArticles(filteredArticles.slice(0, 3));
          } else {
            console.error("Data is not an array:", res.data);
            setError("Failed to load related articles.");
          }
        } catch (err) {
          console.error("Failed to load related articles:", err);
          setError("Failed to load related articles.");
        }
      }
    }

    if (article) {
      fetchRelatedArticles();
    }
  }, [article]);

  if (loading) {
    return (
      <article className="max-w-3xl mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </article>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!article) {
    return (
      <p className="text-center text-gray-500 mt-10">Article not found.</p>
    );
  }

  const ArticleCard = ({ article }: { article: Article }) => {
    const imageSrc = article.imageUrl || "/images/gambar.jpg";

    return (
      <Card
        className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
        onClick={() => (window.location.href = `/articles/${article.id}`)}
      >
        <div className="relative w-full h-48">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={article.title || "Article image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">
            {new Date(article.createdAt).toLocaleDateString("id-ID")}
          </p>
          <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {article.content.substring(0, 120)}...
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.category.name && (
              <Badge variant="secondary">{article.category.name}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main>
      <article className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-sm text-center text-muted-foreground mb-4">
          <span className="font-medium text-gray-800">
            {article.user.username}
          </span>{" "}
          | <span className="text-gray-600">{article.category.name}</span> |{" "}
          <span className="italic text-gray-500">
            {new Date(article.createdAt)
              .toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
              .replace(",", " •")}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 leading-tight text-gray-900">
          {article.title}
        </h1>

        {article.imageUrl && (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden shadow-md">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              unoptimized
            />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-sm md:prose-base prose-img:rounded-lg prose-img:shadow"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8 mt-12">
          <h2 className="text-2xl font-semibold mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
