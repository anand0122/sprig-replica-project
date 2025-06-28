import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "How AI is Revolutionizing Form Building in 2024",
      excerpt: "Discover how artificial intelligence is transforming the way we create, optimize, and analyze forms. Learn about the latest AI-powered features that can boost your conversion rates.",
      content: "AI-powered form building is changing the game for businesses of all sizes...",
      author: "Sarah Johnson",
      date: "2024-12-20",
      readTime: "8 min read",
      category: "AI & Technology",
      image: "/blog/ai-forms.jpg",
      tags: ["AI", "Form Building", "Conversion Optimization", "Technology"],
      featured: true,
      slug: "ai-revolutionizing-form-building-2024"
    },
    {
      id: 2,
      title: "10 Proven Strategies to Increase Form Conversion Rates",
      excerpt: "Learn the top strategies used by successful companies to boost their form completion rates by up to 300%. Includes real case studies and actionable tips.",
      content: "Form conversion optimization is crucial for business success...",
      author: "Michael Chen",
      date: "2024-12-18",
      readTime: "12 min read",
      category: "Conversion Optimization",
      image: "/blog/conversion-rates.jpg",
      tags: ["Conversion", "Optimization", "UX Design", "Analytics"],
      featured: true,
      slug: "increase-form-conversion-rates-strategies"
    },
    {
      id: 3,
      title: "GDPR Compliance for Online Forms: Complete Guide 2024",
      excerpt: "Everything you need to know about making your forms GDPR compliant. Includes templates, checklists, and best practices for data protection.",
      content: "GDPR compliance is essential for any business collecting data...",
      author: "Emma Rodriguez",
      date: "2024-12-15",
      readTime: "15 min read",
      category: "Privacy & Compliance",
      image: "/blog/gdpr-compliance.jpg",
      tags: ["GDPR", "Privacy", "Compliance", "Data Protection"],
      featured: false,
      slug: "gdpr-compliance-online-forms-guide"
    },
    {
      id: 4,
      title: "The Ultimate Guide to Quiz Marketing: Engage and Convert",
      excerpt: "Discover how interactive quizzes can boost engagement, generate leads, and provide valuable customer insights. Includes 20+ quiz templates.",
      content: "Quiz marketing has become one of the most effective ways to engage audiences...",
      author: "David Park",
      date: "2024-12-12",
      readTime: "10 min read",
      category: "Marketing",
      image: "/blog/quiz-marketing.jpg",
      tags: ["Quiz Marketing", "Lead Generation", "Engagement", "Interactive Content"],
      featured: false,
      slug: "ultimate-guide-quiz-marketing"
    },
    {
      id: 5,
      title: "Form Analytics: Measuring What Matters for Better Results",
      excerpt: "Learn how to track, analyze, and optimize your form performance using advanced analytics. Discover the key metrics that drive success.",
      content: "Form analytics provide crucial insights into user behavior...",
      author: "Lisa Wang",
      date: "2024-12-10",
      readTime: "9 min read",
      category: "Analytics",
      image: "/blog/form-analytics.jpg",
      tags: ["Analytics", "Metrics", "Optimization", "Data Analysis"],
      featured: false,
      slug: "form-analytics-measuring-success"
    },
    {
      id: 6,
      title: "Mobile-First Form Design: Best Practices for 2024",
      excerpt: "With mobile traffic dominating, learn how to design forms that work perfectly on all devices. Includes responsive design tips and mobile UX principles.",
      content: "Mobile-first design is no longer optional in today's digital landscape...",
      author: "Alex Thompson",
      date: "2024-12-08",
      readTime: "7 min read",
      category: "Design & UX",
      image: "/blog/mobile-forms.jpg",
      tags: ["Mobile Design", "UX", "Responsive Design", "User Experience"],
      featured: false,
      slug: "mobile-first-form-design-best-practices"
    }
  ];

  const categories = [
    { name: "All Posts", count: blogPosts.length, active: true },
    { name: "AI & Technology", count: 1, active: false },
    { name: "Conversion Optimization", count: 1, active: false },
    { name: "Privacy & Compliance", count: 1, active: false },
    { name: "Marketing", count: 1, active: false },
    { name: "Analytics", count: 1, active: false },
    { name: "Design & UX", count: 1, active: false }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 4);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "FormPulse Blog",
    "description": "Expert insights on form building, AI, conversion optimization, and data collection",
    "url": "https://formpulse.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "FormPulse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://formpulse.com/logo.png"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://formpulse.com/blog/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "image": `https://formpulse.com${post.image}`,
      "keywords": post.tags.join(", ")
    }))
  };

  return (
    <>
      <SEOHead
        title="FormPulse Blog - Expert Insights on Form Building, AI & Conversion Optimization"
        description="Discover expert tips, strategies, and insights on form building, AI automation, conversion optimization, and data collection. Stay ahead with the latest trends."
        keywords="form building blog, AI forms, conversion optimization, GDPR compliance, quiz marketing, form analytics, mobile forms, UX design, data collection tips"
        image="https://formpulse.com/blog-og.png"
        url="https://formpulse.com/blog"
        type="website"
        structuredData={blogStructuredData}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                FormPulse Blog
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Expert insights on form building, AI automation, conversion optimization, and data collection strategies
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category, index) => (
                  <Badge 
                    key={index} 
                    variant={category.active ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">Featured Article</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Posts */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      {post.category === "AI & Technology" && <Brain className="w-12 h-12 text-blue-600 mx-auto mb-2" />}
                      {post.category === "Conversion Optimization" && <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />}
                      {post.category === "Privacy & Compliance" && <Shield className="w-12 h-12 text-purple-600 mx-auto mb-2" />}
                      {post.category === "Marketing" && <Target className="w-12 h-12 text-orange-600 mx-auto mb-2" />}
                      {post.category === "Analytics" && <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-2" />}
                      {post.category === "Design & UX" && <Zap className="w-12 h-12 text-pink-600 mx-auto mb-2" />}
                      <p className="text-xs text-gray-500">{post.category}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest insights on form building, AI, and conversion optimization delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Join 10,000+ professionals. Unsubscribe anytime.
            </p>
          </section>
        </main>

        {/* Footer CTA */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Better Forms?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Put these insights into practice with FormPulse's AI-powered form builder.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Building Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog; 