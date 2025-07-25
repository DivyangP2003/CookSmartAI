"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Home, Search, Utensils, Coffee, Cookie, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function NotFound() {
  const [currentEmoji, setCurrentEmoji] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const foodEmojis = ["🍳", "🥘", "🍝", "🍕", "🥗", "🍰", "🥐", "🍜"]

  const suggestions = [
    { icon: <Home className="h-5 w-5" />, text: "Go Home", href: "/" },
    { icon: <Search className="h-5 w-5" />, text: "Search Recipes", href: "/search" },
    { icon: <Utensils className="h-5 w-5" />, text: "Recipe Generator", href: "/recipe-generator" },
    { icon: <Coffee className="h-5 w-5" />, text: "Meal Planner", href: "/meal-planner" },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % foodEmojis.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Food Icons */}
      <motion.div
        className="absolute top-16 left-16 text-4xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        🍕
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 text-3xl"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        🥗
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-24 text-3xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        🍰
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-16 text-4xl"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 20, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        🥐
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto z-10"
      >
        {/* 404 with Chef Hat */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isVisible ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              className="text-8xl md:text-9xl font-black text-gray-200 select-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              404
            </motion.div>
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 rounded-full shadow-2xl">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-6xl mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentEmoji}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {foodEmojis[currentEmoji]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            Oops! Recipe Not Found
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl text-gray-600 mb-8 leading-relaxed"
        >
          Looks like this page went back to the kitchen! Don't worry, we have plenty of other delicious options for you
          to explore.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/" passHref>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-3 rounded-full shadow-xl border-0 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </motion.div>
          </Link>

          <Link href="/recipe-generator" passHref>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Recipe
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Suggestions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-6">Or try one of these:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={suggestion.href}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="bg-gradient-to-r from-orange-500 to-green-500 p-3 rounded-full text-white mb-3 mx-auto w-fit group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 5 }}
                      >
                        {suggestion.icon}
                      </motion.div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {suggestion.text}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block mr-2"
          >
            <Cookie className="h-6 w-6 text-orange-500" />
          </motion.div>
          <span className="text-gray-600 font-medium">
            Fun fact: Even professional chefs sometimes can't find their recipes!
          </span>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            className="inline-block ml-2"
          >
            <Cookie className="h-6 w-6 text-green-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
