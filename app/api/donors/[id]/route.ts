import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// PUT: Update a donor
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const donor = await request.json()
  const { data, error } = await supabase
    .from('donors')
    .update(donor)
    .eq('id', params.id)
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, donor: data[0] })
}

// DELETE: Remove a donor
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase
    .from('donors')
    .delete()
    .eq('id', params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function GET() {
  const { data, error } = await supabase.from("donors").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    donors: data.map(donor => ({
      id: donor.id,
      fullName: donor.fullname,
      fatherName: donor.fathername,
      bloodGroup: donor.bloodgroup,
      city: donor.city,
      address: donor.address,
      age: donor.age,
      contactNumber: donor.contactnumber,
      donationStatus: donor.donationstatus,
      lastDonationDate: donor.lastdonationdate,
      totalBloodDonate: donor.totalblooddonate,
      createdAt: donor.createdat,
      updatedAt: donor.updatedat,
    }))
  });
}
