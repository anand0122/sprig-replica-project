import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { 
  ArrowRight, 
  Play, 
  Users, 
  BarChart3, 
  FileText, 
  Brain,
  Zap,
  Target,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Lightbulb,
  Trophy,
  Code,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  // SEO: Set dynamic page title and meta description
  useEffect(() => {
    document.title = "FormPulse - AI-Powered Form Builder | Create Smart Forms & Surveys in Minutes";
    
    // Update meta description if needed
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build beautiful, high-converting forms and surveys with AI in seconds. Advanced analytics, 40+ integrations, GDPR compliant. Start free - no coding required!');
    }
  }, []);

  // SEO structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FormPulse",
    "url": "https://formpulse.com",
    "logo": "https://formpulse.com/logo.png",
    "description": "AI-powered form builder for creating beautiful, high-converting forms and surveys",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/FormPulse",
      "https://linkedin.com/company/formpulse"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@formpulse.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free plan available"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Form Generation",
      description: "Generate beautiful forms and engaging quizzes with artificial intelligence in seconds. From images to PDFs, URLs to stories - our AI creates intelligent forms from any content.",
      category: "AI Creation",
      gradient: "from-blue-500 to-purple-600",
      keywords: "AI form builder, artificial intelligence forms, automated form creation"
    },
    {
      icon: FileText,
      title: "Advanced Drag-and-Drop Form Builder",
      description: "Create professional forms with drag-and-drop ease. Multiple question types, conditional logic, and real-time collaboration make form building effortless.",
      category: "Form Building",
      gradient: "from-green-500 to-teal-600",
      keywords: "drag drop form builder, online form creator, form designer"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics & Form Insights",
      description: "Get deep insights into form performance with real-time analytics, completion tracking, and AI-powered recommendations for optimization.",
      category: "Analytics",
      gradient: "from-orange-500 to-red-600",
      keywords: "form analytics, survey analytics, data insights, conversion tracking"
    },
    {
      icon: Trophy,
      title: "Interactive Quiz & Survey System",
      description: "Build engaging quizzes with scoring, timers, and leaderboards. Perfect for education, training, and customer engagement surveys.",
      category: "Quizzes",
      gradient: "from-purple-500 to-pink-600",
      keywords: "quiz builder, survey creator, online quiz maker, interactive surveys"
    }
  ];

  const useCases = [
    {
      icon: TrendingUp,
      title: "Boost Form Conversion Rates",
      description: "Optimize your forms for maximum completion rates with AI insights"
    },
    {
      icon: Target,
      title: "Collect Quality Lead Data",
      description: "Advanced validation ensures clean, actionable customer data"
    },
    {
      icon: Clock,
      title: "Save Development Time",
      description: "No coding required - launch professional forms in minutes"
    },
    {
      icon: Shield,
      title: "Enterprise Security & GDPR",
      description: "GDPR compliant with enterprise-grade security and data protection"
    }
  ];

  const teams = [
    {
      icon: Users,
      title: "Marketing Teams",
      description: "Lead generation forms, customer feedback surveys, and campaign optimization tools",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Lightbulb,
      title: "HR Departments",
      description: "Employee surveys, job application forms, and onboarding questionnaires",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Product Teams",
      description: "User research forms, feature feedback surveys, and product validation tools",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Sales Teams",
      description: "Lead qualification forms, customer surveys, and feedback collection systems",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const testimonials = [
    {
      company: "TechCorp Solutions",
      logo: "💼",
      quote: "FormPulse transformed our data collection process. The AI features saved us hours of work and increased our form completion rates by 40%.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      rating: 5
    },
    {
      company: "EduTech Academy",
      logo: "🎓",
      quote: "The quiz builder is incredible. Our student engagement increased by 300% and the analytics help us improve our courses.",
      author: "Dr. Michael Chen",
      role: "Education Technology Lead",
      rating: 5
    },
    {
      company: "StartupX Inc",
      logo: "🚀",
      quote: "From simple surveys to complex forms, FormPulse handles everything we need. The integrations with our CRM are seamless.",
      author: "Alex Rivera",
      role: "Product Manager",
      rating: 5
    }
  ];

  const integrations = [
    { name: "Google Sheets", logo: "📊", description: "Sync form data automatically" },
    { name: "Slack", logo: "💬", description: "Get instant notifications" },
    { name: "Zapier", logo: "⚡", description: "Connect 5000+ apps" },
    { name: "HubSpot CRM", logo: "🎯", description: "Manage leads efficiently" },
    { name: "Mailchimp", logo: "📧", description: "Email marketing automation" },
    { name: "Notion", logo: "📝", description: "Organize responses" }
  ];

  const stats = [
    { value: "50+", label: "AI-powered form templates", description: "Ready-to-use templates" },
    { value: "99.9%", label: "Uptime guarantee", description: "Reliable service" },
    { value: "2min", label: "Average setup time", description: "Quick deployment" },
    { value: "GDPR", label: "Compliant & secure", description: "Data protection" }
  ];

  return (
    <>
      <SEOHead
        title="FormPulse - AI-Powered Form Builder | Create Smart Forms & Surveys in Minutes"
        description="Build beautiful, high-converting forms and surveys with AI in seconds. Advanced analytics, 40+ integrations, GDPR compliant. Start free - no coding required!"
        keywords="form builder, AI forms, survey creator, online forms, form analytics, quiz builder, data collection, lead generation, customer feedback, form templates, drag drop forms, conditional logic, form integrations, GDPR forms, responsive forms, AI form generator, online survey tool"
        image="https://formpulse.com/og-image.png"
        url="https://formpulse.com/"
        type="website"
        structuredData={homepageStructuredData}
      />
      
      <div className="min-h-screen bg-white">
      {/* SEO: Structured Navigation with proper semantic HTML */}
      <header>
        <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">FormPulse</div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
                  <a href="#templates" className="text-gray-700 hover:text-gray-900 transition-colors">Templates</a>
                  <a href="#integrations" className="text-gray-700 hover:text-gray-900 transition-colors">Integrations</a>
                  <button onClick={() => navigate("/pricing")} className="text-gray-700 hover:text-gray-900 transition-colors">Pricing</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* SEO: Hero Section with proper heading hierarchy */}
        <section className="pt-20 pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50" aria-label="Hero section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800">
                <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
                New: AI Form Generation & Smart Analytics
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Create Intelligent Forms with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Power
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Build beautiful forms, surveys, and quizzes in minutes with AI assistance. 
                Collect data smarter, analyze deeper, and make better decisions with the most advanced form builder.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
                  Start Building Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            {/* Hero Visual */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-600">formpulse.com/builder</span>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Brain className="w-8 h-8 text-blue-600" />
              <div>
                          <h3 className="font-semibold text-gray-900">AI Form Builder</h3>
                          <p className="text-sm text-gray-600">Generate forms from any content</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-2">✨ AI Suggestion:</p>
                        <p className="text-sm text-blue-700">Add a rating question about user satisfaction to increase engagement by 45%</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900">Interactive Quiz</h4>
                        <div className="mt-4 space-y-2">
                          <div className="bg-white/80 rounded px-3 py-2 text-sm">Question 1 of 5</div>
                          <div className="bg-white/80 rounded px-3 py-2 text-sm">⏱️ 2:30 remaining</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything you need to collect data intelligently
              </h2>
              <p className="text-xl text-gray-600">
                From AI-powered creation to advanced analytics, FormPulse has all the tools you need.
              </p>
            </div>

            <div className="space-y-20">
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center gap-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-4 text-xs">
                      {feature.category}
                    </Badge>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center gap-4">
                      <Button>
                        Try {feature.category}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className={`h-80 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className="w-24 h-24 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why teams choose FormPulse
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features that help you collect better data and make smarter decisions
              </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <useCase.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
              </div>
        </section>

        {/* Teams Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for every team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you're in marketing, HR, product, or sales - FormPulse adapts to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teams.map((team, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${team.color} rounded-lg flex items-center justify-center mb-4`}>
                      <team.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.title}</h3>
                    <p className="text-gray-600 text-sm">{team.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by teams worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{testimonial.logo}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
        </section>

        {/* Integrations */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Integrates with your favorite tools
              </h2>
              <p className="text-xl text-gray-600">
                Connect FormPulse with the tools you already use
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {integrations.map((integration, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{integration.logo}</div>
                  <div className="text-sm font-medium text-gray-700">{integration.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your data collection?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of teams who trust FormPulse for their form and survey needs
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4" onClick={() => navigate("/signup")}>
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold">FormPulse</div>
              </div>
              <p className="text-gray-400 mb-4">
                The intelligent form builder that helps you collect better data and make smarter decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Form Builder</li>
                <li>Quiz Creator</li>
                <li>Analytics</li>
                <li>Templates</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Status</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FormPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Index;
