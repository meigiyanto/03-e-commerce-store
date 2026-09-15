import Link from "next/link";
import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexaShop",
  description: "Modern online shop built with Next.js",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          {/* Navbar */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              {/ Logo */}
              <Link
                 href="/"
                 className="flex items-center gap-2 transition-opacity hover:opacity-80"
               >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-700 text-sm font-bold text-white">
                N
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Nexa<span className="text-purple-700">Shop</span>
                </span>
              </Link>
    
              {/* Navigation */}
              <nav className="hidden items-center gap-8 md:flex">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
    
                <Link
                  href="/products"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Products
                </Link>
              </nav>
    
              {/* Authentication */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex"
                    >
                      Sign In
                    </button>
                  </SignInButton>
    
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="inline-flex rounded-full bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow-md"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>
    
                <Show when="signed-in">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />
                </Show>
              </div>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex-1">
            <CartProvider>{children}</CartProvider>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}