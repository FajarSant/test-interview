"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios";

// Fungsi untuk menghapus HTML dari konten
const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Definisi tipe data lokal
interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleApi {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: {
    id: string;
    username: string;
  };
}

interface Article {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export default function AdminArticlesPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]); // Gunakan tipe yang tepat
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await api.get<{ data: ArticleApi[] }>("/articles", {
          params: { page: 1, limit: 1000 },
        });

        const fetched = res.data.data;

        // Mapping data sesuai dengan yang diinginkan
        const mapped = fetched.map((a) => ({
          id: a.id,
          date: new Date(a.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          title: a.title,
          description: stripHtml(a.content).slice(0, 120) + "...", // Ambil 120 karakter pertama dari konten
          tags: [a.category.name], // Daftar kategori
          image: a.imageUrl,
        }));

        setAllArticles(mapped); // Set data yang sudah dimapping
      } catch (e) {
        console.error("Failed to fetch articles", e);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <main className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Category</TabsTrigger>
                </TabsList>
              </Tabs>
              <Input
                placeholder="Search by title"
                className="max-w-xs w-full sm:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Add Article</Button>
          </div>

          <Table>
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
              {allArticles
                .filter((article) =>
                  article.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <img
                        src={article.image}
                        alt="Thumbnail"
                        className="w-12 h-12 rounded"
                      />
                    </TableCell>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>{article.tags.join(", ")}</TableCell>
                    <TableCell>{article.date}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="link" size="sm">
                        Preview
                      </Button>
                      <Button variant="link" size="sm">
                        Edit
                      </Button>
                      <Button variant="link" size="sm" className="text-red-500">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
