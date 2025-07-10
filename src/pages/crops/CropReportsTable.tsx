"use client"

import { useCallback, useState, useEffect } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table-v2"
import type { Crop, CropFilters, CropFilterOptions } from "./Services/CropTypes"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import CropService from "./Services/CropService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Calendar,
  MapPin,
  Sprout,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  Users,
  Target,
  CheckCircle,
} from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"

export function CropReportTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)
  const [filters, setFilters] = useState<CropFilters>({})
  const [currentFilterValues, setCurrentFilterValues] = useState<Record<string, any>>({})
  const [filterOptions, setFilterOptions] = useState<CropFilterOptions>({
    statuses: [],
    locations: [],
    ecosystems: [],
    varieties: [],
    cropNames: [],
    soilTypes: [],
    irrigationMethods: [],
    harvestQualities: [],
    yieldUnits: [],
    farmers: [],
  })

  // Fetch filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ["crop-filter-options"],
    queryFn: CropService.getFilterOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ["crop-analytics"],
    queryFn: CropService.getCropAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  useEffect(() => {
    if (filterOptionsData?.data) {
      setFilterOptions(filterOptionsData.data)
    }
  }, [filterOptionsData])

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

  // Handle filter changes from DataTableV2
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    // Update the current filter values for UI display
    setCurrentFilterValues((prev) => {
      if (value === "all" || !value || value === "") {
        const { [filterId]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [filterId]: value,
      }
    })

    // Update the filters for API calls
    setFilters((prev) => {
      if (!value || value === "") {
        const { [filterId]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [filterId]: value,
      }
    })
    setCurrentPage(1)
  }, [])

  const {
    isPending,
    error,
    isFetching,
    data: cropsData,
    refetch: refetchCrops,
  } = useQuery({
    queryKey: ["crops-report-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters],
    queryFn: () =>
      CropService.getAllCrops("asc", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  if (error) return "An error has occurred: " + error.message

  // Handle Review action
  const handleReview = (crop: Crop) => {
    console.log("Review crop report:", crop)
    // Add review logic here - could open a detailed report modal or navigate to report page
    // This could include:
    // - Generating comprehensive crop report
    // - Opening report review interface
    // - Marking report as reviewed
    // - Adding review comments or approval status
  }

  const handleExportReport = () => {
    console.log("Export crop reports")
    // Add export logic for reports here
  }

  const handleGenerateBulkReport = () => {
    console.log("Generate bulk reports")
    // Add bulk report generation logic here
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const getDaysUntilHarvest = (expectedDate: string) => {
    if (!expectedDate) return null
    const today = new Date()
    const harvest = new Date(expectedDate)
    const diffTime = harvest.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getYieldPerformance = (expected: number, actual: number) => {
    if (!expected || !actual) return null
    const performance = (actual / expected) * 100
    return Math.round(performance)
  }

  const getReportStatus = (crop: Crop) => {
    // Logic to determine if crop report is complete and ready for review
    const hasBasicInfo = crop.cropName && crop.location && crop.plantedDate
    const hasYieldData = crop.yieldExpected || crop.yieldActual
    const hasFinancialData = crop.totalIncome || crop.expenses

    if (hasBasicInfo && hasYieldData && hasFinancialData) {
      return { status: "Complete", color: "bg-green-100 text-green-800" }
    } else if (hasBasicInfo && (hasYieldData || hasFinancialData)) {
      return { status: "Partial", color: "bg-yellow-100 text-yellow-800" }
    } else {
      return { status: "Incomplete", color: "bg-red-100 text-red-800" }
    }
  }

  // Define columns for report table
  const columns: ColumnDefinition<Crop>[] = [
    {
      id: "cropInfo",
      header: "Crop Information",
      accessorKey: "cropName",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-2">
          <div className="font-medium flex items-center">
            <Sprout className="h-4 w-4 mr-2 text-green-600" />
            {row.cropName}
          </div>
          {row.variety && <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{row.variety}</div>}
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="max-w-[150px] truncate" title={row.location}>
              {row.location}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "farmerInfo",
      header: "Farmer Details",
      accessorKey: "farmerName",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-1">
          {row.farmerName ? (
            <>
              <div className="text-sm font-medium flex items-center">
                <Users className="h-3 w-3 mr-1 text-blue-600" />
                {row.farmerName}
              </div>
              <div className="text-xs text-gray-500 font-mono">{row.rsbsaNo}</div>
              <div className="text-xs text-gray-600">{row.farmSize && `${row.farmSize}`}</div>
            </>
          ) : (
            <span className="text-gray-400">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      id: "reportStatus",
      header: "Report Status",
      accessorKey: "cropStatus",
      enableSorting: true,
      cell: (row) => {
        const reportStatus = getReportStatus(row)
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "planted":
              return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "growing":
              return "bg-green-100 text-green-800 hover:bg-green-100"
            case "active":
              return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
            case "harvested":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "inactive":
              return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        }

        return (
          <div className="space-y-2">
            <Badge className={reportStatus.color}>
              <FileText className="h-3 w-3 mr-1" />
              {reportStatus.status}
            </Badge>
            <Badge className={getStatusColor(row.cropStatus)}>{row.cropStatus}</Badge>
            {row.ecosystem && <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">{row.ecosystem}</div>}
          </div>
        )
      },
    },
    {
      id: "timeline",
      header: "Timeline Summary",
      accessorKey: "plantedDate",
      enableSorting: true,
      cell: (row) => {
        const daysUntilHarvest = getDaysUntilHarvest(row.expectedHarvestDate || "")
        return (
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1 text-gray-500" />
              <span className="font-medium">Planted:</span>
              <span className="ml-1">{formatDate(row.plantedDate || "")}</span>
            </div>
            {row.actualHarvestDate ? (
              <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                ✓ Harvested: {formatDate(row.actualHarvestDate)}
              </div>
            ) : row.expectedHarvestDate ? (
              <div className="text-xs">
                <span className="text-gray-600">Expected:</span>
                <span className="ml-1">{formatDate(row.expectedHarvestDate)}</span>
                {daysUntilHarvest !== null && (
                  <div
                    className={`mt-1 px-2 py-1 rounded text-xs font-medium ${
                      daysUntilHarvest < 0
                        ? "bg-red-100 text-red-700"
                        : daysUntilHarvest <= 7
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {daysUntilHarvest < 0
                      ? `${Math.abs(daysUntilHarvest)} days overdue`
                      : `${daysUntilHarvest} days left`}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-400">No harvest date</span>
            )}
          </div>
        )
      },
    },
    {
      id: "performance",
      header: "Performance Metrics",
      accessorKey: "yieldExpected",
      enableSorting: true,
      cell: (row) => {
        const performance = getYieldPerformance(row.yieldExpected || 0, row.yieldActual || 0)
        return (
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-xs text-gray-600">Target:</span>
                <span className="ml-1 font-medium">
                  {row.yieldExpected || 0} {row.yieldUnit || "tons"}
                </span>
              </div>
              {row.yieldActual && (
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-xs text-gray-600">Actual:</span>
                  <span className="ml-1 font-medium text-green-700">
                    {row.yieldActual} {row.yieldUnit || "tons"}
                  </span>
                </div>
              )}
            </div>
            {performance && (
              <div
                className={`text-xs px-2 py-1 rounded font-medium ${
                  performance >= 100
                    ? "bg-green-100 text-green-800"
                    : performance >= 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {performance}% Achievement
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "financial",
      header: "Financial Summary",
      accessorKey: "totalIncome",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-1">
          {row.totalIncome ? (
            <>
              <div className="flex items-center text-xs">
                <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                <span className="font-medium text-green-700">{formatCurrency(row.totalIncome)}</span>
              </div>
              {row.expenses && <div className="text-xs text-gray-600">Costs: {formatCurrency(row.expenses)}</div>}
              {row.profitLoss !== undefined && (
                <div className={`text-xs font-medium ${row.profitLoss > 0 ? "text-green-700" : "text-red-700"}`}>
                  {row.profitLoss > 0 ? "Profit" : "Loss"}: {formatCurrency(Math.abs(row.profitLoss))}
                </div>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400">No financial data</span>
          )}
        </div>
      ),
    },
  ]

  // Enhanced filter definitions for reports
  const filterDefinitions: FilterDefinition[] = [
    {
      id: "cropName",
      label: "Crop Type",
      type: "select",
      placeholder: "Select crop...",
      options: filterOptions.cropNames.map((crop) => ({
        label: crop.name,
        value: crop.value,
      })),
    },
    {
      id: "cropStatus",
      label: "Crop Status",
      type: "select",
      placeholder: "Select status...",
      options: filterOptions.statuses.map((status) => ({
        label: status.name,
        value: status.value,
      })),
    },
    {
      id: "location",
      label: "Province",
      type: "select",
      placeholder: "Select location...",
      options: filterOptions.locations.map((location) => ({
        label: location.name,
        value: location.value,
      })),
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      type: "select",
      placeholder: "Select ecosystem...",
      options: filterOptions.ecosystems.map((ecosystem) => ({
        label: ecosystem.name,
        value: ecosystem.value,
      })),
    },
    {
      id: "farmerId",
      label: "Farmer",
      type: "select",
      placeholder: "Select farmer...",
      options: filterOptions.farmers.map((farmer) => ({
        label: `${farmer.name} (${farmer.rsbsaNo})`,
        value: farmer.value.toString(),
      })),
    },
  ]

  const search: SearchDefinition = {
    title: "Search Reports",
    placeholder: "Search crop reports, farmer, location, RSBSA...",
    enableSearch: true,
  }

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <MainLayout>
      <>
        {/* Report Analytics Cards */}
        {analyticsData?.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cropsData?.data.pagination.total_items ?? 0}</div>
                <p className="text-xs text-muted-foreground">Available for review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complete Reports</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {cropsData?.data.crops?.filter((crop) => getReportStatus(crop).status === "Complete").length ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">Ready for review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Yield Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
             
            </Card>
          </div>
        )}

        <DataTableV2
          totalCount={cropsData?.data.pagination.total_items ?? 0}
          perPage={cropsData?.data.pagination.per_page ?? 10}
          pageNumber={cropsData?.data.pagination.current_page ?? 1}
          onPaginationChange={onPaginationChange}
          onRowCountChange={onRowCountChange}
          title="Crop Report Management"
          data={cropsData?.data.crops ?? []}
          columns={columns}
          filters={filterDefinitions}
          filterValues={currentFilterValues}
          onLoading={isPending || isFetching}
          idField="id"
          search={search}
          enableNew={false}
          enablePdfExport={true}
          enableCsvExport={true}
          enableFilter={true}
          onResetTable={false}
          onSearchChange={onSearchChange}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          actionButtons={[
            {
              label: "Review",
              icon: <CheckCircle className="h-4 w-4" />,
              onClick: handleReview,
              variant: "default",
            },
          ]}
         
        />
      </>
    </MainLayout>
  )
}

export default CropReportTable
