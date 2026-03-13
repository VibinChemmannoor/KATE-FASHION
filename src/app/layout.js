import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AppProvider } from "@/components/providers/AppProvider";
import { Toast } from "@/components/atoms/Toast";
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
  title: "KATE FASHION | Premium Baby & Kids Clothing",
  description:
    "Discover organic, sustainable baby fashion at KATE. Premium quality clothing for newborns, boys & girls. 100% organic cotton, ethically made.",
  keywords: [
    "baby fashion",
    "kids clothing",
    "organic baby clothes",
    "newborn essentials",
    "sustainable fashion",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased font-sans min-h-screen flex flex-col`}
      >
        <AppProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
