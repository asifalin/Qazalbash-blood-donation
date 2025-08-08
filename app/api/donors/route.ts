import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// 🔧 Helper to extract ID from URL
const getIdFromUrl = (request: NextRequest) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1]; // last segment assumed to be ID
};

type Donor = {
  id?: string;
  name?: string;
  blood_group?: string;
  city?: string;
  address?: string;
  age?: number;
  contact?: string;
  donationStatus?: string;
  lastDonationDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

// 🔄 Helper to calculate days since donation
function getDaysSinceDonation(dateString?: string): number | null {
  if (!dateString) return null;
  const lastDate = new Date(dateString);
  if (isNaN(lastDate.getTime())) return null;
  const now = new Date();
  const diff = now.getTime() - lastDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ✅ Check if donor is active
const isDonorActive = (donor: Donor): boolean => {
  if (!donor || donor.donationStatus === "Inactive") return false;
  const days = getDaysSinceDonation(donor.lastDonationDate);
  return days !== null && days < 90;
};

// 📥 GET: All donors
export async function GET() {
  const { data, error } = await supabase.from("donors").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    donors: data.map(donor => ({
      id: donor.id,
      fullName: donor.name,
      fatherName: donor.father_name,
      bloodGroup: donor.blood_group,
      city: donor.city,
      address: donor.address,
      age: donor.age,
      contactNumber: donor.contact,
      donationStatus: donor.donationStatus,
      lastDonationDate: donor.lastDonationDate,
      totalBloodDonate: donor.totalBloodDonate,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
    }))
  });
}

// ➕ POST: Add a new donor
export async function POST(request: NextRequest) {
  try {
    const donor = await request.json();
    console.log("Received donor:", donor);

    const newDonor = {
      id: donor.id,
      name: donor.fullName,
      father_name: donor.fatherName,
      blood_group: donor.bloodGroup,
      city: donor.city,
      address: donor.address,
      age: donor.age ? Number(donor.age) : undefined,
      contact: donor.contactNumber,
      totalBloodDonate: donor.totalBloodDonate,
      donationStatus: donor.donationStatus || "Inactive",
      lastDonationDate: donor.lastDonationDate || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Inserting donor:", newDonor);

    const { data, error } = await supabase.from("donors").insert([newDonor]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, donor: data[0] });
  } catch (err) {
    console.error("POST catch error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}


// ✏️ PUT: Update a donor by ID
export async function PUT(request: NextRequest) {
  const id = getIdFromUrl(request);
  const donor = await request.json();

  const updatedDonor = {
    ...donor,
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("donors")
    .update(updatedDonor)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Donor not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, donor: data[0] });
}

// 🗑 DELETE: Remove donor by ID
export async function DELETE(request: NextRequest) {
  const id = getIdFromUrl(request);

  const { error } = await supabase.from("donors").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
