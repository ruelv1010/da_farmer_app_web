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
import { Sprout, MapPin, Users, Wheat } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";


export default function Component() {
    const [date, setDate] = useState<Date | undefined>(new Date())
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rice Farmers Portal</h1>
          <p className="text-gray-600 text-lg">Agricultural Data Management System</p>
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
                    <div className="bg-white/90 rounded-lg p-2 min-w-[200px]">
                    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal border-0 bg-transparent text-gray-800 placeholder-gray-500 focus-visible:ring-0"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span>Pick a season month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <Label
                    htmlFor="beneficiary-name"
                    className="text-base font-medium text-gray-700"
                  >
                    Name of the Beneficiary:
                  </Label>
                  <div className="md:col-span-2">
                    <Input
                      id="beneficiary-name"
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <Sprout className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Registration Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <Label
                    htmlFor="rsbsa-no"
                    className="text-base font-medium text-gray-700"
                  >
                    RSBSA No.:
                  </Label>
                  <div className="md:col-span-2">
                    <Input
                      id="rsbsa-no"
                      className="bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg"
                      placeholder="Enter RSBSA number"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Location Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Farm Location & Details</h3>
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
                      <Select>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg">
                          <SelectValue placeholder="Select ecosystem type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irrigated">🌊 Irrigated</SelectItem>
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
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Crop Information</h3>
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
                  <h3 className="text-lg font-semibold text-gray-800">Organization Membership</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <Label
                    htmlFor="organization"
                    className="text-base font-medium text-gray-700 leading-tight"
                  >
                    Name of FCA, IA, ARBO, SWISA or any other farmer organization (if member):
                  </Label>
                  <div className="md:col-span-2">
                    <Input
                      id="organization"
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
                className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
              >
                Clear Form
              </Button>
              <Button 
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">© 2024 Rice Farmers Agricultural Data Management System</p>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}