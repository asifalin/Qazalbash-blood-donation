"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { fetchDonors } from "@/redux/features/donor-slice"
import { logout } from "@/redux/features/auth-slice"
import dynamic from "next/dynamic"
import DonorFilters from "@/components/donor-filters"
import AddDonorDialog from "@/components/add-donor-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, RefreshCw, Download, UserPlus } from "lucide-react"
import { useState } from "react"
import type { RootState, AppDispatch } from "@/redux/store"
import Image from "next/image"


const DonorList = dynamic(() => import("@/components/donor-list"), { ssr: false })

export default function DashboardPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { loading, error } = useSelector((state: RootState) => state.donors)
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false)
 

  // Load donors when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDonors())
    }
  }, [isAuthenticated, dispatch])

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  const handleRefresh = () => {
    dispatch(fetchDonors())
    toast({
      title: "Refreshed",
      description: "Donor list has been refreshed",
    })
  }

  if (!isAuthenticated) return null

  return (
    <>
      <div className="bg-red-800 hover:bg-red-900 font-bold text-white text-2xl text-center py-4">
        <h1>  
         Qazalbash Blood Donation Gilgit Baltistan
        </h1>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-scroll inline-block">
            Qazalbash Blood Donation ke saath mil kar insaniyat ki khidmat mein kadam uthayein, 
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="md:flex justify-between items-center mb-6">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <Image 
             src="/images/qazalbash-logo.png" 
              alt="Blood Donation Icon" 
              width={100} 
              height={100}
              className="mr-2"
            />
            <h1 className="md:text-2xl text-lg font-bold">Blood Donors</h1>
          </div>
          <div className="flex space-x-2 justify-center">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDonorOpen(true)} className="bg-red-800 hover:bg-red-900 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Donor 
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>

        <DonorFilters />
        
        <div className="pb-4 flex justify-center items-center mb-6">
          <Image 
            src="/images/qazalbash-logo.png" 
            alt="Blood Donation Icon" 
            width={100} 
            height={100}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold text-center text-red-900">
        Qazalbash Blood Donation Donors list Gilgit Baltistan
          </h1>
        </div>
        
        <DonorList />
        <AddDonorDialog open={isAddDonorOpen} onOpenChange={setIsAddDonorOpen} />
      </div>
      
      <div className="bg-red-800 text-white text-center py-2">
        <p>
          &copy; Copyright 2025 by Qazalbash Blood Donation Gilgit Baltistan.
          <span className="block">Design by Asif Ali</span>
        </p>
      </div>
    </>
  )
}
