"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoveLeftIcon } from "lucide-react";
import api from "@/lib/axios";
import {
  ArticleFormData,
  articleFormSchema,
} from "@/lib/validation/articleFormSchema";
import { ThumbnailUpload } from "@/components/ThumbnailUpload";
import RichTextEditor from "@/components/RicthTextEditor";
import { Descendant, Node } from "slate";

export default function CreateArticlePage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Slate editor content state
  const [editorValue, setEditorValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
  });

  const thumbnailFile = watch("thumbnail");

  const serialize = (value: Descendant[]) => {
    return value.map((n) => Node.string(n)).join("\n");
  };

  const onSubmit = async (data: ArticleFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("content", serialize(editorValue));
    if (data.thumbnail && data.thumbnail.length > 0) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    try {
      await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Artikel berhasil dibuat!");
      reset();
      setThumbnailPreview(null);
      setEditorValue([
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]);
    } catch (error) {
      console.error("Gagal mengupload artikel", error);
      alert("Gagal mengupload artikel");
    }
  };

  const handlePreview = () => {
    const file = thumbnailFile?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    setPreviewOpen(true);
  };

  const handleCancel = () => {
    reset();
    setThumbnailPreview(null);
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <MoveLeftIcon className="w-5 h-5" />
          </Button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ThumbnailUpload
              register={register}
              error={
                typeof errors.thumbnail?.message === "string"
                  ? errors.thumbnail.message
                  : undefined
              }
              onPreview={setThumbnailPreview}
            />

            <div>
              <Label>Judul</Label>
              <Input placeholder="Masukkan judul" {...register("title")} />
              {errors.title?.message && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label>Kategori</Label>
              <Select
                onValueChange={(val) => setValue("category", val)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Teknologi</SelectItem>
                  <SelectItem value="health">Kesehatan</SelectItem>
                  <SelectItem value="education">Pendidikan</SelectItem>
                </SelectContent>
              </Select>
              {errors.category?.message && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Konten</Label>
              <RichTextEditor value={editorValue} onChange={setEditorValue} />
              {errors.content?.message && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Batal
              </Button>

              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-semibold">Preview Artikel</h2>
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="preview thumbnail"
                      className="w-full rounded"
                    />
                  )}
                  <p className="mt-2 font-semibold">{watch("title")}</p>
                  <p className="text-sm italic">
                    Kategori: {watch("category")}
                  </p>
                  <p className="mt-2 whitespace-pre-line">
                    {serialize(editorValue)}
                  </p>
                </DialogContent>
              </Dialog>

              <Button type="submit">Upload</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
