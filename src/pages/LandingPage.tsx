import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Code, 
  Sparkles, 
  Globe, 
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
  Trophy,
  Clock,
  Target,
  FileText,
  Users,
  Timer,
  Award
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Creation",
      description: "Generate beautiful forms and engaging quizzes with AI in seconds"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "Smart Assessments",
      description: "Create scored quizzes with timers, rankings, and detailed analytics"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Advanced Analytics",
      description: "Track performance, completion rates, and user behavior insights"
    },
    {
      icon: <Timer className="w-8 h-8 text-red-600" />,
      title: "Timer Controls",
      description: "Set quiz time limits and expiry dates with automatic management"
    },
    {
      icon: <Code className="w-8 h-8 text-purple-600" />,
      title: "Easy Embedding",
      description: "Embed forms and quizzes anywhere with simple copy-paste code"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Enterprise Security",
      description: "GDPR compliant with enterprise-grade security features"
    }
  ];

  const useCases = [
    {
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      title: "Forms & Surveys",
      description: "Collect feedback, registrations, and data with smart forms",
      examples: ["Customer Feedback", "Event Registration", "Lead Generation", "Contact Forms"]
    },
    {
      icon: <Trophy className="w-12 h-12 text-purple-600" />,
      title: "Quizzes & Assessments",
      description: "Create engaging quizzes with scoring and leaderboards",
      examples: ["Knowledge Tests", "Skill Assessments", "Training Quizzes", "Certifications"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      content: "FormPulse transformed how we collect user feedback and assess team knowledge. The AI suggestions increased our completion rates by 40%.",
      rating: 5,
      useCase: "Forms & Quizzes"
    },
    {
      name: "Mike Rodriguez",
      role: "HR Director",
      content: "The quiz analytics are incredible. We can track employee training progress and see exactly where they need more support.",
      rating: 5,
      useCase: "Training Assessments"
    },
    {
      name: "Emily Davis",
      role: "Education Coordinator",
      content: "Creating educational quizzes has never been this easy. The timer and scoring features are perfect for our courses.",
      rating: 5,
      useCase: "Educational Quizzes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FormPulse</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <button onClick={() => navigate("/pricing")} className="text-gray-600 hover:text-gray-900">Pricing</button>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Reviews</a>
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
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Forms & Quizzes
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Forms & Quizzes with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Magic</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build beautiful forms and engaging quizzes in seconds using AI. Get detailed analytics, 
              scoring systems, timer controls, and secure cloud storage for all your responses.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => navigate("/signup")}>
              Start Building for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
              View Pricing
            </Button>
          </div>

          {/* Hero Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">{useCase.icon}</div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {useCase.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-700">Smart Forms</p>
                    <p className="text-xs text-gray-500">AI-Generated Templates</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-700">Interactive Quizzes</p>
                    <p className="text-xs text-gray-500">Scoring & Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for forms and quizzes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered creation to advanced analytics and scoring systems, FormPulse has all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Trusted by thousands of businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">75K+</div>
              <div className="text-blue-100">Forms & Quizzes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3M+</div>
              <div className="text-blue-100">Responses & Attempts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">45%</div>
              <div className="text-blue-100">Avg. Engagement Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What our customers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-xs text-blue-600 mt-1">{testimonial.useCase}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to transform your forms and quizzes?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses using FormPulse to create better forms, engaging quizzes, and collect more responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => navigate("/signup")}>
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
              View Pricing
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
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><button onClick={() => navigate("/pricing")} className="hover:text-white">Pricing</button></li>
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
  );
};

export default LandingPage; 