
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useResponses } from '@/hooks/useResponses';
import { Study, Question } from './StudyBuilder';

interface StudyEmbedProps {
  studyId: string;
  onComplete?: (responseId: string) => void;
}

export const StudyEmbed = ({ studyId, onComplete }: StudyEmbedProps) => {
  const [study, setStudy] = useState<Study | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const { addResponse } = useResponses();

  useEffect(() => {
    const studies = JSON.parse(localStorage.getItem('sprig_studies') || '[]');
    const foundStudy = studies.find((s: Study) => s.id === studyId);
    setStudy(foundStudy);
  }, [studyId]);

  if (!study) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Study not found</p>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-semibold">Thank you!</h3>
          <p className="text-gray-600">
            Your response has been recorded. We appreciate your feedback!
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = study.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === study.questions.length - 1;

  const handleAnswerChange = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Submit the study
      const response = addResponse({
        studyId: study.id,
        sessionId: crypto.randomUUID(),
        responses,
        timeSpent: Date.now() - startTime,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }
      });
      
      setIsCompleted(true);
      onComplete?.(response.id);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderQuestion = (question: Question) => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your response..."
            className="w-full"
          />
        );

      case 'rating':
        return (
          <RadioGroup 
            value={currentValue?.toString()} 
            onValueChange={(value) => handleAnswerChange(parseInt(value))}
            className="flex justify-between"
          >
            {Array.from({ length: (question.scale?.max || 5) - (question.scale?.min || 1) + 1 }, (_, i) => {
              const value = (question.scale?.min || 1) + i;
              return (
                <div key={value} className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`} className="text-sm">
                    {value}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        );

      case 'choice':
        return (
          <RadioGroup 
            value={currentValue} 
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`choice-${index}`} />
                <Label htmlFor={`choice-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'nps':
        return (
          <RadioGroup 
            value={currentValue?.toString()} 
            onValueChange={(value) => handleAnswerChange(parseInt(value))}
            className="grid grid-cols-11 gap-2"
          >
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <RadioGroupItem value={i.toString()} id={`nps-${i}`} />
                <Label htmlFor={`nps-${i}`} className="text-sm">
                  {i}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  const isAnswered = currentQuestion.required ? responses[currentQuestion.id] !== undefined : true;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{study.name}</CardTitle>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {study.questions.length}
          </span>
        </div>
        {study.description && (
          <p className="text-gray-600 text-sm">{study.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.title}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {renderQuestion(currentQuestion)}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / study.questions.length) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
