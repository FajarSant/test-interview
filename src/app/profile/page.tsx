"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface User {
  username: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data);
      } catch (err) {
        setError("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white text-center space-y-6 py-12">
          <h2 className="text-lg font-semibold">User Profile</h2>

          <div className="flex justify-center">
            <Avatar className="w-16 h-16 bg-blue-100 text-blue-600">
              <AvatarFallback className="text-xl">
                {user?.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-3">
            <Card>
              <CardContent className="flex justify-between items-center py-4 px-6">
                <span className="font-semibold">Username :</span>
                <span>{user?.username}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex justify-between items-center py-4 px-6">
                <span className="font-semibold">Role :</span>
                <span>{user?.role}</span>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Back to home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
