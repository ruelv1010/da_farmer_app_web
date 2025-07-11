//guide 2
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, MapPin, Calendar, FileText, Leaf, Users, Award, MessageSquare } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

// Enhanced beneficiary data structure
interface Beneficiary {
  id: number;
  name: string;
  rsbsaNo: string;
  location: string;
  farmSize: string;
  ecosystem: string;
  variety: string;
  status: 'active' | 'inactive';
  organization: string;
  interventions: string[];
  lastReportDate: string;
  cropType: string;
  damageHistory: string[];
}

// Convert crop damage report data to beneficiary data
const mockBeneficiaries: Beneficiary[] = [
  {
    id: 1,
    name: "Juan Carlos Dela Cruz",
    rsbsaNo: "R10-01-001-0001-2024",
    location: "Barangay San Jose, Nueva Ecija",
    farmSize: "2.5 hectares",
    ecosystem: "irrigated",
    variety: "PSB Rc82",
    status: "active",
    organization: "San Jose Farmers Cooperative",
    interventions: ["Seed Distribution", "Fertilizer Subsidy", "Training Programs"],
    lastReportDate: "2024-06-02",
    cropType: "Rice",
    damageHistory: ["Pest Infestation", "Drought"]
  },
  {
    id: 2,
    name: "Maria Santos Rivera",
    rsbsaNo: "R10-01-002-0002-2024",
    location: "Barangay Maligaya, Tarlac",
    farmSize: "1.8 hectares",
    ecosystem: "rainfed",
    variety: "NSIC Rc222",
    status: "active",
    organization: "Maligaya Agricultural Association",
    interventions: ["Irrigation Support", "Crop Insurance", "Equipment Lending"],
    lastReportDate: "2024-05-11",
    cropType: "Corn",
    damageHistory: ["Drought", "Flood"]
  },
  {
    id: 3,
    name: "Roberto Magno Flores",
    rsbsaNo: "R10-01-003-0003-2024",
    location: "Barangay Bagong Silang, Bulacan",
    farmSize: "0.8 hectares",
    ecosystem: "upland",
    variety: "Mixed Vegetables",
    status: "active",
    organization: "Bagong Silang Vegetable Growers",
    interventions: ["Greenhouse Construction", "Seed Subsidy", "Market Linkage"],
    lastReportDate: "2024-06-16",
    cropType: "Vegetables",
    damageHistory: ["Flood", "Pest Infestation"]
  },
  {
    id: 4,
    name: "Ana Luz Mercado",
    rsbsaNo: "R10-01-004-0004-2024",
    location: "Barangay Masagana, Pampanga",
    farmSize: "3.2 hectares",
    ecosystem: "irrigated",
    variety: "NSIC Rc160",
    status: "active",
    organization: "Masagana Rice Farmers Association",
    interventions: ["Modern Harvesting Equipment", "Post-Harvest Training"],
    lastReportDate: "2024-06-10",
    cropType: "Rice",
    damageHistory: ["Typhoon Damage"]
  },
  {
    id: 5,
    name: "Pedro Villanueva Cruz",
    rsbsaNo: "R10-01-005-0005-2024",
    location: "Barangay Mabini, Zambales",
    farmSize: "1.5 hectares",
    ecosystem: "rainfed",
    variety: "PSB Rc18",
    status: "inactive",
    organization: "Mabini Farmers Guild",
    interventions: ["Soil Testing", "Organic Fertilizer"],
    lastReportDate: "2024-04-15",
    cropType: "Rice",
    damageHistory: ["Drought", "Soil Degradation"]
  },
  {
    id: 6,
    name: "Luz Marina Fernandez",
    rsbsaNo: "R10-01-006-0006-2024",
    location: "Barangay Rizal, Pangasinan",
    farmSize: "2.0 hectares",
    ecosystem: "irrigated",
    variety: "NSIC Rc238",
    status: "active",
    organization: "Rizal Progressive Farmers",
    interventions: ["Water Management System", "Crop Rotation Training"],
    lastReportDate: "2024-06-20",
    cropType: "Rice",
    damageHistory: ["Bacterial Blight"]
  }
];

