"use client";

import type { ReactElement } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface Props {
  module?: string;
  children: ReactElement<any>;
}

export default function MainLayout({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <Header />

        {/* Mobile Toggle Button */}
        <div className="md:hidden px-4 py-2 bg-white shadow-md">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            Menu
          </Button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar for desktop */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Sidebar for mobile (overlay style) */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50">
              <div className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg z-50">
                <Sidebar />
              </div>
              <div
                className="absolute inset-0"
                onClick={() => setSidebarOpen(false)}
              ></div>
            </div>
          )}

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
