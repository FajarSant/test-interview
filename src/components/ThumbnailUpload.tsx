"use client";

import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "@/lib/validation/articleFormSchema";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

interface ThumbnailUploadProps {
  register: UseFormRegister<ArticleFormData>;
  error?: string;
  onPreview?: (value: string | null) => void;
  onFileUpload: (file: File) => void;
}

export function ThumbnailUpload({
  register,
  error,
  onPreview,
  onFileUpload,
}: ThumbnailUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      onPreview?.(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan (jpg atau png).");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onPreview?.(result);
    };
    reader.readAsDataURL(file);

    onFileUpload(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="thumbnail">Thumbnail</Label>
      <label
        htmlFor="thumbnail"
        className={cn(
          "flex h-36 w-60 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-center text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition",
          previewUrl && "border-none"
        )}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
            width={240}
            height={144}
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-6 h-6 mb-2" />
            <p className="text-sm">Klik untuk memilih file</p>
            <p className="text-xs text-muted-foreground">
              Jenis File yang Didukung: jpg atau png
            </p>
          </div>
        )}

        <input
          id="thumbnail"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
