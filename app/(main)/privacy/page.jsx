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
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Globe,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Eye,
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect your name, email address, and profile information you choose to provide.",
        },
        {
          subtitle: "Recipe Data",
          text: "We store the recipes you generate, save, and interact with to provide personalized recommendations and improve our service.",
        },
        {
          subtitle: "Usage Information",
          text: "We collect information about how you use our service, including pages visited, features used, and time spent on the platform.",
        },
        {
          subtitle: "Device Information",
          text: "We may collect information about your device, browser type, IP address, and operating system for security and optimization purposes.",
        },
      ],
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Users,
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our recipe generation and recommendation services.",
        },
        {
          subtitle: "Personalization",
          text: "Your data helps us personalize your experience, including dietary preferences and recipe recommendations.",
        },
        {
          subtitle: "Communication",
          text: "We may use your email to send important updates, newsletters (if subscribed), and respond to your inquiries.",
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to improve our AI algorithms and overall user experience.",
        },
      ],
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Globe,
      content: [
        {
          subtitle: "Public Recipes",
          text: "Recipes you choose to share publicly will be visible to other users along with your username (not your email).",
        },
        {
          subtitle: "Service Providers",
          text: "We may share data with trusted third-party service providers who help us operate our service, such as cloud hosting and analytics providers.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law, court order, or to protect our rights and the safety of our users.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.",
        },
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "All data transmission is encrypted using industry-standard SSL/TLS protocols.",
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and authentication measures to protect your data from unauthorized access.",
        },
        {
          subtitle: "Regular Audits",
          text: "We conduct regular security audits and vulnerability assessments to maintain the highest security standards.",
        },
        {
          subtitle: "Data Minimization",
          text: "We only collect and retain the minimum amount of data necessary to provide our services effectively.",
        },
      ],
    },
    {
      id: "user-rights",
      title: "Your Rights and Choices",
      icon: Shield,
      content: [
        {
          subtitle: "Access and Portability",
          text: "You can access, download, and export your personal data and recipes at any time through your account settings.",
        },
        {
          subtitle: "Correction and Updates",
          text: "You can update your personal information and preferences directly in your account settings.",
        },
        {
          subtitle: "Deletion",
          text: "You can delete your account and all associated data at any time. Some data may be retained for legal or security purposes.",
        },
        {
          subtitle: "Marketing Communications",
          text: "You can opt out of marketing emails at any time using the unsubscribe link or by updating your preferences.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Eye,
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use essential cookies to provide basic functionality, such as keeping you logged in and remembering your preferences.",
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how users interact with our service and identify areas for improvement.",
        },
        {
          subtitle: "Cookie Control",
          text: "You can control cookie settings through your browser preferences, though this may affect some functionality.",
        },
        {
          subtitle: "Third-Party Cookies",
          text: "Some third-party services we use may set their own cookies. We do not control these cookies.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your privacy is important to us. Learn how we collect, use, and
              protect your information.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Calendar className="mr-2 h-4 w-4" />
                Last Updated: {lastUpdated}
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <FileText className="mr-2 h-4 w-4" />
                GDPR Compliant
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <FileText className="mr-2 h-4 w-4" />
                DPDP Act
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Privacy at a Glance
                </CardTitle>
                <CardDescription>
                  Here's what you need to know about how we handle your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          We protect your data
                        </h4>
                        <p className="text-sm text-gray-600">
                          Industry-standard encryption and security measures
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          You control your data
                        </h4>
                        <p className="text-sm text-gray-600">
                          Access, update, or delete your information anytime
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Globe className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Limited sharing
                        </h4>
                        <p className="text-sm text-gray-600">
                          We only share data when necessary for our service
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Mail className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Transparent communication
                        </h4>
                        <p className="text-sm text-gray-600">
                          Clear notifications about any policy changes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={section.id} id={section.id} className="scroll-mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-3 rounded-full">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                        {itemIndex < section.content.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* International Users */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  International Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      GDPR Compliance (EU Users)
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      For users in the European Union, we comply with the
                      General Data Protection Regulation (GDPR). You have
                      additional rights including the right to data portability,
                      the right to be forgotten, and the right to object to
                      processing.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      DPDP Compliance (Indian Users)
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      For users in India, we comply with the provisions of the
                      Digital Personal Data Protection Act (DPDP Act), 2023. You
                      have rights including the right to access your personal
                      data, the right to correction and erasure, and the right
                      to grievance redressal through a Data Protection Board
                      established under the Act.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Data Transfers
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      We may transfer your data to servers located outside your
                      country. We ensure appropriate safeguards are in place to
                      protect your data during international transfers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact and Updates */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Questions About Privacy?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy or how
                    we handle your data, please don't hesitate to contact us.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Email:</strong> privacy@cooksmartai.com
                    </p>
                    <p>
                      <strong>Address:</strong> 42 Example Nagar, Faketown,
                      India 999999
                    </p>
                  </div>
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Policy Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    We may update this Privacy Policy from time to time. We'll
                    notify you of any significant changes via email or through
                    our service.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Current Version:</strong> 2.1
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {lastUpdated}
                    </p>
                    <p>
                      <strong>Next Review:</strong> July 2026
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
