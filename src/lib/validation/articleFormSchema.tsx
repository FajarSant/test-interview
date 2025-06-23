import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  thumbnail: z
    .any()
    .refine(
      (files) => files?.length === 1,
      "Thumbnail harus diupload dan hanya 1 file"
    ),
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
