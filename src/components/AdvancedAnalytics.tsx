import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Eye,
  Download,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  MousePointer,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface RealTimeEvent {
  id: string;
  type: 'form_start' | 'form_complete' | 'form_abandon' | 'question_answer' | 'page_change';
  formId: string;
  formTitle: string;
  timestamp: Date;
  userLocation?: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
  metadata?: {
    questionId?: string;
    answer?: string;
    pageNumber?: number;
    timeSpent?: number;
  };
}

interface HeatmapData {
  questionId: string;
  question: string;
  interactions: {
    clicks: number;
    hovers: number;
    focusTime: number;
    dropoffRate: number;
  };
  coordinates: {
    x: number;
    y: number;
    intensity: number;
  }[];
}

interface CohortData {
  cohortName: string;
  period: string;
  totalUsers: number;
  retentionRates: number[];
  conversionRates: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
}

interface DropoffPoint {
  questionId: string;
  question: string;
  position: number;
  dropoffRate: number;
  averageTimeSpent: number;
  commonExitReasons: string[];
}

interface AdvancedAnalyticsProps {
  formId: string;
  dateRange: { start: Date; end: Date };
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  formId,
  dateRange
}) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [realTimeEvents, setRealTimeEvents] = useState<RealTimeEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filters, setFilters] = useState({
    device: 'all',
    location: 'all',
    timeRange: '24h'
  });

  // Mock data - in real implementation, this would come from your analytics service
  const mockHeatmapData: HeatmapData[] = [
    {
      questionId: 'q1',
      question: 'What is your name?',
      interactions: {
        clicks: 1250,
        hovers: 890,
        focusTime: 3.2,
        dropoffRate: 5.2
      },
      coordinates: [
        { x: 100, y: 150, intensity: 0.8 },
        { x: 120, y: 170, intensity: 0.6 },
        { x: 140, y: 190, intensity: 0.9 }
      ]
    },
    {
      questionId: 'q2',
      question: 'What is your email?',
      interactions: {
        clicks: 1180,
        hovers: 820,
        focusTime: 4.1,
        dropoffRate: 12.3
      },
      coordinates: [
        { x: 100, y: 250, intensity: 0.7 },
        { x: 130, y: 270, intensity: 0.5 }
      ]
    }
  ];

  const mockCohortData: CohortData[] = [
    {
      cohortName: 'January 2024',
      period: '2024-01',
      totalUsers: 1250,
      retentionRates: [100, 85, 72, 65, 58, 52, 48],
      conversionRates: {
        week1: 85,
        week2: 72,
        week3: 65,
        week4: 58
      }
    },
    {
      cohortName: 'February 2024',
      period: '2024-02',
      totalUsers: 1380,
      retentionRates: [100, 88, 75, 68, 61, 55, 50],
      conversionRates: {
        week1: 88,
        week2: 75,
        week3: 68,
        week4: 61
      }
    }
  ];

  const mockDropoffData: DropoffPoint[] = [
    {
      questionId: 'q3',
      question: 'Please provide your phone number',
      position: 3,
      dropoffRate: 23.5,
      averageTimeSpent: 8.2,
      commonExitReasons: ['Privacy concerns', 'Too personal', 'Form too long']
    },
    {
      questionId: 'q5',
      question: 'Upload your resume',
      position: 5,
      dropoffRate: 18.7,
      averageTimeSpent: 12.1,
      commonExitReasons: ['File upload issues', 'No file ready', 'Technical problems']
    }
  ];

  // Simulate real-time events
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const eventTypes: RealTimeEvent['type'][] = [
        'form_start', 'form_complete', 'form_abandon', 'question_answer', 'page_change'
      ];
      const devices = ['desktop', 'mobile', 'tablet'];
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
      const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'];

      const newEvent: RealTimeEvent = {
        id: crypto.randomUUID(),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        formId: formId,
        formTitle: 'Contact Form',
        timestamp: new Date(),
        userLocation: {
          country: countries[Math.floor(Math.random() * countries.length)],
          city: 'Sample City'
        },
        device: {
          type: devices[Math.floor(Math.random() * devices.length)] as any,
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: 'Windows'
        }
      };

      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 49)]);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isLive, formId]);

  const exportData = (format: 'csv' | 'pdf' | 'excel') => {
    // Mock export functionality
    const data = {
      format,
      dateRange,
      formId,
      exportedAt: new Date().toISOString()
    };
    
    console.log('Exporting data:', data);
    alert(`Exporting data as ${format.toUpperCase()}...`);
  };

  const getEventIcon = (type: RealTimeEvent['type']) => {
    switch (type) {
      case 'form_start': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'form_complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'form_abandon': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'question_answer': return <MousePointer className="w-4 h-4 text-purple-500" />;
      case 'page_change': return <RefreshCw className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Smartphone className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const formatEventType = (type: RealTimeEvent['type']) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Advanced Analytics
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">Real-Time Feed</TabsTrigger>
          <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="dropoff">Dropoff Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">
                      {isLive ? 'Live' : 'Paused'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLive(!isLive)}
                  >
                    {isLive ? 'Pause' : 'Resume'}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filters.device}
                    onValueChange={(value) => setFilters({ ...filters, device: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.timeRange}
                    onValueChange={(value) => setFilters({ ...filters, timeRange: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activity Feed
                <Badge variant="secondary">{realTimeEvents.length} events</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realTimeEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="text-sm font-medium">
                        {formatEventType(event.type)}
                      </span>
                    </div>
                    
                    <div className="flex-1 text-sm text-gray-600">
                      {event.formTitle}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {getDeviceIcon(event.device.type)}
                      <span>{event.device.browser}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{event.userLocation?.country}</span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {realTimeEvents.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    {isLive ? 'Waiting for events...' : 'Feed paused'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Completions</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Abandons</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Conversion</p>
                    <p className="text-2xl font-bold">60%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Form Heatmaps & Interaction Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockHeatmapData.map((heatmap) => (
                  <Card key={heatmap.questionId} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{heatmap.question}</h4>
                          <p className="text-sm text-gray-600">Question ID: {heatmap.questionId}</p>
                        </div>
                        <Badge variant={heatmap.interactions.dropoffRate > 15 ? "destructive" : "secondary"}>
                          {heatmap.interactions.dropoffRate}% dropoff
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {heatmap.interactions.clicks}
                          </p>
                          <p className="text-sm text-gray-600">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {heatmap.interactions.hovers}
                          </p>
                          <p className="text-sm text-gray-600">Hovers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {heatmap.interactions.focusTime}s
                          </p>
                          <p className="text-sm text-gray-600">Avg Focus Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {heatmap.interactions.dropoffRate}%
                          </p>
                          <p className="text-sm text-gray-600">Dropoff Rate</p>
                        </div>
                      </div>

                      {/* Heatmap Visualization Placeholder */}
                      <div className="bg-gradient-to-r from-blue-100 to-red-100 h-32 rounded-lg flex items-center justify-center relative">
                        <div className="text-center">
                          <MousePointer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Heatmap visualization would appear here</p>
                        </div>
                        
                        {/* Mock hotspots */}
                        {heatmap.coordinates.map((coord, index) => (
                          <div
                            key={index}
                            className="absolute w-4 h-4 rounded-full bg-red-500 opacity-70"
                            style={{
                              left: `${(coord.x / 300) * 100}%`,
                              top: `${(coord.y / 400) * 100}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cohort Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockCohortData.map((cohort) => (
                  <Card key={cohort.period}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{cohort.cohortName}</h4>
                          <p className="text-sm text-gray-600">
                            {cohort.totalUsers} users started
                          </p>
                        </div>
                        <Badge variant="outline">
                          {cohort.retentionRates[cohort.retentionRates.length - 1]}% retained
                        </Badge>
                      </div>

                      {/* Retention Chart */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Weekly Retention Rates</Label>
                        <div className="flex gap-2">
                          {cohort.retentionRates.map((rate, index) => (
                            <div key={index} className="flex-1">
                              <div className="text-center text-sm font-medium mb-1">
                                Week {index}
                              </div>
                              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full transition-all duration-300"
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <div className="text-center text-xs text-gray-600 mt-1">
                                {rate}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conversion Rates */}
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {Object.entries(cohort.conversionRates).map(([week, rate]) => (
                          <div key={week} className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">{week.replace('week', 'Week ')}</p>
                            <p className="font-bold text-lg">{rate}%</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropoff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Dropoff Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDropoffData.map((dropoff) => (
                  <Card key={dropoff.questionId} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{dropoff.question}</h4>
                          <p className="text-sm text-gray-600">
                            Position {dropoff.position} in form
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {dropoff.dropoffRate}% dropoff
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Average Time Spent</Label>
                          <p className="text-lg font-bold text-orange-600">
                            {dropoff.averageTimeSpent}s
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Dropoff Rate</Label>
                          <p className="text-lg font-bold text-red-600">
                            {dropoff.dropoffRate}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Common Exit Reasons
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {dropoff.commonExitReasons.map((reason, index) => (
                            <Badge key={index} variant="outline">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">High Dropoff at Phone Number</p>
                        <p className="text-sm text-blue-700">
                          Consider making the phone number field optional or adding explanation text about privacy.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">File Upload Issues</p>
                        <p className="text-sm text-yellow-700">
                          Improve file upload UX with drag-and-drop and better error messages.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 