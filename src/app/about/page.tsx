import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Globe, Award, Target, Heart, ArrowRight } from "lucide-react"
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            About Sellor.ai
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Empowering
            <span className="text-blue-600"> Entrepreneurs</span>
            Worldwide
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to make e-commerce accessible to everyone, 
            from small startups to established businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/auth">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Meet Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-slate-600">Active Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">$2B+</div>
              <div className="text-slate-600">GMV Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-slate-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                We believe that everyone should have the opportunity to start and grow their own business. 
                Our mission is to provide the tools, technology, and support that make e-commerce accessible 
                to entrepreneurs of all sizes.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                From the local artisan selling handmade goods to the global enterprise managing thousands of 
                products, we're here to help you succeed in the digital marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/about">Learn More <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Mission-Driven</h3>
                  <p className="text-sm text-slate-600">
                    Focused on your success above all else
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Customer-First</h3>
                  <p className="text-sm text-slate-600">
                    Your success is our success
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Community-Focused</h3>
                  <p className="text-sm text-slate-600">
                    Building a network of successful entrepreneurs
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Excellence</h3>
                  <p className="text-sm text-slate-600">
                    Committed to delivering the best
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From a simple idea to a global platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">2019</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  The Beginning
                </h3>
                <p className="text-slate-600">
                  Founded by a team of e-commerce experts who saw the need for a more accessible 
                  platform for small businesses to sell online.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">2021</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Rapid Growth
                </h3>
                <p className="text-slate-600">
                  Reached 10,000 active stores and expanded our team to serve customers in over 
                  50 countries worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">2024</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Global Impact
                </h3>
                <p className="text-slate-600">
                  Now powering over 50,000 stores and processing billions in GMV, helping entrepreneurs 
                  achieve their dreams worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Customer Success
                </h3>
                <p className="text-slate-600">
                  We're obsessed with helping our customers succeed. Your wins are our wins.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Global Thinking
                </h3>
                <p className="text-slate-600">
                  We build for a global audience, understanding diverse needs and markets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Excellence
                </h3>
                <p className="text-slate-600">
                  We strive for excellence in everything we do, from code to customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Innovation
                </h3>
                <p className="text-slate-600">
                  We constantly innovate to bring you the latest e-commerce technology and features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Passion
                </h3>
                <p className="text-slate-600">
                  We're passionate about e-commerce and helping entrepreneurs achieve their dreams.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Integrity
                </h3>
                <p className="text-slate-600">
                  We operate with transparency, honesty, and integrity in all our dealings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the people behind Sellor.ai
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Sarah Chen</h3>
              <p className="text-sm text-blue-600 mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-slate-600">
                Former VP of Engineering at Amazon, 15+ years in e-commerce
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Michael Rodriguez</h3>
              <p className="text-sm text-blue-600 mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-slate-600">
                Ex-Google senior engineer, expert in scalable systems
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Emily Johnson</h3>
              <p className="text-sm text-blue-600 mb-2">CPO</p>
              <p className="text-sm text-slate-600">
                Former product lead at Shopify, passionate about user experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">David Kim</h3>
              <p className="text-sm text-blue-600 mb-2">CFO</p>
              <p className="text-sm text-slate-600">
                Former investment banker, expert in fintech and payments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're always looking for talented people who share our passion for helping entrepreneurs succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50" asChild>
              <Link href="/careers">View Open Positions</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/auth">Start Your Store</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}