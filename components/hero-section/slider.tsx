"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AddDonorDialog from "../add-donor-dialog";

export default function Slider() {
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false);

  const sliderData = [
    {
      title: "Save Lives With Your Contribution",
      description:
        "Join our community of donors and help make a difference in people's lives. Every donation counts and could be the reason someone gets a second chance.",
      buttonText: "Register as a Donor",
      image: "/images/slider1.jpeg",
    },
    {
      title: "Donate Blood, Save a Life",
      description:
        "Your single donation can save up to three lives. Become a hero today by registering as a donor.",
      buttonText: "Become a Hero",
      image: "/images/slider3.jpeg",
    },
    {
      title: "Be the Reason Someone Smiles",
      description:
        "By donating blood, you're spreading hope and kindness. Help us in our mission to save lives.",
      buttonText: "Join the Cause",
      image: "/images/slider2.jpeg",
    },
  ];

  return (
    <div className="h-screen w-full">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="w-full h-full"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6">
                  {slide.description}
                </p>
                <Button
                  onClick={() => setIsAddDonorOpen(true)}
                  className="bg-red-800 hover:bg-red-900 text-white px-8 py-5 text-lg"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Include the dialog inside component JSX */}
      <AddDonorDialog
        open={isAddDonorOpen}
        onOpenChange={setIsAddDonorOpen}
      />
    </div>
  );
}
