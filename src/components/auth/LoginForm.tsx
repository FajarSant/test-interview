"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validation/loginschema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { LoginResponse } from "@/lib/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: undefined },
  });

  const roleValue = watch("role");

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { username, password, role } = data;

      const res = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      const { token, role: serverRole } = res.data;

      if (serverRole !== role) {
        setErrorMsg("Role tidak sesuai dengan akun.");
        return;
      }

      // Simpan token sesuai role, hapus token role lain
      if (serverRole === "Admin") {
        localStorage.setItem("token_admin", token);
        localStorage.removeItem("token_user");
        localStorage.setItem("role", serverRole);
        router.push("/dashboard/admin");
      } else if (serverRole === "User") {
        localStorage.setItem("token_user", token);
        localStorage.removeItem("token_admin");
        localStorage.setItem("role", serverRole);
        router.push("/home");
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("role", serverRole);
        router.push("/home");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setErrorMsg(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-md w-full"
      noValidate
    >
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" type="text" {...register("username")} />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label>Role</Label>
        <Select
          value={roleValue}
          onValueChange={(value) => setValue("role", value as "User" | "Admin")}
          defaultValue={undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
        )}
      </div>

      {errorMsg && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {errorMsg}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
