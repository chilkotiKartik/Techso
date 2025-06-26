import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Infinity Tech Society - IIT Madras Innovation Hub",
  description:
    "Join IIT Madras students in building the future through cutting-edge research, AI innovation, and collaborative projects. Discover groundbreaking student projects and connect with fellow innovators.",
  keywords:
    "IIT Madras, technology, research, innovation, AI, machine learning, collaboration, projects, students, data science",
  authors: [{ name: "Infinity Tech Society" }],
  creator: "Infinity Tech Society",
  publisher: "Infinity Tech Society",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://infinity-tech-society.vercel.app",
    title: "Infinity Tech Society - IIT Madras Innovation Hub",
    description:
      "Join IIT Madras students in building the future through cutting-edge research, AI innovation, and collaborative projects.",
    siteName: "Infinity Tech Society",
    images: [
      {
        url: "https://infinity-tech-society.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Infinity Tech Society - Innovation Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Tech Society - IIT Madras Innovation Hub",
    description:
      "Join IIT Madras students in building the future through cutting-edge research, AI innovation, and collaborative projects.",
    creator: "@infinitytech",
    images: ["https://infinity-tech-society.vercel.app/og-image.jpg"],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pt-16 md:pt-20">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
