"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { setFilters, resetFilters } from "@/redux/features/donor-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Filter } from "lucide-react"

const bloodGroups = ["All Blood Groups", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const cities = ["Select city", "Gilgit", "Nagar", "Astore", "Skardu", "Hunza", "Ghizer","Chilas","Haramush"]
const donationStatuses = ["All Donors", "Active", "Inactive"]

export default function DonorFilters() {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [bloodGroup, setBloodGroup] = useState("All Blood Groups")
  const [city, setCity] = useState("Select city")
  const [donationStatus, setDonationStatus] = useState("All Donors")

  const handleApplyFilters = () => {
    dispatch(
      setFilters({
        name,
        bloodGroup,
        city,
        donationStatus,
      }),
    )
  }

  const handleResetFilters = () => {
    setName("")
    setBloodGroup("All Blood Groups")
    setCity("Select city")
    setDonationStatus("All Donors")
    dispatch(resetFilters())
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium">Filter Donors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input placeholder="Search by name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Blood Group</label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger>
                <SelectValue placeholder="All Blood Groups" />
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

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Select value={city} onValueChange={setCity}>
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

          <div>
            <label className="block text-sm font-medium mb-1">Donation Status</label>
            <Select value={donationStatus} onValueChange={setDonationStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Donors" />
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

        <div className="flex mt-4 space-x-2">
          <Button onClick={handleApplyFilters} className="bg-red-800 hover:bg-red-900">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
