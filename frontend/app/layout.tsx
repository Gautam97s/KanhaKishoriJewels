import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google"; // Import compatible Google Fonts
import "./globals.css";
import { ShopProvider } from "../context/ShopContext";
import { AuthProvider } from "../context/AuthContext";
import LayoutWrapper from "../components/LayoutWrapper";

// Next.js Google Fonts automatically optimizes loading
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"]
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"]
});

export const metadata: Metadata = {
  title: "Kanha & Kishori | Luxury Jewelry",
  description: "Crafting eternal moments through ethically sourced gemstones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${lato.variable} font-sans bg-beige-100 text-stone-900`}>
        <AuthProvider>
          <ShopProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
