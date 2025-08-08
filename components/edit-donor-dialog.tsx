"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateDonor } from "@/redux/features/donor-slice"
import type { RootState, AppDispatch } from "@/redux/store"
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
import { format, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const cities = ["Gilgit", "Nagar", "Astore", "Skardu", "Hunza", "Ghizer", "Chilas", "Haramush"]
const donationStatuses = ["Active", "Inactive"]

type EditDonorDialogProps = {
  donorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditDonorDialog({ donorId, open, onOpenChange }: EditDonorDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { donors, loading } = useSelector((state: RootState) => state.donors)
  const donor = donors.find((d) => d.id === donorId)

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    totalBloodDonate: 0,
    bloodGroup: "",
    age: "",
    city: "",
    address: "",
    contactNumber: "",
    donationStatus: "Inactive",
  })

  const [date, setDate] = useState<Date | undefined>()
  const [justDonated, setJustDonated] = useState(false)


  useEffect(() => {
    if (donor) {
      setFormData({
        fullName: donor.fullName || "",
        fatherName: donor.fatherName || "",
        totalBloodDonate: donor.totalBloodDonate || 0,
        bloodGroup: donor.bloodGroup || "",
        age: donor.age || "",
        city: donor.city || "",
        address: donor.address || "",
        contactNumber: donor.contactNumber || "",
        donationStatus: donor.donationStatus || "Inactive",
      })

      if (donor.lastDonationDate) {
        try {
          setDate(parseISO(donor.lastDonationDate))
        } catch {
          setDate(undefined)
        }
      }

      if (donor.donationStatus === "Active") {
        setJustDonated(true)
      } else {
        setJustDonated(false)
      }
    }
  }, [donor])

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
      setDate(new Date())
      setFormData((prev) => ({ ...prev, donationStatus: "Active" }))
    } else {
      setFormData((prev) => ({ ...prev, donationStatus: "Inactive" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donor) return

    const updatedDonor = {
      id: donor.id,
      ...formData,
      lastDonationDate: date ? format(date, "yyyy-MM-dd") : "",
      donationStatus: justDonated ? "Active" : formData.donationStatus,
    }

    try {
      await dispatch(updateDonor(updatedDonor)).unwrap()
      toast({
        title: "Donor Updated",
        description: "Donor information has been updated successfully",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update donor. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!donor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Blood Donor</DialogTitle>
          <DialogDescription>Update the details of the blood donor.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fatherName"> Father Name</Label>
              <Input
                id="fatherName"
                name="fatherName"
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
                <Label htmlFor="justDonated">This person just donated blood today</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleSelectChange("city", value)}
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
            <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Updating..." : "Update Donor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}