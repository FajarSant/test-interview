"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

interface ThumbnailUploadProps {
  register: any;
  error?: string;
  onPreview?: (value: string | null) => void;
}

export function ThumbnailUpload({
  register,
  error,
  onPreview,
}: ThumbnailUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        if (onPreview) onPreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      if (onPreview) onPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Thumbnail</Label>

      <label
        htmlFor="thumbnail"
        className={cn(
          "flex h-36 w-60 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-center text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition",
          previewUrl && "border-none"
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-6 h-6 mb-2" />
            <p className="text-sm">Click to select files</p>
            <p className="text-xs text-muted-foreground">
              Support File Type: jpg or png
            </p>
          </div>
        )}

        <input
          id="thumbnail"
          type="file"
          accept="image/png, image/jpeg"
          {...register("thumbnail")}
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
