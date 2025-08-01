"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChefHat,
  Calendar,
  Calculator,
  Globe,
  Camera,
  Sparkles,
  Users,
  Clock,
  Heart,
  MapPin,
  CheckCircle,
} from "lucide-react";
import TopRecipes from "./_components/TopReceipes";
import { useEffect, useState } from "react";
import { useToast } from "./_components/ui/use-toast";
import Chatbot from "./_components/chat-bot/chatbot";

export default function HomePage() {
  const [locationStatus, setLocationStatus] = useState("not_requested"); // not_requested, requesting, granted, denied, error
  const [locationData, setLocationData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if location is already stored
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocationData(JSON.parse(storedLocation));
      setLocationStatus("granted");
    }
  }, []);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    setLocationStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        

        try {
          // Use free reverse geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error("Failed to get location details");
          }

          const locationDetails = await response.json();

          const locationInfo = {
            latitude,
            longitude,
            city:
              locationDetails.city ||
              locationDetails.locality ||
              "Unknown City",
            state: locationDetails.principalSubdivision || "Unknown State",
            country: locationDetails.countryName || "Unknown Country",
            countryCode: locationDetails.countryCode || "",
            fullAddress: locationDetails.localityInfo?.administrative || [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            timestamp: new Date().toISOString(),
          };

          // Store location data
          localStorage.setItem("userLocation", JSON.stringify(locationInfo));
          setLocationData(locationInfo);
          setLocationStatus("granted");

          toast({
            title: "Location Saved!",
            description: `We'll customize meal plans for ${locationInfo.city}, ${locationInfo.state} with local meal timings`,
            variant: "default",
          });
        } catch (error) {
          console.error("Error getting location details:", error);
          setLocationStatus("error");
          toast({
            title: "Location Error",
            description: "Could not get detailed location information.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus("denied");

        let errorMessage = "Location access was denied.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access was denied. You can enable it in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast({
          title: "Location Access Denied",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const clearLocation = () => {
    localStorage.removeItem("userLocation");
    setLocationData(null);
    setLocationStatus("not_requested");
    toast({
      title: "Location Cleared",
      description: "Location data has been removed.",
      variant: "default",
    });
  };

  const features = [
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: "AI Recipe Generator",
      description:
        "Generate personalized recipes from ingredients or any cooking idea you have in mind.",
      href: "/recipe-generator",
      color: "bg-orange-500",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Meal Planner & Scheduler",
      description:
        "Plan your meals for days or weeks with AI-powered suggestions based on your preferences.",
      href: "/meal-planner",
      color: "bg-green-500",
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Nutrition Calculator",
      description:
        "Calculate detailed nutrition information for recipes and individual ingredients.",
      href: "/nutrition-calculator",
      color: "bg-blue-500",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Explore World Recipes",
      description:
        "Discover authentic recipes from different cuisines and countries worldwide.",
      href: "/explore",
      color: "bg-purple-500",
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Image Scanner",
      description:
        "Scan food images to get recipes or nutrition information instantly.",
      href: "/scanner",
      color: "bg-pink-500",
    },
  ];

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "50K+",
      label: "Happy Cooks",
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      value: "100K+",
      label: "Recipes Generated",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: "24/7",
      label: "AI Assistant",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      value: "99%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 rounded-full">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-6">
            CookSmartAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your intelligent cooking companion powered by AI. Generate recipes,
            plan meals, calculate nutrition, and explore world cuisines
            effortlessly.
          </p>
          {/* Location Permission Section */}
          <div className="mb-8">
            {locationStatus === "not_requested" && (
              <Card className="max-w-md mx-auto mb-6 border-2 border-dashed border-orange-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    <MapPin className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">
                    Enable Local Cuisine
                  </CardTitle>
                  <CardDescription>
                    Allow location access to get meal plans with local food
                    styles and ingredients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={requestLocationPermission}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Enable Location for Local Recipes
                  </Button>
                </CardContent>
              </Card>
            )}

            {locationStatus === "requesting" && (
              <Card className="max-w-md mx-auto mb-6 border-orange-200">
                <CardContent className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Getting your location...</p>
                </CardContent>
              </Card>
            )}

            {locationStatus === "granted" && locationData && (
              <Card className="max-w-md mx-auto mb-6 border-green-200 bg-green-50">
                <CardContent className="text-center py-4">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <span className="font-medium text-green-800">
                      Location Enabled
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    {locationData.city}, {locationData.state},{" "}
                    {locationData.country}
                  </p>
                  <Button
                    onClick={clearLocation}
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-300 hover:bg-green-100 bg-transparent"
                  >
                    Change Location
                  </Button>
                </CardContent>
              </Card>
            )}

            {locationStatus === "denied" && (
              <Card className="max-w-md mx-auto mb-6 border-red-200 bg-red-50">
                <CardContent className="text-center py-4">
                  <p className="text-sm text-red-700 mb-3">
                    Location access denied. You can still use all features, but
                    won't get local cuisine recommendations.
                  </p>
                  <Button
                    onClick={requestLocationPermission}
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recipe-generator" passHref>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-3 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Cooking Smart
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-orange-500 to-green-500 p-3 rounded-full text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all the amazing ways CookSmartAI can transform your
              cooking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`${feature.color} p-4 rounded-full text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.href}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white">
                      Try Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Recipes Section */}
      <TopRecipes />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Cook Smarter?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are already using AI to create
            amazing meals every day.
          </p>
          <Link href="/recipe-generator" passHref>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>


      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}
