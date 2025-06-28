import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  RotateCcw,
  Eye,
  EyeOff,
  Timer,
  Flag
} from "lucide-react";

interface QuizAttempt {
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number;
  answers: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
  }[];
  passed: boolean;
  completedAt: string;
}

const QuizTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizExpired, setQuizExpired] = useState(false);
  const [results, setResults] = useState<QuizAttempt | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userAttempts, setUserAttempts] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, timeRemaining]);

  const loadQuiz = () => {
    try {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundQuiz = savedForms.find((f: any) => f.id === id);
      
      if (foundQuiz) {
        // Check if quiz is expired
        if (foundQuiz.settings?.expiresAt && new Date(foundQuiz.settings.expiresAt) < new Date()) {
          setQuizExpired(true);
          return;
        }

        // Check if quiz is active
        if (!foundQuiz.settings?.isActive) {
          setQuizExpired(true);
          return;
        }

        setQuiz(foundQuiz);
        setTimeRemaining((foundQuiz.settings?.timeLimit || 30) * 60); // Convert minutes to seconds
        
        // Load user attempts (mock data for demo)
        const mockAttempts = localStorage.getItem(`quiz_attempts_${id}`) || '0';
        setUserAttempts(parseInt(mockAttempts));
      } else {
        navigate('/forms');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      navigate('/forms');
    }
  };

  const startQuiz = () => {
    if (userAttempts >= (quiz.settings?.maxAttempts || 3)) {
      alert('You have reached the maximum number of attempts for this quiz.');
      return;
    }

    setQuizStarted(true);
    startTimeRef.current = Date.now();
    
    // Randomize questions if enabled
    if (quiz.settings?.randomizeQuestions) {
      const shuffledQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);
      setQuiz({ ...quiz, questions: shuffledQuestions });
    }
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    submitQuiz(true);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = (timeExpired = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let score = 0;
    const totalPoints = quiz.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    
    const detailedAnswers = quiz.questions.map((question: any) => {
      const userAnswer = answers[question.id] || '';
      const correctAnswer = question.correctAnswer || '';
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      const points = isCorrect ? (question.points || 1) : 0;
      
      score += points;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect,
        points
      };
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= (quiz.settings?.passingScore || 70);

    const attempt: QuizAttempt = {
      score,
      totalPoints,
      percentage,
      timeSpent,
      answers: detailedAnswers,
      passed,
      completedAt: new Date().toISOString()
    };

    setResults(attempt);
    setQuizCompleted(true);
    
    // Update user attempts
    const newAttemptCount = userAttempts + 1;
    setUserAttempts(newAttemptCount);
    localStorage.setItem(`quiz_attempts_${id}`, newAttemptCount.toString());

    // Save attempt to localStorage (in real app, this would go to backend)
    const savedAttempts = JSON.parse(localStorage.getItem(`quiz_results_${id}`) || '[]');
    savedAttempts.push({
      ...attempt,
      userId: 'demo-user',
      userName: 'Demo User',
      userEmail: 'demo@example.com',
      attemptNumber: newAttemptCount,
      timeExpired
    });
    localStorage.setItem(`quiz_results_${id}`, JSON.stringify(savedAttempts));

    if (quiz.settings?.showResults) {
      setShowResults(true);
    }
  };

  const retakeQuiz = () => {
    if (userAttempts >= (quiz.settings?.maxAttempts || 3)) {
      alert('You have reached the maximum number of attempts for this quiz.');
      return;
    }

    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining((quiz.settings?.timeLimit || 30) * 60);
    setQuizCompleted(false);
    setResults(null);
    setShowResults(false);
    startQuiz();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = (quiz.settings?.timeLimit || 30) * 60;
    const percentage = (timeRemaining / totalTime) * 100;
    
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressPercentage = () => {
    if (!quiz.questions.length) return 0;
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  if (quizExpired) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Unavailable</h2>
            <p className="text-gray-600 mb-6">
              This quiz is either expired or has been deactivated by the owner.
            </p>
            <Button onClick={() => navigate('/forms')}>
              Back to Forms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted && showResults && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {results.passed ? (
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {results.passed ? 'Congratulations!' : 'Quiz Completed'}
              </h2>
              <p className="text-gray-600">
                {results.passed ? 'You passed the quiz!' : 'Better luck next time!'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{results.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{results.percentage}%</div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{userAttempts}</div>
                <div className="text-sm text-gray-600">Attempt #{userAttempts}</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              {quiz.settings?.allowRetakes && userAttempts < (quiz.settings?.maxAttempts || 3) && (
                <Button onClick={retakeQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowResults(false)}>
                <Eye className="w-4 h-4 mr-2" />
                Review Answers
              </Button>
              <Button variant="outline" onClick={() => navigate('/forms')}>
                Back to Forms
              </Button>
            </div>
          </CardContent>
        </Card>

        {!showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.answers.map((answer, index) => (
                  <div key={answer.questionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">Q{index + 1}: {quiz.questions[index]?.question}</h4>
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Your Answer:</span> {answer.userAnswer || 'No answer'}</p>
                      {!answer.isCorrect && (
                        <p><span className="font-medium text-green-600">Correct Answer:</span> {answer.correctAnswer}</p>
                      )}
                      {quiz.questions[index]?.explanation && (
                        <div className="bg-blue-50 p-3 rounded mt-2">
                          <p className="font-medium text-blue-900">Explanation:</p>
                          <p className="text-blue-800">{quiz.questions[index].explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{quiz.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{quiz.settings?.timeLimit || 30}m</div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{quiz.settings?.passingScore || 70}%</div>
                <div className="text-sm text-gray-600">Passing Score</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{userAttempts}/{quiz.settings?.maxAttempts || 3}</div>
                <div className="text-sm text-gray-600">Attempts</div>
              </div>
            </div>

            {userAttempts >= (quiz.settings?.maxAttempts || 3) ? (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">You have reached the maximum number of attempts.</p>
              </div>
            ) : (
              <Button onClick={startQuiz} className="w-full" size="lg">
                <Flag className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Timer and Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-gray-500" />
                <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>
            <Badge variant="outline">
              {Math.round(getProgressPercentage())}% Complete
            </Badge>
          </div>
          <Progress value={getProgressPercentage()} className="mt-3" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Question {currentQuestionIndex + 1}</span>
            <Badge variant="secondary">
              {currentQuestion.points || 1} point{(currentQuestion.points || 1) !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'short-answer' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button onClick={() => submitQuiz()} className="bg-green-600 hover:bg-green-700">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_: any, index: number) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : answers[quiz.questions[index].id] ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTaker;