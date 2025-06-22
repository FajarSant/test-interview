"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation/registerschema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
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

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: undefined },
  });

  const roleValue = watch("role");

 const onSubmit = async (data: RegisterInput) => {
  try {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { confirmPassword, ...payload } = data; 

    await api.post("/auth/register", payload);
    router.push("/");
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    setErrorMsg(err.response?.data?.message || "Registrasi gagal");
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
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <Label>Role</Label>
        <Select
          value={roleValue}
          onValueChange={(value) => setValue("role", value as "User" | "Admin")}
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

      {successMsg && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          {successMsg}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Mendaftarkan..." : "Daftar"}
      </Button>
    </form>
  );
}
