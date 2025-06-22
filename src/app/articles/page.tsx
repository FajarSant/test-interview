"use client";

import React, { useEffect, useState, MouseEvent, useCallback } from "react";
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
  id: string;
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
  const [allArticles, setAllArticles] = useState<ArticleCardProps[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleCardProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const limit = 9;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await api.get<{ data: ArticleApi[] }>("/articles", {
          params: { page: 1, limit: 1000 },
        });

        const fetched = res.data.data;

        const mapped = fetched.map((a) => ({
          id: a.id,
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

        setAllArticles(mapped);
      } catch (e) {
        console.error("Failed to fetch articles", e);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  useEffect(() => {
    if (allArticles.length > 0) {
      const uniqueCategories = Array.from(
        new Set(allArticles.flatMap((art) => art.tags))
      );
      setCategories(uniqueCategories);
    }
  }, [allArticles]);

  useEffect(() => {
    let filtered = allArticles;

    if (categoryFilter) {
      filtered = filtered.filter((art) =>
        art.tags.some(
          (tag) => tag.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }

    if (searchFilter) {
      filtered = filtered.filter((art) =>
        art.title.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
    setPage(1);
  }, [allArticles, categoryFilter, searchFilter]);

  const pageCount = Math.ceil(filteredArticles.length / limit);
  const pagedArticles = filteredArticles.slice(
    (page - 1) * limit,
    page * limit
  );

  function handlePageClick(
    e: MouseEvent<HTMLAnchorElement>,
    targetPage: number
  ) {
    e.preventDefault();
    if (targetPage !== page) {
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const onCategoryChange = useCallback((cat: string) => {
    setCategoryFilter(cat);
  }, []);

  const onSearchChange = useCallback((search: string) => {
    setSearchFilter(search);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      <HeaderSection
        categories={categories}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
      />

      <section className="px-4 md:px-12 py-8">
        <p className="mb-4 text-gray-600">
          Showing: {loading ? "..." : filteredArticles.length} articles
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-md border p-4 shadow animate-pulse"
              >
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-6 w-1/4 rounded-full" />
              </div>
            ))}
          </div>
        ) : pagedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pagedArticles.map((art, i) => (
              <ArticleCard key={i} article={art} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-12">No articles found.</p>
        )}

        {pageCount > 1 && filteredArticles.length > limit && (
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

                {(() => {
                  const maxVisiblePages = 5;
                  let startPage = Math.max(
                    1,
                    page - Math.floor(maxVisiblePages / 2)
                  );
                  let endPage = startPage + maxVisiblePages - 1;

                  if (endPage > pageCount) {
                    endPage = pageCount;
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const visiblePages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    visiblePages.push(i);
                  }

                  return visiblePages.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === page}
                        onClick={(e) => handlePageClick(e, pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ));
                })()}

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
