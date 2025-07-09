// src/pages/dashboard.tsx
import MainLayout from "@/components/layout/MainLayout";

import { Card, CardContent } from "@/components/ui/card";

import { CreditCard } from "lucide-react";


export default function DashboardPage() {

  return (
    <MainLayout>
      <>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
      
            </div>
          </div>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Farmers"
              value="12,234"
              change=""
            />
            <MetricCard
              title="Crop Report"
              value="32"
              change=""
            />
            <MetricCard
              title="Total Rice Per Sock"
              value="20"
              change=""
            />
            
          </div>
        </div>
        {/* Chart Section */}
      
        {/* Receivables Table */}
    

        {/* <ReceivablesTable /> */}
      </>
    </MainLayout>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  change?: string;
};

function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <Card className="p-6 border-[var(--border)]">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-500">{title}</p>
      
          </div>
          <div className="text-left">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

