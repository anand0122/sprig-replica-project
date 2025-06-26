
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useResponses } from '@/hooks/useResponses';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const { studyId } = useParams();
  const { responses, stats, isLoading } = useResponses(studyId);
  const [study, setStudy] = useState<any>(null);

  useEffect(() => {
    if (studyId) {
      const studies = JSON.parse(localStorage.getItem('sprig_studies') || '[]');
      const foundStudy = studies.find((s: any) => s.id === studyId);
      setStudy(foundStudy);
    }
  }, [studyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {study ? `${study.name} Analytics` : 'Study Analytics'}
                </h1>
                <p className="text-gray-600">Real-time insights and performance metrics</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalResponses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {study?.audience?.targetUsers ? 
                      `${Math.round(((stats?.totalResponses || 0) / study.audience.targetUsers) * 100)}% of target` :
                      'No target set'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    All responses completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.averageTimeSpent ? Math.round(stats.averageTimeSpent / 1000) : 0}s
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per response
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant={study?.status === 'active' ? 'default' : 'secondary'}>
                    {study?.status || 'Draft'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Study status
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Responses Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.responsesByDay || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question Response Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.questionStats && Object.keys(stats.questionStats).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(stats.questionStats).slice(0, 3).map(([questionId, questionStat], index) => (
                        <div key={questionId}>
                          <h4 className="text-sm font-medium mb-2">Question {index + 1}</h4>
                          <div className="text-xs text-gray-600 mb-2">
                            {questionStat.totalAnswers} responses
                            {questionStat.averageRating && (
                              <span className="ml-2">
                                Avg: {questionStat.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No response data available yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Responses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Responses</CardTitle>
              </CardHeader>
              <CardContent>
                {responses.length > 0 ? (
                  <div className="space-y-4">
                    {responses.slice(0, 5).map((response) => (
                      <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">
                            Response from {response.sessionId.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(response.completedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {Math.round(response.timeSpent / 1000)}s to complete
                          </p>
                          <p className="text-xs text-gray-500">
                            {Object.keys(response.responses).length} questions answered
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No responses yet. Share your study to start collecting data.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
