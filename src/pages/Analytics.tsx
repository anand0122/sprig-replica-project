import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Target,
  Brain,
  Sparkles,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { aiService } from "@/services/aiService";

interface FormAnalytics {
  formId: string;
  formTitle: string;
  totalViews: number;
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  dropOffPoints: string[];
  topPerformingQuestions: string[];
  conversionFunnel: {
    step: string;
    users: number;
    percentage: number;
  }[];
  demographics: {
    device: { mobile: number; desktop: number; tablet: number };
    location: { [key: string]: number };
    timeOfDay: { [key: string]: number };
  };
}

const Analytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<FormAnalytics[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeRange]);

  const loadAnalytics = () => {
    // Mock analytics data - in production this would come from your backend
    const mockAnalytics: FormAnalytics[] = [
      {
        formId: 'demo-1',
        formTitle: 'Customer Feedback Survey',
        totalViews: 1250,
        totalResponses: 894,
        completionRate: 71.5,
        averageTime: 3.2,
        dropOffPoints: ['question_3', 'question_5'],
        topPerformingQuestions: ['question_1', 'question_2'],
        conversionFunnel: [
          { step: 'Form Viewed', users: 1250, percentage: 100 },
          { step: 'Started', users: 1050, percentage: 84 },
          { step: 'Question 3', users: 920, percentage: 73.6 },
          { step: 'Question 5', users: 894, percentage: 71.5 },
          { step: 'Completed', users: 894, percentage: 71.5 }
        ],
        demographics: {
          device: { mobile: 65, desktop: 30, tablet: 5 },
          location: { 'United States': 45, 'Canada': 20, 'United Kingdom': 15, 'Australia': 10, 'Other': 10 },
          timeOfDay: { '9-12': 25, '12-15': 35, '15-18': 30, '18-21': 10 }
        }
      },
      {
        formId: 'demo-2',
        formTitle: 'Product Knowledge Quiz',
        totalViews: 680,
        totalResponses: 425,
        completionRate: 62.5,
        averageTime: 4.8,
        dropOffPoints: ['question_2', 'question_4'],
        topPerformingQuestions: ['question_1', 'question_3'],
        conversionFunnel: [
          { step: 'Form Viewed', users: 680, percentage: 100 },
          { step: 'Started', users: 580, percentage: 85.3 },
          { step: 'Question 2', users: 520, percentage: 76.5 },
          { step: 'Question 4', users: 425, percentage: 62.5 },
          { step: 'Completed', users: 425, percentage: 62.5 }
        ],
        demographics: {
          device: { mobile: 45, desktop: 50, tablet: 5 },
          location: { 'United States': 50, 'Canada': 25, 'United Kingdom': 15, 'Other': 10 },
          timeOfDay: { '9-12': 30, '12-15': 25, '15-18': 35, '18-21': 10 }
        }
      }
    ];
    setAnalytics(mockAnalytics);
  };

  const generateAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const insights = await aiService.analyzeFormPerformance(
        analytics[0], 
        analytics[0]?.conversionFunnel || []
      );
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const totalViews = analytics.reduce((sum, form) => sum + form.totalViews, 0);
  const totalResponses = analytics.reduce((sum, form) => sum + form.totalResponses, 0);
  const avgCompletionRate = analytics.length > 0 
    ? analytics.reduce((sum, form) => sum + form.completionRate, 0) / analytics.length 
    : 0;
  const avgTimeSpent = analytics.length > 0 
    ? analytics.reduce((sum, form) => sum + form.averageTime, 0) / analytics.length 
    : 0;

  const getChangeIndicator = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your form performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIndicator(12)}
                  <span className="text-sm text-green-600">+12% vs last period</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{totalResponses.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIndicator(8)}
                  <span className="text-sm text-green-600">+8% vs last period</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgCompletionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIndicator(-2)}
                  <span className="text-sm text-red-600">-2% vs last period</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{avgTimeSpent.toFixed(1)}m</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIndicator(5)}
                  <span className="text-sm text-green-600">+5% vs last period</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
              <Badge className="bg-purple-100 text-purple-800">New</Badge>
            </div>
            <Button 
              onClick={generateAIInsights}
              disabled={isLoadingInsights}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoadingInsights ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiInsights ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {aiInsights.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {aiInsights.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-600">Click "Generate Insights" to get AI-powered recommendations for improving your forms</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Form Performance</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid gap-4">
            {analytics.map((form) => (
              <Card key={form.formId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{form.formTitle}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={form.completionRate > 70 ? 'bg-green-100 text-green-800' : 
                                      form.completionRate > 50 ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}>
                        {form.completionRate > 70 ? 'High Performance' : 
                         form.completionRate > 50 ? 'Average Performance' : 
                         'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{form.totalViews}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{form.totalResponses}</div>
                      <div className="text-sm text-gray-600">Responses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{form.completionRate}%</div>
                      <div className="text-sm text-gray-600">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{form.averageTime}m</div>
                      <div className="text-sm text-gray-600">Avg. Time</div>
                    </div>
                  </div>

                  {form.dropOffPoints.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-800">Drop-off Points Detected</span>
                      </div>
                      <p className="text-sm text-red-700">
                        Users commonly drop off at: {form.dropOffPoints.join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          {analytics.map((form) => (
            <Card key={form.formId}>
              <CardHeader>
                <CardTitle>Conversion Funnel - {form.formTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {form.conversionFunnel.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-700">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${step.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12">
                            {step.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-16 text-sm text-gray-600 text-right">
                        {step.users}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.map((form) => (
              <div key={form.formId} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Device Breakdown - {form.formTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(form.demographics.device).map(([device, percentage]) => (
                        <div key={device} className="flex items-center gap-3">
                          <span className="w-16 text-sm capitalize">{device}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(form.demographics.location).map(([location, percentage]) => (
                        <div key={location} className="flex justify-between items-center">
                          <span className="text-sm">{location}</span>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {analytics.map((form) => (
            <Card key={form.formId}>
              <CardHeader>
                <CardTitle>Question Performance - {form.formTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Top Performing Questions</h4>
                    <div className="space-y-1">
                      {form.topPerformingQuestions.map((question, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Questions Needing Attention</h4>
                    <div className="space-y-1">
                      {form.dropOffPoints.map((question, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span>{question} - High drop-off rate</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
