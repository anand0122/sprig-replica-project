import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  FileText, 
  Image, 
  Video, 
  Link, 
  Newspaper, 
  FileImage,
  Sparkles,
  Zap,
  BookOpen,
  RotateCcw,
  Layers,
  ArrowRight,
  Upload,
  Globe,
  Plus,
  Trophy,
  Clock,
  Target,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Building,
  Monitor,
  Heart,
  ShoppingCart,
  Calendar,
  MessageSquare,
  UserCheck,
  ClipboardList,
  Star,
  TrendingUp,
  Mail,
  Crown,
  Settings,
  Workflow,
  BarChart3,
  CreditCard,
  Globe2,
  Palette
} from "lucide-react";


const CreateForm = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedBuilderType, setSelectedBuilderType] = useState<'basic' | 'enhanced'>('enhanced');
  const [activeTab, setActiveTab] = useState<'forms' | 'quizzes'>('forms');

  // Builder type comparison for Forms
  const formBuilderTypes = {
    enhanced: {
      title: "Enhanced Builder",
      subtitle: "Enterprise-grade form creation",
      description: "Full-featured builder with AI assistance, conditional logic, workflows, team collaboration, payments, and 40+ integrations",
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      color: "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200",
      features: [
        "AI-Powered Generation",
        "Conditional Logic & Workflows", 
        "Multi-Step Forms",
        "Team Collaboration",
        "Payment Integration",
        "Advanced Analytics",
        "40+ Integrations",
        "Custom Branding"
      ],
      badge: "Recommended",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    basic: {
      title: "Basic Builder",
      subtitle: "Simple form creation",
      description: "Straightforward form builder for basic data collection with essential question types and simple customization",
      icon: <FileText className="w-6 h-6 text-gray-600" />,
      color: "bg-gray-50 border-gray-200",
      features: [
        "Basic Question Types",
        "Simple Customization",
        "Form Templates",
        "Response Collection",
        "Basic Analytics",
        "Email Notifications",
        "Public Sharing",
        "Export Data"
      ],
      badge: "Quick Start",
      badgeColor: "bg-gray-100 text-gray-700"
    }
  };

  // Builder type comparison for Quizzes
  const quizBuilderTypes = {
    enhanced: {
      title: "AI Quiz Builder",
      subtitle: "Intelligent assessment creation",
      description: "Advanced quiz builder with AI content generation, auto-grading, adaptive questioning, and comprehensive analytics",
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      color: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
      features: [
        "AI Content Generation",
        "Auto-Grading System",
        "Adaptive Questions",
        "Smart Analytics",
        "Performance Tracking",
        "Question Banks",
        "Timed Assessments",
        "Certification Support"
      ],
      badge: "AI-Powered",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    basic: {
      title: "Simple Quiz Builder",
      subtitle: "Quick assessment creation",
      description: "Easy-to-use quiz builder for creating basic assessments with multiple choice, true/false, and simple scoring",
      icon: <Trophy className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
      features: [
        "Multiple Choice Questions",
        "True/False Questions",
        "Basic Scoring",
        "Time Limits",
        "Result Pages",
        "Simple Analytics",
        "Public Sharing",
        "Export Results"
      ],
      badge: "Quick Start",
      badgeColor: "bg-orange-100 text-orange-700"
    }
  };

  // Get current builder types based on active tab
  const getCurrentBuilderTypes = () => {
    return activeTab === 'forms' ? formBuilderTypes : quizBuilderTypes;
  };

  // Form templates organized by user scenarios
  const formTemplates = {
    "Teachers & Schools": [
      {
        id: "student-registration",
        title: "Student Registration",
        description: "Collect student information for enrollment and class assignments",
        icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        features: ["Student Details", "Parent Information", "Medical Forms", "Emergency Contacts"]
      },
      {
        id: "parent-teacher-conference",
        title: "Parent-Teacher Conference",
        description: "Schedule meetings and collect parent feedback and concerns",
        icon: <Calendar className="w-6 h-6 text-green-600" />,
        color: "bg-green-50 border-green-200 hover:bg-green-100",
        features: ["Time Slots", "Student Progress", "Parent Concerns", "Meeting Notes"]
      },
      {
        id: "field-trip-permission",
        title: "Field Trip Permission",
        description: "Get parental consent and collect necessary information for school trips",
        icon: <Users className="w-6 h-6 text-orange-600" />,
        color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
        features: ["Permission Slips", "Medical Info", "Emergency Contacts", "Transportation"]
      },
      {
        id: "course-evaluation",
        title: "Course Evaluation",
        description: "Gather student feedback on courses, teaching methods, and curriculum",
        icon: <Star className="w-6 h-6 text-purple-600" />,
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        features: ["Rating Scales", "Open Feedback", "Improvement Suggestions", "Anonymous Options"]
      }
    ],
    "HR Teams": [
      {
        id: "job-application",
        title: "Job Application",
        description: "Streamline hiring process with comprehensive application forms",
        icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
        color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
        features: ["Resume Upload", "Experience Details", "References", "Skill Assessment"]
      },
      {
        id: "employee-onboarding",
        title: "Employee Onboarding",
        description: "Collect new hire information and documentation efficiently",
        icon: <UserCheck className="w-6 h-6 text-green-600" />,
        color: "bg-green-50 border-green-200 hover:bg-green-100",
        features: ["Personal Details", "Tax Forms", "Bank Information", "Policy Acknowledgment"]
      },
      {
        id: "performance-review",
        title: "Performance Review",
        description: "Conduct comprehensive employee performance evaluations",
        icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        features: ["Goal Setting", "Skill Assessment", "360 Feedback", "Development Plans"]
      },
      {
        id: "employee-satisfaction",
        title: "Employee Satisfaction",
        description: "Measure workplace satisfaction and gather improvement suggestions",
        icon: <Heart className="w-6 h-6 text-red-600" />,
        color: "bg-red-50 border-red-200 hover:bg-red-100",
        features: ["Satisfaction Ratings", "Work-Life Balance", "Management Feedback", "Anonymous Surveys"]
      }
    ],
    "Publishers": [
      {
        id: "manuscript-submission",
        title: "Manuscript Submission",
        description: "Accept and organize manuscript submissions from authors",
        icon: <FileText className="w-6 h-6 text-purple-600" />,
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        features: ["Author Information", "Manuscript Upload", "Genre Classification", "Submission Guidelines"]
      },
      {
        id: "reader-feedback",
        title: "Reader Feedback",
        description: "Collect reader reviews and feedback on published content",
        icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        features: ["Rating System", "Detailed Reviews", "Recommendation Engine", "Reader Demographics"]
      },
      {
        id: "author-royalty",
        title: "Author Royalty Form",
        description: "Manage author payments and royalty information",
        icon: <ClipboardList className="w-6 h-6 text-green-600" />,
        color: "bg-green-50 border-green-200 hover:bg-green-100",
        features: ["Sales Data", "Payment Details", "Tax Information", "Contract Terms"]
      },
      {
        id: "book-marketing",
        title: "Book Marketing Survey",
        description: "Gather market research data for book promotion strategies",
        icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
        color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
        features: ["Target Audience", "Marketing Channels", "Budget Planning", "Campaign Tracking"]
      }
    ],
    "EdTech Companies": [
      {
        id: "user-onboarding",
        title: "User Onboarding",
        description: "Welcome new users and customize their learning experience",
        icon: <Monitor className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        features: ["Learning Goals", "Skill Level", "Preferences", "Progress Tracking"]
      },
      {
        id: "course-feedback",
        title: "Course Feedback",
        description: "Collect student feedback on online courses and content quality",
        icon: <Star className="w-6 h-6 text-yellow-600" />,
        color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
        features: ["Content Quality", "Instructor Rating", "Technical Issues", "Improvement Suggestions"]
      },
      {
        id: "beta-testing",
        title: "Beta Testing Form",
        description: "Gather feedback from beta testers for new features and products",
        icon: <Zap className="w-6 h-6 text-purple-600" />,
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        features: ["Feature Testing", "Bug Reports", "User Experience", "Feature Requests"]
      },
      {
        id: "partnership-inquiry",
        title: "Partnership Inquiry",
        description: "Connect with potential educational partners and institutions",
        icon: <Building className="w-6 h-6 text-indigo-600" />,
        color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
        features: ["Institution Details", "Partnership Type", "Integration Needs", "Contact Information"]
      }
    ]
  };

  // AI-powered quiz creation methods (moved to quiz section)
  const quizCreationMethods = [
    {
      id: "blooms-quiz",
      title: "Bloom's Quiz",
      description: "Create educational quizzes based on Bloom's Taxonomy levels - from basic recall to critical analysis",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      category: "Educational",
      features: ["Knowledge Assessment", "Critical Thinking", "Analysis & Synthesis", "Evaluation Skills"]
    },
    {
      id: "similar-quiz",
      title: "Similar Quiz",
      description: "Generate quizzes similar to existing ones using AI pattern recognition and content analysis",
      icon: <RotateCcw className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      category: "AI-Powered",
      features: ["Pattern Recognition", "Content Matching", "Style Replication", "Difficulty Scaling"]
    },
    {
      id: "illustrate-story",
      title: "Illustrate Story",
      description: "Transform stories and narratives into interactive quizzes with visual elements and comprehension questions",
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      category: "Creative",
      features: ["Story Analysis", "Visual Elements", "Comprehension", "Interactive Narrative"]
    },
    {
      id: "image-to-quiz",
      title: "Image to Quiz",
      description: "Upload images and automatically generate quizzes about visual content, objects, and concepts",
      icon: <Image className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      category: "Visual",
      features: ["Image Recognition", "Visual Analysis", "Object Detection", "Context Questions"]
    },
    {
      id: "high-volume-quiz",
      title: "High-Volume Quiz",
      description: "Generate large sets of questions quickly for comprehensive assessments and training programs",
      icon: <Layers className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      category: "Enterprise",
      features: ["Bulk Generation", "Question Banks", "Randomization", "Scalable Content"]
    },
    {
      id: "matching-quiz",
      title: "Matching Quiz",
      description: "Create interactive matching exercises connecting concepts, definitions, images, and terms",
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      category: "Interactive",
      features: ["Drag & Drop", "Concept Mapping", "Visual Matching", "Multi-format Support"]
    },
    {
      id: "video-to-quiz",
      title: "Video to Quiz",
      description: "Analyze video content and generate comprehension quizzes based on spoken content and visuals",
      icon: <Video className="w-6 h-6 text-red-600" />,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      category: "Media",
      features: ["Video Analysis", "Speech Recognition", "Timestamp Questions", "Visual Content"]
    },
    {
      id: "learn-from-url",
      title: "Learn from URL",
      description: "Extract content from websites and automatically create educational quizzes and assessments",
      icon: <Link className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      category: "Web Content",
      features: ["Web Scraping", "Content Analysis", "Auto-summarization", "Key Point Extraction"]
    },
    {
      id: "news-to-quiz",
      title: "News to Quiz",
      description: "Convert news articles into current events quizzes for educational and awareness purposes",
      icon: <Newspaper className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
      category: "Current Events",
      features: ["News Analysis", "Fact Extraction", "Opinion vs Fact", "Current Affairs"]
    },
    {
      id: "pdf-to-quiz",
      title: "PDF to Quiz",
      description: "Upload PDF documents and automatically generate comprehensive quizzes from the content",
      icon: <FileImage className="w-6 h-6 text-gray-600" />,
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      category: "Document",
      features: ["PDF Parsing", "Text Extraction", "Content Structuring", "Multi-page Support"]
    }
  ];

  // Basic quiz templates
  const basicQuizTemplates = [
    {
      id: "knowledge-quiz",
      title: "Knowledge Assessment",
      description: "Test understanding of facts, concepts, and information recall",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      features: ["Multiple Choice", "True/False", "Short Answer", "Scoring System"]
    },
    {
      id: "skill-assessment",
      title: "Skill Assessment",
      description: "Evaluate practical abilities and competencies",
      icon: <Target className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      features: ["Practical Questions", "Scenario-based", "Performance Metrics", "Skill Mapping"]
    },
    {
      id: "certification-quiz",
      title: "Certification Quiz",
      description: "Create professional certification and training assessments",
      icon: <Award className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      features: ["Pass/Fail Criteria", "Time Limits", "Certificates", "Retake Options"]
    },
    {
      id: "timed-quiz",
      title: "Timed Challenge",
      description: "Fast-paced quizzes with time pressure and instant feedback",
      icon: <Clock className="w-6 h-6 text-red-600" />,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      features: ["Timer Controls", "Speed Scoring", "Leaderboards", "Real-time Results"]
    }
  ];

  const handleMethodSelect = (methodId: string, type: 'form' | 'quiz' = 'form', builderType: 'basic' | 'enhanced' = 'enhanced') => {
    setSelectedMethod(methodId);
    if (type === 'quiz') {
      navigate(`/quiz/new?method=${methodId}`);
    } else {
      if (builderType === 'enhanced') {
        navigate(`/forms/new/enhanced?method=${methodId}`);
      } else {
        // For basic templates, pass the template ID directly
        navigate(`/forms/new/edit?method=${methodId}&template=true`);
      }
    }
  };

  // Basic form templates section
  const basicFormTemplates = {
    forms: [
      {
        id: "student-registration",
        title: "Student Registration",
        description: "Collect student information for enrollment and class assignments",
        icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        features: ["Personal Info", "Academic Details", "Contact Info", "Additional Notes"],
        category: "Education"
      },
      {
        id: "job-application",
        title: "Job Application",
        description: "Standard job application form with work history and references",
        icon: <Briefcase className="w-6 h-6 text-green-600" />,
        color: "bg-green-50 border-green-200 hover:bg-green-100",
        features: ["Personal Details", "Work History", "Education", "References"],
        category: "Employment"
      },
      {
        id: "event-registration",
        title: "Event Registration",
        description: "Register attendees for events and gatherings",
        icon: <Calendar className="w-6 h-6 text-purple-600" />,
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        features: ["Attendee Info", "Event Selection", "Dietary Needs", "Special Requests"],
        category: "Events"
      },
      {
        id: "contact-form",
        title: "Contact Form",
        description: "Professional contact form with message and priority options",
        icon: <Mail className="w-6 h-6 text-red-600" />,
        color: "bg-red-50 border-red-200 hover:bg-red-100",
        features: ["Contact Details", "Message", "Priority Level", "Department Selection"],
        category: "Business"
      }
    ]
  };

  const renderFormTemplate = (template: any, category: string) => (
    <Card 
      key={template.id} 
      className={`cursor-pointer transition-all duration-200 ${template.color} ${
        selectedMethod === template.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      } h-full flex flex-col`}
      onClick={() => handleMethodSelect(template.id, 'form', selectedBuilderType)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {template.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {template.title}
              </CardTitle>
              <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full mt-1 inline-block">
                {category}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
        </div>
        <CardDescription className="text-gray-700 leading-relaxed text-sm">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-800">Key Features:</div>
          <div className="grid grid-cols-2 gap-1">
            {template.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className={`w-full mt-4 text-xs px-3 py-2 h-auto min-h-[36px] ${
            selectedBuilderType === 'enhanced' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
              : 'bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleMethodSelect(template.id, 'form', selectedBuilderType);
          }}
        >
          {selectedBuilderType === 'enhanced' ? (
            <div className="flex items-center justify-center gap-1">
              <Crown className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">Enhanced Builder</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Plus className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">Basic Builder</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuizMethod = (method: any) => (
    <Card 
      key={method.id} 
      className={`cursor-pointer transition-all duration-200 ${method.color} ${
        selectedMethod === method.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
      } h-full flex flex-col`}
      onClick={() => handleMethodSelect(method.id, 'quiz')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {method.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {method.title}
              </CardTitle>
              <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full mt-1 inline-block">
                {method.category}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
        </div>
        <CardDescription className="text-gray-700 leading-relaxed text-sm">
          {method.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-800">Key Features:</div>
          <div className="grid grid-cols-2 gap-1">
            {method.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleMethodSelect(method.id, 'quiz');
          }}
        >
          <Brain className="w-3 h-3 mr-2" />
          Generate Quiz
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Content</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your builder type and select from scenario-based templates or AI-powered generators
        </p>
      </div>

      {/* Builder Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Choose Your Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {Object.entries(getCurrentBuilderTypes()).map(([type, config]) => (
            <Card 
              key={type}
              className={`cursor-pointer transition-all duration-200 ${config.color} ${
                selectedBuilderType === type ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
              } relative`}
              onClick={() => setSelectedBuilderType(type as 'basic' | 'enhanced')}
            >
              {type === 'enhanced' && (
                <div className="absolute -top-2 -right-2">
                  <Badge className={config.badgeColor}>
                    {config.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {config.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {config.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{config.subtitle}</p>
                  </div>
                </div>
                <CardDescription className="text-gray-700 leading-relaxed">
                  {config.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-800">Key Features:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          type === 'enhanced' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedBuilderType === type 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedBuilderType === type && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs 
        defaultValue="forms" 
        className="w-full"
        onValueChange={(value) => {
          setActiveTab(value as 'forms' | 'quizzes');
          setSelectedBuilderType('enhanced'); // Reset to enhanced when switching tabs
        }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Forms & Surveys
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Quizzes & Assessments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-8">
          {/* Forms Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">16</div>
                <div className="text-sm text-gray-600">Form Templates</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">Industry Scenarios</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedBuilderType === 'enhanced' ? 'Enterprise' : 'Basic'}
                </div>
                <div className="text-sm text-gray-600">Builder Selected</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedBuilderType === 'enhanced' ? '40+' : '8'}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedBuilderType === 'enhanced' ? 'Integrations' : 'Features'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Templates by Category */}
          {Object.entries(formTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                <Badge variant="outline" className="text-xs">
                  {templates.length} templates
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {templates.map((template) => renderFormTemplate(template, category))}
              </div>
            </div>
          ))}

          {/* Custom Form Builder */}
          <div className="pt-6 border-t border-gray-200">
            <Card className={selectedBuilderType === 'enhanced' 
              ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200" 
              : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
            }>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {selectedBuilderType === 'enhanced' ? (
                        <Crown className="w-6 h-6 text-purple-600" />
                      ) : (
                        <FileText className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Custom {selectedBuilderType === 'enhanced' ? 'Enhanced' : 'Basic'} Form Builder
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedBuilderType === 'enhanced' 
                          ? 'Start with a blank form using our enterprise builder with AI assistance, workflows, and advanced features'
                          : 'Start with a blank form and build from scratch using our simple drag-and-drop editor'
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleMethodSelect('blank', 'form', selectedBuilderType)}
                    className={selectedBuilderType === 'enhanced' 
                      ? "border-purple-300 text-purple-700 hover:bg-purple-50 flex-shrink-0" 
                      : "border-gray-300 hover:border-gray-400 flex-shrink-0"
                    }
                  >
                    {selectedBuilderType === 'enhanced' ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Start Enhanced Builder
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Start Basic Builder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          {/* Quiz Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedBuilderType === 'enhanced' ? '10' : '5'}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedBuilderType === 'enhanced' ? 'AI Generators' : 'Quiz Templates'}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedBuilderType === 'enhanced' ? 'Smart' : 'Auto'}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedBuilderType === 'enhanced' ? 'AI Scoring' : 'Basic Scoring'}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {selectedBuilderType === 'enhanced' ? 'Adaptive' : 'Timed'}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedBuilderType === 'enhanced' ? 'Questions' : 'Assessments'}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {selectedBuilderType === 'enhanced' ? 'Advanced' : 'Basic'}
                </div>
                <div className="text-sm text-gray-600">Analytics</div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Powered Quiz Generators - Only show for Enhanced builder */}
          {selectedBuilderType === 'enhanced' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">AI-Powered Quiz Generators</h2>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {quizCreationMethods.map((method) => renderQuizMethod(method))}
              </div>
            </div>
          )}

          {/* Basic Quiz Templates - Show for both but with different emphasis */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedBuilderType === 'enhanced' ? 'Quick Start Templates' : 'Quiz Templates'}
              </h2>
              <Badge variant="outline" className="text-xs">
                {selectedBuilderType === 'enhanced' ? 'Ready to use' : 'Simple & Fast'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {basicQuizTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all duration-200 ${template.color} ${
                    selectedMethod === template.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                  } h-full flex flex-col`}
                  onClick={() => handleMethodSelect(template.id, 'quiz')}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {template.title}
                          </CardTitle>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                    <CardDescription className="text-gray-700 leading-relaxed text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-gray-800">Features:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {template.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                            <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMethodSelect(template.id, 'quiz');
                      }}
                    >
                      <Trophy className="w-3 h-3 mr-2" />
                      Create Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Blank Quiz Builder */}
          <div className="pt-6 border-t border-gray-200">
            <Card className={selectedBuilderType === 'enhanced' 
              ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200" 
              : "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
            }>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {selectedBuilderType === 'enhanced' ? (
                        <Brain className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Trophy className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Custom {selectedBuilderType === 'enhanced' ? 'AI Quiz Builder' : 'Quiz Builder'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedBuilderType === 'enhanced' 
                          ? 'Start with a blank quiz using our AI-powered builder with smart question generation, adaptive scoring, and advanced analytics'
                          : 'Start with a blank quiz and build simple assessments with basic question types, scoring, and timers'
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/quiz/new?method=blank')}
                    className={selectedBuilderType === 'enhanced' 
                      ? "border-purple-300 text-purple-700 hover:bg-purple-50 flex-shrink-0" 
                      : "border-orange-300 text-orange-700 hover:bg-orange-50 flex-shrink-0"
                    }
                  >
                    {selectedBuilderType === 'enhanced' ? (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Start AI Quiz Builder
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Start Basic Quiz
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Need Help Choosing?</h3>
                <p className="text-gray-700 text-sm">
                  Our AI can recommend the best template or creation method based on your specific needs and industry.
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-shrink-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm; 