import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "KATERI | Luxury Childrenwear",
  description:
    "Sustainability meets style. We're dedicated to creating beautiful, safe, and organic garments for the next generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased font-sans min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
