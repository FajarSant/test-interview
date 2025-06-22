"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderSectionProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export default function HeaderSection({
  categories,
  onCategoryChange,
  onSearchChange,
}: HeaderSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearchChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onCategoryChange(selectedCategory === "all" ? "" : selectedCategory);
    }, 500);

    return () => clearTimeout(handler);
  }, [selectedCategory, onCategoryChange]);

  return (
    <section className="bg-blue-600 text-white py-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h4 className="text-sm uppercase">Blog genzet</h4>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          The Journal : Design Resources, <br className="hidden md:inline" />
          Interviews, and Industry News
        </h1>
        <p className="mt-4 text-lg">Your daily dose of design insights!</p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full md:w-48 bg-white text-black">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search articles"
            className="w-full md:w-96 bg-white text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
