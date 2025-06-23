import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  content: z.string().min(1, "Konten tidak boleh kosong"),
  thumbnail: z.string().url("Thumbnail harus berupa URL").optional(),
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
