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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/layout/MainLayout";

export default function FertilizerSubsidy() {
  return (
    <MainLayout>
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 tracking-wide">
            RICE FARMERS
          </CardTitle>
          <p className="text-lg text-gray-600 mt-1">Validation Form</p>
          <div className="flex items-center justify-end mt-4">
            <Label
              htmlFor="validation-date"
              className="text-lg font-semibold mr-4"
            >
              Date of Validation:
            </Label>
            <div className="border-b-2 border-gray-800 w-48">
              <Input
                id="validation-date"
                type="date"
                className="border-0 border-b-2 border-gray-800 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-600"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
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
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
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
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <Label className="text-base font-medium text-gray-700">
                Land Owner:
              </Label>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-6 bg-gray-200 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner" />
                    <Label htmlFor="owner" className="text-sm font-medium">
                      Owner:
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tenant" />
                    <Label htmlFor="tenant" className="text-sm font-medium">
                      Tenant:
                    </Label>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="owner-name"
                    className="text-sm font-medium text-gray-600 mb-2 block"
                  >
                    Name of Owner:
                  </Label>
                  <Input
                    id="owner-name"
                    className="bg-gray-200 border-gray-300"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

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
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
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
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <Label
                htmlFor="ecosystem"
                className="text-base font-medium text-gray-700"
              >
                Ecosystem (Irrigated, Rainfed, Upland):
              </Label>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger className="bg-gray-200 border-gray-300">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <Label className="text-base font-medium text-gray-700">
                Farmer Status:
              </Label>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-6 bg-gray-200 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="active" />
                    <Label htmlFor="active" className="text-sm font-medium">
                      Active:
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inactive" />
                    <Label htmlFor="inactive" className="text-sm font-medium">
                      Inactive:
                    </Label>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="inactive-reason"
                    className="text-sm font-medium text-gray-600 mb-2 block"
                  >
                    Reason if inactive:
                  </Label>
                  <Input
                    id="inactive-reason"
                    className="bg-gray-200 border-gray-300"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <Label
                htmlFor="variety"
                className="text-base font-medium text-gray-700"
              >
                Variety:
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="variety"
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <Label
                htmlFor="organization"
                className="text-base font-medium text-gray-700 leading-tight"
              >
                Name of FCA, IA, ARBO, SWISA or any other farmer organization,
                if member:
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="organization"
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <Label
                htmlFor="intervention"
                className="text-base font-medium text-gray-700"
              >
                Intervention Received from DARO10:
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="intervention"
                  className="bg-gray-200 border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <Label
                htmlFor="remarks"
                className="text-base font-medium text-gray-700"
              >
                Remarks:
              </Label>
              <div className="md:col-span-2">
                <Textarea
                  id="remarks"
                  className="bg-gray-200 border-gray-300 min-h-[80px]"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <Button variant="outline" className="px-8 bg-transparent">
              Clear Form
            </Button>
            <Button className="px-8">Validate</Button>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
