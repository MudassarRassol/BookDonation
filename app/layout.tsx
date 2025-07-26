import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from "@/app/redux/provider";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import LayoutWrapper from "@/components/LayoutWrapper";
import { SpeedInsights } from '@vercel/speed-insights/next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata : Metadata= {
  title: "Book Aid",
  description: "Find, donate, and receive books easily.",
  openGraph: {
    title: "Book Aid",
    description: "A community-driven book donation platform.",
    url: "https://book-donation-orcin.vercel.app",
    siteName: "Book Aid",
    images: [
      {
        url: "https://book-donation-orcin.vercel.app/globe.svg",
        width: 1200,
        height: 630,
        alt: "Book Aid",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Aid",
    description: "A community-driven book donation platform.",
    images: ["https://book-donation-orcin.vercel.app/globe.svg"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <LayoutWrapper>
            {children}
            <SpeedInsights />
          </LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
