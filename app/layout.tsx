import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Srivastava Associates – Easy Loan, Happy Life | Kota, Rajasthan",
    template: "%s | Srivastava Associates",
  },
  description:
    "Trusted loan DSA since 1998. Home Loan, Car Loan, Business Loan, MSME Loan, Personal Loan & more. 30+ Banks & NBFCs. Expert guidance in Kota, Rajasthan.",
  keywords: [
    "loan agency Kota",
    "home loan Kota",
    "car loan Rajasthan",
    "business loan Kota",
    "MSME loan",
    "DSA agent Kota",
    "Srivastava Associates",
    "loan consultant Kota",
  ],
  openGraph: {
    title: "Srivastava Associates – Easy Loan, Happy Life",
    description:
      "Trusted loan consultants since 1998. 30+ bank tie-ups. 1000+ happy clients. Kota, Rajasthan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0B1D3E",
              color: "#fff",
              borderLeft: "4px solid #C9A227",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
