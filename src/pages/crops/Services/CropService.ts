import type { Crop, CropFilters, CropFilterOptions, CropResponse, CropAnalytics, CropCalendarEvent } from "./CropTypes"

// Enhanced mock data with comprehensive crop information
const mockCrops: Crop[] = [
  {
    id: 1,
    cropName: "Rice",
    location: "Barangay San Jose, Nueva Ecija",
    cropStatus: "Growing",
    plantedDate: "2024-01-15",
    expectedHarvestDate: "2024-05-15",
    variety: "PSB Rc82",
    farmSize: "2.5 hectares",
    ecosystem: "Irrigated",
    farmerId: 1,
    farmerName: "Juan Dela Cruz",
    rsbsaNo: "R01-001-001234",
    yieldExpected: 6.5,
    yieldUnit: "tons",
    seedSource: "PhilRice",
    fertilizerUsed: "14-14-14 NPK, Urea",
    pesticidesUsed: "Herbicide, Insecticide",
    irrigationMethod: "Flood irrigation",
    soilType: "Clay loam",
    weatherConditions: "Favorable",
    marketPrice: 22.5,
    expenses: 45000,
    notes: "First planting season, good soil condition. Regular monitoring needed.",
    coordinates: { latitude: 15.5784, longitude: 120.9726 },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    cropName: "Corn",
    location: "Barangay Maligaya, Bulacan",
    cropStatus: "Planted",
    plantedDate: "2024-02-01",
    expectedHarvestDate: "2024-06-01",
    variety: "Pioneer 30G12",
    farmSize: "1.8 hectares",
    ecosystem: "Rainfed",
    farmerId: 2,
    farmerName: "Maria Santos",
    rsbsaNo: "R01-002-005678",
    yieldExpected: 4.2,
    yieldUnit: "tons",
    seedSource: "Pioneer Seeds",
    fertilizerUsed: "16-20-0, Urea",
    pesticidesUsed: "Herbicide",
    irrigationMethod: "Rain-fed",
    soilType: "Sandy loam",
    weatherConditions: "Adequate rainfall",
    marketPrice: 18.75,
    expenses: 32000,
    notes: "Hybrid variety, drought resistant. Good germination rate.",
    coordinates: { latitude: 14.7985, longitude: 120.8797 },
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-02-01T14:20:00Z",
  },
  {
    id: 3,
    cropName: "Rice",
    location: "Barangay Bagong Silang, Tarlac",
    cropStatus: "Harvested",
    plantedDate: "2023-10-10",
    expectedHarvestDate: "2024-02-10",
    actualHarvestDate: "2024-02-08",
    variety: "PSB Rc18",
    farmSize: "3.2 hectares",
    ecosystem: "Irrigated",
    farmerId: 3,
    farmerName: "Pedro Reyes",
    rsbsaNo: "R01-003-009012",
    yieldExpected: 5.8,
    yieldActual: 6.2,
    yieldUnit: "tons",
    seedSource: "PhilRice",
    fertilizerUsed: "14-14-14 NPK, Urea, Potash",
    pesticidesUsed: "Herbicide, Fungicide",
    irrigationMethod: "Flood irrigation",
    soilType: "Clay",
    weatherConditions: "Excellent",
    harvestQuality: "Excellent",
    marketPrice: 23.0,
    totalIncome: 142600,
    expenses: 58000,
    profitLoss: 84600,
    notes: "Excellent harvest yield, 6.2 tons per hectare. Premium quality rice.",
    coordinates: { latitude: 15.4817, longitude: 120.5979 },
    createdAt: "2023-10-05T07:45:00Z",
    updatedAt: "2024-02-08T16:10:00Z",
  },
  {
    id: 4,
    cropName: "Vegetables",
    location: "Barangay Riverside, Pangasinan",
    cropStatus: "Active",
    plantedDate: "2024-01-28",
    expectedHarvestDate: "2024-04-28",
    variety: "Tomato - Determinate",
    farmSize: "0.5 hectares",
    ecosystem: "Upland",
    farmerId: 4,
    farmerName: "Ana Garcia",
    rsbsaNo: "R01-004-003456",
    yieldExpected: 8.0,
    yieldUnit: "tons",
    seedSource: "Local supplier",
    fertilizerUsed: "Organic compost, 14-14-14",
    pesticidesUsed: "Organic pesticide",
    irrigationMethod: "Drip irrigation",
    soilType: "Loam",
    weatherConditions: "Good",
    marketPrice: 35.0,
    expenses: 25000,
    notes: "Organic farming approach. High-value crop with good market demand.",
    coordinates: { latitude: 16.0389, longitude: 120.3209 },
    createdAt: "2024-01-20T11:30:00Z",
    updatedAt: "2024-01-28T13:45:00Z",
  },
  {
    id: 5,
    cropName: "Rice",
    location: "Barangay Central, Isabela",
    cropStatus: "Growing",
    plantedDate: "2024-02-15",
    expectedHarvestDate: "2024-06-15",
    variety: "NSIC Rc222",
    farmSize: "4.1 hectares",
    ecosystem: "Irrigated",
    farmerId: 5,
    farmerName: "Roberto Mendoza",
    rsbsaNo: "R01-005-007890",
    yieldExpected: 7.2,
    yieldUnit: "tons",
    seedSource: "PhilRice",
    fertilizerUsed: "14-14-14 NPK, Urea",
    pesticidesUsed: "Herbicide, Insecticide",
    irrigationMethod: "Flood irrigation",
    soilType: "Clay loam",
    weatherConditions: "Good",
    marketPrice: 22.0,
    expenses: 72000,
    notes: "Large farm area. Using improved variety with high yield potential.",
    coordinates: { latitude: 16.9754, longitude: 121.8077 },
    createdAt: "2024-02-10T06:20:00Z",
    updatedAt: "2024-02-15T12:00:00Z",
  },
  {
    id: 6,
    cropName: "Corn",
    location: "Barangay Malaking Ilog, Cagayan",
    cropStatus: "Inactive",
    plantedDate: "2023-11-20",
    expectedHarvestDate: "2024-03-20",
    variety: "IPB Var 6",
    farmSize: "1.5 hectares",
    ecosystem: "Rainfed",
    farmerId: 6,
    farmerName: "Carmen Lopez",
    rsbsaNo: "R01-006-001122",
    yieldExpected: 3.8,
    yieldUnit: "tons",
    seedSource: "UPLB",
    fertilizerUsed: "16-20-0",
    irrigationMethod: "Rain-fed",
    soilType: "Sandy clay",
    weatherConditions: "Drought affected",
    expenses: 28000,
    notes: "Crop affected by prolonged drought. Considering crop insurance claim.",
    coordinates: { latitude: 18.1667, longitude: 121.75 },
    createdAt: "2023-11-15T14:10:00Z",
    updatedAt: "2024-01-20T09:25:00Z",
  },
]