interface BeneficiarySelectProps {
  value: Beneficiary | null;
  onChange: (beneficiary: Beneficiary | null) => void;
  placeholder?: string;
}

const BeneficiarySelect: React.FC<BeneficiarySelectProps> = ({ value, onChange, placeholder = "Search beneficiary..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);

  useEffect(() => {
    const filtered = mockBeneficiaries.filter(beneficiary =>
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.rsbsaNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.cropType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeneficiaries(filtered);
  }, [searchTerm]);

  const handleSelect = (beneficiary: Beneficiary) => {
    onChange(beneficiary);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={value ? value.name : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value && value) {
              handleClear();
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            onClick={handleClear}
          >
            ×
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredBeneficiaries.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              No beneficiaries found
            </div>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleSelect(beneficiary)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{beneficiary.name}</div>
                    <div className="text-sm text-gray-600">RSBSA: {beneficiary.rsbsaNo}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {beneficiary.location}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Leaf className="w-3 h-3 mr-1" />
                      {beneficiary.cropType} • {beneficiary.farmSize}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      beneficiary.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {beneficiary.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function FertilizerSubsidy() {
  const [formData, setFormData] = useState({
    validationDate: '',
    beneficiaryName: '',
    rsbsaNo: '',
    isOwner: false,
    isTenant: false,
    ownerName: '',
    farmLocation: '',
    farmSize: '',
    ecosystem: '',
    isActive: false,
    isInactive: false,
    inactiveReason: '',
    variety: '',
    organization: '',
    intervention: '',
    remarks: ''
  });

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  const handleBeneficiarySelect = (beneficiary: Beneficiary | null) => {
    setSelectedBeneficiary(beneficiary);
    if (beneficiary) {
      setFormData(prev => ({
        ...prev,
        beneficiaryName: beneficiary.name,
        rsbsaNo: beneficiary.rsbsaNo,
        farmLocation: beneficiary.location,
        farmSize: beneficiary.farmSize,
        ecosystem: beneficiary.ecosystem,
        variety: beneficiary.variety,
        organization: beneficiary.organization,
        intervention: beneficiary.interventions.join(', '),
        isActive: beneficiary.status === 'active',
        isInactive: beneficiary.status === 'inactive'
      }));
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearForm = () => {
    setFormData({
      validationDate: '',
      beneficiaryName: '',
      rsbsaNo: '',
      isOwner: false,
      isTenant: false,
      ownerName: '',
      farmLocation: '',
      farmSize: '',
      ecosystem: '',
      isActive: false,
      isInactive: false,
      inactiveReason: '',
      variety: '',
      organization: '',
      intervention: '',
      remarks: ''
    });
    setSelectedBeneficiary(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center border-b bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
              <Leaf className="w-8 h-8" />
              RICE FARMERS FERTILIZER SUBSIDY
            </CardTitle>
            <p className="text-lg text-green-100 mt-2">Validation Form</p>
            <div className="flex items-center justify-end mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Label htmlFor="validation-date" className="text-lg font-semibold mr-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date of Validation:
              </Label>
              <Input
                id="validation-date"
                type="date"
                value={formData.validationDate}
                onChange={(e) => handleInputChange('validationDate', e.target.value)}
                className="bg-white border-2 border-white/20 focus:border-white focus:ring-white text-gray-900 w-48"
              />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Beneficiary Search Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Beneficiary Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <Label className="text-base font-medium text-gray-700">
                    Search & Select Beneficiary:
                  </Label>
                  <div className="md:col-span-2">
                    <BeneficiarySelect
                      value={selectedBeneficiary}
                      onChange={handleBeneficiarySelect}
                      placeholder="Search by name, RSBSA number, or location..."
                    />
                  </div>
                </div>

                {selectedBeneficiary && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-3">Selected Beneficiary Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {selectedBeneficiary.name}</div>
                      <div><strong>RSBSA:</strong> {selectedBeneficiary.rsbsaNo}</div>
                      <div><strong>Location:</strong> {selectedBeneficiary.location}</div>
                      <div><strong>Farm Size:</strong> {selectedBeneficiary.farmSize}</div>
                      <div><strong>Crop Type:</strong> {selectedBeneficiary.cropType}</div>
                      <div><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedBeneficiary.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedBeneficiary.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      Name of the Beneficiary:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.beneficiaryName}
                        onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter beneficiary name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      RSBSA No.:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.rsbsaNo}
                        onChange={(e) => handleInputChange('rsbsaNo', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter RSBSA number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Land Ownership Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-800">Land Ownership</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <Label className="text-base font-medium text-gray-700">
                    Land Owner:
                  </Label>
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-6 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="owner"
                          checked={formData.isOwner}
                          onCheckedChange={(checked) => handleInputChange('isOwner', checked as boolean)}
                        />
                        <Label htmlFor="owner" className="text-sm font-medium">
                          Owner
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tenant"
                          checked={formData.isTenant}
                          onCheckedChange={(checked) => handleInputChange('isTenant', checked as boolean)}
                        />
                        <Label htmlFor="tenant" className="text-sm font-medium">
                          Tenant
                        </Label>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-2 block">
                        Name of Owner:
                      </Label>
                      <Input
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter owner's name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Farm Details Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Farm Details</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      Farm Location:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.farmLocation}
                        onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="Enter farm location"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      Farm Size:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.farmSize}
                        onChange={(e) => handleInputChange('farmSize', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="e.g., 2.5 hectares"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      Ecosystem:
                    </Label>
                    <div className="md:col-span-2">
                      <Select value={formData.ecosystem} onValueChange={(value) => handleInputChange('ecosystem', value)}>
                        <SelectTrigger className="bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select ecosystem type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irrigated">Irrigated</SelectItem>
                          <SelectItem value="rainfed">Rainfed</SelectItem>
                          <SelectItem value="upland">Upland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Label className="text-base font-medium text-gray-700">
                      Variety:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.variety}
                        onChange={(e) => handleInputChange('variety', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="Enter variety"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Status Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-800">Farmer Status</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <Label className="text-base font-medium text-gray-700">
                    Status:
                  </Label>
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-6 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="active"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
                        />
                        <Label htmlFor="active" className="text-sm font-medium">
                          Active
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="inactive"
                          checked={formData.isInactive}
                          onCheckedChange={(checked) => handleInputChange('isInactive', checked as boolean)}
                        />
                        <Label htmlFor="inactive" className="text-sm font-medium">
                          Inactive
                        </Label>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-2 block">
                        Reason if inactive:
                      </Label>
                      <Input
                        value={formData.inactiveReason}
                        onChange={(e) => handleInputChange('inactiveReason', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Enter reason for inactive status"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization & Interventions Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Organization & Interventions</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <Label className="text-base font-medium text-gray-700 leading-tight">
                      Name of FCA, IA, ARBO, SWISA or any other farmer organization:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Enter organization name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <Label className="text-base font-medium text-gray-700">
                      Intervention Received from DARO10:
                    </Label>
                    <div className="md:col-span-2">
                      <Input
                        value={formData.intervention}
                        onChange={(e) => handleInputChange('intervention', e.target.value)}
                        className="bg-white border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Enter interventions received"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks Section */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-800">Additional Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <Label className="text-base font-medium text-gray-700">
                    Remarks:
                  </Label>
                  <div className="md:col-span-2">
                    <Textarea
                      value={formData.remarks}
                      onChange={(e) => handleInputChange('remarks', e.target.value)}
                      className="bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 min-h-[100px]"
                      placeholder="Enter any additional remarks or observations..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 pt-6">
                <Button 
                  type="button"
                  onClick={handleClearForm}
                  variant="outline" 
                  className="px-8 py-3 text-lg font-medium bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  Clear Form
                </Button>
                <Button 
                  type="submit"
                  className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Validate & Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </MainLayout>
  );
}