import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Qazalbash Blood Donation Gilgit Baltistan",
  description: "A system to manage blood donors",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Existing header with scrolling text */}
    

        {/* Page content */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}