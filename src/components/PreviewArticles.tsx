"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thumbnailPreview: string | null;
  title: string;
  category: string;
  content: string;
}

export default function PreviewArticles({
  open,
  onOpenChange,
  thumbnailPreview,
  title,
  category,
  content,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg w-full max-h-[80vh] overflow-auto p-6 rounded-md
                   bg-white dark:bg-gray-800 shadow-lg
                   sm:max-w-md sm:max-h-[70vh]"
        style={{ outline: "none" }}
      >
        <DialogTitle className="text-lg font-semibold mb-4">Preview Artikel</DialogTitle>

        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="preview thumbnail"
            className="w-full rounded mb-4"
          />
        )}

        <p className="mt-2 font-semibold">{title}</p>
        <p className="text-sm italic">Kategori: {category}</p>

        <p className="mt-4 whitespace-pre-line">{content}</p>
      </DialogContent>
    </Dialog>
  );
}
