"use client";

import { useCallback, useState, useEffect } from "react";
import type {
  SearchDefinition,
  ColumnDefinition,
  FilterDefinition,
} from "@/components/data-table/data-table-v2";
import type {
  Farmer,
  FarmerFilters,
  FilterOptions,
} from "./Services/FarmerTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import FarmerService from "./Services/FarmerService";
import { DataTableV2 } from "@/components/data-table/data-table-v2";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  FileText,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import CreateFarmerDialog from "./CreateFarmerDialog";

export function FarmerTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<string | null>(null);
  const [sortQuery, setSortQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<FarmerFilters>({});
  const [currentFilterValues, setCurrentFilterValues] = useState<
    Record<string, any>
  >({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ecosystems: [],
    statuses: [],
    locations: [],
    seasons: [],
    landOwnerTypes: [],
    sexOptions: [],
    civilStatusOptions: [],
    educationLevels: [],
    governmentIdTypes: [],
  });
  const [, setSelectedFarmer] = useState<Farmer | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ["farmer-filter-options"],
    queryFn: FarmerService.getFilterOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

    // Update the filters for API calls with proper type conversion
    setFilters((prev) => {
      if (!value || value === "") {
        const { [filterId]: removed, ...rest } = prev;
        return rest;
      }

      // Handle boolean filters
      let processedValue: string | boolean = value;
      if (
        filterId === "is4psBeneficiary" ||
        filterId === "isIndigenousMember" ||
        filterId === "isFarmerCoopMember"
      ) {
        processedValue = value === "true";
      }

      return {
        ...prev,
        [filterId]: processedValue,
      };
    });
    setCurrentPage(1);
  }, []);

  const {
    isPending,
    error,
    isFetching,
    data: farmersData,
  } = useQuery({
    queryKey: [
      "farmers-table",
      currentPage,
      rowsPerPage,
      searchQuery,
      columnSort,
      sortQuery,
      filters,
    ],
    queryFn: () =>
      FarmerService.getAllFarmers(
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
  const handleView = (farmer: Farmer) => {
    console.log("View farmer:", farmer);
    setSelectedFarmer(farmer);
    // Add view logic here
  };

  const handleEdit = (farmer: Farmer) => {
    console.log("Edit farmer:", farmer);
    setSelectedFarmer(farmer);
    // Add edit logic here
  };

  const handleGenerateReport = (farmer: Farmer) => {
    console.log("Generate report for farmer:", farmer);
    // Add report generation logic here
  };

  // Handle New button click - using window.location for navigation
  const handleNew = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSuccess = (farmer: any) => {
    console.log("Farmer created successfully:", farmer);
    // Optionally refresh the table data
    // You can add a refetch here if needed
  };

  // Helper function to get full name
  const getFullName = (farmer: Farmer) => {
    const parts = [farmer.firstName, farmer.middleName, farmer.lastName].filter(
      Boolean
    );
    return parts.join(" ");
  };

  // Helper function to calculate age
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Define columns
  const columns: ColumnDefinition<Farmer>[] = [
    {
      id: "name",
      header: "Full Name",
      accessorKey: "firstName",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-1">
          <div className="font-medium">{getFullName(row)}</div>
          <div className="text-xs text-gray-500">
            {row.sex} • {calculateAge(row.dateOfBirth)} years old
          </div>
        </div>
      ),
    },
    {
      id: "rsbsaNo",
      header: "RSBSA No.",
      accessorKey: "rsbsaNo",
      enableSorting: true,
      cell: (row) => (
        <div className="font-mono text-xs">
          {row.rsbsaNo || <span className="text-gray-400">Not assigned</span>}
        </div>
      ),
    },
   
    {
      id: "farmLocation",
      header: "Farm Location",
      accessorKey: "farmLocation",
      enableSorting: true,
      cell: (row) => (
        <div className="space-y-1">
          <div
            className="max-w-[180px] truncate font-medium"
            title={row.farmLocation}
          >
            {row.farmLocation || "Not specified"}
          </div>
          <div className="text-xs text-gray-500">
            {row.farmSize || "Size not specified"}
          </div>
        </div>
      ),
    },
   
    {
      id: "ecosystem",
      header: "Farm Type",
      accessorKey: "ecosystem",
      enableSorting: true,
      cell: (row) => {
        if (!row.ecosystem)
          return <span className="text-gray-400">Not specified</span>;

        const getEcosystemColor = (ecosystem: string) => {
          switch (ecosystem) {
            case "Irrigated":
              return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "Rainfed":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "Upland":
              return "bg-purple-100 text-purple-800 hover:bg-purple-100";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-100";
          }
        };
        return (
          <div className="space-y-1">
            <Badge className={getEcosystemColor(row.ecosystem)}>
              {row.ecosystem}
            </Badge>
            {row.variety && (
              <div className="text-xs text-gray-600">
                Variety: {row.variety}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      cell: (row) => {
        const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
            case "active":
              return "bg-green-100 text-green-800 hover:bg-green-100";
            case "inactive":
              return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-100";
          }
        };
        return (
          <div className="space-y-1">
            <Badge className={getStatusColor(row.status || "")}>
              {row.status || "Not specified"}
            </Badge>
            {row.datePlanted && (
              <div className="text-xs text-gray-600">
                Planted: {new Date(row.datePlanted).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },

  ];

  // Define filters
  const filterDefinitions: FilterDefinition[] = [
    

    {
      id: "ecosystem",
      label: "Farm Type",
      type: "select",
      placeholder: "Select...",
      options: filterOptions.ecosystems.map((ecosystem) => ({
        label: ecosystem.name,
        value: ecosystem.value,
      })),
    },
  ];

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search name, RSBSA, contact, location...",
    enableSearch: true,
  };

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column);
    setSortQuery(sort);
  };

  return (
    <MainLayout>
      <>
        <DataTableV2
          totalCount={farmersData?.data.pagination.total_items ?? 0}
          perPage={farmersData?.data.pagination.per_page ?? 10}
          pageNumber={farmersData?.data.pagination.current_page ?? 1}
          onPaginationChange={onPaginationChange}
          onRowCountChange={onRowCountChange}
          title="Rice Farmers Database"
          data={farmersData?.data.farmers ?? []}
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
          ]}
        />

        <CreateFarmerDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </>
    </MainLayout>
  );
}

export default FarmerTable;
