export interface Farmer {
    id: number
    // Personal Information
    firstName: string
    middleName?: string
    lastName: string
    sex: "Male" | "Female"
    dateOfBirth: string
    placeOfBirth: string
    contactNumber: string
    email?: string
    farmerAddress: string
    civilStatus: "Single" | "Married" | "Widowed" | "Separated" | "Divorced"
    religion: string
  
    // Family Information
    spouseName?: string
    mothersMaidenName: string
    isHouseholdHead: boolean
    householdHeadName?: string
    relationshipToHead?: string
  
    // Education and Emergency
    highestEducation: string
    emergencyContactPerson: string
  
    // Program Memberships
    is4psBeneficiary: boolean
    isIndigenousMember: boolean
    isFarmerCoopMember: boolean
    hasGovernmentId: boolean
    governmentIdType?: string
    governmentIdNumber?: string
  
    // Farm Information (from previous forms)
    rsbsaNo?: string
    farmLocation?: string
    farmSize?: string
    ecosystem?: "Irrigated" | "Rainfed" | "Upland"
    status?: "Active" | "Inactive"
    datePlanted?: string
    variety?: string
    organization?: string
    intervention?: string
    croppingSeason?: string
    landOwner?: "Owner" | "Tenant"
    ownerName?: string
    inactiveReason?: string
    remarks?: string
  
    // System fields
    createdAt: string
    updatedAt: string
  }
  
  export interface CreateFarmerRequest {
    firstName: string
    middleName?: string
    lastName: string
    sex: "Male" | "Female"
    dateOfBirth: string
    placeOfBirth: string
    contactNumber: string
    email?: string
    farmerAddress: string
    civilStatus: "Single" | "Married" | "Widowed" | "Separated" | "Divorced"
    religion: string
    spouseName?: string
    mothersMaidenName: string
    isHouseholdHead: boolean
    householdHeadName?: string
    relationshipToHead?: string
    highestEducation: string
    emergencyContactPerson: string
    is4psBeneficiary: boolean
    isIndigenousMember: boolean
    isFarmerCoopMember: boolean
    hasGovernmentId: boolean
    governmentIdType?: string
    governmentIdNumber?: string
  }
  
  export interface FarmerFilters {
    ecosystem?: string
    status?: string
    farmLocation?: string
    croppingSeason?: string
    landOwner?: string
    sex?: string
    civilStatus?: string
    is4psBeneficiary?: boolean
    isIndigenousMember?: boolean
    isFarmerCoopMember?: boolean
    // Add index signature to allow dynamic property access
    [key: string]: string | boolean | undefined
  }
  
  export interface FilterOptions {
    ecosystems: Array<{ name: string; value: string }>
    statuses: Array<{ name: string; value: string }>
    locations: Array<{ name: string; value: string }>
    seasons: Array<{ name: string; value: string }>
    landOwnerTypes: Array<{ name: string; value: string }>
    sexOptions: Array<{ name: string; value: string }>
    civilStatusOptions: Array<{ name: string; value: string }>
    educationLevels: Array<{ name: string; value: string }>
    governmentIdTypes: Array<{ name: string; value: string }>
  }
  
  export interface FarmerResponse {
    data: {
      farmers: Farmer[]
      pagination: {
        total_items: number
        per_page: number
        current_page: number
        total_pages: number
      }
    }
  }
  