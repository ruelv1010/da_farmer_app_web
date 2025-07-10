"use client"
import type { Farmer } from "./Services/FarmerTypes"

interface FarmerProfilePrintProps {
  farmer: Farmer
  onClose?: () => void
}

export function FarmerProfilePrint({ farmer, onClose }: FarmerProfilePrintProps) {
  const handlePrint = () => {
    window.print()
  }

  // Helper function to get full name
  const getFullName = (farmer: Farmer) => {
    const parts = [farmer.firstName, farmer.middleName, farmer.lastName].filter(Boolean)
    return parts.join(" ")
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden bg-gray-50 p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">RSBSA Enrollment Form - {getFullName(farmer)}</h2>
        <div className="space-x-2">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Print
          </button>
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Content - Exact RSBSA Form Layout */}
      <div className="max-w-4xl mx-auto p-8 print:p-4 print:max-w-none print:mx-0">
        {/* Header with DA Logo and Version */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">DEPARTMENT OF AGRICULTURE</h1>
              <p className="text-sm font-semibold">ANI AT KITA</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">REVISED VERSION: 03-2021</p>
          </div>
        </div>

        {/* Form Title and Picture Box */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold">RSBSA ENROLLMENT FORM</h2>
          </div>
          <div className="w-32 h-32 border-4 border-black flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-center leading-tight">
              2x2
              <br />
              PICTURE
            </span>
          </div>
        </div>

        {/* Farm Location Section 1 */}
        <div className="border-2 border-black p-4 mb-6">
          <div className="mb-4">
            <span className="font-bold text-lg">Farm Location:</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">BARANGAY</span>
              <div className="border-b-2 border-black h-8 flex items-end pb-1">
                <span className="text-sm">{farmer.farmLocation?.split(",")[0]?.trim() || ""}</span>
              </div>
            </div>
            <div>
              <span className="font-bold">CITY/MUNICIPALITY</span>
              <div className="border-b-2 border-black h-8 flex items-end pb-1">
                <span className="text-sm">{farmer.farmLocation?.split(",")[1]?.trim() || ""}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Within Ancestral Domain:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
            <div>
              <span className="font-bold">Agrarian Reform Beneficiary:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Total Farm Area (in hectares):</span>
              <div className="flex items-center space-x-2 mt-2">
                <div className="border-b-2 border-black w-24 h-8 flex items-end pb-1">
                  <span className="text-sm">{farmer.farmSize || ""}</span>
                </div>
                <span className="font-bold">ha</span>
              </div>
            </div>
            <div>
              <span className="font-bold">Ownership Document No*:</span>
              <div className="border-b-2 border-black h-8 flex items-end pb-1 mt-2">
                <span className="text-sm"></span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="font-bold">Ownership Type:</span>
            <div className="mt-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="font-bold">Registered Owner</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Tenant (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Lessee (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Others:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Farm Location Section 2 (Empty Template) */}
        <div className="border-2 border-black p-4 mb-6">
          <div className="mb-4">
            <span className="font-bold text-lg">Farm Location:</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">BARANGAY</span>
              <div className="border-b-2 border-black h-8"></div>
            </div>
            <div>
              <span className="font-bold">CITY/MUNICIPALITY</span>
              <div className="border-b-2 border-black h-8"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Within Ancestral Domain:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
            <div>
              <span className="font-bold">Agrarian Reform Beneficiary:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Total Farm Area (in hectares):</span>
              <div className="flex items-center space-x-2 mt-2">
                <div className="border-b-2 border-black w-24 h-8"></div>
                <span className="font-bold">ha</span>
              </div>
            </div>
            <div>
              <span className="font-bold">Ownership Document No*:</span>
              <div className="border-b-2 border-black h-8 mt-2"></div>
            </div>
          </div>

          <div className="mb-4">
            <span className="font-bold">Ownership Type:</span>
            <div className="mt-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Registered Owner</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Tenant (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Lessee (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Others:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Farm Location Section 3 (Empty Template) */}
        <div className="border-2 border-black p-4 mb-6">
          <div className="mb-4">
            <span className="font-bold text-lg">Farm Location:</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">BARANGAY</span>
              <div className="border-b-2 border-black h-8"></div>
            </div>
            <div>
              <span className="font-bold">CITY/MUNICIPALITY</span>
              <div className="border-b-2 border-black h-8"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Within Ancestral Domain:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
            <div>
              <span className="font-bold">Agrarian Reform Beneficiary:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="font-bold">Total Farm Area (in hectares):</span>
              <div className="flex items-center space-x-2 mt-2">
                <div className="border-b-2 border-black w-24 h-8"></div>
                <span className="font-bold">ha</span>
              </div>
            </div>
            <div>
              <span className="font-bold">Ownership Document No*:</span>
              <div className="border-b-2 border-black h-8 mt-2"></div>
            </div>
          </div>

          <div className="mb-4">
            <span className="font-bold">Ownership Type:</span>
            <div className="mt-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Registered Owner</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Tenant (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Lessee (Name of Land Owner:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
                <span className="font-bold">)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-bold">Others:</span>
                <div className="border-b border-black flex-1 mx-2 h-6"></div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="font-bold">Within Ancestral Domain:</span>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-bold">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmerProfilePrint
