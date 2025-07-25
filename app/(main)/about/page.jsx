"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Users,
  Globe,
  Sparkles,
  Heart,
  Target,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Divyang Palsehtakr",
      role: "Founder & CEO",
      image: "DP",
      bio: "Visionary entrepreneur dedicated to transforming how India engages with modern food tech and community-driven innovation.",
    },
    {
      name: "Ananya Mehta",
      role: "Head of AI",
      image: "AM",
      bio: "Machine learning specialist building intuitive cooking intelligence with a deep understanding of various cuisine patterns.",
    },
    {
      name: "Rohit Iyer",
      role: "Lead Designer",
      image: "RI",
      bio: "Design thinker blending traditional aesthetics with modern UX for seamless user experiences across platforms.",
    },
    {
      name: "Priya Sharma",
      role: "Community Manager",
      image: "PS",
      bio: "Passionate connector fostering inclusive communities for food lovers and home chefs across world.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Recipes Generated", icon: ChefHat },
    { number: "25K+", label: "Active Users", icon: Users },
    { number: "100+", label: "Countries", icon: Globe },
    { number: "4.9/5", label: "User Rating", icon: Award },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Food",
      description:
        "We believe cooking is an art form that brings people together and creates lasting memories.",
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description:
        "Using cutting-edge AI to revolutionize how people discover and create amazing recipes.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Building a global community of food lovers who share, learn, and grow together.",
    },
    {
      icon: Target,
      title: "Accessibility",
      description:
        "Making great cooking accessible to everyone, regardless of skill level or dietary needs.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <ChefHat className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About CookSmartAI
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Revolutionizing home cooking with AI-powered recipe generation and
              a passionate community of food lovers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/recipe-generator">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try Recipe Generator
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold bg-transparent"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Recipes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-xl text-gray-600">
                From a simple idea to revolutionizing how the world cooks
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/about.png"
                  alt="Our Story"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    The Beginning
                  </h3>
                  <p className="text-gray-600">
                    It all began in 2025, when our founder Divyang Palsehtakr —
                    a passionate AI Engineer — noticed how countless home cooks
                    across world struggled to create inspiring meals from
                    everyday ingredients. He envisioned a world where anyone,
                    regardless of skill level, could cook confidently with the
                    right guidance and a touch of technology.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    The Innovation
                  </h3>
                  <p className="text-gray-600">
                    By combining advanced AI technology with culinary expertise,
                    we created the first intelligent recipe generator that
                    understands your preferences, dietary needs, and available
                    ingredients to create personalized recipes.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    The Community
                  </h3>
                  <p className="text-gray-600">
                    Today, we're proud to serve a global community of home
                    cooks, professional chefs, and food enthusiasts who share
                    our passion for great food and innovative cooking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind CookSmartAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-white flex items-center justify-center">
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                      {member.image}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{member.role}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Target className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              To democratize great cooking by making it accessible, enjoyable,
              and personalized for everyone, regardless of their skill level,
              dietary preferences, or cultural background.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Instant Inspiration
                </h3>
                <p className="opacity-90">
                  Get personalized recipes in seconds
                </p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Community</h3>
                <p className="opacity-90">Connect with cooks worldwide</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
                <p className="opacity-90">Every recipe crafted with care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Cooking?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of home cooks who are already creating amazing
              meals with CookSmartAI
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/recipe-generator">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <ChefHat className="mr-2 h-5 w-5" />
                  Generate Your First Recipe
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
