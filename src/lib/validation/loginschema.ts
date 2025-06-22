import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, { message: "Username wajib diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.enum(["User", "Admin"], {
    required_error: "Role wajib dipilih",
    invalid_type_error: "Role tidak valid",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
