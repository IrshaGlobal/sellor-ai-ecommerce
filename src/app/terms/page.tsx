import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Shield, AlertCircle, Scale } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Legal Information
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Terms of
            <span className="text-blue-600"> Service</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Please read these terms carefully before using Sellor.ai services.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: November 15, 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-600 mb-4">
                Welcome to Sellor.ai. These Terms of Service ("Terms") govern your use of our e-commerce platform 
                and related services (collectively, the "Service") provided by Sellor.ai Inc. ("Sellor.ai," "we," "us," or "our").
              </p>
              <p className="text-slate-600">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part 
                of these terms, then you may not access the Service.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Acceptance of Terms
              </h2>
              <p className="text-slate-600 mb-4">
                By creating an account, using our Service, or clicking "I agree" during the registration process, 
                you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
              <p className="text-slate-600">
                If you are using the Service on behalf of a company or other legal entity, you represent and warrant 
                that you have the authority to bind that entity to these Terms.
              </p>
            </div>

            {/* Description of Service */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Description of Service
              </h2>
              <p className="text-slate-600 mb-4">
                Sellor.ai is an e-commerce platform that enables individuals and businesses to create and manage 
                online stores, sell products, process payments, and manage customer relationships.
              </p>
              <p className="text-slate-600">
                Our Service includes, but is not limited to: store creation and customization, product management, 
                order processing, payment processing, analytics, and customer support tools.
              </p>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. User Accounts
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.1 Account Creation
                  </h3>
                  <p className="text-slate-600">
                    To use our Service, you must create an account. You must provide accurate, complete, and current 
                    information during registration. You are responsible for maintaining the confidentiality of your 
                    account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.2 Account Responsibilities
                  </h3>
                  <p className="text-slate-600">
                    You are responsible for all activities that occur under your account. You must notify us immediately 
                    of any unauthorized use of your account. Sellor.ai is not liable for any loss or damage arising 
                    from your failure to protect your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    4.3 Account Termination
                  </h3>
                  <p className="text-slate-600">
                    We reserve the right to suspend or terminate your account at any time for violation of these Terms 
                    or for any other reason at our sole discretion.
                  </p>
                </div>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. User Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    5.1 Prohibited Activities
                  </h3>
                  <p className="text-slate-600 mb-2">
                    You agree not to use the Service for any illegal or unauthorized purpose. You must not:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                    <li>Sell illegal products or services</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Engage in fraudulent or deceptive practices</li>
                    <li>Transmit malicious code or viruses</li>
                    <li>Spam or harass other users</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    5.2 Content Standards
                  </h3>
                  <p className="text-slate-600">
                    You are solely responsible for the content you post on your store. You must ensure that all content 
                    complies with applicable laws and does not violate the rights of others.
                  </p>
                </div>
              </div>
            </div>

            {/* Fees and Payments */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Fees and Payments
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.1 Subscription Fees
                  </h3>
                  <p className="text-slate-600">
                    Our Service is offered on a subscription basis with different pricing tiers. Fees are billed 
                    monthly or annually in advance. All fees are non-refundable except as required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.2 Transaction Fees
                  </h3>
                  <p className="text-slate-600">
                    We charge transaction fees on processed payments. The fee structure varies by plan and is 
                    detailed in our Pricing page.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    6.3 Payment Methods
                  </h3>
                  <p className="text-slate-600">
                    We accept major credit cards, PayPal, and other payment methods as specified on our website. 
                    You authorize us to charge your chosen payment method for all fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    7.1 Our Intellectual Property
                  </h3>
                  <p className="text-slate-600">
                    The Service and its original content, features, and functionality are owned by Sellor.ai and are 
                    protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    7.2 Your Content
                  </h3>
                  <p className="text-slate-600">
                    You retain ownership of the content you upload to your store. By using our Service, you grant us 
                    a license to use, modify, and display your content as necessary to provide the Service.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Privacy
              </h2>
              <p className="text-slate-600 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the Service, to understand our practices.
              </p>
              <p className="text-slate-600">
                By using our Service, you consent to the collection and use of information in accordance with 
                our Privacy Policy.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Termination
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    9.1 Termination by You
                  </h3>
                  <p className="text-slate-600">
                    You may terminate your account at any time by following the account deletion process in your 
                    account settings or by contacting our support team.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    9.2 Termination by Us
                  </h3>
                  <p className="text-slate-600">
                    We may terminate or suspend your account immediately, without prior notice or liability, for 
                    any reason, including if you breach the Terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                10. Disclaimer
              </h2>
              <p className="text-slate-600 mb-4">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESSED 
                OR IMPLIED, AND HEREBY DISCLAIM ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES 
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-slate-600">
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-slate-600 mb-4">
                IN NO EVENT SHALL SELLOR.AI, OUR DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES 
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
                LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-slate-600">
                OUR TOTAL LIABILITY TO YOU FOR ANY CAUSE OF ACTION WHATSOEVER, AND REGARDLESS OF THE FORM OF THE ACTION, 
                WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US FOR THE SERVICE DURING THE 
                PRECEDING TWELVE (12) MONTHS.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                12. Governing Law
              </h2>
              <p className="text-slate-600">
                These Terms shall be interpreted and governed by the laws of the State of Delaware, United States, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms will be 
                resolved in the courts of Delaware.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-slate-600">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify 
                you by email or by posting a notice on our website prior to the effective date of the changes. 
                Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                14. Contact Information
              </h2>
              <p className="text-slate-600 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="space-y-2">
                  <p className="text-slate-600">
                    <strong>Email:</strong> legal@sellor.ai
                  </p>
                  <p className="text-slate-600">
                    <strong>Address:</strong> 123 Market Street, San Francisco, CA 94105, United States
                  </p>
                  <p className="text-slate-600">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-100" />
            <span className="text-blue-100 font-medium">Important Notice</span>
          </div>
          <p className="text-blue-100">
            This document is a legal agreement between you and Sellor.ai. Please read it carefully and 
            keep a copy for your records. If you have any questions, consult with a legal professional.
          </p>
        </div>
      </section>
    </div>
  )
}