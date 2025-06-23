import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username harus memiliki minimal 3 karakter.")
    .max(20, "Username tidak boleh lebih dari 20 karakter."),
  password: z
    .string()
    .min(6, "Password harus memiliki minimal 6 karakter.")
    .max(20, "Password tidak boleh lebih dari 20 karakter."),
  role: z.enum(["User", "Admin"], {
    errorMap: () => {
      return { message: "Pilih role yang valid" };
    },
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
