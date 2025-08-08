"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonor } from "@/redux/features/donor-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { AppDispatch, RootState } from "@/redux/store"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { CheckCircle } from "lucide-react"


const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const cities = ["Gilgit", "Nagar", "Astore", "Skardu", "Hunza", "Ghizer", "Chilas", "Haramush"]
const donationStatuses = ["Active", "Inactive"]

type AddDonorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDonorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.donors)
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [justDonated, setJustDonated] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    bloodGroup: "",
    age: "",
    city: "",
    address: "",
    contactNumber: "",
    totalBloodDonate: 0,
    donationStatus: "Inactive",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleJustDonatedChange = (checked: boolean) => {
    setJustDonated(checked)
    if (checked) {
      // Set current date if they just donated
      setDate(new Date())
      setFormData((prev) => ({ ...prev, donationStatus: "Active" }))
    } else {
      setFormData((prev) => ({ ...prev, donationStatus: "Inactive" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Map form fields to match the Redux Donor type
    const newDonor = {
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      bloodGroup: formData.bloodGroup,
      age: formData.age,
      city: formData.city,
      address: formData.address,
      contactNumber: formData.contactNumber,
      totalBloodDonate: formData.totalBloodDonate,
      lastDonationDate: date ? format(date, "yyyy-MM-dd") : "",
      donationStatus: formData.donationStatus,
    }

    try {
      // Use Redux async thunk instead of direct Supabase call
      await dispatch(addDonor(newDonor)).unwrap()
      
      toast({
        title: "Donor Added",
        description: justDonated
          ? "New donor added and marked as recently donated"
          : "New donor has been added successfully",
      })

      // Show success popup
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setFormData({
        fullName: "",
        fatherName: "",
        bloodGroup: "",
        age: "",
        city: "",
        address: "",
        contactNumber: "",
        totalBloodDonate: 0,
        donationStatus: "Inactive",
      })
      setDate(new Date())
      setJustDonated(false)

      onOpenChange(false)
    } catch (error) {
      console.error("Error adding donor:", error)
      toast({
        title: "Error",
        description: "Failed to add donor. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Blood Donor</DialogTitle>
            <DialogDescription>Enter the details of the new blood donor.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter donor's full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fatherName">Father Name</Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  placeholder="Enter donor's father name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                    required
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="justDonated"
                    checked={justDonated}
                    onCheckedChange={handleJustDonatedChange}
                    disabled={loading}
                  />
                  <Label htmlFor="justDonated" className="text-sm font-medium">
                    This person just donated blood today
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleSelectChange("city", value)}
                    required
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Last Donation Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        disabled={justDonated || loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalBloodDonate">Total Blood Donate</Label>
                  <Input
                    id="totalBloodDonate"
                    name="totalBloodDonate"
                    // placeholder="Enter contact number"
                    value={formData.totalBloodDonate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="donationStatus">Donation Status</Label>
                  <Select
                    value={formData.donationStatus}
                    onValueChange={(value) => handleSelectChange("donationStatus", value)}
                    required
                    disabled={justDonated || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {donationStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-800 hover:bg-red-900" disabled={loading}>
                {loading ? "Saving..." : "Save Donor"}
              </Button>
            </DialogFooter>
          </form>

        </DialogContent>
      </Dialog>
      {/* Success AlertDialog */}
      <AlertDialog open={showSuccess}>
        <AlertDialogContent className="flex flex-col items-center justify-center py-8">
          <AlertDialogHeader>
            <div className="flex flex-col items-center">
              <CheckCircle className="text-green-500 mb-2" size={48} />
              <AlertDialogTitle>Save successful</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