const mockFilterOptions: CropFilterOptions = {
  statuses: [
    { name: "Planted", value: "Planted" },
    { name: "Growing", value: "Growing" },
    { name: "Active", value: "Active" },
    { name: "Harvested", value: "Harvested" },
    { name: "Inactive", value: "Inactive" },
  ],
  locations: [
    { name: "Nueva Ecija", value: "Nueva Ecija" },
    { name: "Bulacan", value: "Bulacan" },
    { name: "Tarlac", value: "Tarlac" },
    { name: "Pangasinan", value: "Pangasinan" },
    { name: "Isabela", value: "Isabela" },
    { name: "Cagayan", value: "Cagayan" },
  ],
  ecosystems: [
    { name: "Irrigated", value: "Irrigated" },
    { name: "Rainfed", value: "Rainfed" },
    { name: "Upland", value: "Upland" },
  ],
  varieties: [
    { name: "PSB Rc82", value: "PSB Rc82" },
    { name: "PSB Rc18", value: "PSB Rc18" },
    { name: "NSIC Rc222", value: "NSIC Rc222" },
    { name: "NSIC Rc160", value: "NSIC Rc160" },
    { name: "Pioneer 30G12", value: "Pioneer 30G12" },
    { name: "IPB Var 6", value: "IPB Var 6" },
    { name: "Tomato - Determinate", value: "Tomato - Determinate" },
  ],
  cropNames: [
    { name: "Rice", value: "Rice" },
    { name: "Corn", value: "Corn" },
    { name: "Vegetables", value: "Vegetables" },
    { name: "Wheat", value: "Wheat" },
    { name: "Sugarcane", value: "Sugarcane" },
  ],
  soilTypes: [
    { name: "Clay", value: "Clay" },
    { name: "Clay loam", value: "Clay loam" },
    { name: "Sandy loam", value: "Sandy loam" },
    { name: "Sandy clay", value: "Sandy clay" },
    { name: "Loam", value: "Loam" },
    { name: "Silt", value: "Silt" },
  ],
  irrigationMethods: [
    { name: "Flood irrigation", value: "Flood irrigation" },
    { name: "Drip irrigation", value: "Drip irrigation" },
    { name: "Sprinkler irrigation", value: "Sprinkler irrigation" },
    { name: "Rain-fed", value: "Rain-fed" },
  ],
  harvestQualities: [
    { name: "Excellent", value: "Excellent" },
    { name: "Good", value: "Good" },
    { name: "Fair", value: "Fair" },
    { name: "Poor", value: "Poor" },
  ],
  yieldUnits: [
    { name: "Tons", value: "tons" },
    { name: "Kilograms", value: "kg" },
    { name: "Sacks", value: "sacks" },
  ],
  farmers: [
    { name: "Juan Dela Cruz", value: 1, rsbsaNo: "R01-001-001234" },
    { name: "Maria Santos", value: 2, rsbsaNo: "R01-002-005678" },
    { name: "Pedro Reyes", value: 3, rsbsaNo: "R01-003-009012" },
    { name: "Ana Garcia", value: 4, rsbsaNo: "R01-004-003456" },
    { name: "Roberto Mendoza", value: 5, rsbsaNo: "R01-005-007890" },
    { name: "Carmen Lopez", value: 6, rsbsaNo: "R01-006-001122" },
  ],
}

