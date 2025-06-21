"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import HeaderSection from "@/components/HeaderSection";
import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

interface ArticleApi {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  category: {
    name: string;
  };
}

interface ArticleCardProps {
  date: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

function stripHtml(html: string) {
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 3;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await api.get<{
          data: ArticleApi[];
          total: number;
        }>("/articles", { params: { page, limit } });

        const fetched = res.data.data;
        setTotal(res.data.total);

        const mapped = fetched.map((a) => ({
          date: new Date(a.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          title: a.title,
          description: stripHtml(a.content).slice(0, 120) + "...",
          tags: [a.category.name],
          image: a.imageUrl,
        }));

        setArticles(mapped);
      } catch (e) {
        console.error("Failed to fetch articles", e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [page]);

  const pageCount = Math.ceil(total / limit);

  function handlePageClick(
    e: MouseEvent<HTMLAnchorElement>,
    targetPage: number
  ) {
    e.preventDefault();
    if (targetPage !== page) {
      setPage(targetPage);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <HeaderSection />

      <section className="px-4 md:px-12 py-8">
        <p className="mb-4 text-gray-600">
          Showing: {loading ? "..." : articles.length} of {total} articles
        </p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-md border p-4 shadow">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-6 w-1/4 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((art, i) => (
              <ArticleCard key={i} article={art} />
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {page === 1 ? (
                    <span
                      className="opacity-50 cursor-not-allowed select-none px-3 py-1"
                      aria-disabled="true"
                    >
                      Previous
                    </span>
                  ) : (
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => handlePageClick(e, page - 1)}
                    />
                  )}
                </PaginationItem>

                {Array.from({ length: pageCount }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === page}
                        onClick={(e) => handlePageClick(e, pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  {page === pageCount ? (
                    <span
                      className="opacity-50 cursor-not-allowed select-none px-3 py-1"
                      aria-disabled="true"
                    >
                      Next
                    </span>
                  ) : (
                    <PaginationNext
                      href="#"
                      onClick={(e) => handlePageClick(e, page + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}
