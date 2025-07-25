"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Scale, Shield, AlertTriangle, Users, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025"
  const effectiveDate = "January 15, 2026"

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: Scale,
      content: [
        {
          text: "By accessing and using CookSmartAI ('the Service'), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        },
        {
          text: "These Terms of Service ('Terms') govern your use of our website, mobile applications, and related services. By creating an account or using our service, you acknowledge that you have read, understood, and agree to these Terms.",
        },
        {
          text: "We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.",
        },
      ],
    },
    {
      id: "description",
      title: "Description of Service",
      icon: FileText,
      content: [
        {
          subtitle: "AI Recipe Generation",
          text: "CookSmartAI provides AI-powered recipe generation services that create personalized recipes based on your ingredients, dietary preferences, and cooking requirements.",
        },
        {
          subtitle: "Recipe Management",
          text: "Our service allows you to save, organize, and share recipes, create meal plans, and access a community of food enthusiasts.",
        },
        {
          subtitle: "Content and Features",
          text: "The Service includes recipe recommendations, nutritional information, cooking tips, and community features. We continuously update and improve our offerings.",
        },
        {
          subtitle: "Service Availability",
          text: "While we strive for 99.9% uptime, we do not guarantee uninterrupted access to the Service. Maintenance, updates, or technical issues may temporarily affect availability.",
        },
      ],
    },
    {
      id: "user-accounts",
      title: "User Accounts and Responsibilities",
      icon: Users,
      content: [
        {
          subtitle: "Account Creation",
          text: "You must provide accurate, current, and complete information when creating your account. You are responsible for maintaining the confidentiality of your account credentials.",
        },
        {
          subtitle: "Age Requirements",
          text: "You must be at least 13 years old to use our Service. Users under 18 must have parental consent. We do not knowingly collect information from children under 13.",
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account or any security breach.",
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a security risk to our Service or users.",
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Shield,
      content: [
        {
          subtitle: "Permitted Uses",
          text: "You may use our Service for personal, non-commercial purposes to generate, save, and share recipes. Commercial use requires prior written permission.",
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not use our Service to: violate laws, infringe intellectual property rights, distribute harmful content, spam users, or attempt to gain unauthorized access to our systems.",
        },
        {
          subtitle: "Content Guidelines",
          text: "When sharing recipes or interacting with the community, content must be appropriate, accurate, and respectful. We reserve the right to remove content that violates our guidelines.",
        },
        {
          subtitle: "System Integrity",
          text: "You may not attempt to reverse engineer, hack, or interfere with the proper functioning of our Service or use automated tools to access our Service without permission.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: FileText,
      content: [
        {
          subtitle: "Our Content",
          text: "The Service, including its AI algorithms, design, text, graphics, and software, is owned by CookSmartAI and protected by copyright, trademark, and other intellectual property laws.",
        },
        {
          subtitle: "User-Generated Content",
          text: "You retain ownership of recipes and content you create. By sharing content on our platform, you grant us a non-exclusive license to display, distribute, and promote your content.",
        },
        {
          subtitle: "AI-Generated Recipes",
          text: "Recipes generated by our AI are provided for your use. While you may use these recipes freely, the underlying AI technology and algorithms remain our intellectual property.",
        },
        {
          subtitle: "Trademark Usage",
          text: "CookSmartAI, our logo, and related marks are trademarks. You may not use our trademarks without prior written permission.",
        },
      ],
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Protection",
      icon: Shield,
      content: [
        {
          subtitle: "Data Collection",
          text: "We collect and process personal data as described in our Privacy Policy. By using our Service, you consent to such collection and processing.",
        },
        {
          subtitle: "Data Security",
          text: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
        },
        {
          subtitle: "Data Retention",
          text: "We retain your data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time.",
        },
        {
          subtitle: "International Transfers",
          text: "Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.",
        },
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Service Disclaimer",
          text: "Our Service is provided 'as is' without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of AI-generated recipes or nutritional information.",
        },
        {
          subtitle: "Health and Safety",
          text: "Recipes and nutritional information are for general purposes only and should not replace professional medical or dietary advice. Consult healthcare providers for specific dietary needs.",
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, CookSmartAI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.",
        },
        {
          subtitle: "Third-Party Content",
          text: "Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites.",
        },
      ],
    },
    {
      id: "termination",
      title: "Termination",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Termination by You",
          text: "You may terminate your account at any time by contacting us or using the account deletion feature in your settings. Termination does not relieve you of any obligations incurred prior to termination.",
        },
        {
          subtitle: "Termination by Us",
          text: "We may terminate or suspend your access immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our Service.",
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your right to use the Service ceases immediately. We may delete your account and data, though some information may be retained as required by law.",
        },
        {
          subtitle: "Survival",
          text: "Provisions regarding intellectual property, disclaimers, limitations of liability, and dispute resolution shall survive termination of these Terms.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Scale className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Please read these terms carefully before using CookSmartAI
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Calendar className="mr-2 h-4 w-4" />
                Effective: {effectiveDate}
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <FileText className="mr-2 h-4 w-4" />
                Version 2.1
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800">
                  These Terms of Service constitute a legally binding agreement between you and CookSmartAI. By using our
                  service, you agree to these terms. If you do not agree, please do not use our service. We recommend
                  printing or saving a copy of these terms for your records.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Terms Summary
                </CardTitle>
                <CardDescription>
                  Key points from our Terms of Service (this is not a substitute for reading the full terms)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Your Account</h4>
                        <p className="text-sm text-gray-600">
                          You're responsible for keeping your account secure and providing accurate information
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Acceptable Use</h4>
                        <p className="text-sm text-gray-600">
                          Use our service responsibly and don't violate our community guidelines
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Your Content</h4>
                        <p className="text-sm text-gray-600">
                          You own your recipes, but grant us permission to display them on our platform
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Disclaimers</h4>
                        <p className="text-sm text-gray-600">
                          Our service is provided "as is" - always use common sense with recipes and nutrition
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

      {/* Detailed Terms Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={section.id} id={section.id} className="scroll-mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-gradient-to-r from-slate-700 to-gray-700 p-3 rounded-full">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {item.subtitle && <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.subtitle}</h4>}
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                        {itemIndex < section.content.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Governing Law and Disputes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-full">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  Governing Law and Dispute Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Governing Law</h4>
                    <p className="text-gray-600 leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of the State of
                      India, without regard to its conflict of law provisions.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Dispute Resolution</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Any disputes arising from these Terms or your use of the Service shall be resolved through binding
                      arbitration in India, except for claims that may be brought in small claims
                      court.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Class Action Waiver</h4>
                    <p className="text-gray-600 leading-relaxed">
                      You agree that any arbitration or legal proceeding shall be limited to the dispute between you and
                      CookSmartAI individually. You waive any right to participate in class action lawsuits or class-wide
                      arbitrations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact and Changes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Questions About These Terms?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms of Service, please contact our legal team.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Email:</strong> legal@cooksmartai.com
                    </p>
                    <p>
                      <strong>Address:</strong> CookSmartAI Legal Department
                      <br />
                      42 Example Nagar, Faketown,
                      
                      <br />
                      India 999999
                    </p>
                  </div>
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-800 hover:to-gray-800 text-white">
                      Contact Legal Team
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    We may update these Terms from time to time. We'll notify you of significant changes and give you
                    time to review before they take effect.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Current Version:</strong> 2.1
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {lastUpdated}
                    </p>
                    <p>
                      <strong>Effective Date:</strong> {effectiveDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="py-12 bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Acknowledgment</h3>
            <p className="text-slate-300 mb-6">
              By using CookSmartAI, you acknowledge that you have read these Terms of Service, understand them, and agree
              to be bound by them.
            </p>
            <p className="text-sm text-slate-400">
              Last updated: {lastUpdated} • Effective: {effectiveDate}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
