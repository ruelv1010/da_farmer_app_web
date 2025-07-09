"use client";

import type { ReactElement } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  module?: string;
  children: ReactElement<any>;
}

export default function MainLayout({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar  />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 ">
            {children}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
