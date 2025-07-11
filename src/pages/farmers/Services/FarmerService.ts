import type { Farmer, FarmerFilters, FilterOptions, FarmerResponse } from "./FarmerTypes"

// Updated mock data with comprehensive farmer information
const mockFarmers: Farmer[] = [
  {
    id: 1,
    // Personal Information
    firstName: "Juan",
    middleName: "Santos",
    lastName: "Dela Cruz",
    sex: "Male",
    dateOfBirth: "1985-03-15",
    placeOfBirth: "San Jose, Nueva Ecija",
    contactNumber: "09171234567",
    email: "juan.delacruz@gmail.com",
    farmerAddress: "123 Rizal Street, Barangay San Jose, Nueva Ecija",
    civilStatus: "Married",
    religion: "Roman Catholic",
    // Family Information
    spouseName: "Maria Dela Cruz",
    mothersMaidenName: "Santos",
    isHouseholdHead: true,
    householdHeadName: "",
    relationshipToHead: "",
    // Education and Emergency
    highestEducation: "High School",
    emergencyContactPerson: "Maria Dela Cruz (Wife) - 09171234568",
    // Program Memberships
    is4psBeneficiary: true,
    isIndigenousMember: false,
    isFarmerCoopMember: true,
    hasGovernmentId: true,
    governmentIdType: "PhilID",
    governmentIdNumber: "1234-5678-9012",
    // Farm Information
    rsbsaNo: "R01-001-001234",
    farmLocation: "Barangay San Jose, Nueva Ecija",
    farmSize: "2.5 hectares",
    ecosystem: "Irrigated",
    status: "Active",
    datePlanted: "2024-01-15",
    variety: "PSB Rc82",
    organization: "San Jose Farmers Association",
    intervention: "Seeds & Fertilizer",
    croppingSeason: "Dry Season 2024",
    landOwner: "Owner",
    // New fields for Step 2
    mainLivelihood: "Farmer",
    farmingActivity: ["Rice", "Corn"],
    otherCropsSpecify: "",
    livestockSpecify: "",
    poultrySpecify: "",
    kindOfWork: [],
    kindOfWorkSpecify: "",
    fishingActivity: [],
    fishingActivitySpecify: "", // Dummy data
    typeOfInvolvement: [],
    typeOfInvolvementSpecify: "", // Dummy data
    grossAnnualIncomeFarming: 150000,
    grossAnnualIncomeNonFarming: 20000,
    // New fields for Step 3
    farmParcels: [
      {
        id: 1,
        farmLocation: "Brgy. San Jose, Nueva Ecija",
        totalFarmArea: 1.5,
        withinAncestralDomain: false,
        ownershipDocumentNo: "DOC-001",
        ownershipType: "Registered Owner",
        agrarianReformBeneficiary: true,
        cropCommodity: "Rice",
        sizeUnit: "hectares",
        farmType: "Irrigated",
        organicPractitioner: false,
        remarks: "Main rice field",
      },
      {
        id: 2,
        farmLocation: "Brgy. Maligaya, Nueva Ecija",
        totalFarmArea: 1.0,
        withinAncestralDomain: false,
        ownershipDocumentNo: "DOC-002",
        ownershipType: "Tenant",
        agrarianReformBeneficiary: false,
        cropCommodity: "Corn",
        sizeUnit: "hectares",
        farmType: "Rainfed",
        organicPractitioner: false,
        remarks: "Corn field, rented",
      },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    // Personal Information
    firstName: "Maria",
    middleName: "Reyes",
    lastName: "Santos",
    sex: "Female",
    dateOfBirth: "1990-07-22",
    placeOfBirth: "Maligaya, Bulacan",
    contactNumber: "09182345678",
    email: "maria.santos@yahoo.com",
    farmerAddress: "456 Bonifacio Avenue, Barangay Maligaya, Bulacan",
    civilStatus: "Single",
    religion: "Iglesia ni Cristo",
    // Family Information
    spouseName: "",
    mothersMaidenName: "Reyes",
    isHouseholdHead: false,
    householdHeadName: "Pedro Santos",
    relationshipToHead: "Daughter",
    // Education and Emergency
    highestEducation: "College",
    emergencyContactPerson: "Pedro Santos (Father) - 09182345679",
    // Program Memberships
    is4psBeneficiary: false,
    isIndigenousMember: false,
    isFarmerCoopMember: true,
    hasGovernmentId: true,
    governmentIdType: "Driver's License",
    governmentIdNumber: "N01-12-345678",
    // Farm Information
    rsbsaNo: "R01-002-005678",
    farmLocation: "Barangay Maligaya, Bulacan",
    farmSize: "1.8 hectares",
    ecosystem: "Rainfed",
    status: "Active",
    datePlanted: "2024-02-01",
    variety: "NSIC Rc222",
    organization: "Maligaya Rice Growers Coop",
    intervention: "Cash Assistance",
    croppingSeason: "Wet Season 2024",
    landOwner: "Tenant",
    ownerName: "Pedro Maligaya",
    // New fields for Step 2
    mainLivelihood: "Farmworker/Laborer",
    farmingActivity: [],
    otherCropsSpecify: "",
    livestockSpecify: "",
    poultrySpecify: "",
    kindOfWork: ["Land Preparation", "Cultivation"],
    kindOfWorkSpecify: "", // Dummy data
    fishingActivity: [],
    fishingActivitySpecify: "", // Dummy data
    typeOfInvolvement: [],
    typeOfInvolvementSpecify: "", // Dummy data
    grossAnnualIncomeFarming: 80000,
    grossAnnualIncomeNonFarming: 50000,
    // New fields for Step 3
    farmParcels: [
      {
        id: 1,
        farmLocation: "Brgy. Maligaya, Bulacan",
        totalFarmArea: 0.5,
        withinAncestralDomain: false,
        ownershipDocumentNo: "",
        ownershipType: "Tenant",
        agrarianReformBeneficiary: false,
        cropCommodity: "Vegetables",
        sizeUnit: "hectares",
        farmType: "Rainfed",
        organicPractitioner: true,
        remarks: "Small vegetable plot",
      },
    ],
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-02-01T14:20:00Z",
  },
  {
    id: 3,
    firstName: "Pedro",
    middleName: "Cruz",
    lastName: "Reyes",
    sex: "Male",
    dateOfBirth: "1970-11-05",
    placeOfBirth: "Tarlac City, Tarlac",
    contactNumber: "09203456789",
    email: "pedro.reyes@example.com",
    farmerAddress: "789 Farm Road, Brgy. San Isidro, Tarlac",
    civilStatus: "Married",
    religion: "Roman Catholic",
    spouseName: "Elena Reyes",
    mothersMaidenName: "Cruz",
    isHouseholdHead: true,
    householdHeadName: "",
    relationshipToHead: "",
    highestEducation: "Vocational",
    emergencyContactPerson: "Elena Reyes (Wife) - 09203456790",
    is4psBeneficiary: false,
    isIndigenousMember: false,
    isFarmerCoopMember: false,
    hasGovernmentId: true,
    governmentIdType: "SSS ID",
    governmentIdNumber: "33-1234567-8",
    rsbsaNo: "R03-003-009876",
    farmLocation: "Brgy. San Isidro, Tarlac",
    farmSize: "3.0 hectares",
    ecosystem: "Upland",
    status: "Active",
    datePlanted: "2023-10-20",
    variety: "Hybrid Corn",
    organization: "Tarlac Corn Growers",
    intervention: "Training on Modern Farming",
    croppingSeason: "Dry Season 2024",
    landOwner: "Owner",
    mainLivelihood: "Farmer",
    farmingActivity: ["Corn", "Livestock"],
    otherCropsSpecify: "",
    livestockSpecify: "Cattle",
    poultrySpecify: "",
    kindOfWork: [],
    kindOfWorkSpecify: "",
    fishingActivity: [],
    fishingActivitySpecify: "",
    typeOfInvolvement: [],
    typeOfInvolvementSpecify: "",
    grossAnnualIncomeFarming: 200000,
    grossAnnualIncomeNonFarming: 10000,
    farmParcels: [
      {
        id: 1,
        farmLocation: "Brgy. San Isidro, Tarlac",
        totalFarmArea: 3.0,
        withinAncestralDomain: false,
        ownershipDocumentNo: "TITLE-003",
        ownershipType: "Registered Owner",
        agrarianReformBeneficiary: false,
        cropCommodity: "Corn",
        sizeUnit: "hectares",
        farmType: "Upland",
        organicPractitioner: false,
        remarks: "Main corn farm with cattle",
      },
    ],
    createdAt: "2023-10-15T11:00:00Z",
    updatedAt: "2024-01-01T09:00:00Z",
  },
  {
    id: 4,
    firstName: "Anna",
    middleName: "Lim",
    lastName: "Garcia",
    sex: "Female",
    dateOfBirth: "1995-04-01",
    placeOfBirth: "Dagupan City, Pangasinan",
    contactNumber: "09304567890",
    email: "anna.garcia@email.com",
    farmerAddress: "101 Fish Lane, Brgy. Pantal, Dagupan City, Pangasinan",
    civilStatus: "Single",
    religion: "Protestant",
    spouseName: "",
    mothersMaidenName: "Lim",
    isHouseholdHead: false,
    householdHeadName: "Jose Garcia",
    relationshipToHead: "Daughter",
    highestEducation: "College",
    emergencyContactPerson: "Jose Garcia (Father) - 09304567891",
    is4psBeneficiary: false,
    isIndigenousMember: false,
    isFarmerCoopMember: true,
    hasGovernmentId: true,
    governmentIdType: "Passport",
    governmentIdNumber: "P1234567",
    rsbsaNo: "R01-004-011223",
    farmLocation: "Coastal Area, Dagupan City, Pangasinan",
    farmSize: "0.5 hectares",
    ecosystem: "Rainfed", // Changed to Rainfed as it's a general category, not specific to fish
    status: "Active",
    datePlanted: "2024-03-10", // Placeholder, as it's fisherfolk
    variety: "Tilapia", // Placeholder
    organization: "Dagupan Fisherfolk Association",
    intervention: "Aquaculture Training",
    croppingSeason: "Wet Season 2024", // Placeholder
    landOwner: "Tenant", // Placeholder
    mainLivelihood: "Fisherfolk",
    farmingActivity: [],
    otherCropsSpecify: "",
    livestockSpecify: "",
    poultrySpecify: "",
    kindOfWork: [],
    kindOfWorkSpecify: "",
    fishingActivity: ["Aquaculture", "Fish Vending"],
    fishingActivitySpecify: "",
    typeOfInvolvement: [],
    typeOfInvolvementSpecify: "",
    grossAnnualIncomeFarming: 0, // No farming income
    grossAnnualIncomeNonFarming: 90000,
    farmParcels: [
      {
        id: 1,
        farmLocation: "Fish Pond 1, Dagupan City",
        totalFarmArea: 0.5,
        withinAncestralDomain: false,
        ownershipDocumentNo: "",
        ownershipType: "Tenant",
        agrarianReformBeneficiary: false,
        cropCommodity: "Tilapia",
        sizeUnit: "sqm",
        numberOfHeads: 500,
        farmType: "Rainfed Lowland", // More specific for aquaculture
        organicPractitioner: false,
        remarks: "Tilapia fish pond",
      },
    ],
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-03-15T11:30:00Z",
  },
  {
    id: 5,
    firstName: "Robert",
    middleName: "Gomez",
    lastName: "Cruz",
    sex: "Male",
    dateOfBirth: "2000-08-20",
    placeOfBirth: "Santiago City, Isabela",
    contactNumber: "09456789012",
    email: "robert.cruz@example.com",
    farmerAddress: "222 Youth Street, Brgy. Centro, Santiago City, Isabela",
    civilStatus: "Single",
    religion: "Roman Catholic",
    spouseName: "",
    mothersMaidenName: "Gomez",
    isHouseholdHead: false,
    householdHeadName: "Maria Cruz",
    relationshipToHead: "Son",
    highestEducation: "College",
    emergencyContactPerson: "Maria Cruz (Mother) - 09456789013",
    is4psBeneficiary: false,
    isIndigenousMember: false,
    isFarmerCoopMember: false,
    hasGovernmentId: true,
    governmentIdType: "PhilID",
    governmentIdNumber: "5678-9012-3456",
    rsbsaNo: "R02-005-022334",
    farmLocation: "Family Farm, Santiago City, Isabela",
    farmSize: "1.0 hectares",
    ecosystem: "Irrigated",
    status: "Active",
    datePlanted: "2024-04-01",
    variety: "Rice",
    organization: "Agri Youth Santiago",
    intervention: "Youth Entrepreneurship Program",
    croppingSeason: "Wet Season 2024",
    landOwner: "Owner",
    mainLivelihood: "Agri Youth",
    farmingActivity: [],
    otherCropsSpecify: "",
    livestockSpecify: "",
    poultrySpecify: "",
    kindOfWork: [],
    kindOfWorkSpecify: "",
    fishingActivity: [],
    fishingActivitySpecify: "",
    typeOfInvolvement: ["part of a farming household", "attending/attended formal agri-fishery related course"],
    typeOfInvolvementSpecify: "",
    grossAnnualIncomeFarming: 0, // Income from family farm, not direct
    grossAnnualIncomeNonFarming: 30000,
    farmParcels: [
      {
        id: 1,
        farmLocation: "Family Farm, Santiago City",
        totalFarmArea: 1.0,
        withinAncestralDomain: false,
        ownershipDocumentNo: "FAM-001",
        ownershipType: "Registered Owner",
        agrarianReformBeneficiary: false,
        cropCommodity: "Rice",
        sizeUnit: "hectares",
        farmType: "Irrigated",
        organicPractitioner: false,
        remarks: "Family rice farm, Robert assists",
      },
    ],
    createdAt: "2024-03-20T14:00:00Z",
    updatedAt: "2024-04-05T16:00:00Z",
  },
]

const mockFilterOptions: FilterOptions = {
  ecosystems: [
    { name: "Irrigated", value: "Irrigated" },
    { name: "Rainfed", value: "Rainfed" },
    { name: "Upland", value: "Upland" },
  ],
  statuses: [
    { name: "Active", value: "Active" },
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
  seasons: [
    { name: "Dry Season 2024", value: "Dry Season 2024" },
    { name: "Wet Season 2024", value: "Wet Season 2024" },
  ],
  landOwnerTypes: [
    { name: "Owner", value: "Owner" },
    { name: "Tenant", value: "Tenant" },
  ],
  sexOptions: [
    { name: "Male", value: "Male" },
    { name: "Female", value: "Female" },
  ],
  civilStatusOptions: [
    { name: "Single", value: "Single" },
    { name: "Married", value: "Married" },
    { name: "Widowed", value: "Widowed" },
    { name: "Separated", value: "Separated" },
    { name: "Divorced", value: "Divorced" },
  ],
  educationLevels: [
    { name: "Elementary", value: "Elementary" },
    { name: "High School", value: "High School" },
    { name: "Vocational", value: "Vocational" },
    { name: "College", value: "College" },
    { name: "Post Graduate", value: "Post Graduate" },
  ],
  governmentIdTypes: [
    { name: "PhilID", value: "PhilID" },
    { name: "Driver's License", value: "Driver's License" },
    { name: "Passport", value: "Passport" },
    { name: "SSS ID", value: "SSS ID" },
    { name: "GSIS ID", value: "GSIS ID" },
    { name: "Voter's ID", value: "Voter's ID" },
    { name: "Senior Citizen ID", value: "Senior Citizen ID" },
    { name: "PWD ID", value: "PWD ID" },
  ],
}

class FarmerService {
  static async getAllFarmers(
    currentPage = 1,
    rowsPerPage = 10,
    searchQuery: string | null = null,
    columnSort: string | null = null,
    sortQuery: string | null = null,
    filters: FarmerFilters = {},
  ): Promise<FarmerResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredFarmers = [...mockFarmers]

    // Apply search
    if (searchQuery) {
      filteredFarmers = filteredFarmers.filter(
        (farmer) =>
          `${farmer.firstName} ${farmer.middleName} ${farmer.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          farmer.rsbsaNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.farmLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply filters
    if (filters.ecosystem) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.ecosystem === filters.ecosystem)
    }
    if (filters.status) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.status === filters.status)
    }
    if (filters.farmLocation) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.farmLocation?.includes(filters.farmLocation!))
    }
    if (filters.croppingSeason) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.croppingSeason === filters.croppingSeason)
    }
    if (filters.landOwner) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.landOwner === filters.landOwner)
    }
    if (filters.sex) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.sex === filters.sex)
    }
    if (filters.civilStatus) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.civilStatus === filters.civilStatus)
    }
    if (filters.is4psBeneficiary !== undefined) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.is4psBeneficiary === filters.is4psBeneficiary)
    }
    if (filters.isIndigenousMember !== undefined) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.isIndigenousMember === filters.isIndigenousMember)
    }
    if (filters.isFarmerCoopMember !== undefined) {
      filteredFarmers = filteredFarmers.filter((farmer) => farmer.isFarmerCoopMember === filters.isFarmerCoopMember)
    }

    // Apply sorting
    if (columnSort && sortQuery) {
      filteredFarmers.sort((a, b) => {
        let aValue: string
        let bValue: string
        // Handle special cases for sorting
        if (columnSort === "name") {
          aValue = `${a.firstName} ${a.middleName} ${a.lastName}`
          bValue = `${b.firstName} ${b.middleName} ${b.lastName}`
        } else {
          aValue = (a[columnSort as keyof Farmer] as string) || ""
          bValue = (b[columnSort as keyof Farmer] as string) || ""
        }

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
    const paginatedFarmers = filteredFarmers.slice(startIndex, endIndex)

    return {
      data: {
        farmers: paginatedFarmers,
        pagination: {
          total_items: filteredFarmers.length,
          per_page: rowsPerPage,
          current_page: currentPage,
          total_pages: Math.ceil(filteredFarmers.length / rowsPerPage),
        },
      },
    }
  }

  static async getFilterOptions(): Promise<{ data: FilterOptions }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { data: mockFilterOptions }
  }
}

export default FarmerService
