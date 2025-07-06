import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Download,
  Share2,
  Calendar,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw
} from "lucide-react";

interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  completionTime: number; // in seconds
  answers: Record<string, any>;
  userAgent: string;
  ipAddress: string;
  location?: {
    country: string;
    city: string;
  };
  device: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
  completed: boolean;
}

interface FormAnalytics {
  totalViews: number;
  totalResponses: number;
  completionRate: number;
  averageCompletionTime: number;
  bounceRate: number;
  conversionRate: number;
  topExitPoints: Array<{ questionId: string; exitRate: number }>;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  timeSeriesData: Array<{ date: string; views: number; responses: number }>;
  questionAnalytics: Array<{
    questionId: string;
    question: string;
    type: string;
    responseRate: number;
    averageTime: number;
    dropoffRate: number;
    responses: Array<{ value: string; count: number }>;
  }>;
}

const FormAnalytics = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadFormAndAnalytics();
  }, [formId, dateRange]);

  const loadFormAndAnalytics = () => {
    setIsLoading(true);
    try {
      // Load form data
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundForm = savedForms.find((f: any) => f.id === formId);
      
      if (!foundForm) {
        navigate('/forms');
        return;
      }
      
      setForm(foundForm);

      // Generate mock analytics data
      const mockResponses = generateMockResponses(foundForm);
      setResponses(mockResponses);
      
      const mockAnalytics = generateMockAnalytics(foundForm, mockResponses);
      setAnalytics(mockAnalytics);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponses = (form: any): FormResponse[] => {
    const responses: FormResponse[] = [];
    const responseCount = Math.floor(Math.random() * 50) + 20; // 20-70 responses
    
    for (let i = 0; i < responseCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const submittedAt = new Date();
      submittedAt.setDate(submittedAt.getDate() - daysAgo);
      
      const answers: Record<string, any> = {};
      form.questions.forEach((q: any) => {
        if (Math.random() > 0.1) { // 90% response rate per question
          switch (q.type) {
            case 'short-answer':
            case 'paragraph':
              answers[q.id] = `Sample answer for ${q.question}`;
              break;
            case 'multiple-choice':
              if (q.options) {
                answers[q.id] = q.options[Math.floor(Math.random() * q.options.length)];
              }
              break;
            case 'checkboxes':
              if (q.options) {
                const selected = q.options.filter(() => Math.random() > 0.5);
                answers[q.id] = selected;
              }
              break;
            case 'rating':
              answers[q.id] = Math.floor(Math.random() * 5) + 1;
              break;
            case 'linear-scale':
              const min = q.scaleMin || 1;
              const max = q.scaleMax || 10;
              answers[q.id] = Math.floor(Math.random() * (max - min + 1)) + min;
              break;
            default:
              answers[q.id] = 'Sample response';
          }
        }
      });

      responses.push({
        id: `response_${i}`,
        formId: form.id,
        submittedAt: submittedAt.toISOString(),
        completionTime: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
        answers,
        userAgent: Math.random() > 0.6 ? 'desktop' : 'mobile',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: {
          country: ['USA', 'Canada', 'UK', 'Germany', 'France'][Math.floor(Math.random() * 5)],
          city: ['New York', 'London', 'Toronto', 'Berlin', 'Paris'][Math.floor(Math.random() * 5)]
        },
        device: Math.random() > 0.7 ? 'mobile' : Math.random() > 0.5 ? 'desktop' : 'tablet',
        completed: Math.random() > 0.15 // 85% completion rate
      });
    }
    
    return responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  };

  const generateMockAnalytics = (form: any, responses: FormResponse[]): FormAnalytics => {
    const totalViews = responses.length + Math.floor(Math.random() * 100) + 50;
    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.completed).length;
    
    const questionAnalytics = form.questions.map((q: any) => {
      const questionResponses = responses.filter(r => r.answers[q.id] !== undefined);
      const responsesByValue: Record<string, number> = {};
      
      questionResponses.forEach(r => {
        const value = Array.isArray(r.answers[q.id]) 
          ? r.answers[q.id].join(', ')
          : String(r.answers[q.id]);
        responsesByValue[value] = (responsesByValue[value] || 0) + 1;
      });

      return {
        questionId: q.id,
        question: q.question,
        type: q.type,
        responseRate: (questionResponses.length / totalResponses) * 100,
        averageTime: Math.floor(Math.random() * 30) + 10,
        dropoffRate: Math.random() * 20,
        responses: Object.entries(responsesByValue).map(([value, count]) => ({ value, count }))
      };
    });

    const deviceBreakdown = responses.reduce((acc, r) => {
      acc[r.device] = (acc[r.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationBreakdown = responses.reduce((acc, r) => {
      if (r.location) {
        acc[r.location.country] = (acc[r.location.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Generate time series data for the last 30 days
    const timeSeriesData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayResponses = responses.filter(r => {
        const responseDate = new Date(r.submittedAt);
        return responseDate.toDateString() === date.toDateString();
      }).length;
      
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        views: dayResponses + Math.floor(Math.random() * 10) + 5,
        responses: dayResponses
      });
    }

    return {
      totalViews,
      totalResponses,
      completionRate: (completedResponses / totalResponses) * 100,
      averageCompletionTime: responses.reduce((sum, r) => sum + r.completionTime, 0) / responses.length,
      bounceRate: ((totalViews - totalResponses) / totalViews) * 100,
      conversionRate: (completedResponses / totalViews) * 100,
      topExitPoints: questionAnalytics.slice(0, 3).map(q => ({
        questionId: q.questionId,
        exitRate: q.dropoffRate
      })),
      deviceBreakdown,
      locationBreakdown,
      timeSeriesData,
      questionAnalytics
    };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!form || !analytics) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Responses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Responses
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Form Analytics & Insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last period
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responses</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalResponses}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last period
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.completionRate)}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  -2% from last period
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(Math.floor(analytics.averageCompletionTime))}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  -15s from last period
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Response Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Response Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.timeSeriesData.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(day.responses / Math.max(...analytics.timeSeriesData.map(d => d.responses))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{day.responses}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
                    const percentage = (count / analytics.totalResponses) * 100;
                    const Icon = device === 'desktop' ? Monitor : device === 'mobile' ? Smartphone : Monitor;
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm capitalize">{device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{formatPercentage(percentage)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Views</span>
                    <span className="font-medium">{analytics.totalViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Started</span>
                    <span className="font-medium">{analytics.totalResponses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{Math.floor(analytics.totalResponses * analytics.completionRate / 100)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Exit Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.topExitPoints.map((exit, index) => {
                    const question = form.questions.find((q: any) => q.id === exit.questionId);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm truncate">{question?.question || 'Unknown'}</span>
                        <Badge variant="outline" className="text-red-600">
                          {formatPercentage(exit.exitRate)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geographic Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.locationBreakdown).slice(0, 5).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{country}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.slice(0, 10).map((response) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={response.completed ? "default" : "secondary"}>
                          {response.completed ? 'Completed' : 'Partial'}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(response.completionTime)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Device:</span> {response.device}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {response.location?.city}, {response.location?.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {analytics.questionAnalytics.map((qa, index) => (
              <Card key={qa.questionId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Badge variant="outline">{formatPercentage(qa.responseRate)} response rate</Badge>
                  </div>
                  <p className="text-gray-600">{qa.question}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Response Distribution</h4>
                      <div className="space-y-2">
                        {qa.responses.slice(0, 5).map((resp, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm truncate">{resp.value}</span>
                            <span className="text-sm font-medium">{resp.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Avg. Time:</span>
                          <span>{qa.averageTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drop-off Rate:</span>
                          <span className="text-red-600">{formatPercentage(qa.dropoffRate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device & Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
                    const percentage = (count / analytics.totalResponses) * 100;
                    return (
                      <div key={device}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{device}</span>
                          <span className="text-sm">{count} ({formatPercentage(percentage)})</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.locationBreakdown).map(([country, count]) => {
                    const percentage = (count / analytics.totalResponses) * 100;
                    return (
                      <div key={country}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{country}</span>
                          <span className="text-sm">{count} ({formatPercentage(percentage)})</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Bounce Rate</span>
                    <Badge variant={analytics.bounceRate > 50 ? "destructive" : "default"}>
                      {formatPercentage(analytics.bounceRate)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <Badge variant={analytics.conversionRate > 20 ? "default" : "secondary"}>
                      {formatPercentage(analytics.conversionRate)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Completion Time</span>
                    <span className="font-medium">{formatTime(Math.floor(analytics.averageCompletionTime))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.bounceRate > 50 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">High Bounce Rate</p>
                        <p className="text-xs text-red-600">Consider simplifying your form or improving the introduction</p>
                      </div>
                    </div>
                  )}
                  {analytics.averageCompletionTime > 300 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Long Completion Time</p>
                        <p className="text-xs text-yellow-600">Form might be too long. Consider breaking it into sections</p>
                      </div>
                    </div>
                  )}
                  {analytics.completionRate > 80 && (
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Great Completion Rate!</p>
                        <p className="text-xs text-green-600">Your form is performing well</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormAnalytics; 