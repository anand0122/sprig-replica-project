import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText,
  Star,
  Send,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface FormQuestion {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'date' | 'rating' | 'file';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

interface Form {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  settings: {
    allowMultipleSubmissions: boolean;
    showProgressBar: boolean;
    showQuestionNumbers: boolean;
    submitButtonText: string;
    thankYouMessage: string;
    redirectUrl?: string;
    collectEmail: boolean;
    requireAuth: boolean;
  };
  branding: {
    primaryColor: string;
    logo?: string;
    showPoweredBy: boolean;
  };
  status: 'active' | 'inactive' | 'draft' | 'published';
  createdAt: string;
  expiresAt?: string;
}

const PublicForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = (formId: string) => {
    // Primary key used by builder
    let forms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    // Back-compat old key
    if (forms.length === 0) {
      forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    }
    const foundForm = forms.find((f: Form) => f.id === formId);
    
    if (!foundForm) {
      // Create a sample form for demonstration
      const sampleForm: Form = {
        id: formId,
        title: 'Customer Feedback Survey',
        description: 'Help us improve our service by sharing your feedback',
        questions: [
          {
            id: 'name',
            type: 'text',
            question: 'What is your name?',
            required: true
          },
          {
            id: 'email',
            type: 'email',
            question: 'What is your email address?',
            description: 'We\'ll use this to follow up if needed',
            required: true,
            validation: {
              pattern: '^[^@]+@[^@]+\\.[^@]+$',
              message: 'Please enter a valid email address'
            }
          },
          {
            id: 'satisfaction',
            type: 'rating',
            question: 'How satisfied are you with our service?',
            required: true,
            validation: { min: 1, max: 5 }
          },
          {
            id: 'recommendation',
            type: 'radio',
            question: 'Would you recommend us to others?',
            required: true,
            options: ['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not']
          },
          {
            id: 'features',
            type: 'checkbox',
            question: 'Which features do you use most? (Select all that apply)',
            required: false,
            options: ['Dashboard', 'Analytics', 'Reports', 'Integrations', 'Mobile App']
          },
          {
            id: 'feedback',
            type: 'textarea',
            question: 'Any additional feedback or suggestions?',
            description: 'Please share any thoughts on how we can improve',
            required: false
          }
        ],
        settings: {
          allowMultipleSubmissions: false,
          showProgressBar: true,
          showQuestionNumbers: true,
          submitButtonText: 'Submit Feedback',
          thankYouMessage: 'Thank you for your feedback! We appreciate your time.',
          collectEmail: true,
          requireAuth: false
        },
        branding: {
          primaryColor: '#3b82f6',
          showPoweredBy: true
        },
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setForm(sampleForm);
    } else {
      // Ensure branding defaults exist to prevent runtime errors
      if (!('branding' in foundForm) || !foundForm.branding) {
        (foundForm as any).branding = { primaryColor: '#3b82f6', showPoweredBy: true };
      }
      // Ensure status default
      if (!foundForm.status) {
        (foundForm as any).status = 'active';
      }
      // Ensure settings defaults
      if (!foundForm.settings) {
        (foundForm as any).settings = {
          allowMultipleSubmissions: true,
          showProgressBar: true,
          showQuestionNumbers: true,
          submitButtonText: 'Submit',
          thankYouMessage: 'Thank you!',
          collectEmail: false,
          requireAuth: false,
        };
      }
      setForm(foundForm);

      // Normalize question types for compatibility
      (foundForm.questions as any[]).forEach((q) => {
        switch (q.type) {
          case 'short-answer':
            q.type = 'text';
            break;
          case 'paragraph':
            q.type = 'textarea';
            break;
          case 'multiple-choice':
            q.type = 'radio';
            break;
          case 'checkboxes':
            q.type = 'checkbox';
            break;
          case 'dropdown':
            q.type = 'select';
            break;
          case 'linear-scale':
            q.type = 'rating';
            if (!q.validation) q.validation = { min: q.scaleMin || 1, max: q.scaleMax || 5 };
            break;
          case 'file-upload':
            q.type = 'file';
            break;
          case 'long-answer':
            q.type = 'textarea';
            break;
          case 'phone':
            q.type = 'text';
            if (!q.validation) q.validation = { pattern: '^\\+?[0-9 .-]{7,15}$', message: 'Enter a valid phone number' };
            break;
          default:
            q.type = 'text';
            break;
        }
      });
      setForm({ ...foundForm });
    }
  };

  const validateQuestion = (question: FormQuestion, value: any): string | null => {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    if (question.validation) {
      const { min, max, pattern, message } = question.validation;
      
      if (min !== undefined && value && value.toString().length < min) {
        return message || `Minimum ${min} characters required`;
      }
      
      if (max !== undefined && value && value.toString().length > max) {
        return message || `Maximum ${max} characters allowed`;
      }
      
      if (pattern && value && !new RegExp(pattern).test(value.toString())) {
        return message || 'Invalid format';
      }
    }

    return null;
  };

  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!form) return false;
    
    const question = form.questions[currentStep];
    const value = responses[question.id];
    const error = validateQuestion(question, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [question.id]: error
      }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!form) return;
    
    if (validateCurrentStep()) {
      if (currentStep < form.questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;
    
    // Validate all questions
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    form.questions.forEach(question => {
      const error = validateQuestion(question, responses[question.id]);
      if (error) {
        newErrors[question.id] = error;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save response to localStorage (in real app, this would be an API call)
      const response = {
        id: crypto.randomUUID(),
        formId: form.id,
        responses,
        submittedAt: new Date().toISOString(),
        timeSpent: Date.now() - startTime,
        userAgent: navigator.userAgent,
        ipAddress: 'xxx.xxx.xxx.xxx' // Would be captured server-side
      };
      
      const existingResponses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');
      existingResponses.push(response);
      localStorage.setItem('formpulse_responses', JSON.stringify(existingResponses));
      
      setIsSubmitted(true);
      
      toast({
        title: "Success!",
        description: "Your response has been submitted successfully.",
      });
      
      // Redirect if specified
      if (form.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl!;
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    const value = responses[question.id];
    const error = errors[question.id];
    
    switch (question.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <div className="space-y-2">
            <Input
              type={question.type}
              value={value || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={`Enter your ${question.type === 'email' ? 'email' : 'answer'}`}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2">
            <Textarea
              value={value || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder="Enter your response..."
              rows={4}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-3">
            <RadioGroup
              value={value || ''}
              onValueChange={(val) => handleInputChange(question.id, val)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleInputChange(question.id, [...currentValues, option]);
                    } else {
                      handleInputChange(question.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2">
            <Select value={value || ''} onValueChange={(val) => handleInputChange(question.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'rating':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: question.validation?.max || 5 }, (_, i) => {
                const rating = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInputChange(question.id, rating)}
                    className={`p-2 rounded-full transition-colors ${
                      value >= rating
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                );
              })}
              {value && (
                <span className="ml-2 text-sm text-gray-600">
                  {value} out of {question.validation?.max || 5}
                </span>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleInputChange(question.id, file.name);
                }
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (form.status && form.status !== 'active' && form.status !== 'published') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Available</h2>
            <p className="text-gray-600">This form is currently not accepting responses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (form.expiresAt && new Date() > new Date(form.expiresAt)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Expired</h2>
            <p className="text-gray-600">This form is no longer accepting responses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">{form.settings.thankYouMessage}</p>
            
            {form.branding.showPoweredBy && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-8">
                <Shield className="w-4 h-4" />
                <span>Powered by FormPulse</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Guard: form without questions
  if (!form.questions || form.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Questions</h2>
            <p className="text-gray-600">This form doesn\'t contain any questions yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = form.questions[currentStep];
  const progress = ((currentStep + 1) / form.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-gray-600 mt-2">{form.description}</p>
            )}
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        {form.settings?.showProgressBar && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentStep + 1} of {form.questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Question Card */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Question Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {form.settings.showQuestionNumbers && (
                    <Badge variant="outline" className="text-sm">
                      {currentStep + 1}
                    </Badge>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentQuestion.question}
                    {currentQuestion.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                </div>
                {currentQuestion.description && (
                  <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
                )}
              </div>

              {/* Question Input */}
              <div>
                {renderQuestion(currentQuestion)}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: form.branding.primaryColor }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : currentStep === form.questions.length - 1 ? (
                    <>
                      <Send className="w-4 h-4" />
                      {form.settings?.submitButtonText || 'Submit'}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        {form.branding.showPoweredBy && (
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Powered by FormPulse</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicForm; 