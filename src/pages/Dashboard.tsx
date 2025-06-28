import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  BarChart3, 
  FileText, 
  Users, 
  TrendingUp,
  Eye,
  MousePointer,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Forms",
      value: "12",
      change: "+2 this week",
      icon: <FileText className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Total Responses",
      value: "1,234",
      change: "+156 this week",
      icon: <Users className="w-5 h-5 text-green-600" />
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+5% this week",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />
    },
    {
      title: "Avg. Time to Complete",
      value: "2m 34s",
      change: "-12s this week",
      icon: <Clock className="w-5 h-5 text-orange-600" />
    }
  ];

  const recentForms = [
    {
      id: "1",
      title: "Customer Feedback Survey",
      responses: 89,
      completionRate: 82,
      lastResponse: "2 hours ago"
    },
    {
      id: "2", 
      title: "Product Feature Request",
      responses: 156,
      completionRate: 74,
      lastResponse: "5 hours ago"
    },
    {
      id: "3",
      title: "Event Registration Form",
      responses: 203,
      completionRate: 91,
      lastResponse: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your forms.</p>
        </div>
        <Button 
          onClick={() => navigate('/create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Forms</CardTitle>
            <CardDescription>Your most recently active forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{form.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {form.responses} responses
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {form.completionRate}% completion
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last response: {form.lastResponse}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/analytics`)}>
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/forms/${form.id}/edit`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/forms')}>
                View All Forms
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with FormPulse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/create')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Create New Form</p>
                    <p className="text-sm text-gray-600">Build with AI or from scratch</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-600">Track form performance</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/responses')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MousePointer className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Responses</p>
                    <p className="text-sm text-gray-600">Manage form submissions</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
