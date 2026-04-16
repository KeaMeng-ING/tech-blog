import type { Metadata } from "next";
import "../globals.css"
import { Inter, Space_Grotesk } from "next/font/google"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-[#0B1120] text-white`}>
        <Navbar />
        {children}
        <Footer /> 
      </body>
    </html>
  )
}