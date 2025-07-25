"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Zap,
  Globe,
  Code,
  Palette,
  BarChart,
  Headphones,
  ChefHat,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs",
    },
    {
      icon: Clock,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours and unlimited PTO policy",
    },
    {
      icon: Zap,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget and conference attendance support",
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with passionate, talented people who love food and technology",
    },
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Market-leading salaries with equity options and performance bonuses",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Help millions of people cook better meals and reduce food waste",
    },
  ]

  const openPositions = [
    {
      id: 1,
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$140k - $180k",
      icon: Code,
      description:
        "Lead the development of our AI recipe generation algorithms and improve our machine learning models.",
      requirements: [
        "5+ years of experience in machine learning and AI",
        "Strong background in NLP and recommendation systems",
        "Experience with Python, TensorFlow, and cloud platforms",
        "PhD in Computer Science or related field preferred",
      ],
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$110k - $140k",
      icon: Palette,
      description: "Design intuitive and beautiful user experiences that make cooking accessible to everyone.",
      requirements: [
        "4+ years of product design experience",
        "Strong portfolio showcasing mobile and web design",
        "Experience with Figma, user research, and design systems",
        "Background in food or lifestyle products preferred",
      ],
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Data",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$120k - $160k",
      icon: BarChart,
      description:
        "Analyze user behavior and recipe performance to drive product decisions and improve recommendations.",
      requirements: [
        "3+ years of data science experience",
        "Strong skills in Python, SQL, and statistical analysis",
        "Experience with A/B testing and experimentation",
        "Background in recommendation systems preferred",
      ],
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Chicago",
      type: "Full-time",
      salary: "$80k - $100k",
      icon: Headphones,
      description: "Help our users get the most out of CookSmartAI and build lasting relationships with our community.",
      requirements: [
        "2+ years of customer success or support experience",
        "Excellent communication and problem-solving skills",
        "Experience with CRM tools and customer analytics",
        "Passion for food and cooking preferred",
      ],
    },
    {
      id: 5,
      title: "Culinary Content Specialist",
      department: "Content",
      location: "Remote / Los Angeles",
      type: "Full-time",
      salary: "$70k - $90k",
      icon: ChefHat,
      description: "Create and curate high-quality recipe content and ensure culinary accuracy across our platform.",
      requirements: [
        "Culinary degree or equivalent professional experience",
        "3+ years of recipe development and food writing",
        "Strong understanding of nutrition and dietary restrictions",
        "Experience with food photography preferred",
      ],
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote / Seattle",
      type: "Full-time",
      salary: "$130k - $170k",
      icon: Code,
      description: "Build and maintain our cloud infrastructure to support millions of recipe generations daily.",
      requirements: [
        "4+ years of DevOps and cloud infrastructure experience",
        "Strong knowledge of AWS, Docker, and Kubernetes",
        "Experience with CI/CD pipelines and monitoring tools",
        "Background in high-scale web applications",
      ],
    },
  ]

  const values = [
    {
      title: "Food First",
      description: "We're passionate about food and believe great meals bring people together.",
    },
    {
      title: "Innovation",
      description: "We use cutting-edge technology to solve real problems in the kitchen.",
    },
    {
      title: "Inclusivity",
      description: "We build for everyone, regardless of cooking skill, dietary needs, or background.",
    },
    {
      title: "Quality",
      description: "We're committed to excellence in everything we create and deliver.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Briefcase className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Help us revolutionize cooking with AI and build the future of food technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Users className="mr-2 h-4 w-4" />
                50+ Team Members
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Globe className="mr-2 h-4 w-4" />
                Remote First
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Fast Growing
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Work With Us</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join a mission-driven team that's passionate about making cooking accessible to everyone
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide how we work and what we build</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Positions</h2>
              <p className="text-xl text-gray-600">{openPositions.length} open positions across multiple departments</p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card key={position.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                          <position.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{position.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{position.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{position.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{position.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{position.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{position.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Hiring Process</h2>
              <p className="text-xl text-gray-600">We believe in a fair, transparent, and efficient hiring process</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Application</h3>
                <p className="text-gray-600 text-sm">
                  Submit your application and we'll review it within 3 business days
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Screen</h3>
                <p className="text-gray-600 text-sm">30-minute call to discuss your background and the role</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Technical Interview</h3>
                <p className="text-gray-600 text-sm">Role-specific interview to assess your skills and experience</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Final Interview</h3>
                <p className="text-gray-600 text-sm">Meet the team and discuss culture fit and career goals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
            <p className="text-xl mb-8 opacity-90">
              We're always looking for talented people who share our passion for food and technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                  <Heart className="mr-2 h-5 w-5" />
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
