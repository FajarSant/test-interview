"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { MoveLeftIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import {
  ArticleFormData,
  articleFormSchema,
} from "@/lib/validation/articleFormSchema";
import ArticleForm from "@/components/ArticlesFrom"; 
import PreviewArticles from "@/components/PreviewArticles";

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("<p></p>");
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);

  const methods = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await api.get("/categories");
        const categories = categoriesRes.data?.data || [];

        const articleRes = await api.get(`/articles/${id}`);
        const article = articleRes.data?.data || articleRes.data;

        if (!article || typeof article !== "object") {
          throw new Error("Artikel tidak ditemukan");
        }

        const validCategoryId =
          categories.find(
            (cat: any) =>
              cat.id === (article.category?.id || article.categoryId)
          )?.id || "";

        methods.reset({
          title: article.title,
          categoryId: validCategoryId,
          content: article.content,
        });
        setEditorContent(article.content);

        setEditorContent(article.content);
        setThumbnailPreview(article.imageUrl);
        setInitialImageUrl(article.imageUrl);
      } catch (error) {
        console.error("Failed to fetch article or categories:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Artikel tidak ditemukan",
        });
        router.push("/admin/articles");
      }
    };

    if (id) fetchData();
  }, [id, methods, router]);

  const onSubmit = async (data: ArticleFormData, thumbnailFile?: File) => {
    try {
      let imageUrl = initialImageUrl;

      if (!thumbnailPreview) {
        imageUrl = null;
      }

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);

        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      await api.put(`/articles/${id}`, {
        title: data.title,
        categoryId: data.categoryId,
        content: editorContent,
        imageUrl,
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Artikel berhasil diperbarui",
        confirmButtonText: "OK",
      });

      router.push("/admin/articles");
    } catch (error) {
      console.error("Gagal update artikel:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat memperbarui artikel",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Button variant="outline" onClick={() => router.back()}>
            <MoveLeftIcon className="w-5 h-5" />
          </Button>

          <ArticleForm
            methods={methods}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            onSubmit={onSubmit}
            onPreviewOpen={setPreviewOpen}
            setThumbnailPreview={setThumbnailPreview}
            thumbnailPreview={thumbnailPreview}
            setInitialImageUrl={setInitialImageUrl}
          />

          <PreviewArticles
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            thumbnailPreview={thumbnailPreview}
            title={methods.watch("title")}
            category={methods.watch("categoryId")}
            content={editorContent}
          />
        </CardContent>
      </Card>
    </div>
  );
}
