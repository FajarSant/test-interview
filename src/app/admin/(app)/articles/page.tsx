"use client";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image dari Next.js
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

// Tipe Article dan Category yang didefinisikan secara lokal
type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  category: Category | string; // Category bisa objek atau string
  createdAt: string;
  imageUrl: string | null; // Gambar bisa null
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get<{ data: Article[] }>("/articles");
        const formattedArticles = response.data.data.map((article) => ({
          id: article.id,
          title: article.title,
          category: article.category,
          createdAt: new Date(article.createdAt).toLocaleString(),
          imageUrl: article.imageUrl || "/images/placeholder.jpg", // Placeholder jika imageUrl null
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching articles", error);
      }
    };
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

          <Table className="min-w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 text-left bg-gray-100">
                  Thumbnail
                </TableHead>
                <TableHead className="px-4 py-2 text-left bg-gray-100">
                  Title
                </TableHead>
                <TableHead className="px-4 py-2 text-left bg-gray-100">
                  Category
                </TableHead>
                <TableHead className="px-4 py-2 text-left bg-gray-100">
                  Created At
                </TableHead>
                <TableHead className="px-4 py-2 text-left bg-gray-100">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles
                .filter((article) =>
                  article.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((article) => (
                  <TableRow key={article.id} className="border-t">
                    <TableCell className="px-4 py-2">
                      <Image
                        src={article.imageUrl || "/images/placeholder.jpg"}
                        alt="Thumbnail"
                        width={100} // Lebar gambar
                        height={60} // Tinggi gambar
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2">{article.title}</TableCell>
                    <TableCell className="px-4 py-2">
                      {typeof article.category === "object" &&
                      article.category !== null
                        ? article.category.name
                        : article.category}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {article.createdAt}
                    </TableCell>
                    <TableCell className="px-4 py-2 space-x-2">
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
        </CardContent>
      </Card>
    </main>
  );
}
