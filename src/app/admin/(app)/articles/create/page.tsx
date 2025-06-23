"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function CreateArticlePage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("<p></p>");

  const methods = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
  });

  const onSubmit = async (data: ArticleFormData, thumbnailFile?: File) => {
    try {
      let imageUrl: string | null = null;

      if (thumbnailFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", thumbnailFile);

        const uploadResponse = await api.post("/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      await api.post("/articles", {
        title: data.title,
        categoryId: data.categoryId,
        content: editorContent,
        imageUrl,
      });

      await Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Artikel berhasil dibuat!",
        confirmButtonText: "OK",
      });

      methods.reset();
      setEditorContent("<p></p>");
      setThumbnailPreview(null);

      window.location.href = "/admin/articles";
    } catch (error) {
      console.error("Gagal mengupload artikel:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengupload artikel",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <MoveLeftIcon className="w-5 h-5" />
          </Button>

          <ArticleForm
            methods={methods}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            onSubmit={onSubmit}
            onPreviewOpen={setPreviewOpen}
            setThumbnailPreview={setThumbnailPreview}
            setInitialImageUrl={() => {}} 
            thumbnailPreview={thumbnailPreview} 
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
