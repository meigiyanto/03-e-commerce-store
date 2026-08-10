import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import SiteShell from "@/components/site-shell";
import { StoreProvider } from "@/context/store-context";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Northstar Store | Modern Essentials",
    template: "%s | Northstar Store",
  },
  description:
    "Northstar Store menyediakan berbagai modern essentials dengan pengalaman belanja yang sederhana dan nyaman.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id" className={`${geist.variable} h-full antialiased`}>
      <body className={`${geist.variable} antialiased`}>
        <ClerkProvider>
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}