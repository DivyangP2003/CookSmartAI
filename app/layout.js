import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./_components/Navbar"
import Footer from "./_components/Footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CookSmartAI - Your Intelligent Cooking Companion",
  description:
    "AI-powered recipe generator, meal planner, nutrition calculator, and cooking assistant. Discover recipes, plan meals, and cook smarter with artificial intelligence.",
  keywords: "AI cooking, recipe generator, meal planner, nutrition calculator, cooking assistant",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-sm normal-case",
          card: "shadow-lg",
          headerTitle: "text-2xl font-bold text-gray-900",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900",
          formFieldInput: "border-gray-300 focus:border-orange-500 focus:ring-orange-500",
          footerActionLink: "text-orange-600 hover:text-orange-700",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main>{children}
            <Toaster/>
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
