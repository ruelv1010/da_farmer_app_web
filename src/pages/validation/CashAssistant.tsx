import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sprout, MapPin, Users, Wheat, Search, User } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

// Dummy beneficiary data extracted from the crop service
const beneficiaryData: Beneficiary[] = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    rsbsaNo: "R01-001-001234",
    location: "Barangay San Jose, Nueva Ecija",
    farmSize: "2.5 hectares",
    crops: ["Rice"],
    status: "Active",
  },
  {
    id: 2,
    name: "Maria Santos",
    rsbsaNo: "R01-002-005678",
    location: "Barangay Maligaya, Bulacan",
    farmSize: "1.8 hectares",
    crops: ["Corn"],
    status: "Active",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    rsbsaNo: "R01-003-009012",
    location: "Barangay Bagong Silang, Tarlac",
    farmSize: "3.2 hectares",
    crops: ["Rice"],
    status: "Active",
  },
  {
    id: 4,
    name: "Ana Garcia",
    rsbsaNo: "R01-004-003456",
    location: "Barangay Riverside, Pangasinan",
    farmSize: "0.5 hectares",
    crops: ["Vegetables"],
    status: "Active",
  },
  {
    id: 5,
    name: "Roberto Mendoza",
    rsbsaNo: "R01-005-007890",
    location: "Barangay Central, Isabela",
    farmSize: "4.1 hectares",
    crops: ["Rice"],
    status: "Active",
  },
  {
    id: 6,
    name: "Carmen Lopez",
    rsbsaNo: "R01-006-001122",
    location: "Barangay Malaking Ilog, Cagayan",
    farmSize: "1.5 hectares",
    crops: ["Corn"],
    status: "Inactive",
  },
];

// Types for better TypeScript support
interface Beneficiary {
  id: number;
  name: string;
  rsbsaNo: string;
  location: string;
  farmSize: string;
  crops: string[];
  status: string;
}

interface BeneficiarySelectProps {
  value?: number;
  onChange: (beneficiary: Beneficiary) => void;
  placeholder?: string;
}

