"use client"

import { useCallback, useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { format } from "date-fns"
import { Eye } from "lucide-react"

import { DataTableV2 } from "@/components/data-table/data-table-v2"
import type { ColumnDefinition, SearchDefinition } from "@/components/data-table/data-table-v2"
import type { CropDamageReport } from "./Services/FarmerTypes"
import FarmerReportService from "./Services/FarmerReportService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs components
import { CropHealthAnalyzer } from "../farmstatus/CropStatus" // Import the new analyzer component

interface CropDamageReportTableProps {
  farmerId?: number // Optional: filter reports by farmer ID
  farmerName?: string // Optional: for display in title
  onViewReport?: (report: CropDamageReport) => void // Callback for viewing a single report
}

export function CropDamageReportTable({ farmerId, farmerName, onViewReport }: CropDamageReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<CropDamageReport | null>(null)

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1)
  }, [])

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1)
  }, [])

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  const {
    isPending,
    error,
    isFetching,
    data: reportsData,
  } = useQuery({
    queryKey: ["crop-damage-reports", farmerId, currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () =>
      FarmerReportService.getAllCropDamageReports(
        farmerId,
        currentPage,
        rowsPerPage,
        searchQuery,
        columnSort,
        sortQuery,
      ),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  if (error) return "An error has occurred: " + error.message

  const columns: ColumnDefinition<CropDamageReport>[] = [
    {
      id: "reportDate",
      header: "Report Date",
      accessorKey: "reportDate",
      enableSorting: true,
      cell: (row) => format(new Date(row.reportDate), "PPP"),
    },
    {
      id: "cropType",
      header: "Crop Type",
      accessorKey: "cropType",
      enableSorting: true,
    },
    {
      id: "damageType",
      header: "Damage Type",
      accessorKey: "damageType",
      enableSorting: true,
    },
    {
      id: "affectedArea",
      header: "Affected Area",
      accessorKey: "affectedArea",
      enableSorting: true,
      cell: (row) => `${row.affectedArea} ${row.affectedAreaUnit}`,
    },
    {
      id: "estimatedYieldLoss",
      header: "Est. Yield Loss",
      accessorKey: "estimatedYieldLoss",
      enableSorting: true,
      cell: (row) => `${row.estimatedYieldLoss} kg`, // Assuming kg, adjust as needed
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: (row) => <div className="max-w-[200px] truncate">{row.description}</div>,
    },
  ]

  const search: SearchDefinition = {
    title: "Search Reports",
    placeholder: "Search crop type, damage type, description...",
    enableSearch: true,
  }

  const handleViewReportDetails = (report: CropDamageReport) => {
    setSelectedReport(report)
    setViewReportDialogOpen(true)
    onViewReport?.(report) // Call external handler if provided
  }

  return (
    <>
      <Tabs defaultValue="reports" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Damage Reports</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Crop Health</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="flex-grow overflow-auto p-4">
          <DataTableV2
            totalCount={reportsData?.data.pagination.total_items ?? 0}
            perPage={reportsData?.data.pagination.per_page ?? 10}
            pageNumber={reportsData?.data.pagination.current_page ?? 1}
            onPaginationChange={onPaginationChange}
            onRowCountChange={onRowCountChange}
            title={farmerName ? `${farmerName}'s Crop Damage Reports` : "Crop Damage Reports"}
            data={reportsData?.data.reports ?? []}
            columns={columns}
            onLoading={isPending || isFetching}
            idField="id"
            search={search}
            enableNew={false}
            enablePdfExport={true}
            enableCsvExport={true}
            enableFilter={false} // No specific filters for now, search is enough
            onResetTable={false}
            onSearchChange={onSearchChange}
            onSort={handleSort}
            actionButtons={[
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: handleViewReportDetails,
                variant: "ghost",
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="analyze" className="flex-grow overflow-auto p-4">
          <CropHealthAnalyzer />
        </TabsContent>
      </Tabs>

      <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crop Damage Report Details</DialogTitle>
            <DialogDescription>Detailed information about the selected crop damage report.</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <ScrollArea className="h-full max-h-[calc(90vh-150px)] pr-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Report ID:</div>
                  <div>{selectedReport.id}</div>
                  <div className="font-medium">Farmer ID:</div>
                  <div>{selectedReport.farmerId}</div>
                  <div className="font-medium">Report Date:</div>
                  <div>{format(new Date(selectedReport.reportDate), "PPP")}</div>
                  <div className="font-medium">Crop Type:</div>
                  <div>{selectedReport.cropType}</div>
                  <div className="font-medium">Damage Type:</div>
                  <div>{selectedReport.damageType}</div>
                  <div className="font-medium">Affected Area:</div>
                  <div>{`${selectedReport.affectedArea} ${selectedReport.affectedAreaUnit}`}</div>
                  <div className="font-medium">Estimated Yield Loss:</div>
                  <div>{`${selectedReport.estimatedYieldLoss} kg`}</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium">Description:</div>
                  <div>{selectedReport.description}</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium">Interventions Needed:</div>
                  <div>{selectedReport.interventionsNeeded || "N/A"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Created At:</div>
                  <div>{format(new Date(selectedReport.createdAt), "PPP p")}</div>
                  <div className="font-medium">Updated At:</div>
                  <div>{format(new Date(selectedReport.updatedAt), "PPP p")}</div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
