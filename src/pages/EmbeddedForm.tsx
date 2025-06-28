import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

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
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  expiresAt?: string;
}

const EmbeddedForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  // Embed settings from URL params
  const embedSettings = {
    theme: searchParams.get('theme') || 'light',
    showTitle: searchParams.get('showTitle') !== 'false',
    showDescription: searchParams.get('showDescription') !== 'false',
    primaryColor: '#' + (searchParams.get('primaryColor') || '3b82f6'),
    backgroundColor: '#' + (searchParams.get('backgroundColor') || 'ffffff'),
    isEmbed: searchParams.get('embed') === 'true'
  };

  useEffect(() => {
    loadForm();
    
    // Auto-resize iframe
    if (embedSettings.isEmbed) {
      const resizeObserver = new ResizeObserver(() => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({
          type: 'formResize',
          formId: id,
          height: height
        }, '*');
      });
      
      resizeObserver.observe(document.body);
      
      return () => resizeObserver.disconnect();
    }
  }, [id]);

  const loadForm = () => {
    try {
      // Mock form data - in production this would come from API
      const mockForm: Form = {
        id: id || 'demo',
        title: 'Contact Us',
        description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        questions: [
          {
            id: 'name',
            type: 'text',
            question: 'What\'s your name?',
            required: true
          },
          {
            id: 'email',
            type: 'email',
            question: 'What\'s your email address?',
            required: true,
            validation: {
              pattern: '^[^@]+@[^@]+\\.[^@]+$',
              message: 'Please enter a valid email address'
            }
          },
          {
            id: 'company',
            type: 'text',
            question: 'What company do you work for?',
            required: false
          },
          {
            id: 'interest',
            type: 'radio',
            question: 'What are you interested in?',
            required: true,
            options: ['Product Demo', 'Pricing Information', 'Technical Support', 'Partnership Opportunities']
          },
          {
            id: 'message',
            type: 'textarea',
            question: 'Tell us more about your inquiry',
            description: 'Please provide as much detail as possible',
            required: true
          }
        ],
        settings: {
          allowMultipleSubmissions: false,
          showProgressBar: true,
          showQuestionNumbers: false,
          submitButtonText: 'Send Message',
          thankYouMessage: 'Thank you for your message! We\'ll get back to you soon.',
          collectEmail: true,
          requireAuth: false
        },
        branding: {
          primaryColor: embedSettings.primaryColor,
          showPoweredBy: true
        },
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setForm(mockForm);
    } catch (error) {
      console.error('Error loading form:', error);
    }
  };

  const validateQuestion = (question: FormQuestion, value: any): string | null => {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    if (question.validation && value) {
      if (question.validation.min && value.length < question.validation.min) {
        return `Minimum ${question.validation.min} characters required`;
      }
      if (question.validation.max && value.length > question.validation.max) {
        return `Maximum ${question.validation.max} characters allowed`;
      }
      if (question.validation.pattern && !new RegExp(question.validation.pattern).test(value)) {
        return question.validation.message || 'Invalid format';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save response
      const response = {
        id: crypto.randomUUID(),
        formId: form.id,
        responses,
        submittedAt: new Date().toISOString(),
        timeSpent: Date.now() - startTime,
        userAgent: navigator.userAgent,
        source: embedSettings.isEmbed ? 'embed' : 'direct'
      };
      
      // In embedded mode, notify parent window
      if (embedSettings.isEmbed) {
        window.parent.postMessage({
          type: 'formSubmit',
          formId: form.id,
          data: response
        }, '*');
      }
      
      // Save to localStorage for demo
      const existingResponses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');
      existingResponses.push(response);
      localStorage.setItem('formpulse_responses', JSON.stringify(existingResponses));
      
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: FormQuestion, index: number) => {
    const value = responses[question.id];
    const error = errors[question.id];
    
    return (
      <div key={question.id} className="space-y-3">
        <div>
          <Label className="text-base font-medium text-gray-900">
            {form?.settings.showQuestionNumbers && `${index + 1}. `}
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {question.description && (
            <p className="text-sm text-gray-600 mt-1">{question.description}</p>
          )}
        </div>
        
        {(() => {
          switch (question.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
              return (
                <Input
                  type={question.type}
                  value={value || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className={error ? 'border-red-500' : ''}
                  style={{ borderColor: error ? '#ef4444' : undefined }}
                />
              );
              
            case 'textarea':
              return (
                <Textarea
                  value={value || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  rows={4}
                  className={error ? 'border-red-500' : ''}
                  style={{ borderColor: error ? '#ef4444' : undefined }}
                />
              );
              
            case 'radio':
              return (
                <RadioGroup
                  value={value || ''}
                  onValueChange={(val) => handleInputChange(question.id, val)}
                >
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`${question.id}-${optIndex}`}
                        style={{ 
                          borderColor: embedSettings.primaryColor,
                          color: embedSettings.primaryColor 
                        }}
                      />
                      <Label 
                        htmlFor={`${question.id}-${optIndex}`} 
                        className="cursor-pointer text-gray-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              );
              
            case 'checkbox':
              return (
                <div className="space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${optIndex}`}
                        checked={(value || []).includes(option)}
                        onCheckedChange={(checked) => {
                          const currentValues = value || [];
                          if (checked) {
                            handleInputChange(question.id, [...currentValues, option]);
                          } else {
                            handleInputChange(question.id, currentValues.filter((v: string) => v !== option));
                          }
                        }}
                        style={{ 
                          borderColor: embedSettings.primaryColor,
                          backgroundColor: (value || []).includes(option) ? embedSettings.primaryColor : undefined
                        }}
                      />
                      <Label 
                        htmlFor={`${question.id}-${optIndex}`} 
                        className="cursor-pointer text-gray-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              );
              
            case 'rating':
              return (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleInputChange(question.id, rating)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                        value === rating
                          ? 'border-current text-white'
                          : 'border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: value === rating ? embedSettings.primaryColor : undefined,
                        borderColor: value === rating ? embedSettings.primaryColor : undefined
                      }}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              );
              
            default:
              return null;
          }
        })()}
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    );
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: embedSettings.backgroundColor }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: embedSettings.primaryColor }}></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: embedSettings.backgroundColor }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: embedSettings.primaryColor }} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">{form.settings.thankYouMessage}</p>
            {form.branding.showPoweredBy && (
              <p className="text-xs text-gray-500">
                Powered by <span className="font-medium">FormPulse</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{ 
        backgroundColor: embedSettings.backgroundColor,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            {embedSettings.showTitle && (
              <CardTitle className="text-2xl font-bold text-gray-900">
                {form.title}
              </CardTitle>
            )}
            {embedSettings.showDescription && form.description && (
              <p className="text-gray-600 mt-2">{form.description}</p>
            )}
            {form.settings.showProgressBar && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((Object.keys(responses).length) / form.questions.length) * 100)}%</span>
                </div>
                <Progress 
                  value={(Object.keys(responses).length / form.questions.length) * 100} 
                  className="h-2"
                  style={{ 
                    backgroundColor: embedSettings.primaryColor + '20'
                  }}
                />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.questions.map((question, index) => renderQuestion(question, index))}
              
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: embedSettings.primaryColor,
                    borderColor: embedSettings.primaryColor
                  }}
                >
                  {isSubmitting ? 'Submitting...' : form.settings.submitButtonText}
                </Button>
              </div>
            </form>
            
            {form.branding.showPoweredBy && (
              <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Powered by <span className="font-medium">FormPulse</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddedForm; 