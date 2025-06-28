import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building2, 
  Rocket,
  ArrowRight,
  Star,
  Users,
  FileText,
  Trophy,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Headphones
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI-powered forms",
      features: [
        "Up to 100 form responses/month",
        "5 forms and quizzes",
        "Basic AI form generation",
        "Standard form templates",
        "Email notifications",
        "Basic analytics",
        "Community support",
        "FormPulse branding"
      ],
      limitations: [
        "Advanced integrations",
        "Custom branding",
        "Priority support",
        "Advanced analytics"
      ],
      cta: "Get Started Free",
      popular: false,
      icon: Zap,
      color: "border-gray-200"
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Best for growing businesses and marketing teams",
      features: [
        "Up to 10,000 responses/month",
        "Unlimited forms and quizzes",
        "Advanced AI features",
        "All premium templates",
        "Remove FormPulse branding",
        "Advanced analytics & insights",
        "40+ integrations",
        "Conditional logic",
        "Custom CSS styling",
        "Email & chat support",
        "Team collaboration (5 seats)",
        "Export data (CSV, Excel)"
      ],
      limitations: [
        "Enterprise integrations",
        "SSO authentication",
        "Priority support"
      ],
      cta: "Start Pro Trial",
      popular: true,
      icon: Crown,
      color: "border-blue-500 ring-2 ring-blue-500"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited responses",
        "Unlimited forms and quizzes",
        "Full AI suite access",
        "White-label solution",
        "Advanced security & compliance",
        "Custom integrations",
        "API access",
        "SSO authentication",
        "Unlimited team members",
        "Priority support",
        "Custom onboarding",
        "SLA guarantee",
        "Advanced reporting",
        "Custom workflows"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      icon: Building2,
      color: "border-purple-500"
    }
  ];

  const features = [
    {
      category: "Form Building",
      items: [
        { name: "AI Form Generation", free: true, pro: true, enterprise: true },
        { name: "Drag & Drop Builder", free: true, pro: true, enterprise: true },
        { name: "Form Templates", free: "Basic", pro: "All Premium", enterprise: "All + Custom" },
        { name: "Question Types", free: "10+", pro: "20+", enterprise: "Unlimited" },
        { name: "Conditional Logic", free: false, pro: true, enterprise: true },
        { name: "Multi-step Forms", free: false, pro: true, enterprise: true }
      ]
    },
    {
      category: "Analytics & Insights",
      items: [
        { name: "Basic Analytics", free: true, pro: true, enterprise: true },
        { name: "Advanced Reports", free: false, pro: true, enterprise: true },
        { name: "Real-time Analytics", free: false, pro: true, enterprise: true },
        { name: "Custom Dashboards", free: false, pro: false, enterprise: true },
        { name: "Data Export", free: false, pro: true, enterprise: true }
      ]
    },
    {
      category: "Integrations",
      items: [
        { name: "Basic Integrations", free: "5", pro: "40+", enterprise: "Unlimited" },
        { name: "Zapier", free: false, pro: true, enterprise: true },
        { name: "API Access", free: false, pro: "Limited", enterprise: "Full" },
        { name: "Webhooks", free: false, pro: true, enterprise: true },
        { name: "Custom Integrations", free: false, pro: false, enterprise: true }
      ]
    },
    {
      category: "Support & Security",
      items: [
        { name: "Community Support", free: true, pro: true, enterprise: true },
        { name: "Email Support", free: false, pro: true, enterprise: true },
        { name: "Priority Support", free: false, pro: false, enterprise: true },
        { name: "GDPR Compliance", free: true, pro: true, enterprise: true },
        { name: "SSO Authentication", free: false, pro: false, enterprise: true },
        { name: "SLA Guarantee", free: false, pro: false, enterprise: true }
      ]
    }
  ];

  const testimonials = [
    {
      quote: "FormPulse Pro has transformed our lead generation. The AI features alone saved us 20 hours per week.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "The enterprise plan gives us everything we need for compliance and scalability. Worth every penny.",
      author: "Michael Chen",
      role: "IT Director",
      company: "GlobalTech Inc",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle."
    },
    {
      question: "What happens if I exceed my response limit?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional responses as needed."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. You only pay the monthly subscription fee."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your billing period."
    }
  ];

  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "FormPulse",
    "description": "AI-powered form builder with advanced analytics and integrations",
    "brand": {
      "@type": "Brand",
      "name": "FormPulse"
    },
    "offers": plans.map(plan => ({
      "@type": "Offer",
      "name": `${plan.name} Plan`,
      "price": plan.price.replace('$', ''),
      "priceCurrency": "USD",
      "description": plan.description,
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": plan.price.replace('$', ''),
        "priceCurrency": "USD",
        "billingPeriod": plan.period === "forever" ? "P1Y" : "P1M"
      }
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      <SEOHead
        title="FormPulse Pricing - AI-Powered Form Builder Plans | Free & Paid Options"
        description="Choose the perfect FormPulse plan for your needs. Free forever plan available. Pro plans start at $29/month with advanced AI features, analytics, and integrations."
        keywords="form builder pricing, AI forms cost, survey tool pricing, form analytics pricing, quiz builder plans, lead generation tool cost, conversion optimization pricing"
        image="https://formpulse.com/pricing-og.png"
        url="https://formpulse.com/pricing"
        type="website"
        structuredData={pricingStructuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">FormPulse</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="/#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <span className="text-blue-600 font-medium">Pricing</span>
                <a href="/#testimonials" className="text-gray-600 hover:text-gray-900">Reviews</a>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Choose Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Plan</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Start free and scale as you grow. All plans include forms, quizzes, and analytics.
              </p>
              
              {/* Annual/Monthly Toggle */}
              <div className="inline-flex items-center gap-4 bg-white rounded-full p-1 border shadow-sm">
                <button className="px-6 py-2 rounded-full text-sm font-medium text-gray-600">
                  Monthly
                </button>
                <button className="px-6 py-2 rounded-full text-sm font-medium bg-blue-600 text-white">
                  Annual (Save 20%)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'transform scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate(plan.name === "Enterprise" ? "/contact" : "/signup")}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <>
                          <h4 className="font-semibold text-gray-900 mt-6 mb-3">Not included:</h4>
                          {plan.limitations.map((limitation, limitIndex) => (
                            <div key={limitIndex} className="flex items-start gap-3">
                              <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Compare All Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features for creating, managing, and analyzing forms and quizzes
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center p-4 font-semibold text-gray-900 bg-blue-50">Pro</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-gray-100">
                        <td colSpan={4} className="p-4 font-semibold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={`item-${categoryIndex}-${itemIndex}`} className="border-t">
                          <td className="p-4 text-gray-700">{item.name}</td>
                          <td className="p-4 text-center">
                            {typeof item.free === 'boolean' ? (
                              item.free ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{item.free}</span>
                            )}
                          </td>
                          <td className="p-4 text-center bg-blue-50">
                            {typeof item.pro === 'boolean' ? (
                              item.pro ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{item.pro}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof item.enterprise === 'boolean' ? (
                              item.enterprise ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{item.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of businesses using FormPulse to create better forms and quizzes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate("/signup")}>
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Headphones className="w-4 h-4 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">FormPulse</span>
                </div>
                <p className="text-gray-400">
                  AI-powered forms and quizzes for modern businesses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/#features" className="hover:text-white">Features</a></li>
                  <li><span className="text-white">Pricing</span></li>
                  <li>Templates</li>
                  <li>Integrations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Documentation</li>
                  <li>API</li>
                  <li>Status</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 FormPulse. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Pricing; 