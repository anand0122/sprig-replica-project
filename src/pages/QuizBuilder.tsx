import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  Trophy, 
  Save,
  Eye,
  Settings,
  Timer,
  Award
} from "lucide-react";
import { QuestionBuilder } from "@/components/QuestionBuilder";

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  timeLimit?: number;
  explanation?: string;
}

interface QuizSettings {
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  showResults: boolean;
  allowRetakes: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  isActive: boolean;
  expiresAt?: string;
  maxAttempts: number;
}

const QuizBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const [quiz, setQuiz] = useState<QuizSettings>({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    showResults: true,
    allowRetakes: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    isActive: true,
    maxAttempts: 3
  });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (id && id !== 'new') {
      loadQuiz();
    } else if (method === 'blank' || id === 'new') {
      // Initialize blank quiz with default settings
      setQuiz({
        title: 'New Quiz',
        description: 'Custom quiz created from scratch',
        timeLimit: 30,
        passingScore: 70,
        showResults: true,
        allowRetakes: true,
        randomizeQuestions: false,
        randomizeOptions: false,
        isActive: true,
        maxAttempts: 3
      });
      setQuestions([]);
      setActiveTab('settings');
    }
  }, [id, method]);

  const loadQuiz = () => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const foundQuiz = savedQuizzes.find((q: any) => q.id === id);
      
      if (foundQuiz) {
        setQuiz(foundQuiz.settings);
        setQuestions(foundQuiz.questions);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const saveQuiz = () => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const quizData = {
        id: id === 'new' ? Date.now().toString() : id,
        settings: quiz,
        questions: questions,
        createdAt: new Date().toISOString(),
        type: 'quiz'
      };

      if (id === 'new') {
        savedQuizzes.push(quizData);
      } else {
        const index = savedQuizzes.findIndex((q: any) => q.id === id);
        if (index !== -1) {
          savedQuizzes[index] = quizData;
        }
      }

      localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
      
      // Also save to forms for unified management
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const formData = {
        id: quizData.id,
        title: quiz.title,
        description: quiz.description,
        questions: questions,
        createdAt: quizData.createdAt,
        method: 'quiz',
        responses: 0,
        status: quiz.isActive ? 'published' : 'draft',
        settings: {
          theme: 'quiz',
          submitButtonText: 'Submit Quiz',
          thankYouMessage: 'Quiz completed successfully!',
          ...quiz
        },
        type: 'quiz'
      };

      const formIndex = savedForms.findIndex((f: any) => f.id === quizData.id);
      if (formIndex !== -1) {
        savedForms[formIndex] = formData;
      } else {
        savedForms.push(formData);
      }
      
      localStorage.setItem('savedForms', JSON.stringify(savedForms));
      
      alert('Quiz saved successfully!');
      navigate('/forms');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz. Please try again.');
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      timeLimit: 60
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const setQuizExpiry = (hours: number) => {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hours);
    setQuiz({ ...quiz, expiresAt: expiryDate.toISOString() });
  };

  const toggleQuizStatus = () => {
    setQuiz({ ...quiz, isActive: !quiz.isActive });
  };

  const getTotalPoints = () => {
    return questions.reduce((total, q) => total + q.points, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id === 'new' ? 'Create New Quiz' : 'Edit Quiz'}
            </h1>
            <p className="text-gray-600">Build interactive quizzes with scoring and timers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (id !== 'new') {
                window.open(`/form/${id}`, '_blank');
              }
            }}
            disabled={id === 'new'}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveQuiz}>
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Quiz Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={quiz.isActive ? "default" : "secondary"}>
                  {quiz.isActive ? "Active" : "Inactive"}
                </Badge>
                {quiz.expiresAt && (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Expires: {new Date(quiz.expiresAt).toLocaleString()}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {questions.length} questions • {getTotalPoints()} total points
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleQuizStatus}
              >
                {quiz.isActive ? 'Deactivate' : 'Activate'} Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Quiz Settings
          </TabsTrigger>
          <TabsTrigger value="questions">
            <Plus className="w-4 h-4 mr-2" />
            Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="timing">
            <Timer className="w-4 h-4 mr-2" />
            Timing & Expiry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quiz.description}
                  onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                  placeholder="Describe what this quiz covers"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scoring & Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={quiz.passingScore}
                    onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttempts">Max Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="1"
                    max="10"
                    value={quiz.maxAttempts}
                    onChange={(e) => setQuiz({ ...quiz, maxAttempts: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showResults">Show Results After Completion</Label>
                  <Switch
                    id="showResults"
                    checked={quiz.showResults}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, showResults: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowRetakes">Allow Retakes</Label>
                  <Switch
                    id="allowRetakes"
                    checked={quiz.allowRetakes}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, allowRetakes: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="randomizeQuestions">Randomize Question Order</Label>
                  <Switch
                    id="randomizeQuestions"
                    checked={quiz.randomizeQuestions}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, randomizeQuestions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="randomizeOptions">Randomize Answer Options</Label>
                  <Switch
                    id="randomizeOptions"
                    checked={quiz.randomizeOptions}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, randomizeOptions: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quiz Questions</h3>
            <Button onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Start building your quiz by adding questions</p>
                <Button onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <span className="text-sm text-gray-600">
                          {question.points} point{question.points !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        placeholder="Enter your question"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { 
                            type: e.target.value as QuizQuestion['type'],
                            options: e.target.value === 'true-false' ? ['True', 'False'] : question.options
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>
                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div>
                        <Label>Time Limit (seconds)</Label>
                        <Input
                          type="number"
                          min="10"
                          max="300"
                          value={question.timeLimit || 60}
                          onChange={(e) => updateQuestion(question.id, { timeLimit: parseInt(e.target.value) || 60 })}
                        />
                      </div>
                    </div>

                    {question.type === 'multiple-choice' && (
                      <div>
                        <Label>Answer Options</Label>
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <Button
                                variant={question.correctAnswer === option ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateQuestion(question.id, { correctAnswer: option })}
                              >
                                {question.correctAnswer === option ? "Correct" : "Mark Correct"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div>
                        <Label>Correct Answer</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={question.correctAnswer === 'True' ? "default" : "outline"}
                            onClick={() => updateQuestion(question.id, { correctAnswer: 'True' })}
                          >
                            True
                          </Button>
                          <Button
                            variant={question.correctAnswer === 'False' ? "default" : "outline"}
                            onClick={() => updateQuestion(question.id, { correctAnswer: 'False' })}
                          >
                            False
                          </Button>
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div>
                        <Label>Correct Answer</Label>
                        <Input
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Explanation (Optional)</Label>
                      <Textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                        placeholder="Explain why this answer is correct"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeLimit">Overall Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  max="180"
                  value={quiz.timeLimit}
                  onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 30 })}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Total time allowed for the entire quiz
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Expiry Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Set Quiz Expiry</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuizExpiry(1)}
                  >
                    1 Hour
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuizExpiry(24)}
                  >
                    1 Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuizExpiry(168)}
                  >
                    1 Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuiz({ ...quiz, expiresAt: undefined })}
                  >
                    No Expiry
                  </Button>
                </div>
                {quiz.expiresAt && (
                  <p className="text-sm text-gray-600 mt-2">
                    Quiz will expire on: {new Date(quiz.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{getTotalPoints()}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{quiz.timeLimit}m</div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{quiz.passingScore}%</div>
                  <div className="text-sm text-gray-600">Passing Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizBuilder;