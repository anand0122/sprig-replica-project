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
  Mail
} from "lucide-react";


const CreateForm = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

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

  const handleMethodSelect = (methodId: string, type: 'form' | 'quiz' = 'form') => {
    setSelectedMethod(methodId);
    if (type === 'quiz') {
      navigate(`/quiz/new?method=${methodId}`);
    } else {
      navigate(`/forms/new/edit?method=${methodId}`);
    }
  };

  const renderFormTemplate = (template: any, category: string) => (
    <Card 
      key={template.id} 
      className={`cursor-pointer transition-all duration-200 ${template.color} ${
        selectedMethod === template.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      } h-full flex flex-col`}
      onClick={() => handleMethodSelect(template.id, 'form')}
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
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleMethodSelect(template.id, 'form');
          }}
        >
          <Plus className="w-3 h-3 mr-2" />
          Create Form
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
          Choose from scenario-based form templates or AI-powered quiz generators
        </p>
      </div>

      <Tabs defaultValue="forms" className="w-full">
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
                <div className="text-2xl font-bold text-purple-600">Ready-Made</div>
                <div className="text-sm text-gray-600">Templates</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">Customizable</div>
                <div className="text-sm text-gray-600">Fields</div>
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

          {/* Traditional Form Builder */}
          <div className="pt-6 border-t border-gray-200">
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Custom Form Builder</h3>
                      <p className="text-gray-600 text-sm">Start with a blank form and build from scratch using our drag-and-drop editor</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/forms/new/edit?method=blank')}
                    className="border-gray-300 hover:border-gray-400 flex-shrink-0"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Blank Form
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
                <div className="text-2xl font-bold text-purple-600">10</div>
                <div className="text-sm text-gray-600">AI Generators</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">Auto</div>
                <div className="text-sm text-gray-600">Scoring</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">Timed</div>
                <div className="text-sm text-gray-600">Assessments</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">Smart</div>
                <div className="text-sm text-gray-600">Analytics</div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Powered Quiz Generators */}
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

          {/* Basic Quiz Templates */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Quick Start Templates</h2>
              <Badge variant="outline" className="text-xs">
                Ready to use
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
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Trophy className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Custom Quiz Builder</h3>
                      <p className="text-gray-600 text-sm">Start with a blank quiz and build custom assessments with scoring, timers, and rankings</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/quiz/new?method=blank')}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 flex-shrink-0"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Start Blank Quiz
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