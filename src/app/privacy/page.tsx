import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Database, User, Lock, Globe, Calendar, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy & Security
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Privacy
            <span className="text-green-600"> Policy</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: November 15, 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-600 mb-4">
                Sellor.ai Inc. ("Sellor.ai," "we," "us," or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our e-commerce platform and related services.
              </p>
              <p className="text-slate-600">
                This policy applies to all users of our Service, including both merchants and customers. 
                By using Sellor.ai, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    2.1 Personal Information
                  </h3>
                  <p className="text-slate-600 mb-2">
                    We collect personal information that you voluntarily provide when:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                    <li>Creating an account (name, email, password)</li>
                    <li>Setting up your store (business information, address)</li>
                    <li>Making purchases (shipping address, payment details)</li>
                    <li>Contacting support (communication details)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    2.2 Business Information
                  </h3>
                  <p className="text-slate-600 mb-2">
                    For merchants, we collect:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                    <li>Business name and registration details</li>
                    <li>Product information and inventory data</li>
                    <li>Sales and transaction history</li>
                    <li>Customer data (for order fulfillment)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    2.3 Technical Information
                  </h3>
                  <p className="text-slate-600 mb-2">
                    We automatically collect technical information such as:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Referral sources and search terms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    2.4 Cookies and Tracking
                  </h3>
                  <p className="text-slate-600">
                    We use cookies and similar technologies to enhance your experience, analyze traffic, 
                    and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. How We Use Your Information
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Service Provision
                    </h3>
                    <p className="text-slate-600">
                      To provide, maintain, and improve our services, including order processing, 
                      payment handling, and customer support.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Analytics and Improvement
                    </h3>
                    <p className="text-slate-600">
                      To analyze usage patterns, improve our platform, and develop new features 
                      that better serve your needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Personalization
                    </h3>
                    <p className="text-slate-600">
                      To personalize your experience, show relevant content, and provide 
                      targeted recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Security and Fraud Prevention
                    </h3>
                    <p className="text-slate-600">
                      To detect and prevent fraudulent activities, protect against unauthorized access, 
                      and ensure the security of our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Information Sharing
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.1 We Do Not Sell Your Information
                  </h3>
                  <p className="text-slate-600">
                    We never sell your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.2 Service Providers
                  </h3>
                  <p className="text-slate-600">
                    We share information with trusted third-party service providers who assist us in 
                    operating our service, such as payment processors, hosting providers, and analytics services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.3 Legal Requirements
                  </h3>
                  <p className="text-slate-600">
                    We may disclose your information if required by law, court order, or to protect 
                    our rights, property, or safety, or that of our users or the public.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.4 Business Transfers
                  </h3>
                  <p className="text-slate-600">
                    In the event of a merger, acquisition, or sale of assets, user information may be 
                    transferred as part of the transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-slate-600 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Encryption</h3>
                  <p className="text-sm text-slate-600">
                    All data is encrypted in transit and at rest using industry-standard protocols.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Access Controls</h3>
                  <p className="text-sm text-slate-600">
                    Strict access controls limit who can access your information within our organization.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Regular Audits</h3>
                  <p className="text-sm text-slate-600">
                    We conduct regular security audits and vulnerability assessments.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Compliance</h3>
                  <p className="text-sm text-slate-600">
                    We comply with GDPR, CCPA, and other applicable privacy regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.1 Access and Correction
                  </h3>
                  <p className="text-slate-600">
                    You have the right to access and update your personal information through your account settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.2 Data Deletion
                  </h3>
                  <p className="text-slate-600">
                    You can request deletion of your personal information, subject to legal and contractual obligations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.3 Data Portability
                  </h3>
                  <p className="text-slate-600">
                    You can request a copy of your data in a structured, machine-readable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.4 Opt-Out
                  </h3>
                  <p className="text-slate-600">
                    You can opt out of marketing communications and certain data collection activities.
                  </p>
                </div>
              </div>
            </div>

            {/* International Data Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. International Data Transfers
              </h2>
              <p className="text-slate-600 mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for international data transfers, including:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions where applicable</li>
                <li>Binding corporate rules</li>
                <li>Other legal mechanisms as required</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-slate-600">
                Our Service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If we become aware that we have 
                collected such information, we will take steps to delete it promptly.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new policy on our website and sending you an email 
                notification. Your continued use of the Service after such changes constitutes 
                acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                10. Contact Information
              </h2>
              <p className="text-slate-600 mb-4">
                If you have any questions about this Privacy Policy or want to exercise your rights, 
                please contact our Data Protection Officer:
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="space-y-2">
                  <p className="text-slate-600">
                    <strong>Email:</strong> privacy@sellor.ai
                  </p>
                  <p className="text-slate-600">
                    <strong>Address:</strong> 123 Market Street, San Francisco, CA 94105, United States
                  </p>
                  <p className="text-slate-600">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p className="text-slate-600">
                    <strong>DPO Contact:</strong> dpo@sellor.ai
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Security Badge */}
      <section className="py-12 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-100" />
            <span className="text-green-100 font-medium">Your Privacy Matters</span>
          </div>
          <p className="text-green-100">
            We are committed to protecting your privacy and maintaining the security of your data. 
            Our practices comply with GDPR, CCPA, and other international privacy regulations.
          </p>
        </div>
      </section>
    </div>
  )
}