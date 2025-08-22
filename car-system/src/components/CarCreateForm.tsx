import React, { useState } from "react";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { carService } from "../lib/carService";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";
import { FormSelect } from "./ui/form-select";
import { useNavigate } from "@tanstack/react-router";
import type { DriveType, TransmissionType } from "@/types";

interface Option {
  value: string;
  label: string;
}

const TRANSMISSION_OPTIONS: Option[] = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATIC", label: "Automatic" },
];

const DRIVE_OPTIONS: Option[] = [
  { value: "FWD", label: "Front Wheel Drive" },
  { value: "AWD", label: "All Wheel Drive" },
];

export function CarCreateForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type, file.size);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const formElements = e.currentTarget.elements;

      const carData = {
        make: (formElements.namedItem("make") as HTMLInputElement).value,
        model: (formElements.namedItem("model") as HTMLInputElement).value,
        year: parseInt(
          (formElements.namedItem("year") as HTMLInputElement).value
        ),
        color: (formElements.namedItem("color") as HTMLInputElement).value,
        transmission: (
          formElements.namedItem("transmission") as HTMLInputElement
        ).value as TransmissionType,
        driveType: (formElements.namedItem("driveType") as HTMLInputElement)
          .value as DriveType,
        fuelEfficiency: parseFloat(
          (formElements.namedItem("fuelEfficiency") as HTMLInputElement).value
        ),
        pricePerDay: parseFloat(
          (formElements.namedItem("pricePerDay") as HTMLInputElement).value
        ),
        imageUrl: "",
        isAvailable: true,
      };

      console.log("Submitting car data:", carData);
      console.log("Image file:", imageFile ? imageFile.name : "none");

      // First directly upload the image if it exists
      if (imageFile) {
        try {
          setUploadProgress(10);
          console.log("Uploading image...");
          const imageUrl = await carService.uploadImage(imageFile);
          setUploadProgress(100);
          console.log("Image uploaded successfully:", imageUrl);
          carData.imageUrl = imageUrl;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Continue without image
        }
      }

      // Now create the car with the data and imageUrl if available
      const response = await carService.createCar(carData);

      if (response.success) {
        navigate({ to: "/dashboard" });
        toast.success("Car created successfully");
      } else {
        throw new Error(response.message || "Failed to create car");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white">
              Car Image
            </label>
          </div>
          <div
            className={cn(
              "mt-1 flex justify-center px-6 pt-5 pb-6",
              "border-2 border-dashed rounded-xl",
              "border-gray-200 dark:border-navy-700",
              "hover:border-blue-500 dark:hover:border-blue-400",
              "transition-colors",
              "bg-gray-50 dark:bg-navy-900/50"
            )}
          >
            <div className="space-y-3 text-center">
              {imagePreview ? (
                <div className="relative h-48 w-full mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg object-contain h-full w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop your image here, or
                  </p>
                </div>
              )}
              <div className="flex justify-center text-sm">
                <label
                  className={cn(
                    "relative cursor-pointer rounded-md font-medium",
                    "text-blue-600 dark:text-blue-400",
                    "hover:text-blue-500 dark:hover:text-blue-300",
                    "focus-within:outline-none focus-within:ring-2",
                    "focus-within:ring-blue-500 dark:focus-within:ring-blue-400",
                    "focus-within:ring-offset-2"
                  )}
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="image"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Make"
              name="make"
              required
              placeholder="e.g., Toyota"
            />
            <Input
              label="Model"
              name="model"
              required
              placeholder="e.g., Camry"
            />
            <Input
              label="Year"
              name="year"
              type="number"
              min="1900"
              max="2025"
              required
              placeholder="e.g., 2023"
            />
            <Input
              label="Color"
              name="color"
              required
              placeholder="e.g., Silver"
            />
          </div>
        </div>

        {/* Technical Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Technical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Transmission"
              name="transmission"
              required
              options={TRANSMISSION_OPTIONS}
            />
            <FormSelect
              label="Drive Type"
              name="driveType"
              required
              options={DRIVE_OPTIONS}
            />
            <Input
              label="Fuel Efficiency (MPG)"
              name="fuelEfficiency"
              type="number"
              step="0.1"
              required
              placeholder="e.g., 25.5"
            />
            <Input
              label="Price Per Day ($)"
              name="pricePerDay"
              type="number"
              step="0.01"
              required
              placeholder="e.g., 50.00"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating...</span>
              </div>
            ) : (
              "Create Car"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