// Custom React Select-like component
const BeneficiarySelect: React.FC<BeneficiarySelectProps> = ({
  value,
  onChange,
  placeholder = "Search beneficiary...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBeneficiaries = useMemo(() => {
    if (!searchTerm) return beneficiaryData;

    return beneficiaryData.filter(
      (beneficiary) =>
        beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.rsbsaNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedBeneficiary = beneficiaryData.find((b) => b.id === value);

  const handleSelect = (beneficiary: Beneficiary) => {
    onChange(beneficiary);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div
        className="flex items-center w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none"
          placeholder={
            selectedBeneficiary ? selectedBeneficiary.name : placeholder
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <div className="ml-2 text-gray-400">{isOpen ? "▲" : "▼"}</div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredBeneficiaries.length > 0 ? (
            filteredBeneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(beneficiary)}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {beneficiary.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      RSBSA: {beneficiary.rsbsaNo}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      📍 {beneficiary.location}
                    </div>
                    <div className="text-xs text-gray-500">
                      🌾 {beneficiary.farmSize} • {beneficiary.crops.join(", ")}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      beneficiary.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {beneficiary.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-gray-500">
              No beneficiaries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Component() {
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [formData, setFormData] = useState({
    farmLocation: "",
    farmSize: "",
    ecosystem: "",
    datePlanted: "",
    variety: "",
    organization: "",
  });

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    // Auto-populate form fields based on selected beneficiary
    setFormData((prev) => ({
      ...prev,
      farmLocation: beneficiary.location,
      farmSize: beneficiary.farmSize,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearForm = () => {
    setSelectedBeneficiary(null);
    setFormData({
      farmLocation: "",
      farmSize: "",
      ecosystem: "",
      datePlanted: "",
      variety: "",
      organization: "",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full shadow-lg">
                <Wheat className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Rice Farmers Portal
            </h1>
            <p className="text-gray-600 text-lg">
              Agricultural Data Management System
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <CardTitle className="text-3xl font-bold text-center tracking-wide mb-6">
                  RICE FARMERS CROPPING STATUS
                </CardTitle>
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center space-x-4">
                      <Label
                        htmlFor="cropping-season"
                        className="text-lg font-semibold text-white"
                      >
                        Cropping Season:
                      </Label>
                      <div className="rounded-lg p-2 min-w-[200px]">
                        First Quarter
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Beneficiary Search Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Search Beneficiary
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label
                      htmlFor="beneficiary-search"
                      className="text-base font-medium text-gray-700"
                    >
                      Name of the Beneficiary:
                    </Label>
                    <div className="md:col-span-2">
                      <BeneficiarySelect
                        value={selectedBeneficiary?.id}
                        onChange={handleBeneficiarySelect}
                        placeholder="Search by name, RSBSA number, or location..."
                      />
                    </div>
                  </div>

                  {selectedBeneficiary && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Selected Beneficiary:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Name:</strong> {selectedBeneficiary.name}
                        </div>
                        <div>
                          <strong>RSBSA No:</strong>{" "}
                          {selectedBeneficiary.rsbsaNo}
                        </div>
                        <div>
                          <strong>Location:</strong>{" "}
                          {selectedBeneficiary.location}
                        </div>
                        <div>
                          <strong>Farm Size:</strong>{" "}
                          {selectedBeneficiary.farmSize}
                        </div>
                        <div>
                          <strong>Crops:</strong>{" "}
                          {selectedBeneficiary.crops.join(", ")}
                        </div>
                        <div>
                          <strong>Status:</strong>
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs ${
                              selectedBeneficiary.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {selectedBeneficiary.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Farm Location Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Farm Location & Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <Label
                        htmlFor="farm-location"
                        className="text-base font-medium text-gray-700"
                      >
                        Farm Location:
                      </Label>
                      <div className="md:col-span-2">
                        <Input
                          id="farm-location"
                          value={formData.farmLocation}
                          onChange={(e) =>
                            handleInputChange("farmLocation", e.target.value)
                          }
                          className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                          placeholder="Enter farm address/location"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <Label
                        htmlFor="farm-size"
                        className="text-base font-medium text-gray-700"
                      >
                        Farm Size:
                      </Label>
                      <div className="md:col-span-2">
                        <Input
                          id="farm-size"
                          value={formData.farmSize}
                          onChange={(e) =>
                            handleInputChange("farmSize", e.target.value)
                          }
                          className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                          placeholder="Enter size in hectares"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <Label
                        htmlFor="ecosystem"
                        className="text-base font-medium text-gray-700"
                      >
                        Ecosystem Type:
                      </Label>
                      <div className="md:col-span-2">
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("ecosystem", value)
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg">
                            <SelectValue placeholder="Select ecosystem type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="irrigated">
                              🌊 Irrigated
                            </SelectItem>
                            <SelectItem value="rainfed">🌧️ Rainfed</SelectItem>
                            <SelectItem value="upland">🏔️ Upland</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crop Information Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <Sprout className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Crop Information
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <Label
                        htmlFor="date-planted"
                        className="text-base font-medium text-gray-700"
                      >
                        Date Planted:
                      </Label>
                      <div className="md:col-span-2">
                        <Input
                          id="date-planted"
                          type="date"
                          value={formData.datePlanted}
                          onChange={(e) =>
                            handleInputChange("datePlanted", e.target.value)
                          }
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <Label
                        htmlFor="variety"
                        className="text-base font-medium text-gray-700"
                      >
                        Rice Variety:
                      </Label>
                      <div className="md:col-span-2">
                        <Input
                          id="variety"
                          value={formData.variety}
                          onChange={(e) =>
                            handleInputChange("variety", e.target.value)
                          }
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                          placeholder="Enter rice variety"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Information */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-teal-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Organization Membership
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <Label
                      htmlFor="organization"
                      className="text-base font-medium text-gray-700 leading-tight"
                    >
                      Name of FCA, IA, ARBO, SWISA or any other farmer
                      organization (if member):
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) =>
                          handleInputChange("organization", e.target.value)
                        }
                        className="bg-white border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg"
                        placeholder="Enter organization name or leave blank"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mt-12 space-x-6">
                <Button
                  variant="outline"
                  onClick={handleClearForm}
                  className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
                >
                  Clear Form
                </Button>
                <Button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm">
              Cualbar © 2024 Rice Farmers Agricultural Data Management System
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
