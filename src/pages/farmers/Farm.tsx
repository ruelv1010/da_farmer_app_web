// Farm.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FarmerTable } from "./FarmerTable"

// Create a client
const queryClient = new QueryClient();

export default function Farm() {
  return (
    <QueryClientProvider client={queryClient}>
      <FarmerTable />
    </QueryClientProvider>
  );
}
