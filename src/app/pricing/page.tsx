import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap, Crown, Rocket, Building2 } from "lucide-react"
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Choose Your Perfect
            <span className="text-blue-600"> Plan</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprise charges.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-slate-600">Monthly</span>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-slate-600">Annual (Save 20%)</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription className="text-slate-600">
                  Perfect for small businesses just getting started
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">$29</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Billed monthly or $23/month annually</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full mb-6" variant="outline" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Up to 100 products</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Mobile responsive store</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Payment processing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">1% transaction fee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-blue-600 shadow-xl hover:shadow-2xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription className="text-slate-600">
                  For growing businesses that need more power
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">$79</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Billed monthly or $63/month annually</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Up to 1,000 products</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Custom themes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Abandoned cart recovery</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">0.5% transaction fee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-slate-600">
                  For large businesses with advanced needs
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">$299</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Billed monthly or $239/month annually</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full mb-6" variant="outline" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Unlimited products</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Custom analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">White-label solution</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">0% transaction fee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Feature Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Compare All Features
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">Starter</th>
                    <th className="text-center py-4 px-4">Professional</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">Products</td>
                    <td className="text-center py-4 px-4">Up to 100</td>
                    <td className="text-center py-4 px-4">Up to 1,000</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Storage</td>
                    <td className="text-center py-4 px-4">1 GB</td>
                    <td className="text-center py-4 px-4">10 GB</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Bandwidth</td>
                    <td className="text-center py-4 px-4">100 GB/month</td>
                    <td className="text-center py-4 px-4">1 TB/month</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Staff Accounts</td>
                    <td className="text-center py-4 px-4">1</td>
                    <td className="text-center py-4 px-4">5</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Transaction Fee</td>
                    <td className="text-center py-4 px-4">1%</td>
                    <td className="text-center py-4 px-4">0.5%</td>
                    <td className="text-center py-4 px-4">0%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Custom Domain</td>
                    <td className="text-center py-4 px-4">✓</td>
                    <td className="text-center py-4 px-4">✓</td>
                    <td className="text-center py-4 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">SSL Certificate</td>
                    <td className="text-center py-4 px-4">✓</td>
                    <td className="text-center py-4 px-4">✓</td>
                    <td className="text-center py-4 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">API Access</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">Basic</td>
                    <td className="text-center py-4 px-4">Full</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-slate-600">
                No, there are no setup fees. You only pay your monthly or annual subscription fee.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Do you offer a free trial?
              </h3>
              <p className="text-slate-600">
                Yes! We offer a 14-day free trial on all plans. No credit card required to start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful sellers using Sellor.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50" asChild>
              <Link href="/auth">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}