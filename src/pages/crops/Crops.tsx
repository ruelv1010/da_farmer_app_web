// Farm.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CropTable from "./CropTable";


// Create a client
const queryClient = new QueryClient();

export default function Crops() {
  return (
    <QueryClientProvider client={queryClient}>
      <CropTable />
    </QueryClientProvider>
  );
}
