import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { differenceInMonths, parseISO, isValid } from "date-fns";
import { supabase } from "@/lib/supabaseClient";

// Donor type
export type Donor = {
  id: string;
  fullName: string;
  fatherName: string;
  totalBloodDonate: number;
  bloodGroup: string;
  age: string;
  city: string;
  lastDonationDate: string;
  address: string;
  contactNumber: string;
  donationStatus: string;
};

// Check if donor donated within 3 months
export const isRecentlyDonated = (lastDonationDate: string): boolean => {
  if (!lastDonationDate) return false;

  try {
    let donationDate = parseISO(lastDonationDate);
    if (!isValid(donationDate)) {
      donationDate = new Date(lastDonationDate);
    }

    if (!isValid(donationDate)) return false;

    const monthsDifference = differenceInMonths(new Date(), donationDate);
    return monthsDifference < 3;
  } catch {
    return false;
  }
};

// Fetch donors from Supabase
export const fetchDonors = createAsyncThunk<Donor[]>(
  "donors/fetchDonors",
  async () => {
    const { data, error } = await supabase.from("donors").select("*");
    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((donor: any) => ({
      id: donor.id,
      fullName: donor.fullname,
      fatherName: donor.fathername,
      totalBloodDonate: donor.totalblooddonate,
      bloodGroup: donor.bloodgroup,
      age: donor.age,
      city: donor.city,
      lastDonationDate: donor.lastdonationdate,
      address: donor.address,
      contactNumber: donor.contactnumber,
      donationStatus: donor.donationstatus,
    }));
  }
);

// Add donor to Supabase
export const addDonor = createAsyncThunk<Donor, Donor>(
  "donors/addDonor",
  async (donor) => {
    const supabaseDonor = {
      fullname: donor.fullName,
      fathername: donor.fatherName,
      totalblooddonate: donor.totalBloodDonate,
      bloodgroup: donor.bloodGroup,
      age: donor.age,
      city: donor.city,
      address: donor.address,
      contactnumber: donor.contactNumber,
      lastdonationdate: donor.lastDonationDate,
      donationstatus: donor.donationStatus,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("donors").insert([supabaseDonor]).select();
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No donor inserted");

    const insertedDonor = data[0];

    return {
      id: insertedDonor.id,
      fullName: insertedDonor.fullname,
      fatherName: insertedDonor.fathername,
      totalBloodDonate: insertedDonor.totalblooddonate,
      bloodGroup: insertedDonor.bloodgroup,
      age: insertedDonor.age,
      city: insertedDonor.city,
      lastDonationDate: insertedDonor.lastdonationdate,
      address: insertedDonor.address,
      contactNumber: insertedDonor.contactnumber,
      donationStatus: insertedDonor.donationstatus,
    };
  }
);

// Update donor in Supabase
export const updateDonor = createAsyncThunk<Donor, Donor>(
  "donors/updateDonor",
  async (donor) => {
    const supabaseDonor = {
      fullname: donor.fullName,
      fathername: donor.fatherName,
      totalblooddonate: donor.totalBloodDonate,
      bloodgroup: donor.bloodGroup,
      age: donor.age,
      city: donor.city,
      address: donor.address,
      contactnumber: donor.contactNumber,
      lastdonationdate: donor.lastDonationDate,
      donationstatus: donor.donationStatus,
      updatedat: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("donors")
      .update(supabaseDonor)
      .eq("id", donor.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Donor not updated");

    const updatedDonor = data[0];

    return {
      id: updatedDonor.id,
      fullName: updatedDonor.fullname,
      fatherName: updatedDonor.fathername,
      totalBloodDonate: updatedDonor.totalblooddonate,
      bloodGroup: updatedDonor.bloodgroup,
      age: updatedDonor.age,
      city: updatedDonor.city,
      lastDonationDate: updatedDonor.lastdonationdate,
      address: updatedDonor.address,
      contactNumber: updatedDonor.contactnumber,
      donationStatus: updatedDonor.donationstatus,
    };
  }
);

// Delete donor
export const deleteDonor = createAsyncThunk<string, string>(
  "donors/deleteDonor",
  async (id) => {
    const { error } = await supabase.from("donors").delete().eq("id", id);
    if (error) throw error;
    return id;
  }
);

// Donor state type
type DonorState = {
  donors: Donor[];
  filteredDonors: Donor[];
  filters: {
    name: string;
    fatherName: string;
    totalBloodDonate: number | string;
    bloodGroup: string;
    city: string;
    donationStatus: string;
  };
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: DonorState = {
  donors: [],
  filteredDonors: [],
  filters: {
    name: "",
    fatherName: "",
    totalBloodDonate: "",
    bloodGroup: "",
    city: "",
    donationStatus: "",
  },
  loading: false,
  error: null,
};

// Apply filter logic
const applyFilters = (donors: Donor[], filters: DonorState["filters"]) => {
  return donors.filter((donor) => {
    const nameMatch = !filters.name || donor.fullName.toLowerCase().includes(filters.name.toLowerCase());
    const fatherNameMatch = !filters.fatherName || donor.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase());
    const totalBloodDonateMatch = !filters.totalBloodDonate || donor.totalBloodDonate == filters.totalBloodDonate;
    const bloodGroupMatch =
      !filters.bloodGroup || filters.bloodGroup === "All Blood Groups" || donor.bloodGroup === filters.bloodGroup;
    const cityMatch = !filters.city || filters.city === "Select city" || donor.city === filters.city;
    const statusMatch =
      !filters.donationStatus ||
      filters.donationStatus === "All Donors" ||
      donor.donationStatus === filters.donationStatus;

    return nameMatch && fatherNameMatch && totalBloodDonateMatch && bloodGroupMatch && cityMatch && statusMatch;
  });
};

// Donor slice
export const donorSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DonorState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredDonors = applyFilters(state.donors, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredDonors = state.donors;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDonors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.loading = false;
        state.donors = action.payload;
        state.filteredDonors = action.payload;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch donors";
      })

      // Add
      .addCase(addDonor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDonor.fulfilled, (state, action) => {
        const exists = state.donors.some((d) => d.id === action.payload.id);
        if (!exists) {
          state.donors.push(action.payload);
        }
        state.filteredDonors = applyFilters(state.donors, state.filters);
        state.loading = false;
      })
      .addCase(addDonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add donor";
      })

      // Update
      .addCase(updateDonor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDonor.fulfilled, (state, action) => {
        const index = state.donors.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.donors[index] = action.payload;
          state.filteredDonors = applyFilters(state.donors, state.filters);
        }
        state.loading = false;
      })
      .addCase(updateDonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update donor";
      })

      // Delete
      .addCase(deleteDonor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDonor.fulfilled, (state, action) => {
        state.donors = state.donors.filter((d) => d.id !== action.payload);
        state.filteredDonors = applyFilters(state.donors, state.filters);
        state.loading = false;
      })
      .addCase(deleteDonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete donor";
      });
  },
});

export const { setFilters, resetFilters, clearError } = donorSlice.actions;
export default donorSlice.reducer;
