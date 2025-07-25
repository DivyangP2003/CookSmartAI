"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageCircle,
  ChefHat,
  Settings,
  CreditCard,
  Smartphone,
  Globe,
  Star,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: Book, count: 45 },
    { id: "getting-started", name: "Getting Started", icon: Star, count: 8 },
    { id: "recipes", name: "Recipes & AI", icon: ChefHat, count: 12 },
    { id: "account", name: "Account & Settings", icon: Settings, count: 10 },
    { id: "billing", name: "Billing & Plans", icon: CreditCard, count: 6 },
    { id: "mobile", name: "Mobile App", icon: Smartphone, count: 5 },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      icon: HelpCircle,
      count: 4,
    },
  ];

  const popularArticles = [
    {
      id: 1,
      title: "How to Generate Your First Recipe",
      category: "getting-started",
      views: 15420,
      helpful: 98,
      description:
        "Step-by-step guide to creating your first AI-generated recipe",
    },
    {
      id: 2,
      title: "Understanding Dietary Preferences and Restrictions",
      category: "recipes",
      views: 12350,
      helpful: 95,
      description:
        "Learn how to set up dietary filters for personalized recipes",
    },
    {
      id: 3,
      title: "Saving and Organizing Your Favorite Recipes",
      category: "recipes",
      views: 9870,
      helpful: 92,
      description: "Tips for managing your recipe collection effectively",
    },
    {
      id: 4,
      title: "Troubleshooting Recipe Generation Issues",
      category: "troubleshooting",
      views: 8650,
      helpful: 89,
      description: "Common issues and solutions when generating recipes",
    },
  ];

  const faqData = [
    {
      category: "getting-started",
      questions: [
        {
          question: "How do I create my first recipe?",
          answer:
            "To create your first recipe, go to the Recipe Generator page, enter your available ingredients or describe what you want to cook, and click 'Generate Recipe'. Our AI will create a personalized recipe for you in seconds.",
        },
        {
          question: "Do I need to create an account to use CookSmartAI?",
          answer:
            "While you can try our recipe generator without an account, creating a free account allows you to save recipes, set dietary preferences, and access your recipe history.",
        },
        {
          question: "What information do I need to provide for better recipes?",
          answer:
            "The more information you provide, the better! Include your available ingredients, dietary restrictions, cooking skill level, and any specific preferences for the best results.",
        },
      ],
    },
    {
      category: "recipes",
      questions: [
        {
          question: "How accurate are the AI-generated recipes?",
          answer:
            "Our recipes are developed using advanced AI trained on thousands of professional recipes. They have a 95% success rate based on user feedback and are reviewed by our culinary team.",
        },
        {
          question: "Can I modify the generated recipes?",
          answer:
            "You can edit ingredients, adjust serving sizes, modify cooking instructions, and save your customized version. Think of our recipes as a starting point for your creativity.",
        },
        {
          question: "How do I set dietary restrictions?",
          answer:
            "Go to your Profile Settings and select your dietary preferences such as vegetarian, vegan, gluten-free, keto, etc. All generated recipes will automatically respect these restrictions.",
        },
        {
          question: "Can I generate recipes for specific cuisines?",
          answer:
            "Yes! You can specify cuisine types like Italian, Mexican, Asian, Mediterranean, etc., in your recipe request, and our AI will generate authentic recipes from those culinary traditions.",
        },
      ],
    },
    {
      category: "account",
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a secure link to reset your password. The link expires after 24 hours for security.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Yes, go to Account Settings > Profile Information and update your email address. You'll need to verify the new email address before the change takes effect.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "We're sorry to see you go! You can delete your account in Settings > Account > Delete Account. This action is permanent and cannot be undone.",
        },
      ],
    },
    {
      category: "billing",
      questions: [
        {
          question: "What's included in the free plan?",
          answer:
            "The free plan includes 10 recipe generations per month, basic dietary filters, and access to community recipes. Perfect for trying out our service!",
        },
        {
          question: "How do I upgrade to a premium plan?",
          answer:
            "Go to Settings > Billing and select your preferred plan. Premium plans include unlimited recipe generation, advanced AI features, meal planning, and priority support.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel your subscription at any time from your billing settings. You'll continue to have premium access until the end of your current billing period.",
        },
      ],
    },
    {
      category: "troubleshooting",
      questions: [
        {
          question: "Why is recipe generation taking so long?",
          answer:
            "Recipe generation typically takes 3-10 seconds. If it's taking longer, try refreshing the page or check your internet connection. During peak hours, there might be slight delays.",
        },
        {
          question: "The generated recipe doesn't match my ingredients",
          answer:
            "Make sure you've entered your ingredients clearly and check your dietary restrictions. If the issue persists, try being more specific about what you want to cook.",
        },
        {
          question: "I can't save my recipes",
          answer:
            "Ensure you're logged into your account and have a stable internet connection. If you're on the free plan, check that you haven't exceeded your monthly limit.",
        },
      ],
    },
  ];

  const filteredFAQ =
    selectedCategory === "all"
      ? faqData.flatMap((category) =>
          category.questions.map((q) => ({ ...q, category: category.category }))
        )
      : faqData.find((cat) => cat.category === selectedCategory)?.questions ||
        [];

  const searchFilteredFAQ = filteredFAQ.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <HelpCircle className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find answers to your questions and get the most out of CookSmartAI
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>Watch step-by-step guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="bg-transparent">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>
                    Get instant help from our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="bg-transparent">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle>Community Forum</CardTitle>
                  <CardDescription>Connect with other users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="bg-transparent">
                    Join Forum
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Browse by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                            selectedCategory === category.id
                              ? "bg-indigo-100 text-indigo-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className="h-4 w-4" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Popular Articles */}
                {selectedCategory === "all" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Popular Articles
                      </CardTitle>
                      <CardDescription>
                        Most viewed and helpful articles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {popularArticles.map((article) => (
                          <div
                            key={article.id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {article.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span>
                                    {article.views.toLocaleString()} views
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>{article.helpful}% helpful</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                            >
                              Read
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* FAQ Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedCategory === "all"
                        ? "Frequently Asked Questions"
                        : `${
                            categories.find((c) => c.id === selectedCategory)
                              ?.name
                          } FAQ`}
                    </CardTitle>
                    <CardDescription>
                      {searchFilteredFAQ.length} question
                      {searchFilteredFAQ.length !== 1 ? "s" : ""} found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {searchFilteredFAQ.length === 0 ? (
                      <div className="text-center py-8">
                        <HelpCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Questions Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search or browse different
                          categories.
                        </p>
                        <Button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                          }}
                          variant="outline"
                          className="bg-transparent"
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        {searchFilteredFAQ.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </Link>

            </div>
            <p className="text-sm text-gray-500 mt-4">
              Average response time: 4 hours • Available 24/7
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
