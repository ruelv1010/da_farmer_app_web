"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Corrected import path
import { Plus, Trash } from "lucide-react"
import type { CreateFarmerRequest, FarmParcel } from "./Services/FarmerTypes"

interface CreateFarmerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (farmer: CreateFarmerRequest) => void
  initialData?: CreateFarmerRequest // Added for edit functionality
}

const defaultFormData: CreateFarmerRequest = {
  firstName: "",
  middleName: "",
  lastName: "",
  sex: "Male",
  dateOfBirth: "",
  placeOfBirth: "",
  contactNumber: "",
  email: "",
  farmerAddress: "",
  civilStatus: "Single",
  religion: "",
  spouseName: "",
  mothersMaidenName: "",
  isHouseholdHead: true,
  householdHeadName: "",
  relationshipToHead: "",
  highestEducation: "",
  emergencyContactPerson: "",
  is4psBeneficiary: false,
  isIndigenousMember: false,
  isFarmerCoopMember: false,
  hasGovernmentId: false,
  governmentIdType: "",
  governmentIdNumber: "",
  mainLivelihood: "Farmer",
  farmingActivity: [],
  otherCropsSpecify: "",
  livestockSpecify: "",
  poultrySpecify: "",
  kindOfWork: [],
  kindOfWorkSpecify: "",
  fishingActivity: [],
  fishingActivitySpecify: "",
  typeOfInvolvement: [],
  typeOfInvolvementSpecify: "",
  grossAnnualIncomeFarming: 0,
  grossAnnualIncomeNonFarming: 0,
  farmParcels: [],
}

export default function CreateFarmer({ open, onOpenChange, onSuccess, initialData }: CreateFarmerProps) {
  const [currentStep, setCurrentStep] = useState("step1")
  const [formData, setFormData] = useState<CreateFarmerRequest>(initialData || defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      // Ensure dateOfBirth is formatted correctly for the input type="date"
      const formattedInitialData = initialData
        ? {
            ...initialData,
            dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split("T")[0] : "",
          }
        : defaultFormData
      setFormData(formattedInitialData)
      setCurrentStep("step1") // Always start at step 1 when opening
    }
  }, [open, initialData])

  const handleInputChange = (field: keyof CreateFarmerRequest, value: any) =>
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

  const handleCheckboxChange = (field: keyof CreateFarmerRequest, value: string, checked: boolean) =>
    setFormData((prev) => {
      const currentArray = (prev[field] || []) as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) }
      }
    })

  const handleParcelChange = (index: number, field: keyof FarmParcel, value: any) =>
    setFormData((prev) => {
      const updatedParcels = [...prev.farmParcels]
      updatedParcels[index] = {
        ...updatedParcels[index],
        [field]: value,
      }
      return { ...prev, farmParcels: updatedParcels }
    })

  const addFarmParcel = () =>
    setFormData((prev) => ({
      ...prev,
      farmParcels: [
        ...prev.farmParcels,
        {
          id: prev.farmParcels.length + 1,
          farmLocation: "",
          totalFarmArea: 0,
          withinAncestralDomain: false,
          ownershipType: "Owner",
          agrarianReformBeneficiary: false,
          cropCommodity: "",
          sizeUnit: "hectares",
          farmType: "Irrigated",
          organicPractitioner: false,
        },
      ],
    }))

  const removeFarmParcel = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      farmParcels: prev.farmParcels.filter((_, i) => i !== index),
    }))

  const handleNext = () => {
    if (currentStep === "step1") {
      setCurrentStep("step2")
    } else if (currentStep === "step2") {
      setCurrentStep("step3")
    }
  }

  const handleBack = () => {
    if (currentStep === "step3") {
      setCurrentStep("step2")
    } else if (currentStep === "step2") {
      setCurrentStep("step1")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form submitted:", formData)
      onSuccess?.(formData)
      onOpenChange(false)
      handleReset()
    } catch (error) {
      console.error("Error creating farmer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(initialData || defaultFormData) // Reset to initialData or default
    setCurrentStep("step1")
  }

  const handleCancel = () => {
    handleReset()
    onOpenChange(false)
  }

  const getDialogTitle = () => {
    const baseTitle = initialData ? "Edit Farmer Profile" : "Create New Farmer Profile"
    switch (currentStep) {
      case "step1":
        return `${baseTitle} - Step 1: Personal Information`
      case "step2":
        return `${baseTitle} - Step 2: Livelihood & Income`
      case "step3":
        return `${baseTitle} - Step 3: Farm Parcels`
      default:
        return baseTitle
    }
  }

  const getDialogDescription = () => {
    switch (currentStep) {
      case "step1":
        return "Fill in the farmer's personal and contact information."
      case "step2":
        return "Provide details about the farmer's main livelihood and annual income."
      case "step3":
        return "Add information about the farmer's land parcels."
      default:
        return "Fill in the farmer's profile details."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step1">Farmer Profile</TabsTrigger>
            <TabsTrigger value="step2">Farm Profile</TabsTrigger>
            <TabsTrigger value="step3">Farm Parcel</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-grow max-h-[calc(75vh-150px)] pr-4">
            <form onSubmit={handleSubmit} id="create-farmer-form">
              <TabsContent value="step1" className="p-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                        Middle Name
                      </Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                        Contact Number *
                      </Label>
                      <Input
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmerAddress" className="text-sm font-medium text-gray-700">
                        Farmer Address *
                      </Label>
                      <Textarea
                        id="farmerAddress"
                        value={formData.farmerAddress}
                        onChange={(e) => handleInputChange("farmerAddress", e.target.value)}
                        className="mt-1"
                        rows={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="civilStatus" className="text-sm font-medium text-gray-700">
                        Civil Status
                      </Label>
                      <Select
                        value={formData.civilStatus}
                        onValueChange={(value) => handleInputChange("civilStatus", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="religion" className="text-sm font-medium text-gray-700">
                        Religion *
                      </Label>
                      <Input
                        id="religion"
                        value={formData.religion}
                        onChange={(e) => handleInputChange("religion", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPerson" className="text-sm font-medium text-gray-700">
                        Emergency Contact Person *
                      </Label>
                      <Input
                        id="emergencyContactPerson"
                        value={formData.emergencyContactPerson}
                        onChange={(e) => handleInputChange("emergencyContactPerson", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  {/* Middle Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Sex</Label>
                      <RadioGroup
                        value={formData.sex}
                        onValueChange={(value) => handleInputChange("sex", value)}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                        Date of Birth *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="placeOfBirth" className="text-sm font-medium text-gray-700">
                        Place of Birth *
                      </Label>
                      <Input
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="spouseName" className="text-sm font-medium text-gray-700">
                        Name of Spouse (If Married)
                      </Label>
                      <Input
                        id="spouseName"
                        value={formData.spouseName}
                        onChange={(e) => handleInputChange("spouseName", e.target.value)}
                        className="mt-1"
                        disabled={formData.civilStatus !== "Married"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mothersMaidenName" className="text-sm font-medium text-gray-700">
                        Mother's Maiden Name *
                      </Label>
                      <Input
                        id="mothersMaidenName"
                        value={formData.mothersMaidenName}
                        onChange={(e) => handleInputChange("mothersMaidenName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="highestEducation" className="text-sm font-medium text-gray-700">
                        Highest Formal Education
                      </Label>
                      <Select
                        value={formData.highestEducation}
                        onValueChange={(value) => handleInputChange("highestEducation", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Elementary">Elementary</SelectItem>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="Vocational">Vocational</SelectItem>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Household Head?</Label>
                      <RadioGroup
                        value={formData.isHouseholdHead.toString()}
                        onValueChange={(value) => handleInputChange("isHouseholdHead", value === "true")}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="householdYes" />
                          <Label htmlFor="householdYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="householdNo" />
                          <Label htmlFor="householdNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {!formData.isHouseholdHead && (
                      <>
                        <div>
                          <Label htmlFor="householdHeadName" className="text-sm font-medium text-gray-700">
                            If NO, Name of Household Head: *
                          </Label>
                          <Input
                            id="householdHeadName"
                            value={formData.householdHeadName}
                            onChange={(e) => handleInputChange("householdHeadName", e.target.value)}
                            className="mt-1"
                            required={!formData.isHouseholdHead}
                          />
                        </div>
                        <div>
                          <Label htmlFor="relationshipToHead" className="text-sm font-medium text-gray-700">
                            Relationship *
                          </Label>
                          <Input
                            id="relationshipToHead"
                            value={formData.relationshipToHead}
                            onChange={(e) => handleInputChange("relationshipToHead", e.target.value)}
                            className="mt-1"
                            required={!formData.isHouseholdHead}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">4p's Beneficiary?</Label>
                      <RadioGroup
                        value={formData.is4psBeneficiary.toString()}
                        onValueChange={(value) => handleInputChange("is4psBeneficiary", value === "true")}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="4psYes" />
                          <Label htmlFor="4psYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="4psNo" />
                          <Label htmlFor="4psNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Member of Indigenous Group?</Label>
                      <RadioGroup
                        value={formData.isIndigenousMember.toString()}
                        onValueChange={(value) => handleInputChange("isIndigenousMember", value === "true")}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="indigenousYes" />
                          <Label htmlFor="indigenousYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="indigenousNo" />
                          <Label htmlFor="indigenousNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Member of any farmer's Cooperative?</Label>
                      <RadioGroup
                        value={formData.isFarmerCoopMember.toString()}
                        onValueChange={(value) => handleInputChange("isFarmerCoopMember", value === "true")}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="coopYes" />
                          <Label htmlFor="coopYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="coopNo" />
                          <Label htmlFor="coopNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">With Government ID?</Label>
                      <RadioGroup
                        value={formData.hasGovernmentId.toString()}
                        onValueChange={(value) => handleInputChange("hasGovernmentId", value === "true")}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="govIdYes" />
                          <Label htmlFor="govIdYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="govIdNo" />
                          <Label htmlFor="govIdNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {formData.hasGovernmentId && (
                      <>
                        <div>
                          <Label htmlFor="governmentIdType" className="text-sm font-medium text-gray-700">
                            If Yes, specify ID Type:
                          </Label>
                          <Select
                            value={formData.governmentIdType}
                            onValueChange={(value) => handleInputChange("governmentIdType", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PhilID">PhilID</SelectItem>
                              <SelectItem value="Driver's License">Driver's License</SelectItem>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="SSS ID">SSS ID</SelectItem>
                              <SelectItem value="GSIS ID">GSIS ID</SelectItem>
                              <SelectItem value="Voter's ID">Voter's ID</SelectItem>
                              <SelectItem value="Senior Citizen ID">Senior Citizen ID</SelectItem>
                              <SelectItem value="PWD ID">PWD ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="governmentIdNumber" className="text-sm font-medium text-gray-700">
                            ID Number:
                          </Label>
                          <Input
                            id="governmentIdNumber"
                            value={formData.governmentIdNumber}
                            onChange={(e) => handleInputChange("governmentIdNumber", e.target.value)}
                            className="mt-1"
                            required={formData.hasGovernmentId}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="step2" className="p-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">PART II: FARM PROFILE</h3>
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Main Livelihood</Label>
                      <RadioGroup
                        value={formData.mainLivelihood}
                        onValueChange={(value: "Farmer" | "Farmworker/Laborer" | "Fisherfolk" | "Agri Youth") =>
                          handleInputChange("mainLivelihood", value)
                        }
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Farmer" id="livelihoodFarmer" />
                          <Label htmlFor="livelihoodFarmer">Farmer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Farmworker/Laborer" id="livelihoodFarmworker" />
                          <Label htmlFor="livelihoodFarmworker">Farmworker/Laborer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Fisherfolk" id="livelihoodFisherfolk" />
                          <Label htmlFor="livelihoodFisherfolk">Fisherfolk</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Agri Youth" id="livelihoodAgriYouth" />
                          <Label htmlFor="livelihoodAgriYouth">Agri Youth</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {formData.mainLivelihood === "Farmer" && (
                      <div className="space-y-4 border p-4 rounded-md">
                        <h4 className="font-medium">For farmers:</h4>
                        <Label className="text-sm font-medium text-gray-700">Type of Farming Activity</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="farmingRice"
                              checked={formData.farmingActivity?.includes("Rice")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("farmingActivity", "Rice", checked as boolean)
                              }
                            />
                            <Label htmlFor="farmingRice">Rice</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="farmingCorn"
                              checked={formData.farmingActivity?.includes("Corn")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("farmingActivity", "Corn", checked as boolean)
                              }
                            />
                            <Label htmlFor="farmingCorn">Corn</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="farmingOtherCrops"
                              checked={formData.farmingActivity?.includes("Other crops")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("farmingActivity", "Other crops", checked as boolean)
                              }
                            />
                            <Label htmlFor="farmingOtherCrops">Other crops, please specify:</Label>
                          </div>
                          {formData.farmingActivity?.includes("Other crops") && (
                            <Input
                              value={formData.otherCropsSpecify}
                              onChange={(e) => handleInputChange("otherCropsSpecify", e.target.value)}
                              placeholder="Specify other crops"
                            />
                          )}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="farmingLivestock"
                              checked={formData.farmingActivity?.includes("Livestock")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("farmingActivity", "Livestock", checked as boolean)
                              }
                            />
                            <Label htmlFor="farmingLivestock">Livestock, please specify:</Label>
                          </div>
                          {formData.farmingActivity?.includes("Livestock") && (
                            <Input
                              value={formData.livestockSpecify}
                              onChange={(e) => handleInputChange("livestockSpecify", e.target.value)}
                              placeholder="Specify livestock"
                            />
                          )}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="farmingPoultry"
                              checked={formData.farmingActivity?.includes("Poultry")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("farmingActivity", "Poultry", checked as boolean)
                              }
                            />
                            <Label htmlFor="farmingPoultry">Poultry, please specify:</Label>
                          </div>
                          {formData.farmingActivity?.includes("Poultry") && (
                            <Input
                              value={formData.poultrySpecify}
                              onChange={(e) => handleInputChange("poultrySpecify", e.target.value)}
                              placeholder="Specify poultry"
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {formData.mainLivelihood === "Farmworker/Laborer" && (
                      <div className="space-y-4 border p-4 rounded-md">
                        <h4 className="font-medium">For farmworkers:</h4>
                        <Label className="text-sm font-medium text-gray-700">Kind of Work</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="workLandPrep"
                              checked={formData.kindOfWork?.includes("Land Preparation")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("kindOfWork", "Land Preparation", checked as boolean)
                              }
                            />
                            <Label htmlFor="workLandPrep">Land Preparation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="workPlanting"
                              checked={formData.kindOfWork?.includes("Planting/Transplanting")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("kindOfWork", "Planting/Transplanting", checked as boolean)
                              }
                            />
                            <Label htmlFor="workPlanting">Planting/Transplanting</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="workCultivation"
                              checked={formData.kindOfWork?.includes("Cultivation")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("kindOfWork", "Cultivation", checked as boolean)
                              }
                            />
                            <Label htmlFor="workCultivation">Cultivation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="workHarvesting"
                              checked={formData.kindOfWork?.includes("Harvesting")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("kindOfWork", "Harvesting", checked as boolean)
                              }
                            />
                            <Label htmlFor="workHarvesting">Harvesting</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="workOthers"
                              checked={formData.kindOfWork?.includes("others")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("kindOfWork", "others", checked as boolean)
                              }
                            />
                            <Label htmlFor="workOthers">others, please specify:</Label>
                          </div>
                          {formData.kindOfWork?.includes("others") && (
                            <Input
                              value={formData.kindOfWorkSpecify}
                              onChange={(e) => handleInputChange("kindOfWorkSpecify", e.target.value)}
                              placeholder="Specify other work"
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {formData.mainLivelihood === "Fisherfolk" && (
                      <div className="space-y-4 border p-4 rounded-md">
                        <h4 className="font-medium">For fisherfolk:</h4>
                        <p className="text-sm text-gray-600">
                          The Lending Conduit shall coordinate with the Bureau of Fisheries and Aquatic Resources (BFAR)
                          in the issuance of a certification that the fisherfolk-borrower under PUNLA/PLE is registered
                          under the Municipal Registration (FishR).
                        </p>
                        <Label className="text-sm font-medium text-gray-700">Type of Fishing Activity</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingCapture"
                              checked={formData.fishingActivity?.includes("Fish Capture")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Fish Capture", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingCapture">Fish Capture</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingProcessing"
                              checked={formData.fishingActivity?.includes("Fish Processing")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Fish Processing", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingProcessing">Fish Processing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingAquaculture"
                              checked={formData.fishingActivity?.includes("Aquaculture")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Aquaculture", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingAquaculture">Aquaculture</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingVending"
                              checked={formData.fishingActivity?.includes("Fish Vending")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Fish Vending", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingVending">Fish Vending</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingGleaning"
                              checked={formData.fishingActivity?.includes("Gleaning")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Gleaning", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingGleaning">Gleaning</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fishingOthers"
                              checked={formData.fishingActivity?.includes("Others")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("fishingActivity", "Others", checked as boolean)
                              }
                            />
                            <Label htmlFor="fishingOthers">Others, specify:</Label>
                          </div>
                          {formData.fishingActivity?.includes("Others") && (
                            <Input
                              value={formData.fishingActivitySpecify}
                              onChange={(e) => handleInputChange("fishingActivitySpecify", e.target.value)}
                              placeholder="Specify other fishing activity"
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {formData.mainLivelihood === "Agri Youth" && (
                      <div className="space-y-4 border p-4 rounded-md">
                        <h4 className="font-medium">For agri youth:</h4>
                        <p className="text-sm text-gray-600">
                          For the purposes of trainings, financial assistance, and other programs catered to the youth
                          with involvement to any agriculture activity.
                        </p>
                        <Label className="text-sm font-medium text-gray-700">Type of involvement</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="involvementHousehold"
                              checked={formData.typeOfInvolvement?.includes("part of a farming household")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "typeOfInvolvement",
                                  "part of a farming household",
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor="involvementHousehold">part of a farming household</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="involvementAttending"
                              checked={formData.typeOfInvolvement?.includes(
                                "attending/attended formal agri-fishery related course",
                              )}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "typeOfInvolvement",
                                  "attending/attended formal agri-fishery related course",
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor="involvementAttending">
                              attending/attended formal agri-fishery related course
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="involvementNonFormal"
                              checked={formData.typeOfInvolvement?.includes(
                                "attending/attended non-formal agri-fishery related course",
                              )}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "typeOfInvolvement",
                                  "attending/attended non-formal agri-fishery related course",
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor="involvementNonFormal">
                              attending/attended non-formal agri-fishery related course
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="involvementParticipated"
                              checked={formData.typeOfInvolvement?.includes(
                                "participated in any agricultural activity/program",
                              )}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "typeOfInvolvement",
                                  "participated in any agricultural activity/program",
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor="involvementParticipated">
                              participated in any agricultural activity/program
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="involvementOthers"
                              checked={formData.typeOfInvolvement?.includes("others,specify")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("typeOfInvolvement", "others,specify", checked as boolean)
                              }
                            />
                            <Label htmlFor="involvementOthers">others,specify</Label>
                          </div>
                          {formData.typeOfInvolvement?.includes("others,specify") && (
                            <Input
                              value={formData.typeOfInvolvementSpecify}
                              onChange={(e) => handleInputChange("typeOfInvolvementSpecify", e.target.value)}
                              placeholder="Specify other involvement"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Gross Annual Income Last Year:</h3>
                    <div>
                      <Label htmlFor="grossAnnualIncomeFarming" className="text-sm font-medium text-gray-700">
                        Farming:
                      </Label>
                      <Input
                        id="grossAnnualIncomeFarming"
                        type="number"
                        value={formData.grossAnnualIncomeFarming}
                        onChange={(e) =>
                          handleInputChange("grossAnnualIncomeFarming", Number.parseFloat(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="grossAnnualIncomeNonFarming" className="text-sm font-medium text-gray-700">
                        Non-farming:
                      </Label>
                      <Input
                        id="grossAnnualIncomeNonFarming"
                        type="number"
                        value={formData.grossAnnualIncomeNonFarming}
                        onChange={(e) =>
                          handleInputChange("grossAnnualIncomeNonFarming", Number.parseFloat(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="step3" className="p-1">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Farm Parcels</h3>
                  {formData.farmParcels.map((parcel, index) => (
                    <div key={parcel.id} className="border p-4 rounded-md space-y-4 relative">
                      <h4 className="font-medium text-gray-700">Farm Parcel {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFarmParcel(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove parcel</span>
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`farmLocation-${index}`} className="text-sm font-medium text-gray-700">
                            Farm Location *
                          </Label>
                          <Input
                            id={`farmLocation-${index}`}
                            value={parcel.farmLocation}
                            onChange={(e) => handleParcelChange(index, "farmLocation", e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`totalFarmArea-${index}`} className="text-sm font-medium text-gray-700">
                            Total Farm Area (in hectares) *
                          </Label>
                          <Input
                            id={`totalFarmArea-${index}`}
                            type="number"
                            step="0.01"
                            value={parcel.totalFarmArea}
                            onChange={(e) =>
                              handleParcelChange(index, "totalFarmArea", Number.parseFloat(e.target.value))
                            }
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Within Ancestral Domain?</Label>
                          <RadioGroup
                            value={parcel.withinAncestralDomain.toString()}
                            onValueChange={(value) =>
                              handleParcelChange(index, "withinAncestralDomain", value === "true")
                            }
                            className="flex space-x-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`ancestralYes-${index}`} />
                              <Label htmlFor={`ancestralYes-${index}`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`ancestralNo-${index}`} />
                              <Label htmlFor={`ancestralNo-${index}`}>No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label htmlFor={`ownershipDocumentNo-${index}`} className="text-sm font-medium text-gray-700">
                            Ownership Document No.
                          </Label>
                          <Input
                            id={`ownershipDocumentNo-${index}`}
                            value={parcel.ownershipDocumentNo}
                            onChange={(e) => handleParcelChange(index, "ownershipDocumentNo", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ownershipType-${index}`} className="text-sm font-medium text-gray-700">
                            Ownership Type:
                          </Label>
                          <Select
                            value={parcel.ownershipType}
                            onValueChange={(value) => handleParcelChange(index, "ownershipType", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select ownership type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Registered Owner">Registered Owner</SelectItem>
                              <SelectItem value="Tenant">Tenant</SelectItem>
                              <SelectItem value="Lessee">Lessee (Name of Land Owner)</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Agrarian Reform Beneficiary?</Label>
                          <RadioGroup
                            value={parcel.agrarianReformBeneficiary.toString()}
                            onValueChange={(value) =>
                              handleParcelChange(index, "agrarianReformBeneficiary", value === "true")
                            }
                            className="flex space-x-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`arbYes-${index}`} />
                              <Label htmlFor={`arbYes-${index}`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`arbNo-${index}`} />
                              <Label htmlFor={`arbNo-${index}`}>No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label htmlFor={`cropCommodity-${index}`} className="text-sm font-medium text-gray-700">
                            Crop/Commodity (Rice/Corn/HVC/Livestock/Poultry/Agri-fishery) *
                          </Label>
                          <Input
                            id={`cropCommodity-${index}`}
                            value={parcel.cropCommodity}
                            onChange={(e) => handleParcelChange(index, "cropCommodity", e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sizeUnit-${index}`} className="text-sm font-medium text-gray-700">
                            Size Unit *
                          </Label>
                          <Select
                            value={parcel.sizeUnit}
                            onValueChange={(value) => handleParcelChange(index, "sizeUnit", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hectares">hectares</SelectItem>
                              <SelectItem value="sqm">sqm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`numberOfHeads-${index}`} className="text-sm font-medium text-gray-700">
                            No. of Head (for Livestock and Poultry)
                          </Label>
                          <Input
                            id={`numberOfHeads-${index}`}
                            type="number"
                            value={parcel.numberOfHeads}
                            onChange={(e) =>
                              handleParcelChange(index, "numberOfHeads", Number.parseInt(e.target.value))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`farmType-${index}`} className="text-sm font-medium text-gray-700">
                            Farm Type **
                          </Label>
                          <Select
                            value={parcel.farmType}
                            onValueChange={(value) => handleParcelChange(index, "farmType", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select farm type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Irrigated">1 - Irrigated</SelectItem>
                              <SelectItem value="Rainfed Upland">2 - Rainfed Upland</SelectItem>
                              <SelectItem value="Rainfed Lowland">3 - Rainfed Lowland</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Organic Practitioner (Y/N)</Label>
                          <RadioGroup
                            value={parcel.organicPractitioner.toString()}
                            onValueChange={(value) =>
                              handleParcelChange(index, "organicPractitioner", value === "true")
                            }
                            className="flex space-x-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`organicYes-${index}`} />
                              <Label htmlFor={`organicYes-${index}`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`organicNo-${index}`} />
                              <Label htmlFor={`organicNo-${index}`}>No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="col-span-full">
                          <Label htmlFor={`remarks-${index}`} className="text-sm font-medium text-gray-700">
                            Remarks
                          </Label>
                          <Textarea
                            id={`remarks-${index}`}
                            value={parcel.remarks}
                            onChange={(e) => handleParcelChange(index, "remarks", e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFarmParcel} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" /> Add Farm Parcel
                  </Button>
                </div>
              </TabsContent>
            </form>
          </ScrollArea>
          <DialogFooter className="gap-2 mt-4">
            {currentStep !== "step1" && (
              <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
            )}
            {currentStep !== "step3" && (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Save & Next
              </Button>
            )}
            {currentStep === "step3" && (
              <Button
                type="submit"
                form="create-farmer-form"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save & Done"}
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
