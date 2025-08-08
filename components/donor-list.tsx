"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Download } from "lucide-react"
import { useState } from "react"
import EditDonorDialog from "./edit-donor-dialog"
import { useDispatch } from "react-redux"
import { deleteDonor, addDonor, fetchDonors } from "@/redux/features/donor-slice"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import type { AppDispatch } from "@/redux/store"
import { differenceInDays, parseISO, isValid } from "date-fns"
import { useEffect } from "react";

type DonorModel ={
  fullname: string
  fathername: string
  totalblooddonate: number
  bloodgroup: string
  age: number
  city: string
  address: string
  contactnumber: string
  lastdonationdate: string
  donationstatus: string
  createdat: string
  updatedat: string
}


export default function DonorList() {
  const { filteredDonors, loading } = useSelector((state: RootState) => state.donors)
  const [editingDonor, setEditingDonor] = useState<string | null>(null)
  const [deletingDonor, setDeletingDonor] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  // Helper to get days since last donation
  const getDaysSinceDonation = (lastDonationDate: string) => {
    try {
      if (!lastDonationDate) return null;
      const parsedDate = parseISO(lastDonationDate);
      if (!isValid(parsedDate)) return null;
      return differenceInDays(new Date(), parsedDate);
    } catch (error) {
      console.error("Error calculating donation day:", error);
      return null;
    }
  };

  // Determine if donor is active based on 90-day rule
  const isDonorActive = (donor: DonorModel) => {
    if (!donor || !donor.donationStatus) return false; // Null/undefined check
    if (donor.donationStatus === "Inactive") return false;

    const days = getDaysSinceDonation(donor.lastDonationDate);
    return days !== null && days < 90;
  };

  // Duration text for active donors
  const getDonationDuration = (lastDonationDate: string) => {
    const days = getDaysSinceDonation(lastDonationDate);
    if (days === null) return "-";
    if (days === 0) return "Just donated today";
    if (days === 1) return "1 day ago";
    if (days < 90) return `${days} days ago`;
    return `${days} days ago (Inactive)`;
  };

  const handleDelete = async () => {
    if (deletingDonor) {
      try {
        await dispatch(deleteDonor(deletingDonor)).unwrap()
        toast({
          title: "Donor Deleted",
          description: "The donor has been removed from the system",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete donor. Please try again.",
          variant: "destructive",
        })
      }
      setDeletingDonor(null)
    }
  }

  const handleEdit = (donorId: string) => {
    setEditingDonor(donorId)
  }

  const handleExportToPDF = () => {
    try {
      import('html2pdf.js').then(html2pdf => {
        const table = document.querySelector('table')
        if (!table) {
          toast({
            title: "Error",
            description: "Could not find table to export",
            variant: "destructive",
          })
          return
        }

        const tableClone = table.cloneNode(true) as HTMLTableElement

        const headerRow = tableClone.querySelector('thead tr')
        const lastHeaderCell = headerRow?.lastElementChild
        if (lastHeaderCell) lastHeaderCell.remove()

        tableClone.querySelectorAll('tbody tr').forEach(row => {
          const lastCell = row.lastElementChild
          if (lastCell) lastCell.remove()

          const statusCell = row.children[8] as HTMLElement;
          if (statusCell) {
            const badgeText = statusCell.textContent?.trim();
            const isActive = badgeText === 'Active';

            const bgColor = isActive ? '#ef4444' : '#ffffff';
            const textColor = isActive ? '#ffffff' : '#1f2937';

            const textLen = badgeText ? badgeText.length : 0;
            const textWidth = Math.max(textLen * 7 + 10, 60);
            const badgeHeight = 24;

            const svgContent = `
              <svg width="${textWidth}" height="${badgeHeight}" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="${textWidth}" height="${badgeHeight}" rx="9999" ry="9999" fill="${bgColor}" style="stroke: ${isActive ? 'none' : '#e5e7eb'}; stroke-width: ${isActive ? '0' : '1'};"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${badgeText}</text>
              </svg>
            `;

            const encodedSvg = encodeURIComponent(svgContent);
            statusCell.innerHTML = `<img src="data:image/svg+xml;charset=utf-8,${encodedSvg}" style="display: block; margin: 0 auto;" alt="${badgeText} Status"/>`;
          }
        })

        const htmlContent = `
          <html>
            <head>
              <title>Qazalbash Blood Donation Donors list Gilgit Baltistan</title>
              <style>
                html, body { box-sizing: border-box; height: auto; min-height: 100%; }
                body { font-family: Arial, sans-serif; margin: 0; padding-bottom: 100px; height: 4000px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .footer {
                  text-align: center;
                  margin-top: 40px;
                  font-size: 10px; 
                  border-top: 1px solid #ddd;
                  padding-top: 10px;
                  min-height: 50px; 
                }
                th, td {
                  vertical-align: middle;
                  padding: 8px !important;
                  text-align: center;
                }
                td:nth-child(2),
                td:nth-child(4),
                td:nth-child(5)
                {
                  text-align: left; 
                }
                td img {
                  display: block !important;
                  margin: 0 auto !important;
                  vertical-align: middle;
                }
                td:first-child {
                  width: 50px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="font-size: 24px; margin-bottom: 5px;">Qazalbash Blood Donation Donors list</h1>
                <h2 style="font-size: 20px; margin-top: 0;">Gilgit Baltistan</h2>
              </div>
              ${tableClone.outerHTML}
              <div class="footer pdf-footer">
                <p>&copy; ${new Date().getFullYear()} Qazalbash Blood Donation Gilgit Baltistan. Designed by Asif Ali</p>
              </div>
            </body>
          </html>
        `

        const pdfOptions = {
          margin: [10, 10, 80, 10],
          filename: 'Raha_Khuda_Donors_List.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 3,
            logging: true,
            dpi: 300,
            letterRendering: true,
            useCORS: true,
            windowWidth: 1200,
            windowHeight: 3500,
            allowTaint: true,
            ignoreElements: (element: HTMLElement) => {
              return element.classList.contains('no-pdf-export');
            }
          },
          jsPDF: {
            unit: 'pt',
            format: 'a4',
            orientation: 'landscape',
            compress: true
          },
        }

        html2pdf.default().from(htmlContent).set(pdfOptions).save()

        toast({
          title: "Export Successful",
          description: "The donor list has been downloaded as a PDF file.",
        })
      }).catch(error => {
        console.error("Error loading html2pdf.js:", error);
        toast({
          title: "Error",
          description: "Failed to load PDF export functionality.",
          variant: "destructive",
        });
      });

    } catch (error) {
      console.error("Error exporting to PDF:", error)
      toast({
        title: "Error",
        description: "Failed to export to PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  // Filter unique donors by id to avoid duplicate key errors
  const uniqueDonors = filteredDonors.filter(
    (donor, index, self) => index === self.findIndex(d => d.id === donor.id)
  );

  if (loading && filteredDonors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading donors...</div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Father Name</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Total blood Donate</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueDonors.length > 0 ? (
              uniqueDonors.map((donor: DonorModel, index: number) => {
                if (!donor) return null; // Null check
                const active = isDonorActive(donor);
                const daysSinceDonation = getDaysSinceDonation(donor.lastDonationDate || "");
                const isRedBadge = active;

                return (

                  <TableRow
                    key={donor.id}
                    className={active ? "bg-red-50 hover:bg-red-100" : "bg-white hover:bg-gray-50"}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {donor.fullName}
                      </div>
                    </TableCell>
                    <TableCell>{donor.fatherName}</TableCell>
                    <TableCell>{donor.bloodGroup}</TableCell>
                    <TableCell>{donor.city}</TableCell>
                    <TableCell>{donor.address}</TableCell>
                    <TableCell>
                      {active ? donor.lastDonationDate || "-" : "-"}
                    </TableCell>
                    <TableCell>
                      {active ? (donor.lastDonationDate ? getDonationDuration(donor.lastDonationDate) : "-") : "-"}
                    </TableCell>
                    <TableCell>{donor.age}</TableCell>

                    <TableCell>
                      <Badge
                        variant={isRedBadge ? "destructive" : "outline"}
                        className={isRedBadge ? "bg-red-800 hover:bg-red-900" : ""}
                      >
                        {active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{donor.contactNumber}</TableCell>
                    <TableCell>{donor.totalBloodDonate}</TableCell>


                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(donor.id)} disabled={loading}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingDonor(donor.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  No donors found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleExportToPDF}
          className="bg-red-800 hover:bg-red-900 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      {editingDonor && (
        <EditDonorDialog
          donorId={editingDonor}
          open={!!editingDonor}
          onOpenChange={(open) => {
            if (!open) setEditingDonor(null)
          }}
        />
      )}

      <AlertDialog open={!!deletingDonor} onOpenChange={(open: boolean) => !open && setDeletingDonor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the donor from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}