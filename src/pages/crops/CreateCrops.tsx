"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import type { CreateCropRequest, Crop } from "./Services/CropTypes";

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

interface CreateEditCropsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (crop: CreateCropRequest | Crop) => void;
  editingCrop?: Crop | null;
}

// Google Maps component
interface GoogleMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCoordinates?: { latitude: number; longitude: number };
  height?: string;
}

function GoogleMap({
  onLocationSelect,
  initialCoordinates,
  height = "400px",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) {
        setError("Google Maps failed to load");
        setIsLoading(false);
        return;
      }

      try {
        // Default to Philippines center
        const defaultCenter = { lat: 14.5995, lng: 120.9842 };
        const center = initialCoordinates
          ? {
              lat: initialCoordinates.latitude,
              lng: initialCoordinates.longitude,
            }
          : defaultCenter;

        // Initialize map
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: initialCoordinates ? 15 : 6,
          center: center,
          mapTypeId: window.google.maps.MapTypeId.HYBRID,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        });

        // Initialize geocoder
        geocoderRef.current = new window.google.maps.Geocoder();

        // Add initial marker if coordinates exist
        if (initialCoordinates) {
          markerRef.current = new window.google.maps.Marker({
            position: center,
            map: mapInstanceRef.current,
            title: "Selected Location",
            draggable: true,
          });

          // Handle marker drag
          markerRef.current.addListener("dragend", (event: any) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              reverseGeocode(lat, lng);
            }
          });
        }

        // Handle map clicks
        mapInstanceRef.current.addListener("click", (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Add new marker
            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: "Selected Location",
              draggable: true,
            });

            // Handle marker drag
            markerRef.current.addListener("dragend", (dragEvent: any) => {
              if (dragEvent.latLng) {
                const dragLat = dragEvent.latLng.lat();
                const dragLng = dragEvent.latLng.lng();
                reverseGeocode(dragLat, dragLng);
              }
            });

            reverseGeocode(lat, lng);
          }
        });

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map");
        setIsLoading(false);
      }
    };

    const reverseGeocode = (lat: number, lng: number) => {
      if (!geocoderRef.current) return;

      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (results: any[] | null, status: any) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address;
            onLocationSelect(lat, lng, address);
          } else {
            onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }
      );
    };

    // Check if Google Maps API key is available
    const apiKey = "AIzaSyAHyGm8x9CWOc1lWw8OzPgtAhk_F12t-ew";
    if (!apiKey) {
      setError("Google Maps API key not configured");
      setIsLoading(false);
      return;
    }

    // Load Google Maps script if not already loaded
    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError("Failed to load Google Maps");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [initialCoordinates, onLocationSelect]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current && window.google?.maps) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(15);

          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Add new marker
          markerRef.current = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: "Current Location",
            draggable: true,
          });

          // Handle marker drag
          markerRef.current.addListener("dragend", (event: any) => {
            if (event.latLng) {
              const dragLat = event.latLng.lat();
              const dragLng = event.latLng.lng();
              if (geocoderRef.current) {
                geocoderRef.current.geocode(
                  { location: { lat: dragLat, lng: dragLng } },
                  (results: any[] | null, status: any) => {
                    if (status === "OK" && results && results[0]) {
                      const address = results[0].formatted_address;
                      onLocationSelect(dragLat, dragLng, address);
                    } else {
                      onLocationSelect(
                        dragLat,
                        dragLng,
                        `${dragLat.toFixed(6)}, ${dragLng.toFixed(6)}`
                      );
                    }
                  }
                );
              }
            }
          });

          // Reverse geocode current location
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results: any[] | null, status: any) => {
                if (status === "OK" && results && results[0]) {
                  const address = results[0].formatted_address;
                  onLocationSelect(lat, lng, address);
                } else {
                  onLocationSelect(
                    lat,
                    lng,
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                  );
                }
              }
            );
          }
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting current location:", error);
        setIsLoading(false);
        let errorMessage = "Unable to get your current location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        alert(errorMessage + " Please select a location on the map.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  if (error) {
    return (
      <div className="space-y-2">
        <Label className="text-base font-medium text-gray-700">
          Farm Location
        </Label>
        <div
          style={{ height, width: "100%" }}
          className="rounded-lg border border-red-300 bg-red-50 flex items-center justify-center"
        >
          <div className="text-center p-4">
            <MapPin className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Map Error</p>
            <p className="text-red-500 text-sm">{error}</p>
            {error.includes("API key") && (
              <p className="text-xs text-red-400 mt-2">
                Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your
                environment variables
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 ">
      <div className="flex justify-between items-center ">
        <Label className="text-base font-medium text-gray-700">
          Select Farm Location
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-1 bg-transparent"
        >
          <Navigation className="h-3 w-3" />
          {isLoading ? "Loading..." : "Use Current Location"}
        </Button>
      </div>
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height, width: "100%" }}
          className="rounded-lg border border-gray-300"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600">
        Click on the map to select farm location, or drag the marker to adjust
        position
      </p>
    </div>
  );
}

export default function CreateEditCropsDialog({
  open,
  onOpenChange,
  onSuccess,
  editingCrop,
}: CreateEditCropsDialogProps) {
  const [formData, setFormData] = useState<CreateCropRequest>({
    cropName: "",
    location: "",
    cropStatus: "Planted",
    plantedDate: "",
    expectedHarvestDate: "",
    variety: "",
    farmSize: "",
    ecosystem: "Irrigated",
    farmerId: undefined,
    notes: "",
    coordinates: undefined,
  });

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editingCrop;

  // Populate form when editing
  useEffect(() => {
    if (editingCrop && open) {
      setFormData({
        cropName: editingCrop.cropName,
        location: editingCrop.location,
        cropStatus: editingCrop.cropStatus,
        plantedDate: editingCrop.plantedDate || "",
        expectedHarvestDate: editingCrop.expectedHarvestDate || "",
        variety: editingCrop.variety || "",
        farmSize: editingCrop.farmSize || "",
        ecosystem: editingCrop.ecosystem || "Irrigated",
        farmerId: editingCrop.farmerId,
        notes: editingCrop.notes || "",
        coordinates: editingCrop.coordinates,
      });
      setSelectedAddress(editingCrop.location);
    } else if (!editingCrop && open) {
      // Reset form for new crop
      handleReset();
    }
  }, [editingCrop, open]);

  const handleInputChange = (field: keyof CreateCropRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedAddress(address);
    handleInputChange("coordinates", { latitude: lat, longitude: lng });

    // Auto-fill location if it's empty
    if (!formData.location) {
      handleInputChange("location", address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Crop ${isEditing ? "updated" : "created"}:`, formData);
      onSuccess?.(formData);
      onOpenChange(false);
      if (!isEditing) {
        handleReset();
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} crop:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      cropName: "",
      location: "",
      cropStatus: "Planted",
      plantedDate: "",
      expectedHarvestDate: "",
      variety: "",
      farmSize: "",
      ecosystem: "Irrigated",
      farmerId: undefined,
      notes: "",
      coordinates: undefined,
    });
    setSelectedAddress("");
  };

  const handleCancel = () => {
    if (!isEditing) {
      handleReset();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Crop Record" : "Create New Crop Record"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the crop information below"
              : "Add a new crop to the farming system"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <form onSubmit={handleSubmit} id="create-edit-crop-form">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="cropName"
                    className="text-base font-medium text-gray-700"
                  >
                    Crops Name *
                  </Label>
                  <Input
                    id="cropName"
                    value={formData.cropName}
                    onChange={(e) =>
                      handleInputChange("cropName", e.target.value)
                    }
                    className="mt-2"
                    placeholder="Enter crop name (e.g., Rice, Corn, Wheat)"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="text-base font-medium text-gray-700"
                  >
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="mt-2"
                    placeholder="Enter farm location or select from map"
                    required
                  />
                  {selectedAddress && formData.location !== selectedAddress && (
                    <div className="mt-1">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-600"
                        onClick={() =>
                          handleInputChange("location", selectedAddress)
                        }
                      >
                        Use selected address: {selectedAddress}
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="cropStatus"
                    className="text-base font-medium text-gray-700"
                  >
                    Crop Status *
                  </Label>
                  <Select
                    value={formData.cropStatus}
                    onValueChange={(value) =>
                      handleInputChange("cropStatus", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planted">Planted</SelectItem>
                      <SelectItem value="Growing">Growing</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Harvested">Harvested</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="plantedDate"
                      className="text-base font-medium text-gray-700"
                    >
                      Planted Date
                    </Label>
                    <Input
                      id="plantedDate"
                      type="date"
                      value={formData.plantedDate}
                      onChange={(e) =>
                        handleInputChange("plantedDate", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="expectedHarvestDate"
                      className="text-base font-medium text-gray-700"
                    >
                      Expected Harvest Date
                    </Label>
                    <Input
                      id="expectedHarvestDate"
                      type="date"
                      value={formData.expectedHarvestDate}
                      onChange={(e) =>
                        handleInputChange("expectedHarvestDate", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="variety"
                    className="text-base font-medium text-gray-700"
                  >
                    Variety
                  </Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) =>
                      handleInputChange("variety", e.target.value)
                    }
                    className="mt-2"
                    placeholder="Enter crop variety"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="farmSize"
                      className="text-base font-medium text-gray-700"
                    >
                      Farm Size
                    </Label>
                    <Input
                      id="farmSize"
                      value={formData.farmSize}
                      onChange={(e) =>
                        handleInputChange("farmSize", e.target.value)
                      }
                      className="mt-2"
                      placeholder="e.g., 2.5 hectares"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="ecosystem"
                      className="text-base font-medium text-gray-700"
                    >
                      Ecosystem
                    </Label>
                    <Select
                      value={formData.ecosystem}
                      onValueChange={(value) =>
                        handleInputChange("ecosystem", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Irrigated">Irrigated</SelectItem>
                        <SelectItem value="Rainfed">Rainfed</SelectItem>
                        <SelectItem value="Upland">Upland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="farmerId"
                    className="text-base font-medium text-gray-700"
                  >
                    Farmer ID (Optional)
                  </Label>
                  <Input
                    id="farmerId"
                    type="number"
                    value={formData.farmerId || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "farmerId",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="mt-2"
                    placeholder="Enter farmer ID if applicable"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="notes"
                    className="text-base font-medium text-gray-700"
                  >
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="mt-2"
                    rows={3}
                    placeholder="Additional notes about the crop..."
                  />
                </div>
              </div>

              {/* Right Column - Google Map */}
              <div className="space-y-4 hidden">
                <GoogleMap
                  onLocationSelect={handleLocationSelect}
                  initialCoordinates={formData.coordinates}
                  height="400px"
                />

                {/* Location Information Card */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {isEditing
                        ? "Editing Crop Information"
                        : "Crop Information"}
                    </h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p>
                        <strong>Name:</strong>{" "}
                        {formData.cropName || "Not specified"}
                      </p>
                      <p>
                        <strong>Status:</strong> {formData.cropStatus}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {formData.location || "Not specified"}
                      </p>
                      {selectedAddress &&
                        selectedAddress !== formData.location && (
                          <p>
                            <strong>Selected Address:</strong> {selectedAddress}
                          </p>
                        )}
                      {formData.coordinates && (
                        <p>
                          <strong>Coordinates:</strong>{" "}
                          {formData.coordinates.latitude.toFixed(6)},{" "}
                          {formData.coordinates.longitude.toFixed(6)}
                        </p>
                      )}
                      <p>
                        <strong>Ecosystem:</strong> {formData.ecosystem}
                      </p>
                      {formData.variety && (
                        <p>
                          <strong>Variety:</strong> {formData.variety}
                        </p>
                      )}
                      {formData.farmSize && (
                        <p>
                          <strong>Farm Size:</strong> {formData.farmSize}
                        </p>
                      )}
                      {formData.plantedDate && (
                        <p>
                          <strong>Planted:</strong>{" "}
                          {new Date(formData.plantedDate).toLocaleDateString()}
                        </p>
                      )}
                      {formData.expectedHarvestDate && (
                        <p>
                          <strong>Expected Harvest:</strong>{" "}
                          {new Date(
                            formData.expectedHarvestDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
            form="create-edit-crop-form"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
              ? "Update Crop"
              : "Save Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
