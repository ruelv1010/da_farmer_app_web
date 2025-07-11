"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { cn } from "@/lib/utils"
import { toast, Toaster } from 'sonner';
import type { Farmer, CreateCropDamageReportRequest } from "./Services/FarmerTypes"
import FarmerReportService from "./Services/FarmerReportService"

const formSchema = z.object({
  reportDate: z.date({
    required_error: "Report date is required.",
  }),
  farmParcelId: z.string().optional(), // Stored as string, convert to number for API
  cropType: z.string().min(1, "Crop type is required."),
  damageType: z.string().min(1, "Damage type is required."),
  affectedArea: z.coerce.number().min(0.01, "Affected area must be greater than 0."),
  affectedAreaUnit: z.string().min(1, "Unit is required."),
  estimatedYieldLoss: z.coerce.number().min(0, "Estimated yield loss cannot be negative."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
  interventionsNeeded: z.string().max(500, "Interventions cannot exceed 500 characters.").optional(),
})

interface FarmerReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  farmer: Farmer
  onSuccess: (report: any) => void
}

export default function FarmerReportDialog({ open, onOpenChange, farmer, onSuccess }: FarmerReportDialogProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportDate: new Date(),
      farmParcelId: farmer.farmParcels.length > 0 ? String(farmer.farmParcels[0].id) : undefined,
      cropType: "",
      damageType: "",
      affectedArea: 0,
      affectedAreaUnit: "hectares",
      estimatedYieldLoss: 0,
      description: "",
      interventionsNeeded: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const reportData: CreateCropDamageReportRequest = {
          farmerId: farmer.id,
          farmParcelId: values.farmParcelId ? Number(values.farmParcelId) : undefined,
          reportDate: values.reportDate.toISOString(),
          cropType: values.cropType,
          damageType: values.damageType,
          affectedArea: values.affectedArea,
          affectedAreaUnit: values.affectedAreaUnit,
          estimatedYieldLoss: values.estimatedYieldLoss,
          description: values.description,
          interventionsNeeded: values.interventionsNeeded || "",
        }

        const response = await FarmerReportService.createCropDamageReport(reportData)
        onSuccess(response.data)

          toast.success("Crop Damage Report Submitted")

        onOpenChange(false) // Close dialog on success
        form.reset() // Reset form fields
      } catch (error) {
        console.error("Failed to submit crop damage report:", error)
             toast.error("Failed to submit crop damage report")
      }
    })
  }

  const getFullName = (f: Farmer) => {
    const parts = [f.firstName, f.middleName, f.lastName].filter(Boolean)
    return parts.join(" ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-w-[90vw] w-full h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Crop Damages</DialogTitle>
          <DialogDescription>
            Fill in the details below to report crop damage for {getFullName(farmer)}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Farmer Name</FormLabel>
              <Input id="farmerName" defaultValue={getFullName(farmer)} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">RSBSA No.</FormLabel>
              <Input id="rsbsaNo" defaultValue={farmer.rsbsaNo || "N/A"} readOnly className="col-span-3" />
            </div>

            <FormField
              control={form.control}
              name="reportDate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Report Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-[240px] pl-3 text-sm font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional form fields can be added here */}

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
