"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = `
The Qazalbash Blood Donors Foundation Gilgit-Baltistan was established on December 12, 2012, born from a deeply personal experience. This led to a profound realization: patients arriving at hospitals, especially from remote areas of Gilgit-Baltistan, often face extreme difficulty in securing timely blood donations.

DHQ Hospital Gilgit, the largest medical facility in the region, receives patients from distant areas such as Ghizer, Chilas, Kohistan, Darel, Astore, Nagar, Hunza, and Baltistan. During emergencies, families were often left helpless, pleading for blood without any organized support. At that time, blood donation drives were minimal and poorly structured. In desperate situations, announcements were made in mosques, Imambargahs, and Jamat Khanas, yet many people hesitated to donate due to a lack of awareness.

The Foundation took it upon itself to educate and mobilize the community. Through tireless efforts, the Qazalbash Blood Donors Foundation became a beacon of hope, introducing structured blood donation awareness across Gilgit-Baltistan. Since its inception, it has facilitated thousands of life-saving blood donations, delivering units to patients in need and helping save countless lives.

The Foundation serves patients of all religions and backgrounds without any discrimination or bias. It stands firmly on the belief that no one should suffer due to a lack of blood or support in their darkest hour.

With the powerful slogan “Our Identity: Serving Humanity”, the Foundation continues its noble journey — committed to compassion, solidarity, and saving lives.
  `;

  // Limit text if not expanded
  const shortText = text.split(" ").slice(0, 40).join(" ") + "...";

  return (
    <section className="w-full bg-gray-50 py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* ✅ Text Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
            About Qazalbash Blood Donors Foundation
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {isExpanded ? text : shortText}
          </p>

          {/* See More / See Less Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        </div>

        {/* ✅ Bigger Image Section */}
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src="/images/qazalbash-logo.png"
            alt="About Qazalbash Blood Donors Foundation"
            fill
            className="object-contain rounded-xl shadow-lg bg-white p-4"
            priority
          />
        </div>
      </div>
    </section>
  );
}
