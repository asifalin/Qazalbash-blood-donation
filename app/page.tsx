"use client";
import Header from "@/components/home/header";
import { UserPlus, HeartPulse, ShieldPlus, Handshake } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddDonorDialog from "@/components/add-donor-dialog";
import Image from "next/image";
import { FaBook } from 'react-icons/fa';
import Slider from "@/components/hero-section/slider";

export default function Home() {
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

        <div>
          <Slider/>
        </div>
      <main className="container mx-auto px-4 py-12">

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <HeartPulse className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Life-Saving Donations</h3>
            <p className="text-gray-600">
              Your blood donation can save up to 3 lives. Be someone's hero today.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ShieldPlus className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safe Process</h3>
            <p className="text-gray-600">
              Our donation process is safe, hygienic, and supervised by medical professionals.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Handshake className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600">
              Join a network of caring individuals making a real difference in your community.
            </p>
          </div>
        </section>

{/* Memorial Section */}
<section className="bg-white rounded-xl shadow-lg overflow-hidden my-16">
  <div className="flex flex-col md:flex-row">
    {/* Photo */}
    <div className="md:w-1/3 relative">
      <Image 
        src="/images/charman.jpeg" 
        alt="jafar - Founder & Chairman of Qazalbash Blood Donation"
        width={50} 
        height={30}
        className="w-full h-full object-cover min-h-[300px]"
      />
     
    </div>
    
    {/* Tribute Content */}
    <div className="md:w-2/3 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
  <h2 className="text-4xl font-extrabold text-red-700 mb-4">
    Honoring Our Esteemed Chairman
  </h2>
  <h3 className="text-2xl text-gray-900 mb-6 font-semibold">
    Jafar Hussain Qazalbash
  </h3>

  {/* One-Man Army Highlight */}
  <div className="bg-red-900 text-white p-4 rounded-lg mb-6 shadow-md">
    <p className="text-xl font-semibold text-center">
      💪 Jafar Hussain is a One-Man Army — We are Proud of You!
    </p>
  </div>

  <div className="border-l-4 border-red-700 pl-6 mb-6 bg-red-50 py-4 px-3 rounded-md shadow-lg">
    <p className="text-gray-800 text-[17px] leading-relaxed">
      A visionary leader and the heart of our blood donation movement. Through compassion and relentless effort,
      he has saved countless lives and continues to uplift communities.
    </p>
    <p className="text-gray-800 text-[17px] mt-3">
      May Allah ﷻ bless Jafar Hussain Qazalbash with good health, strength, and endless barakah. Ameen.
    </p>
  </div>

  <div className="bg-gradient-to-r from-red-100 via-white to-red-50 p-6 rounded-xl border border-red-200 shadow-lg">
    <p className="text-red-700 text-lg font-medium italic mb-4">
      "Every blood donor is a soldier fighting for humanity"
      <span className="block text-red-800 font-semibold mt-2 text-right pr-2">
        — Jafar Hussain Qazalbash
      </span>
    </p>

    <div className="flex items-start mt-6 space-x-4">
      <Handshake className="h-8 w-8 text-red-600" />
      <p className="text-gray-700 text-[16px]">
        We are honored to walk this path with him and continue his mission of saving lives and spreading kindness.
      </p>
    </div>
  </div>

  {/* Dua Section */}
  <div className="mt-10 p-6 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 shadow">
    <div className="flex items-start">
      <div className="bg-red-800 text-white p-3 rounded-lg mr-4 shadow">
        <FaBook className="h-8 w-8" /> {/* Using react-icons */}
      </div>
      <div>
        <h4 className="text-xl font-semibold text-red-700 mb-2">A Special Dua</h4>
        <p className="text-gray-800">
          May Allah ﷻ accept all his efforts as sadaqah jariyah, grant him more strength to serve humanity, 
          and guide him always on the path of goodness and compassion. Ameen.
        </p>
      </div>
    </div>
  </div>
</div>


  </div>
</section>

<section className="relative min-h-[500px] rounded-xl overflow-hidden my-16 shadow-lg">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0">
    <Image
      src="/images/s2.jpg" // Replace with your background image
      alt="Niyat Jan Memorial"
      width={30} 
      height={30}
      className="w-full h-full object-center"
    />
    {/* <div className="absolute inset-0 bg-black bg-opacity-60"></div> */}
  </div>
  </section>

        {/* Call to Action */}
        <section className="bg-red-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Register now and we'll help you through every step of the donation process.
          </p>
          <Button 
            variant="outline" 
            className="text-gray-700 bg-white hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => setIsAddDonorOpen(true)}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Become a Donor Today
          </Button>
        </section>

        
      </main>
      <div className="bg-black text-white text-center py-2">
  <p>
  &copy; Copyright 2025 by Qazalbash Blood Donation Gilgit Baltistan.
  <span className=" block">Design by Asif Ali</span>
  </p>
</div>
      <AddDonorDialog open={isAddDonorOpen} onOpenChange={setIsAddDonorOpen} />
    </div>
  );
}