import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Share, 
  Copy, 
  Trash2, 
  Calendar,
  BarChart3,
  Users,
  FileText,
  Search,
  Filter,
  Trophy,
  Clock,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SavedForm {
  id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: string;
  method: string;
  responses?: number;
  status: 'draft' | 'published' | 'archived';
  type?: 'form' | 'quiz';
  settings: {
    theme: string;
    submitButtonText: string;
    thankYouMessage: string;
    timeLimit?: number;
    passingScore?: number;
    isActive?: boolean;
    expiresAt?: string;
  };
}

const Forms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<SavedForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'form' | 'quiz'>('all');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    // Add some demo data if no forms exist
    if (savedForms.length === 0) {
      const demoForms = [
        {
          id: 'demo-1',
          title: 'Customer Feedback Survey',
          description: 'Collect valuable feedback from our customers',
          questions: [
            { id: '1', type: 'text', question: 'What is your name?', required: true },
            { id: '2', type: 'email', question: 'Your email address?', required: true },
            { id: '3', type: 'radio', question: 'How satisfied are you?', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] }
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          method: 'blank',
          responses: 24,
          status: 'published' as const,
          type: 'form' as const,
          settings: {
            theme: 'modern',
            submitButtonText: 'Submit Feedback',
            thankYouMessage: 'Thank you for your feedback!'
          }
        },
        {
          id: 'demo-2',
          title: 'Product Knowledge Quiz',
          description: 'Test your knowledge about our products',
          questions: [
            { id: '1', type: 'multiple-choice', question: 'What is our main product?', required: true, options: ['Software', 'Hardware', 'Service', 'Consulting'], correctAnswer: 'Software', points: 2 },
            { id: '2', type: 'short-answer', question: 'Explain the main benefits', required: true, correctAnswer: 'Improved efficiency and productivity', points: 3 }
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          method: 'blooms-quiz',
          responses: 12,
          status: 'published' as const,
          type: 'quiz' as const,
          settings: {
            theme: 'educational',
            submitButtonText: 'Submit Quiz',
            thankYouMessage: 'Thank you for taking the quiz!',
            timeLimit: 30,
            passingScore: 70,
            isActive: true
          }
        },
        {
          id: 'demo-3',
          title: 'Event Registration',
          description: 'Register for our upcoming webinar',
          questions: [
            { id: '1', type: 'text', question: 'Full Name', required: true },
            { id: '2', type: 'email', question: 'Email Address', required: true },
            { id: '3', type: 'select', question: 'Company Size', required: false, options: ['1-10', '11-50', '51-200', '200+'] }
          ],
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          method: 'blank',
          responses: 0,
          status: 'draft' as const,
          type: 'form' as const,
          settings: {
            theme: 'modern',
            submitButtonText: 'Register',
            thankYouMessage: 'Registration successful!'
          }
        },
        {
          id: 'demo-4',
          title: 'Math Skills Assessment',
          description: 'Evaluate mathematical problem-solving abilities',
          questions: [
            { id: '1', type: 'multiple-choice', question: 'What is 15 + 27?', required: true, options: ['40', '42', '44', '46'], correctAnswer: '42', points: 1 },
            { id: '2', type: 'true-false', question: 'The square root of 64 is 8', required: true, correctAnswer: 'True', points: 1 },
            { id: '3', type: 'short-answer', question: 'Solve: 3x + 5 = 14', required: true, correctAnswer: 'x = 3', points: 2 }
          ],
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          method: 'knowledge-quiz',
          responses: 8,
          status: 'published' as const,
          type: 'quiz' as const,
          settings: {
            theme: 'educational',
            submitButtonText: 'Submit Assessment',
            thankYouMessage: 'Assessment completed!',
            timeLimit: 15,
            passingScore: 75,
            isActive: true,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];
      localStorage.setItem('savedForms', JSON.stringify(demoForms));
      setForms(demoForms);
    } else {
      setForms(savedForms);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    const matchesType = filterType === 'all' || (form.type || 'form') === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const deleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedForms = forms.filter(form => form.id !== formId);
      setForms(updatedForms);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    }
  };

  const duplicateForm = (form: SavedForm) => {
    const newForm = {
      ...form,
      id: Date.now().toString(),
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
      responses: 0
    };
    const updatedForms = [...forms, newForm];
    setForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'quiz' ? <Trophy className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'blooms-quiz': return '🧠';
      case 'knowledge-quiz': return '📚';
      case 'skill-assessment': return '🎯';
      case 'certification-quiz': return '🏆';
      case 'timed-quiz': return '⏱️';
      case 'image-to-quiz': return '🖼️';
      case 'video-to-quiz': return '🎥';
      case 'pdf-to-quiz': return '📄';
      case 'news-to-quiz': return '📰';
      case 'learn-from-url': return '🔗';
      default: return '📝';
    }
  };

  const handleView = (form: SavedForm) => {
    if (form.type === 'quiz') {
      window.open(`/quiz/${form.id}`, '_blank');
    } else {
      window.open(`/form/${form.id}`, '_blank');
    }
  };

  const handleEdit = (form: SavedForm) => {
    if (form.type === 'quiz') {
      navigate(`/quiz/${form.id}/edit`);
    } else {
      navigate(`/forms/${form.id}/edit`);
    }
  };

  const handleAnalytics = (form: SavedForm) => {
    if (form.type === 'quiz') {
      navigate(`/quiz/${form.id}/analytics`);
    } else {
      navigate(`/forms/${form.id}/analytics`);
    }
  };

  const isQuizExpired = (form: SavedForm) => {
    if (form.type === 'quiz' && form.settings.expiresAt) {
      return new Date(form.settings.expiresAt) < new Date();
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms & Quizzes</h1>
          <p className="text-gray-600 mt-1">Manage your forms, surveys, and assessments</p>
        </div>
        <Button 
          onClick={() => navigate('/create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Forms</p>
                <p className="text-2xl font-bold text-green-600">{forms.filter(f => (f.type || 'form') === 'form').length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quizzes</p>
                <p className="text-2xl font-bold text-purple-600">{forms.filter(f => f.type === 'quiz').length}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-orange-600">{forms.reduce((sum, f) => sum + (f.responses || 0), 0)}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search forms and quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="form">Forms</option>
          <option value="quiz">Quizzes</option>
        </select>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first form or quiz to get started'}
            </p>
            <Button onClick={() => navigate('/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(form.type || 'form')}
                    <div className="text-lg font-medium">{getMethodIcon(form.method)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                    {form.type === 'quiz' && isQuizExpired(form) && (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                    {form.type === 'quiz' && form.settings.timeLimit && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {form.settings.timeLimit}m
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleView(form)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View {form.type === 'quiz' ? 'Quiz' : 'Form'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(form)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit {form.type === 'quiz' ? 'Quiz' : 'Form'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/forms/${form.id}/enhanced`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Enhanced Builder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAnalytics(form)}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/forms/${form.id}/embed`)}>
                          <Share className="w-4 h-4 mr-2" />
                          Embed {form.type === 'quiz' ? 'Quiz' : 'Form'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => duplicateForm(form)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteForm(form.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                  {form.title}
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {form.responses || 0} responses
                    </span>
                  </div>
                </div>

                {form.type === 'quiz' && (
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-purple-50 rounded p-2 text-center">
                      <div className="font-medium text-purple-700">{form.questions.length}</div>
                      <div className="text-purple-600">Questions</div>
                    </div>
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="font-medium text-green-700">{form.settings.passingScore || 70}%</div>
                      <div className="text-green-600">Pass Score</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms; 