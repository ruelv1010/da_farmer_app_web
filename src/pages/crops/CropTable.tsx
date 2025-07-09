"use client";

import { useCallback, useState, useEffect } from "react";
import type {
  SearchDefinition,
  ColumnDefinition,
  FilterDefinition,
} from "@/components/data-table/data-table-v2";
import type {
  Crop,
  CropFilters,
  CropFilterOptions,
} from "./Services/CropTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import CropService from "./Services/CropService";
import { DataTableV2 } from "@/components/data-table/data-table-v2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  Edit,
  FileText,
  Calendar,
  MapPin,
  Sprout,
  TrendingUp,
  DollarSign,
  BarChart3,
  Trash2,
  Download,
  Users,
  Target,
  Droplets,
  Thermometer,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import CreateEditCropsDialog from "./CreateCrops";

export function CropTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<string | null>(null);
  const [sortQuery, setSortQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<CropFilters>({});
  const [currentFilterValues, setCurrentFilterValues] = useState<
    Record<string, any>
  >({});
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
  });
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Fetch filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ["crop-filter-options"],
    queryFn: CropService.getFilterOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ["crop-analytics"],
    queryFn: CropService.getCropAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  useEffect(() => {
    if (filterOptionsData?.data) {
      setFilterOptions(filterOptionsData.data);
    }
  }, [filterOptionsData]);

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row);
    setCurrentPage(1);
  }, []);

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null);
    setCurrentPage(1);
  }, []);

  // Handle filter changes from DataTableV2
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    // Update the current filter values for UI display
    setCurrentFilterValues((prev) => {
      if (value === "all" || !value || value === "") {
        const { [filterId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [filterId]: value,
      };
    });

    // Update the filters for API calls
    setFilters((prev) => {
      if (!value || value === "") {
        const { [filterId]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [filterId]: value,
      };
    });
    setCurrentPage(1);
  }, []);

  const {
    isPending,
    error,
    isFetching,
    data: cropsData,
    refetch: refetchCrops,
  } = useQuery({
    queryKey: [
      "crops-table",
      currentPage,
      rowsPerPage,
      searchQuery,
      columnSort,
      sortQuery,
      filters,
    ],
    queryFn: () =>
      CropService.getAllCrops(
        "asc",
        currentPage,
        rowsPerPage,
        searchQuery,
        columnSort,
        sortQuery,
        filters
      ),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return "An error has occurred: " + error.message;

  // Handle actions
  const handleView = (crop: Crop) => {
    console.log("View crop:", crop);
    setSelectedCrop(crop);
    // Add view logic here - could open a detailed view modal
  };

  const handleEdit = (crop: Crop) => {
    console.log("Edit crop:", crop);
    setEditingCrop(crop);
    setCreateEditDialogOpen(true);
  };

  const handleDelete = async (crop: Crop) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${crop.cropName} at ${crop.location}?`
      )
    ) {
      try {
        await CropService.deleteCrop(crop.id);
        console.log("Crop deleted successfully");
        refetchCrops();
      } catch (error) {
        console.error("Error deleting crop:", error);
      }
    }
  };

  const handleGenerateReport = (crop: Crop) => {
    console.log("Generate report for crop:", crop);
    // Add report generation logic here
  };

  const handleExportData = () => {
    console.log("Export crop data");
    // Add export logic here
  };

  const handleViewCalendar = () => {
    console.log("View crop calendar");
    // Add calendar view logic here
  };

  // Handle New button click
  const handleNew = () => {
    setEditingCrop(null);
    setCreateEditDialogOpen(true);
  };

  const handleCreateEditSuccess = (crop: any) => {
    console.log("Crop created/updated successfully:", crop);
    refetchCrops();
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const getDaysUntilHarvest = (expectedDate: string) => {
    if (!expectedDate) return null;
    const today = new Date();
    const harvest = new Date(expectedDate);
    const diffTime = harvest.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getYieldPerformance = (expected: number, actual: number) => {
    if (!expected || !actual) return null;
    const performance = (actual / expected) * 100;
    return Math.round(performance);
  };

  // Define columns
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
          {row.variety && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {row.variety}
            </div>
          )}
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
      header: "Farmer",
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
              <div className="text-xs text-gray-500 font-mono">
                {row.rsbsaNo}
              </div>
              <div className="text-xs text-gray-600">
                {row.farmSize && `${row.farmSize}`}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status & Ecosystem",
      accessorKey: "cropStatus",
      enableSorting: true,
      cell: (row) => {
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "planted":
              return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "growing":
              return "bg-green-100 text-green-800 hover:bg-green-100";
            case "active":
              return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
            case "harvested":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "inactive":
              return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-100";
          }
        };

        const getEcosystemIcon = (ecosystem: string) => {
          switch (ecosystem?.toLowerCase()) {
            case "irrigated":
              return <Droplets className="h-3 w-3 text-blue-600" />;
            case "rainfed":
              return <Thermometer className="h-3 w-3 text-orange-600" />;
            case "upland":
              return <Target className="h-3 w-3 text-purple-600" />;
            default:
              return null;
          }
        };

        return (
          <div className="space-y-2">
            <Badge className={getStatusColor(row.cropStatus)}>
              {row.cropStatus}
            </Badge>
            {row.ecosystem && (
              <div className="flex items-center text-xs text-gray-600">
                {getEcosystemIcon(row.ecosystem)}
                <span className="ml-1 capitalize">
                  {row.ecosystem.toLowerCase()}
                </span>
              </div>
            )}
            {row.soilType && (
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {row.soilType}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "timeline",
      header: "Timeline",
      accessorKey: "plantedDate",
      enableSorting: true,
      cell: (row) => {
        const daysUntilHarvest = getDaysUntilHarvest(
          row.expectedHarvestDate || ""
        );

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
                <span className="ml-1">
                  {formatDate(row.expectedHarvestDate)}
                </span>
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
        );
      },
    },
    {
      id: "yield",
      header: "Yield Performance",
      accessorKey: "yieldExpected",
      enableSorting: true,
      cell: (row) => {
        const performance = getYieldPerformance(
          row.yieldExpected || 0,
          row.yieldActual || 0
        );

        return (
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-xs text-gray-600">Expected:</span>
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
                {performance}% of target
              </div>
            )}

            {row.harvestQuality && (
              <div className="text-xs text-gray-600">
                Quality: {row.harvestQuality}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "financial",
      header: "Financial",
      accessorKey: "totalIncome",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-1">
          {row.totalIncome ? (
            <>
              <div className="flex items-center text-xs">
                <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                <span className="font-medium text-green-700">
                  {formatCurrency(row.totalIncome)}
                </span>
              </div>
              {row.expenses && (
                <div className="text-xs text-gray-600">
                  Expenses: {formatCurrency(row.expenses)}
                </div>
              )}
              {row.profitLoss && (
                <div
                  className={`text-xs font-medium ${
                    row.profitLoss > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {row.profitLoss > 0 ? "Profit" : "Loss"}:{" "}
                  {formatCurrency(Math.abs(row.profitLoss))}
                </div>
              )}
            </>
          ) : row.marketPrice ? (
            <div className="text-xs text-gray-600">
              Market: {formatCurrency(row.marketPrice)}/{row.yieldUnit || "ton"}
            </div>
          ) : (
            <span className="text-xs text-gray-400">No financial data</span>
          )}
        </div>
      ),
    },
    {
      id: "agricultural",
      header: "Agricultural Details",
      accessorKey: "irrigationMethod",
      enableSorting: false,
      cell: (row) => (
        <div className="space-y-1 max-w-[200px]">
          {row.irrigationMethod && (
            <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {row.irrigationMethod}
            </div>
          )}
          {row.fertilizerUsed && (
            <div
              className="text-xs text-gray-600 truncate"
              title={row.fertilizerUsed}
            >
              Fertilizer: {row.fertilizerUsed}
            </div>
          )}
          {row.weatherConditions && (
            <div className="text-xs text-gray-600">
              Weather: {row.weatherConditions}
            </div>
          )}
          {row.notes && (
            <div className="text-xs text-gray-500 truncate" title={row.notes}>
              Notes: {row.notes}
            </div>
          )}
        </div>
      ),
    },
  ];

  // Enhanced filter definitions
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
      label: "Status",
      type: "select",
      placeholder: "Select status...",
      options: filterOptions.statuses.map((status) => ({
        label: status.name,
        value: status.value,
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
      id: "variety",
      label: "Variety",
      type: "select",
      placeholder: "Select variety...",
      options: filterOptions.varieties.map((variety) => ({
        label: variety.name,
        value: variety.value,
      })),
    },
    {
      id: "soilType",
      label: "Soil Type",
      type: "select",
      placeholder: "Select soil type...",
      options: filterOptions.soilTypes.map((soil) => ({
        label: soil.name,
        value: soil.value,
      })),
    },
    {
      id: "irrigationMethod",
      label: "Irrigation",
      type: "select",
      placeholder: "Select irrigation...",
      options: filterOptions.irrigationMethods.map((method) => ({
        label: method.name,
        value: method.value,
      })),
    },
    {
      id: "harvestQuality",
      label: "Harvest Quality",
      type: "select",
      placeholder: "Select quality...",
      options: filterOptions.harvestQualities.map((quality) => ({
        label: quality.name,
        value: quality.value,
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
  ];

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search crop, variety, farmer, location, RSBSA, notes...",
    enableSearch: true,
  };

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column);
    setSortQuery(sort);
  };

  return (
    <MainLayout>
      <>
        {/* Analytics Cards */}

        <DataTableV2
          totalCount={cropsData?.data.pagination.total_items ?? 0}
          perPage={cropsData?.data.pagination.per_page ?? 10}
          pageNumber={cropsData?.data.pagination.current_page ?? 1}
          onPaginationChange={onPaginationChange}
          onRowCountChange={onRowCountChange}
          title="Crops Management System"
          data={cropsData?.data.crops ?? []}
          columns={columns}
          filters={filterDefinitions}
          filterValues={currentFilterValues}
          onLoading={isPending || isFetching}
          idField="id"
          search={search}
          enableNew={true}
          enablePdfExport={true}
          enableCsvExport={true}
          enableFilter={true}
          onResetTable={false}
          onSearchChange={onSearchChange}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          onNew={handleNew}
          actionButtons={[
            {
              label: "View",
              icon: <Eye className="h-4 w-4" />,
              onClick: handleView,
              variant: "ghost",
            },
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              onClick: handleEdit,
              variant: "ghost",
            },
            {
              label: "Report",
              icon: <FileText className="h-4 w-4" />,
              onClick: handleGenerateReport,
              variant: "ghost",
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: handleDelete,
              variant: "ghost",
            },
          ]}
        />

        <CreateEditCropsDialog
          open={createEditDialogOpen}
          onOpenChange={setCreateEditDialogOpen}
          onSuccess={handleCreateEditSuccess}
          editingCrop={editingCrop}
        />
      </>
    </MainLayout>
  );
}

export default CropTable;
