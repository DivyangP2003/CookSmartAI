"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, Menu, X, User, Heart } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn, user, isLoaded } = useUser()

  const navItems = [
    { name: "Recipe Generator", href: "/recipe-generator" },
    { name: "Meal Planner", href: "/meal-planner" },
    { name: "Nutrition Calculator", href: "/nutrition-calculator" },
    { name: "Explore Recipes", href: "/explore" },
    { name: "Image Scanner", href: "/scanner" },
  ]

  if (isSignedIn) {
    navItems.push({ name: "❤️", href: "/favourites" })
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              CookSmartAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {item.name === "My Favorites" && <Heart className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isLoaded ? (
              <div className="flex space-x-4">
                <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress.split("@")[0]}!
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name === "My Favorites" && <Heart className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {!isLoaded ? (
                  <div className="flex flex-col space-y-2">
                    <div className="w-full h-9 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-9 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : isSignedIn ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Welcome, {user.firstName || user.emailAddresses[0].emailAddress.split("@")[0]}!
                    </span>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
