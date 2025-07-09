export interface Crop {
    id: number
    cropName: string
    location: string
    cropStatus: "Active" | "Inactive" | "Harvested" | "Planted" | "Growing"
    plantedDate?: string
    expectedHarvestDate?: string
    actualHarvestDate?: string
    variety?: string
    farmSize?: string
    ecosystem?: "Irrigated" | "Rainfed" | "Upland"
    farmerId?: number
    farmerName?: string
    rsbsaNo?: string
    yieldExpected?: number
    yieldActual?: number
    yieldUnit?: "tons" | "kg" | "sacks"
    seedSource?: string
    fertilizerUsed?: string
    pesticidesUsed?: string
    irrigationMethod?: string
    soilType?: string
    weatherConditions?: string
    harvestQuality?: "Excellent" | "Good" | "Fair" | "Poor"
    marketPrice?: number
    totalIncome?: number
    expenses?: number
    profitLoss?: number
    notes?: string
    images?: string[]
    coordinates?: {
      latitude: number
      longitude: number
    }
    createdAt: string
    updatedAt: string
  }
  
  export interface CreateCropRequest {
    cropName: string
    location: string
    cropStatus: "Active" | "Inactive" | "Harvested" | "Planted" | "Growing"
    plantedDate?: string
    expectedHarvestDate?: string
    actualHarvestDate?: string
    variety?: string
    farmSize?: string
    ecosystem?: "Irrigated" | "Rainfed" | "Upland"
    farmerId?: number
    yieldExpected?: number
    yieldUnit?: "tons" | "kg" | "sacks"
    seedSource?: string
    fertilizerUsed?: string
    pesticidesUsed?: string
    irrigationMethod?: string
    soilType?: string
    weatherConditions?: string
    notes?: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  
  export interface CropFilters {
    cropStatus?: string
    location?: string
    ecosystem?: string
    farmerId?: number
    variety?: string
    cropName?: string
    plantedDateFrom?: string
    plantedDateTo?: string
    expectedHarvestFrom?: string
    expectedHarvestTo?: string
    yieldRange?: {
      min?: number
      max?: number
    }
    soilType?: string
    irrigationMethod?: string
    harvestQuality?: string
    [key: string]: string | number | object | undefined
  }
  
  export interface CropFilterOptions {
    statuses: Array<{ name: string; value: string }>
    locations: Array<{ name: string; value: string }>
    ecosystems: Array<{ name: string; value: string }>
    varieties: Array<{ name: string; value: string }>
    cropNames: Array<{ name: string; value: string }>
    soilTypes: Array<{ name: string; value: string }>
    irrigationMethods: Array<{ name: string; value: string }>
    harvestQualities: Array<{ name: string; value: string }>
    yieldUnits: Array<{ name: string; value: string }>
    farmers: Array<{ name: string; value: number; rsbsaNo?: string }>
  }
  
  export interface CropResponse {
    data: {
      crops: Crop[]
      pagination: {
        total_items: number
        per_page: number
        current_page: number
        total_pages: number
      }
    }
  }
  
  export interface CropAnalytics {
    totalCrops: number
    activeCrops: number
    harvestedCrops: number
    totalYield: number
    averageYield: number
    totalIncome: number
    totalExpenses: number
    totalProfit: number
    cropsByStatus: Array<{ status: string; count: number }>
    cropsByEcosystem: Array<{ ecosystem: string; count: number }>
    monthlyPlanting: Array<{ month: string; count: number }>
    monthlyHarvest: Array<{ month: string; count: number; yield: number }>
  }
  
  export interface CropCalendarEvent {
    id: number
    cropId: number
    cropName: string
    farmerName?: string
    location: string
    eventType: "planting" | "harvest" | "maintenance"
    date: string
    status: string
    notes?: string
  }
  