// components/DashboardHeader.tsx
import { Facebook } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-2 bg-white shadow-sm border-b">
      <div className="flex items-center">
        <Image
          src="/images/qazalbash-logo.png"
          alt="Blood Donation Icon"
          width={70}
          height={60}
          className="ml-4"
        />
      </div>
      <div className='flex items-center space-x-4'>
        <Link href="https://www.facebook.com/share/1EppZxzpXh/ " target="_blank" rel="noopener noreferrer">
          <FaFacebook className="h-6 w-6 text-blue-600 hover:text-blue-700 transition-colors" />
        </Link>
        <Link href="https://chat.whatsapp.com/K1TkgazaEGo62FZzO7S6HL?mode=ac_t " target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors" />
        </Link>
        <Link href="https://www.instagram.com/qazalbash_blood_doners_society?utm_source=qr&igsh=cmZzdmFub3FhbGZp" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="h-6 w-6 text-red-700 hover:text-red-800 transition-colors" />
        </Link>
        <Link href="/login">
          <button className="px-4 py-2 bg-red-800 hover:bg-red-900  text-white rounded-md transition-colors">
            Login
          </button>
        </Link>
      </div>

    </header>
  );
};

export default Header;