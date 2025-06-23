"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import api from "@/lib/axios";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import PreviewArticles from "@/components/PreviewArticles";

type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  category: Category | string;
  createdAt: string;
  imageUrl: string | null;
  content: string;
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get<{ data: Article[] }>("/articles");
        const formattedArticles = response.data.data.map((article) => ({
          id: article.id,
          title: article.title,
          category: article.category,
          createdAt: new Date(article.createdAt).toLocaleString(),
          imageUrl: article.imageUrl || "/images/placeholder.jpg",
          content: article.content, 
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching articles", error);
      }
    };
    fetchArticles();
  }, []);

  const categoryList = [
    "all",
    ...Array.from(
      new Set(
        articles.map((a) =>
          typeof a.category === "object" ? a.category.name : a.category
        )
      )
    ),
  ];

  const getPaginationNumbers = () => {
    const maxPage = totalPages;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);

    let start = Math.max(currentPage - halfWindow, 1);
    let end = start + pageWindow - 1;

    if (end > maxPage) {
      end = maxPage;
      start = Math.max(end - pageWindow + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const filteredArticles = articles.filter((article) => {
    const titleMatch = article.title
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    const categoryName =
      typeof article.category === "object"
        ? article.category.name
        : article.category;
    const categoryMatch =
      selectedCategory === "all" || categoryName === selectedCategory;
    return titleMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (dir: "prev" | "next") => {
    setCurrentPage((prev) =>
      dir === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const handlePreview = (article: Article) => {
    setSelectedArticle(article);
    setPreviewOpen(true);
  };

  return (
    <main className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Showing {filteredArticles.length} articles
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select category">
                    {selectedCategory === "all"
                      ? "Category: All"
                      : `Category: ${
                          selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1)
                        }`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by title"
                className="w-full sm:w-auto max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link
              href="/admin/articles/create"
              className="inline-block w-full sm:w-auto"
            >
              <Button variant="blue" className="w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Article
              </Button>
            </Link>
          </div>

          <Table className="min-w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Image
                      src={article.imageUrl || "/images/gambar.jpg"}
                      alt="Thumbnail"
                      width={100}
                      height={60}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    {typeof article.category === "object"
                      ? article.category.name
                      : article.category}
                  </TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handlePreview(article)}
                    >
                      Preview
                    </Button>
                    <Button asChild variant="link" size="sm">
                      <Link href={`/admin/articles/edit/${article.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="link" size="sm" className="text-red-500">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredArticles.length > itemsPerPage && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange("prev")}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPaginationNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded transition ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange("next")}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {selectedArticle && (
        <PreviewArticles
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          thumbnailPreview={
            selectedArticle.imageUrl || "/images/placeholder.jpg"
          }
          title={selectedArticle.title}
          category={
            typeof selectedArticle.category === "object"
              ? selectedArticle.category.name
              : selectedArticle.category
          }
          content={selectedArticle.content}
        />
      )}
    </main>
  );
}
