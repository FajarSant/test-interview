"use client"
import { Newspaper, Tag, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SidebarAdmin() {
  const handleLogout = () => {
    localStorage.removeItem("token_admin");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const items = [
    {
      title: "Articles",
      url: "/admin/articles",
      icon: Newspaper,
    },
    {
      title: "Category",
      url: "/admin/categories",
      icon: Tag,
    },
  ];

  return (
    <Sidebar className="bg-blue-700 text-white w-64">
      <SidebarContent>
        <div className="flex items-center p-4">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src="/icon/Vector.png" alt="Logo" width={24} height={24} />
              <span className="font-semibold text-sm text-white">
                Logoipsum
              </span>
            </div>
          </Link>
        </div>

        <p className="border-b-2 mx-4"></p>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="text-white hover:bg-blue-400 active:bg-blue-400 hover:text-white active:text-white"
                    asChild
                  >
                    <Link href={item.url}>
                      <span className="flex items-center space-x-2 p-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout with AlertDialog */}
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton className="text-white hover:bg-blue-400 active:bg-blue-400 hover:text-white active:text-white">
                      <span className="flex items-center space-x-2 p-3">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </span>
                    </SidebarMenuButton>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Apakah Anda yakin ingin keluar?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Keluar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
