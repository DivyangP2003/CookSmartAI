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
} from "lucide-react";
import TopRecipes from "./_components/TopReceipes";

export default function HomePage() {
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
    </div>
  );
}
