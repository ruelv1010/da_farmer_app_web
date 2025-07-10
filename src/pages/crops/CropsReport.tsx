// Farm.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CropReportTable from "./CropReportsTable";


// Create a client
const queryClient = new QueryClient();

export default function Crops() {
  return (
    <QueryClientProvider client={queryClient}>
      <CropReportTable />
    </QueryClientProvider>
  );
}
