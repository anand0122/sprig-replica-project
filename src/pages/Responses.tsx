import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface FormResponse {
  id: string;
  formId: string;
  formTitle: string;
  submittedAt: string;
  submittedBy: {
    name?: string;
    email?: string;
    ip?: string;
    location?: string;
    device?: string;
  };
  responses: { [questionId: string]: any };
  completionTime: number;
  status: 'complete' | 'partial' | 'abandoned';
  score?: number;
  rating?: number;
}

const Responses = () => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'partial' | 'abandoned'>('all');
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = () => {
    // Mock response data
    const mockResponses: FormResponse[] = [
      {
        id: 'resp_1',
        formId: 'demo-1',
        formTitle: 'Customer Feedback Survey',
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        submittedBy: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          ip: '192.168.1.1',
          location: 'New York, US',
          device: 'Desktop'
        },
        responses: {
          'q1': 'Alice Johnson',
          'q2': 'alice@example.com',
          'q3': 'Very Satisfied',
          'q4': 'The service was excellent and the team was very helpful.'
        },
        completionTime: 180,
        status: 'complete',
        rating: 5
      },
      {
        id: 'resp_2',
        formId: 'demo-1',
        formTitle: 'Customer Feedback Survey',
        submittedAt: new Date(Date.now() - 7200000).toISOString(),
        submittedBy: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          ip: '192.168.1.2',
          location: 'California, US',
          device: 'Mobile'
        },
        responses: {
          'q1': 'Bob Smith',
          'q2': 'bob@example.com',
          'q3': 'Satisfied'
        },
        completionTime: 120,
        status: 'partial',
        rating: 4
      },
      {
        id: 'resp_3',
        formId: 'demo-2',
        formTitle: 'Product Knowledge Quiz',
        submittedAt: new Date(Date.now() - 10800000).toISOString(),
        submittedBy: {
          name: 'Carol Davis',
          email: 'carol@example.com',
          ip: '192.168.1.3',
          location: 'London, UK',
          device: 'Desktop'
        },
        responses: {
          'q1': 'Software',
          'q2': 'Our software helps businesses streamline their operations and improve efficiency through automation and intelligent insights.'
        },
        completionTime: 240,
        status: 'complete',
        score: 85
      },
      {
        id: 'resp_4',
        formId: 'demo-1',
        formTitle: 'Customer Feedback Survey',
        submittedAt: new Date(Date.now() - 14400000).toISOString(),
        submittedBy: {
          name: 'David Wilson',
          email: 'david@example.com',
          ip: '192.168.1.4',
          location: 'Toronto, CA',
          device: 'Tablet'
        },
        responses: {
          'q1': 'David Wilson',
          'q2': 'david@example.com',
          'q3': 'Neutral',
          'q4': 'The service was okay, but there is room for improvement.'
        },
        completionTime: 200,
        status: 'complete',
        rating: 3
      }
    ];
    setResponses(mockResponses);
  };

  const filteredResponses = responses.filter(response => {
    const matchesForm = selectedForm === 'all' || response.formId === selectedForm;
    const matchesSearch = response.submittedBy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.submittedBy.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || response.status === filterStatus;
    return matchesForm && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'abandoned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertCircle className="w-4 h-4" />;
      case 'abandoned': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const exportResponses = () => {
    const csv = [
      ['Form Title', 'Submitted At', 'Name', 'Email', 'Status', 'Completion Time', 'Rating/Score'],
      ...filteredResponses.map(response => [
        response.formTitle,
        new Date(response.submittedAt).toLocaleString(),
        response.submittedBy.name || 'Anonymous',
        response.submittedBy.email || 'N/A',
        response.status,
        `${response.completionTime}s`,
        response.rating || response.score || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueForms = Array.from(new Set(responses.map(r => r.formId)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Responses</h1>
          <p className="text-gray-600 mt-1">View and analyze form submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportResponses}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Forms</option>
          {uniqueForms.map(formId => {
            const form = responses.find(r => r.formId === formId);
            return (
              <option key={formId} value={formId}>
                {form?.formTitle}
              </option>
            );
          })}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="complete">Complete</option>
          <option value="partial">Partial</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{filteredResponses.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Complete</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredResponses.filter(r => r.status === 'complete').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partial</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredResponses.filter(r => r.status === 'partial').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredResponses.reduce((sum, r) => sum + r.completionTime, 0) / filteredResponses.length || 0)}s
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResponses.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' || selectedForm !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Responses will appear here once people start submitting your forms.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResponses.map((response) => (
                <div
                  key={response.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {response.submittedBy.name || 'Anonymous'}
                        </h3>
                        <Badge className={getStatusColor(response.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(response.status)}
                            {response.status}
                          </div>
                        </Badge>
                        {response.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{response.rating}/5</span>
                          </div>
                        )}
                        {response.score && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Score: {response.score}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {response.formTitle}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {response.submittedBy.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {response.submittedBy.location || 'Unknown location'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(response.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Response Details</h2>
                  <p className="text-gray-600">{selectedResponse.formTitle}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedResponse(null)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="responses" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="responses">Responses</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                
                <TabsContent value="responses" className="space-y-4">
                  <div className="space-y-4">
                    {Object.entries(selectedResponse.responses).map(([questionId, answer], index) => (
                      <Card key={questionId}>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">
                              Question {index + 1}
                            </h4>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {typeof answer === 'string' ? answer : JSON.stringify(answer)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="metadata" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Submission Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span>{new Date(selectedResponse.submittedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completion Time:</span>
                          <span>{selectedResponse.completionTime} seconds</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={getStatusColor(selectedResponse.status)}>
                            {selectedResponse.status}
                          </Badge>
                        </div>
                        {selectedResponse.rating && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <span>{selectedResponse.rating}/5 stars</span>
                          </div>
                        )}
                        {selectedResponse.score && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Score:</span>
                            <span>{selectedResponse.score}%</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">User Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span>{selectedResponse.submittedBy.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>{selectedResponse.submittedBy.email || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span>{selectedResponse.submittedBy.location || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Device:</span>
                          <span>{selectedResponse.submittedBy.device || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IP Address:</span>
                          <span>{selectedResponse.submittedBy.ip || 'Hidden'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Responses; 