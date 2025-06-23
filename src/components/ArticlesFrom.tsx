"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/lib/validation/articleFormSchema";
import api from "@/lib/axios";

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
import { ThumbnailUpload } from "@/components/ThumbnailUpload";
import RichTextEditor from "@/components/richtexteditor";

interface Props {
  methods: UseFormReturn<ArticleFormData>;
  editorContent: string;
  setEditorContent: (val: string) => void;
  onSubmit: (data: ArticleFormData, thumbnailFile?: File) => Promise<void>;
  onPreviewOpen: (open: boolean) => void;
  setThumbnailPreview: (val: string | null) => void;
  setInitialImageUrl: (val: string | null) => void;
  thumbnailPreview: string | null;
}

export default function ArticleForm({
  methods,
  editorContent,
  setEditorContent,
  onSubmit,
  onPreviewOpen,
  setThumbnailPreview,
  setInitialImageUrl,
  thumbnailPreview,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const categoryId = watch("categoryId") || "";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    }
    fetchCategories();
  }, []);

useEffect(() => {
  setValue("content", editorContent, { shouldValidate: true });
}, [editorContent, setValue]);


  const handleFileUpload = (file: File | null) => {
    setThumbnailFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setInitialImageUrl(null);
    }
  };

  const handlePreviewChange = (url: string | null) => {
    setThumbnailPreview(url);
  };

  const isEditorEmpty = (html: string) => {
   const text = html.replace(/<[^>]*>/g, "").replace(/\s/g, "");
  return text.length === 0;
  };

  const handleFormSubmit = async (data: ArticleFormData) => {
    if (!thumbnailPreview && !thumbnailFile) {
      alert("Thumbnail harus diunggah atau dipertahankan.");
      return;
    }

    if (isEditorEmpty(editorContent)) {
      alert("Konten artikel tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(data, thumbnailFile ?? undefined);
    } catch (error) {
      alert("Gagal mengupload thumbnail atau artikel.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setThumbnailFile(null);
    setEditorContent("<p></p>");
    setThumbnailPreview(null);
    setInitialImageUrl(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Thumbnail Upload dan Preview */}
      <div className="mb-4">
        <ThumbnailUpload
          register={register}
          error={errors.thumbnail?.message}
          onFileUpload={handleFileUpload}
          onPreview={handlePreviewChange}
          initialImageUrl={thumbnailPreview}
        />
      </div>

      {/* Judul */}
      <div>
        <Label htmlFor="title">Judul</Label>
        <Input id="title" placeholder="Masukkan judul" {...register("title")} />
        {errors.title?.message && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <Label htmlFor="categoryId">Kategori</Label>
        <Select
          value={categoryId}
          onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
        >
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 && (
              <SelectItem value="_loading" disabled>
                Loading...
              </SelectItem>
            )}
            {categories
              .filter((cat) => !!cat.id?.trim())
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.categoryId?.message && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Konten */}
      <div>
        <Label>Konten</Label>
        <RichTextEditor content={editorContent} onChange={setEditorContent} />
        {errors.content?.message && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Tombol aksi */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
          Batal
        </Button>
        <Button type="button" variant="secondary" onClick={() => onPreviewOpen(true)} disabled={loading}>
          Preview
        </Button>
        <Button variant="blue" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
