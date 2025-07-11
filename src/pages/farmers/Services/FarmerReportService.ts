import type { CropDamageReport, CreateCropDamageReportRequest } from "./FarmerTypes"

// Mock database for crop damage reports
const mockCropDamageReports: CropDamageReport[] = [
  {
    id: 1,
    farmerId: 1,
    farmParcelId: 1,
    reportDate: "2024-06-01T00:00:00.000Z",
    cropType: "Rice",
    damageType: "Pest Infestation",
    affectedArea: 0.5,
    affectedAreaUnit: "hectares",
    estimatedYieldLoss: 200, // kg
    description: "Severe infestation of rice black bug in the northern section of the farm parcel.",
    interventionsNeeded: "Pesticide application, biological control methods.",
    createdAt: "2024-06-02T08:00:00Z",
    updatedAt: "2024-06-02T08:00:00Z",
  },
  {
    id: 2,
    farmerId: 1,
    farmParcelId: 2,
    reportDate: "2024-05-10T00:00:00.000Z",
    cropType: "Corn",
    damageType: "Drought",
    affectedArea: 0.8,
    affectedAreaUnit: "hectares",
    estimatedYieldLoss: 30, // percentage
    description: "Prolonged dry spell caused significant wilting and stunted growth in corn crops.",
    interventionsNeeded: "Emergency irrigation, drought-resistant varieties for next season.",
    createdAt: "2024-05-11T09:30:00Z",
    updatedAt: "2024-05-11T09:30:00Z",
  },
  {
    id: 3,
    farmerId: 2,
    farmParcelId: 1,
    reportDate: "2024-06-15T00:00:00.000Z",
    cropType: "Vegetables",
    damageType: "Flood",
    affectedArea: 0.2,
    affectedAreaUnit: "hectares",
    estimatedYieldLoss: 80, // percentage
    description: "Flash flood submerged vegetable plots for 24 hours, leading to crop rot.",
    interventionsNeeded: "Replanting, improved drainage system.",
    createdAt: "2024-06-16T11:00:00Z",
    updatedAt: "2024-06-16T11:00:00Z",
  },
]
let nextReportId = mockCropDamageReports.length + 1

class FarmerReportService {
  static async createCropDamageReport(reportData: CreateCropDamageReportRequest): Promise<{ data: CropDamageReport }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newReport: CropDamageReport = {
      id: nextReportId++,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCropDamageReports.push(newReport)
    console.log("New Crop Damage Report created:", newReport)
    console.log("All Crop Damage Reports:", mockCropDamageReports)

    return { data: newReport }
  }

  static async getAllCropDamageReports(
    farmerId?: number,
    currentPage = 1,
    rowsPerPage = 10,
    searchQuery: string | null = null,
    columnSort: string | null = null,
    sortQuery: string | null = null,
  ): Promise<{
    data: {
      reports: CropDamageReport[]
      pagination: { total_items: number; per_page: number; current_page: number; total_pages: number }
    }
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredReports = [...mockCropDamageReports]

    if (farmerId) {
      filteredReports = filteredReports.filter((report) => report.farmerId === farmerId)
    }

    if (searchQuery) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.damageType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (columnSort && sortQuery) {
      filteredReports.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        if (columnSort === "reportDate") {
          aValue = new Date(a.reportDate).getTime()
          bValue = new Date(b.reportDate).getTime()
        } else {
          aValue = (a[columnSort as keyof CropDamageReport] as string | number) || ""
          bValue = (b[columnSort as keyof CropDamageReport] as string | number) || ""
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortQuery === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          return sortQuery === "asc" ? aValue - bValue : bValue - aValue
        }
        return 0
      })
    }

    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedReports = filteredReports.slice(startIndex, endIndex)

    return {
      data: {
        reports: paginatedReports,
        pagination: {
          total_items: filteredReports.length,
          per_page: rowsPerPage,
          current_page: currentPage,
          total_pages: Math.ceil(filteredReports.length / rowsPerPage),
        },
      },
    }
  }
}

export default FarmerReportService
