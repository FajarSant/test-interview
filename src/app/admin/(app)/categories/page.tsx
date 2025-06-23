"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import api from "@/lib/axios";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";

type Category = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState<string>("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ data: Category[] }>("/categories");
      const formattedCategories = response.data.data.map((category) => ({
        id: category.id,
        userId: category.userId,
        name: category.name,
        createdAt: new Date(category.createdAt).toLocaleString(),
        updatedAt: new Date(category.updatedAt).toLocaleString(),
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const nameMatch = category.name
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    return nameMatch;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (dir: "prev" | "next") => {
    setCurrentPage((prev) =>
      dir === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
  };

  const handleSaveEdit = async () => {
    if (!categoryName) {
      setErrorMessage("Nama kategori harus diisi.");
      return;
    }
    setErrorMessage("");

    if (!selectedCategory) return;

    try {
      await api.put(`/categories/${selectedCategory.id}`, {
        name: categoryName,
      });
      await fetchCategories();
      setSelectedCategory(null);
      setCategoryName("");
      Swal.fire("Diperbarui!", "Kategori telah diperbarui.", "success");
    } catch (error) {
      console.error("Gagal memperbarui kategori", error);
      Swal.fire("Gagal!", "Gagal memperbarui kategori.", "error");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      await fetchCategories();
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      Swal.fire("Dihapus!", "Kategori telah dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus kategori", error);
      Swal.fire("Gagal!", "Gagal menghapus kategori.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      setErrorMessage("Nama kategori harus diisi.");
      return;
    }
    setErrorMessage("");

    try {
      await api.post("/categories", { name: newCategoryName });
      await fetchCategories();
      setAddCategoryOpen(false);
      setNewCategoryName("");
      Swal.fire("Ditambahkan!", "Kategori telah ditambahkan.", "success");
    } catch (error) {
      console.error("Gagal menambahkan kategori", error);
      Swal.fire("Gagal!", "Gagal menambahkan kategori.", "error");
    }
  };

  return (
    <main className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Menampilkan {filteredCategories.length} kategori
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Input
                placeholder="Cari berdasarkan nama kategori"
                className="w-full sm:w-auto max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="blue"
              className="w-full sm:w-auto"
              onClick={() => setAddCategoryOpen(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Tambah Kategori
            </Button>
          </div>

          <Table className="min-w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead>Diubah Pada</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>{category.updatedAt}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteClick(category)}
                      disabled={isDeleting}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCategories.length > itemsPerPage && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange("prev")}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <button
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 text-sm rounded transition ${
                          currentPage === i + 1
                            ? "bg-primary text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        {i + 1}
                      </button>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange("next")}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl mb-4">Edit Kategori</h2>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nama kategori"
              className="mb-2"
            />
            {errorMessage && (
              <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
            )}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                Batal
              </Button>
              <Button
                variant="blue"
                onClick={handleSaveEdit}
                disabled={!categoryName}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {addCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl mb-4">Tambah Kategori Baru</h2>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nama kategori baru"
              className="mb-2"
            />
            {errorMessage && (
              <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
            )}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setAddCategoryOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="blue"
                onClick={handleAddCategory}
                disabled={!newCategoryName}
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl mb-4">
              Apakah Anda yakin ingin menghapus kategori ini?
            </h2>
            <div className="flex justify-between">
              <Button variant="outline" onClick={cancelDelete}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
