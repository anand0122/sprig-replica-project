import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  Clock, 
  BarChart3, 
  Award,
  Medal,
  Target,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";

interface QuizAttempt {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number; // in seconds
  completedAt: string;
  answers: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    timeSpent: number;
  }[];
  passed: boolean;
  attemptNumber: number;
}

interface QuizAnalytics {
  totalAttempts: number;
  uniqueUsers: number;
  averageScore: number;
  averageTime: number;
  passRate: number;
  topScore: number;
  completionRate: number;
  questionAnalytics: {
    questionId: string;
    question: string;
    correctAnswers: number;
    totalAnswers: number;
    accuracy: number;
    averageTime: number;
  }[];
}

const QuizAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadQuizAndAttempts();
  }, [id]);

  const loadQuizAndAttempts = () => {
    try {
      // Load quiz data
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundQuiz = savedForms.find((f: any) => f.id === id);
      
      if (foundQuiz) {
        setQuiz(foundQuiz);
        
        // Generate mock quiz attempts for demo
        const mockAttempts = generateMockQuizAttempts(foundQuiz);
        setAttempts(mockAttempts);
        
        // Calculate analytics
        const calculatedAnalytics = calculateQuizAnalytics(foundQuiz, mockAttempts);
        setAnalytics(calculatedAnalytics);
      } else {
        navigate('/forms');
      }
    } catch (error) {
      console.error('Error loading quiz analytics:', error);
      navigate('/forms');
    }
  };

  const generateMockQuizAttempts = (quiz: any): QuizAttempt[] => {
    const mockUsers = [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
      { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
      { id: '4', name: 'David Wilson', email: 'david@example.com' },
      { id: '5', name: 'Emma Brown', email: 'emma@example.com' },
      { id: '6', name: 'Frank Miller', email: 'frank@example.com' },
      { id: '7', name: 'Grace Lee', email: 'grace@example.com' },
      { id: '8', name: 'Henry Taylor', email: 'henry@example.com' },
      { id: '9', name: 'Ivy Chen', email: 'ivy@example.com' },
      { id: '10', name: 'Jack Anderson', email: 'jack@example.com' }
    ];

    const attempts: QuizAttempt[] = [];
    const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 10;
    const passingScore = quiz.settings?.passingScore || 70;

    mockUsers.forEach((user, index) => {
      const numAttempts = Math.floor(Math.random() * 3) + 1; // 1-3 attempts per user
      
      for (let attempt = 1; attempt <= numAttempts; attempt++) {
        const score = Math.floor(Math.random() * totalPoints);
        const percentage = Math.round((score / totalPoints) * 100);
        const timeSpent = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
        
        const answers = quiz.questions?.map((q: any, qIndex: number) => {
          const isCorrect = Math.random() > 0.3; // 70% chance of correct answer
          const questionTimeSpent = Math.floor(Math.random() * 120) + 30; // 30-150 seconds per question
          
          return {
            questionId: q.id || `q${qIndex}`,
            question: q.question || `Question ${qIndex + 1}`,
            userAnswer: isCorrect ? (q.correctAnswer || 'Correct Answer') : 'Wrong Answer',
            correctAnswer: q.correctAnswer || 'Correct Answer',
            isCorrect,
            points: isCorrect ? (q.points || 1) : 0,
            timeSpent: questionTimeSpent
          };
        }) || [];

        const actualScore = answers.reduce((sum, a) => sum + a.points, 0);
        const actualPercentage = Math.round((actualScore / totalPoints) * 100);

        attempts.push({
          id: `${user.id}-${attempt}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          score: actualScore,
          totalPoints,
          percentage: actualPercentage,
          timeSpent,
          completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          answers,
          passed: actualPercentage >= passingScore,
          attemptNumber: attempt
        });
      }
    });

    return attempts.sort((a, b) => b.score - a.score);
  };

  const calculateQuizAnalytics = (quiz: any, attempts: QuizAttempt[]): QuizAnalytics => {
    const totalAttempts = attempts.length;
    const uniqueUsers = new Set(attempts.map(a => a.userId)).size;
    const averageScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts;
    const averageTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const passRate = (passedAttempts / totalAttempts) * 100;
    const topScore = Math.max(...attempts.map(a => a.percentage));
    const completionRate = 85; // Mock completion rate

    const questionAnalytics = quiz.questions?.map((q: any, index: number) => {
      const questionAnswers = attempts.flatMap(a => a.answers.filter(ans => ans.questionId === (q.id || `q${index}`)));
      const correctAnswers = questionAnswers.filter(a => a.isCorrect).length;
      const totalAnswers = questionAnswers.length;
      const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
      const averageTime = questionAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / totalAnswers || 0;

      return {
        questionId: q.id || `q${index}`,
        question: q.question || `Question ${index + 1}`,
        correctAnswers,
        totalAnswers,
        accuracy,
        averageTime
      };
    }) || [];

    return {
      totalAttempts,
      uniqueUsers,
      averageScore,
      averageTime,
      passRate,
      topScore,
      completionRate,
      questionAnalytics
    };
  };

  const getRankingBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-600">#{rank}</span>;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const exportResults = () => {
    const csvContent = [
      ['Rank', 'Name', 'Email', 'Score', 'Percentage', 'Time Spent', 'Passed', 'Completed At'].join(','),
      ...attempts.map((attempt, index) => [
        index + 1,
        attempt.userName,
        attempt.userEmail,
        `${attempt.score}/${attempt.totalPoints}`,
        `${attempt.percentage}%`,
        formatTime(attempt.timeSpent),
        attempt.passed ? 'Yes' : 'No',
        new Date(attempt.completedAt).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${quiz?.title || 'quiz'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!quiz || !analytics) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz analytics...</p>
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
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">Quiz Analytics & Leaderboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.open(`/form/${id}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Quiz
          </Button>
          <Button 
            variant="outline" 
            onClick={exportResults}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalAttempts}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">{analytics.averageScore.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.passRate.toFixed(1)}%</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-orange-600">{formatTime(Math.floor(analytics.averageTime))}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="responses">User Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: attempts.filter(a => a.percentage >= 90).length, color: 'bg-green-500' },
                    { range: '80-89%', count: attempts.filter(a => a.percentage >= 80 && a.percentage < 90).length, color: 'bg-blue-500' },
                    { range: '70-79%', count: attempts.filter(a => a.percentage >= 70 && a.percentage < 80).length, color: 'bg-yellow-500' },
                    { range: '60-69%', count: attempts.filter(a => a.percentage >= 60 && a.percentage < 70).length, color: 'bg-orange-500' },
                    { range: 'Below 60%', count: attempts.filter(a => a.percentage < 60).length, color: 'bg-red-500' }
                  ].map((bucket) => (
                    <div key={bucket.range} className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium">{bucket.range}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className={`${bucket.color} h-6 rounded-full transition-all duration-500`}
                          style={{ width: `${(bucket.count / analytics.totalAttempts) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {bucket.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attempts.slice(0, 5).map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankingBadge(index + 1)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{attempt.userName}</p>
                        <p className="text-sm text-gray-600">{attempt.userEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{attempt.percentage}%</p>
                        <p className="text-xs text-gray-600">{formatTime(attempt.timeSpent)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Quiz Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attempts.map((attempt, index) => (
                  <div key={attempt.id} className={`flex items-center gap-4 p-4 rounded-lg border ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankingBadge(index + 1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{attempt.userName}</p>
                        {attempt.passed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {!attempt.passed && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{attempt.userEmail}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{attempt.score}/{attempt.totalPoints}</p>
                      <p className="text-sm text-gray-600">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-blue-600">{attempt.percentage}%</p>
                      <p className="text-sm text-gray-600">Percentage</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{formatTime(attempt.timeSpent)}</p>
                      <p className="text-sm text-gray-600">Time Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{new Date(attempt.completedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.questionAnalytics.map((qa, index) => (
                  <div key={qa.questionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Q{index + 1}: {qa.question}</h4>
                      </div>
                      <Badge variant={qa.accuracy >= 70 ? "default" : qa.accuracy >= 50 ? "secondary" : "destructive"}>
                        {qa.accuracy.toFixed(1)}% Accuracy
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Correct Answers</p>
                        <p className="font-semibold">{qa.correctAnswers}/{qa.totalAnswers}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Average Time</p>
                        <p className="font-semibold">{formatTime(Math.floor(qa.averageTime))}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Difficulty</p>
                        <p className="font-semibold">
                          {qa.accuracy >= 80 ? 'Easy' : qa.accuracy >= 60 ? 'Medium' : 'Hard'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            qa.accuracy >= 70 ? 'bg-green-500' : qa.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${qa.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed User Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{attempt.userName}</h4>
                        <p className="text-sm text-gray-600">{attempt.userEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{attempt.percentage}%</p>
                        <p className="text-sm text-gray-600">Score: {attempt.score}/{attempt.totalPoints}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {attempt.answers.map((answer, index) => (
                        <div key={answer.questionId} className="bg-gray-50 rounded p-3">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-sm">Q{index + 1}: {answer.question}</p>
                            <div className="flex items-center gap-2">
                              {answer.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-gray-600">{formatTime(answer.timeSpent)}</span>
                            </div>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">User Answer:</span> {answer.userAnswer}</p>
                            {!answer.isCorrect && (
                              <p><span className="font-medium text-green-600">Correct Answer:</span> {answer.correctAnswer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizAnalytics;