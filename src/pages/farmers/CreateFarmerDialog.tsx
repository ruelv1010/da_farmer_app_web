"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CreateFarmerRequest } from "./Services/FarmerTypes";

interface CreateFarmerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (farmer: CreateFarmerRequest) => void;
}

export default function CreateFarmer({
  open,
  onOpenChange,
  onSuccess,
}: CreateFarmerProps) {
  const [formData, setFormData] = useState<CreateFarmerRequest>({
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateFarmerRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);
      onSuccess?.(formData);
      onOpenChange(false);
      handleReset();
    } catch (error) {
      console.error("Error creating farmer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
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
    });
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Create New Farmer Profile
          </DialogTitle>
          <DialogDescription>
            Fill in the farmer's personal and contact information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} id="create-farmer-form">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="middleName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contactNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contact Number *
                  </Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
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
                  <Label
                    htmlFor="farmerAddress"
                    className="text-sm font-medium text-gray-700"
                  >
                    Farmer Address *
                  </Label>
                  <Textarea
                    id="farmerAddress"
                    value={formData.farmerAddress}
                    onChange={(e) =>
                      handleInputChange("farmerAddress", e.target.value)
                    }
                    className="mt-1"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="civilStatus"
                    className="text-sm font-medium text-gray-700"
                  >
                    Civil Status
                  </Label>
                  <Select
                    value={formData.civilStatus}
                    onValueChange={(value) =>
                      handleInputChange("civilStatus", value)
                    }
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
                  <Label
                    htmlFor="religion"
                    className="text-sm font-medium text-gray-700"
                  >
                    Religion *
                  </Label>
                  <Input
                    id="religion"
                    value={formData.religion}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="emergencyContactPerson"
                    className="text-sm font-medium text-gray-700"
                  >
                    Emergency Contact Person *
                  </Label>
                  <Input
                    id="emergencyContactPerson"
                    value={formData.emergencyContactPerson}
                    onChange={(e) =>
                      handleInputChange(
                        "emergencyContactPerson",
                        e.target.value
                      )
                    }
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Sex
                  </Label>
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
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="placeOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Place of Birth *
                  </Label>
                  <Input
                    id="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={(e) =>
                      handleInputChange("placeOfBirth", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="spouseName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name of Spouse (If Married)
                  </Label>
                  <Input
                    id="spouseName"
                    value={formData.spouseName}
                    onChange={(e) =>
                      handleInputChange("spouseName", e.target.value)
                    }
                    className="mt-1"
                    disabled={formData.civilStatus !== "Married"}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="mothersMaidenName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mother's Maiden Name *
                  </Label>
                  <Input
                    id="mothersMaidenName"
                    value={formData.mothersMaidenName}
                    onChange={(e) =>
                      handleInputChange("mothersMaidenName", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="highestEducation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Highest Formal Education
                  </Label>
                  <Select
                    value={formData.highestEducation}
                    onValueChange={(value) =>
                      handleInputChange("highestEducation", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Vocational">Vocational</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Post Graduate">
                        Post Graduate
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Household Head?
                  </Label>
                  <RadioGroup
                    value={formData.isHouseholdHead.toString()}
                    onValueChange={(value) =>
                      handleInputChange("isHouseholdHead", value === "true")
                    }
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
                      <Label
                        htmlFor="householdHeadName"
                        className="text-sm font-medium text-gray-700"
                      >
                        If NO, Name of Household Head: *
                      </Label>
                      <Input
                        id="householdHeadName"
                        value={formData.householdHeadName}
                        onChange={(e) =>
                          handleInputChange("householdHeadName", e.target.value)
                        }
                        className="mt-1"
                        required={!formData.isHouseholdHead}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="relationshipToHead"
                        className="text-sm font-medium text-gray-700"
                      >
                        Relationship *
                      </Label>
                      <Input
                        id="relationshipToHead"
                        value={formData.relationshipToHead}
                        onChange={(e) =>
                          handleInputChange(
                            "relationshipToHead",
                            e.target.value
                          )
                        }
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
                  <Label className="text-sm font-medium text-gray-700">
                    4p's Beneficiary?
                  </Label>
                  <RadioGroup
                    value={formData.is4psBeneficiary.toString()}
                    onValueChange={(value) =>
                      handleInputChange("is4psBeneficiary", value === "true")
                    }
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
                  <Label className="text-sm font-medium text-gray-700">
                    Member of Indigenous Group?
                  </Label>
                  <RadioGroup
                    value={formData.isIndigenousMember.toString()}
                    onValueChange={(value) =>
                      handleInputChange("isIndigenousMember", value === "true")
                    }
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
                  <Label className="text-sm font-medium text-gray-700">
                    Member of any farmer's Cooperative?
                  </Label>
                  <RadioGroup
                    value={formData.isFarmerCoopMember.toString()}
                    onValueChange={(value) =>
                      handleInputChange("isFarmerCoopMember", value === "true")
                    }
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
                  <Label className="text-sm font-medium text-gray-700">
                    With Government ID?
                  </Label>
                  <RadioGroup
                    value={formData.hasGovernmentId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("hasGovernmentId", value === "true")
                    }
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
                      <Label
                        htmlFor="governmentIdType"
                        className="text-sm font-medium text-gray-700"
                      >
                        If Yes, specify ID Type:
                      </Label>
                      <Select
                        value={formData.governmentIdType}
                        onValueChange={(value) =>
                          handleInputChange("governmentIdType", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PhilID">PhilID</SelectItem>
                          <SelectItem value="Driver's License">
                            Driver's License
                          </SelectItem>
                          <SelectItem value="Passport">Passport</SelectItem>
                          <SelectItem value="SSS ID">SSS ID</SelectItem>
                          <SelectItem value="GSIS ID">GSIS ID</SelectItem>
                          <SelectItem value="Voter's ID">Voter's ID</SelectItem>
                          <SelectItem value="Senior Citizen ID">
                            Senior Citizen ID
                          </SelectItem>
                          <SelectItem value="PWD ID">PWD ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="governmentIdNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        ID Number:
                      </Label>
                      <Input
                        id="governmentIdNumber"
                        value={formData.governmentIdNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "governmentIdNumber",
                            e.target.value
                          )
                        }
                        className="mt-1"
                        required={formData.hasGovernmentId}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-farmer-form"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Farmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
