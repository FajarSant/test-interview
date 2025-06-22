import { SidebarAdmin } from "@/components/SidebarAdmin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarAdmin />
     <main className="flex-1 w-screen p-4 overflow-hide transition-all duration-300 ease-in-out overflow-hidden">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
