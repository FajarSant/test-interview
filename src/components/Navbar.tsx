"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token_user");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image src="/icon/Vector.png" alt="Logo" width={24} height={24} />
        <span className="font-semibold text-sm text-blue-700">Logoipsum</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/avatar.jpg" alt="@james" />
              <AvatarFallback className="text-xs">J</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              James Dean
            </span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40 mt-2">
          <DropdownMenuItem className="gap-2">
            <User className="w-4 h-4" />
            Akun Saya
          </DropdownMenuItem>

          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="gap-2 text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin logout dari akun ini?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleLogout();
                    setOpenDialog(false);
                  }}
                >
                  Ya, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