class CropService {
  static async getAllCrops(
    sortOrder = "asc",
    currentPage = 1,
    rowsPerPage = 10,
    searchQuery: string | null = null,
    columnSort: string | null = null,
    sortQuery: string | null = null,
    filters: CropFilters = {},
  ): Promise<CropResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredCrops = [...mockCrops]

    // Enhanced search
    if (searchQuery) {
      filteredCrops = filteredCrops.filter(
        (crop) =>
          crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.rsbsaNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.soilType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Enhanced filters
    if (filters.cropName) {
      filteredCrops = filteredCrops.filter((crop) => crop.cropName === filters.cropName)
    }
    if (filters.variety) {
      filteredCrops = filteredCrops.filter((crop) => crop.variety === filters.variety)
    }
    if (filters.soilType) {
      filteredCrops = filteredCrops.filter((crop) => crop.soilType === filters.soilType)
    }
    if (filters.plantedDateFrom) {
      filteredCrops = filteredCrops.filter((crop) => crop.plantedDate && crop.plantedDate >= filters.plantedDateFrom!)
    }
    if (filters.plantedDateTo) {
      filteredCrops = filteredCrops.filter((crop) => crop.plantedDate && crop.plantedDate <= filters.plantedDateTo!)
    }
    if (filters.yieldRange?.min !== undefined) {
      filteredCrops = filteredCrops.filter(
        (crop) => (crop.yieldActual || crop.yieldExpected || 0) >= filters.yieldRange!.min!,
      )
    }
    if (filters.yieldRange?.max !== undefined) {
      filteredCrops = filteredCrops.filter(
        (crop) => (crop.yieldActual || crop.yieldExpected || 0) <= filters.yieldRange!.max!,
      )
    }

    // Apply sorting
    if (columnSort && sortQuery) {
      filteredCrops.sort((a, b) => {
        const aValue = (a[columnSort as keyof Crop] as string) || ""
        const bValue = (b[columnSort as keyof Crop] as string) || ""

        if (sortQuery === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedCrops = filteredCrops.slice(startIndex, endIndex)

    return {
      data: {
        crops: paginatedCrops,
        pagination: {
          total_items: filteredCrops.length,
          per_page: rowsPerPage,
          current_page: currentPage,
          total_pages: Math.ceil(filteredCrops.length / rowsPerPage),
        },
      },
    }
  }

  static async getFilterOptions(): Promise<{ data: CropFilterOptions }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { data: mockFilterOptions }
  }

  static async createCrop(cropData: any): Promise<{ data: Crop }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newCrop: Crop = {
      id: mockCrops.length + 1,
      ...cropData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCrops.push(newCrop)
    return { data: newCrop }
  }

  static async getCropById(id: number): Promise<{ data: Crop | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const crop = mockCrops.find((c) => c.id === id)
    return { data: crop || null }
  }

  static async updateCrop(id: number, cropData: Partial<Crop>): Promise<{ data: Crop }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const cropIndex = mockCrops.findIndex((c) => c.id === id)
    if (cropIndex === -1) {
      throw new Error("Crop not found")
    }

    mockCrops[cropIndex] = {
      ...mockCrops[cropIndex],
      ...cropData,
      updatedAt: new Date().toISOString(),
    }

    return { data: mockCrops[cropIndex] }
  }

  static async deleteCrop(id: number): Promise<{ success: boolean }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cropIndex = mockCrops.findIndex((c) => c.id === id)
    if (cropIndex === -1) {
      throw new Error("Crop not found")
    }

    mockCrops.splice(cropIndex, 1)
    return { success: true }
  }

  static async getCropAnalytics(): Promise<{ data: CropAnalytics }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const totalCrops = mockCrops.length
    const activeCrops = mockCrops.filter((c) => c.cropStatus === "Active" || c.cropStatus === "Growing").length
    const harvestedCrops = mockCrops.filter((c) => c.cropStatus === "Harvested").length

    const totalYield = mockCrops.filter((c) => c.yieldActual).reduce((sum, c) => sum + (c.yieldActual || 0), 0)

    const averageYield = harvestedCrops > 0 ? totalYield / harvestedCrops : 0

    const totalIncome = mockCrops.filter((c) => c.totalIncome).reduce((sum, c) => sum + (c.totalIncome || 0), 0)

    const totalExpenses = mockCrops.filter((c) => c.expenses).reduce((sum, c) => sum + (c.expenses || 0), 0)

    const analytics: CropAnalytics = {
      totalCrops,
      activeCrops,
      harvestedCrops,
      totalYield,
      averageYield,
      totalIncome,
      totalExpenses,
      totalProfit: totalIncome - totalExpenses,
      cropsByStatus: [
        { status: "Active", count: mockCrops.filter((c) => c.cropStatus === "Active").length },
        { status: "Growing", count: mockCrops.filter((c) => c.cropStatus === "Growing").length },
        { status: "Planted", count: mockCrops.filter((c) => c.cropStatus === "Planted").length },
        { status: "Harvested", count: harvestedCrops },
        { status: "Inactive", count: mockCrops.filter((c) => c.cropStatus === "Inactive").length },
      ],
      cropsByEcosystem: [
        { ecosystem: "Irrigated", count: mockCrops.filter((c) => c.ecosystem === "Irrigated").length },
        { ecosystem: "Rainfed", count: mockCrops.filter((c) => c.ecosystem === "Rainfed").length },
        { ecosystem: "Upland", count: mockCrops.filter((c) => c.ecosystem === "Upland").length },
      ],
      monthlyPlanting: [], // Would be calculated from actual data
      monthlyHarvest: [], // Would be calculated from actual data
    }

    return { data: analytics }
  }

  static async getCropCalendar(year: number, month?: number): Promise<{ data: CropCalendarEvent[] }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const events: CropCalendarEvent[] = []

    mockCrops.forEach((crop) => {
      // Add planting events
      if (crop.plantedDate) {
        const plantDate = new Date(crop.plantedDate)
        if (plantDate.getFullYear() === year && (!month || plantDate.getMonth() + 1 === month)) {
          events.push({
            id: events.length + 1,
            cropId: crop.id,
            cropName: crop.cropName,
            farmerName: crop.farmerName,
            location: crop.location,
            eventType: "planting",
            date: crop.plantedDate,
            status: crop.cropStatus,
            notes: `Planted ${crop.variety || crop.cropName}`,
          })
        }
      }

      // Add harvest events
      const harvestDate = crop.actualHarvestDate || crop.expectedHarvestDate
      if (harvestDate) {
        const hDate = new Date(harvestDate)
        if (hDate.getFullYear() === year && (!month || hDate.getMonth() + 1 === month)) {
          events.push({
            id: events.length + 1,
            cropId: crop.id,
            cropName: crop.cropName,
            farmerName: crop.farmerName,
            location: crop.location,
            eventType: "harvest",
            date: harvestDate,
            status: crop.cropStatus,
            notes: crop.actualHarvestDate
              ? `Harvested: ${crop.yieldActual || "N/A"} ${crop.yieldUnit || "tons"}`
              : `Expected harvest: ${crop.yieldExpected || "N/A"} ${crop.yieldUnit || "tons"}`,
          })
        }
      }
    })

    return { data: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }
  }
}

export default CropService
