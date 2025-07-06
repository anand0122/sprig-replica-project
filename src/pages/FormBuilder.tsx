import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiService, FormQuestion, GeneratedForm } from "@/services/aiService";
import * as aiBackend from "@/services/aiBackend";
import { QuestionBuilder } from "@/components/QuestionBuilder";
import { FORM_TEMPLATES } from "@/data/formTemplates";
import { 
  ArrowLeft, 
  Upload, 
  Link, 
  FileText, 
  Image, 
  Video, 
  Newspaper,
  FileImage,
  Brain,
  Sparkles,
  Send,
  Save,
  Eye,
  Loader2,
  Plus
} from "lucide-react";

const FormBuilder = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const method = searchParams.get('method');
  const isEditing = Boolean(id && id !== 'new');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    file: null as File | null,
    url: '',
    difficulty: 'medium',
    questionCount: 5,
    taxonomyLevel: 'understand'
  });

  // Map old question types to new ones for backward compatibility
  const mapOldTypeToNew = (oldType: string): FormQuestion['type'] => {
    const typeMap: Record<string, FormQuestion['type']> = {
      'text': 'short-answer',
      'textarea': 'paragraph',
      'radio': 'multiple-choice',
      'checkbox': 'checkboxes',
      'select': 'dropdown',
      'email': 'email',
      'number': 'number',
      'date': 'date',
      'time': 'time',
      'file': 'file-upload',
      'rating': 'rating',
      'scale': 'linear-scale'
    };
    return typeMap[oldType] || 'short-answer';
  };

  // Update the useEffect to handle template initialization
  useEffect(() => {
    const isTemplate = searchParams.get('template') === 'true';
    
    if (isEditing && id) {
      loadExistingForm(id);
    } else if (method === 'blank') {
      setGeneratedForm({
        title: 'New Form',
        description: 'Custom form created from scratch',
        questions: [],
        settings: {
          theme: 'modern',
          submitButtonText: 'Submit',
          thankYouMessage: 'Thank you for your submission!'
        }
      });
      setCurrentStep(1);
    } else if (method && isTemplate && FORM_TEMPLATES[method as keyof typeof FORM_TEMPLATES]) {
      const template = FORM_TEMPLATES[method as keyof typeof FORM_TEMPLATES];
      setGeneratedForm({
        ...template,
        questions: template.questions.map(q => ({
          ...q,
          id: `question_${Date.now()}_${Math.random()}`
        }))
      });
      setFormData({
        ...formData,
        title: template.title,
        description: template.description
      });
      setCurrentStep(1);
    } else if (!method && !isEditing) {
      navigate('/create');
    }
  }, [isEditing, id, method, navigate, searchParams]);

  const loadExistingForm = (formId: string) => {
    try {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundForm = savedForms.find((f: any) => f.id === formId);
      
      if (foundForm) {
        // Normalize questions for the new question types
        const normalizedQuestions = foundForm.questions.map((q: any) => ({
          id: q.id || `question_${Date.now()}_${Math.random()}`,
          type: mapOldTypeToNew(q.type),
          question: q.question || q.title || 'Untitled Question',
          required: q.required || false,
          placeholder: q.placeholder || '',
          description: q.description || '',
          options: q.options || undefined,
          validation: q.validation || undefined,
          gridRows: q.gridRows || undefined,
          gridColumns: q.gridColumns || undefined,
          scaleMin: q.scaleMin || q.scale?.min || undefined,
          scaleMax: q.scaleMax || q.scale?.max || undefined,
          scaleMinLabel: q.scaleMinLabel || q.scale?.minLabel || undefined,
          scaleMaxLabel: q.scaleMaxLabel || q.scale?.maxLabel || undefined
        }));

        setGeneratedForm({
          title: foundForm.title,
          description: foundForm.description,
          questions: normalizedQuestions,
          settings: foundForm.settings || {
            theme: 'modern',
            submitButtonText: 'Submit',
            thankYouMessage: 'Thank you for your submission!'
          }
        });
        
        setFormData({
          title: foundForm.title,
          description: foundForm.description,
          content: '',
          file: null,
          url: '',
          difficulty: 'medium',
          questionCount: normalizedQuestions.length,
          taxonomyLevel: 'understand'
        });
        
        setCurrentStep(1); // Start with form information for editing
      } else {
        console.error('Form not found');
        navigate('/forms');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      navigate('/forms');
    }
  };

  const initializeTemplateForm = (templateId: string) => {
    if (FORM_TEMPLATES[templateId as keyof typeof FORM_TEMPLATES]) {
      const template = FORM_TEMPLATES[templateId as keyof typeof FORM_TEMPLATES];
      setGeneratedForm({
        ...template,
        questions: template.questions.map(q => ({
          ...q,
          id: `question_${Date.now()}_${Math.random()}`
        }))
      });
      setFormData({
        ...formData,
        title: template.title,
        description: template.description
      });
    }
  };

  const methodConfigs = {
    'blooms-quiz': {
      title: "Bloom's Quiz Creator",
      description: "Create educational quizzes based on Bloom's Taxonomy",
      icon: <Brain className="w-6 h-6" />,
      steps: ['Content Input', 'Taxonomy Settings', 'AI Generation', 'Review & Publish'],
      inputType: 'text'
    },
    'similar-quiz': {
      title: "Similar Quiz Generator",
      description: "Generate quizzes similar to existing ones",
      icon: <Sparkles className="w-6 h-6" />,
      steps: ['Reference Quiz', 'AI Analysis', 'Content Generation', 'Review & Publish'],
      inputType: 'reference'
    },
    'illustrate-story': {
      title: "Story Illustrator",
      description: "Transform stories into interactive forms",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Story Input', 'Scene Analysis', 'Question Creation', 'Review & Publish'],
      inputType: 'text'
    },
    'image-to-quiz': {
      title: "Image Quiz Creator",
      description: "Generate quizzes from images",
      icon: <Image className="w-6 h-6" />,
      steps: ['Image Upload', 'AI Analysis', 'Question Generation', 'Review & Publish'],
      inputType: 'file'
    },
    'high-volume-quiz': {
      title: "High-Volume Quiz Generator",
      description: "Create large sets of questions quickly",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Topic Selection', 'Volume Settings', 'Bulk Generation', 'Review & Publish'],
      inputType: 'text'
    },
    'matching-quiz': {
      title: "Matching Quiz Creator",
      description: "Create interactive matching exercises",
      icon: <Sparkles className="w-6 h-6" />,
      steps: ['Content Input', 'Matching Pairs', 'Layout Design', 'Review & Publish'],
      inputType: 'text'
    },
    'video-to-quiz': {
      title: "Video Quiz Creator",
      description: "Generate quizzes from video content",
      icon: <Video className="w-6 h-6" />,
      steps: ['Video Upload', 'Content Analysis', 'Question Generation', 'Review & Publish'],
      inputType: 'file'
    },
    'learn-from-url': {
      title: "URL Content Extractor",
      description: "Create forms from web content",
      icon: <Link className="w-6 h-6" />,
      steps: ['URL Input', 'Content Extraction', 'Question Generation', 'Review & Publish'],
      inputType: 'url'
    },
    'news-to-quiz': {
      title: "News Quiz Creator",
      description: "Convert news articles into quizzes",
      icon: <Newspaper className="w-6 h-6" />,
      steps: ['Article Input', 'News Analysis', 'Question Generation', 'Review & Publish'],
      inputType: 'url'
    },
    'pdf-to-quiz': {
      title: "PDF Quiz Creator",
      description: "Generate quizzes from PDF documents",
      icon: <FileImage className="w-6 h-6" />,
      steps: ['PDF Upload', 'Text Extraction', 'Question Generation', 'Review & Publish'],
      inputType: 'file'
    },
    'blank': {
      title: "Blank Form Builder",
      description: "Build forms from scratch",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'manual'
    },
    'edit': {
      title: "Form Editor",
      description: "Edit existing form",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Information', 'Edit Questions', 'Settings', 'Save Changes'],
      inputType: 'edit'
    },
    // Form Templates - Teachers & Schools
    'student-registration': {
      title: "Student Registration Form",
      description: "Collect student information for enrollment and class assignments",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'parent-teacher-conference': {
      title: "Parent-Teacher Conference Form",
      description: "Schedule meetings and collect parent feedback and concerns",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'field-trip-permission': {
      title: "Field Trip Permission Form",
      description: "Get parental consent and collect necessary information for school trips",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'course-evaluation': {
      title: "Course Evaluation Form",
      description: "Gather student feedback on courses, teaching methods, and curriculum",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    // Form Templates - HR Teams
    'job-application': {
      title: "Job Application Form",
      description: "Streamline hiring process with comprehensive application forms",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'employee-onboarding': {
      title: "Employee Onboarding Form",
      description: "Collect new hire information and documentation efficiently",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'performance-review': {
      title: "Performance Review Form",
      description: "Conduct comprehensive employee performance evaluations",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'employee-satisfaction': {
      title: "Employee Satisfaction Form",
      description: "Measure workplace satisfaction and gather improvement suggestions",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    // Form Templates - Publishers
    'manuscript-submission': {
      title: "Manuscript Submission Form",
      description: "Accept and organize manuscript submissions from authors",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'reader-feedback': {
      title: "Reader Feedback Form",
      description: "Collect reader reviews and feedback on published content",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'author-royalty': {
      title: "Author Royalty Form",
      description: "Manage author payments and royalty information",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'book-marketing': {
      title: "Book Marketing Survey",
      description: "Gather market research data for book promotion strategies",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    // Form Templates - EdTech Companies
    'user-onboarding': {
      title: "User Onboarding Form",
      description: "Welcome new users and customize their learning experience",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'course-feedback': {
      title: "Course Feedback Form",
      description: "Collect student feedback on online courses and content quality",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'beta-testing': {
      title: "Beta Testing Form",
      description: "Gather feedback from beta testers for new features and products",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    },
    'partnership-inquiry': {
      title: "Partnership Inquiry Form",
      description: "Connect with potential educational partners and institutions",
      icon: <FileText className="w-6 h-6" />,
      steps: ['Form Setup', 'Add Questions', 'Design & Layout', 'Review & Publish'],
      inputType: 'template'
    }
  };

  const currentConfig = isEditing 
    ? methodConfigs['edit'] 
    : (method ? methodConfigs[method as keyof typeof methodConfigs] : null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleNext = () => {
    if (currentStep < currentConfig?.steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!currentConfig) return;
    
    setIsGenerating(true);
    try {
      let result: GeneratedForm | null = null;
      
      switch (method) {
        case 'blooms-quiz':
          result = await aiBackend.generateBloomsQuiz(
            formData.content,
            formData.taxonomyLevel,
            formData.difficulty,
            formData.questionCount
          );
          break;
          
        case 'image-to-quiz':
          if (formData.file) {
            result = await aiBackend.generateQuestionsFromImage(formData.file.toString());
          } else {
            throw new Error('Please upload an image file');
          }
          break;
          
        case 'learn-from-url':
        case 'news-to-quiz':
          if (formData.url) {
            result = await aiBackend.generateFormFromUrl(formData.url, method);
          } else {
            throw new Error('Please provide a valid URL');
          }
          break;
          
        case 'similar-quiz':
          result = await aiBackend.generateSimilarQuiz(formData.content);
          break;
          
        case 'blank':
          if (formData.content && formData.content.trim().length > 0) {
            result = await aiBackend.generateForm(formData.content);
          } else {
            // No prompt — fall back to minimal starter template
            setGeneratedForm({
              title: formData.title || 'New Form',
              description: formData.description || 'Custom form created from scratch',
              questions: [
                {
                  id: 'question_1',
                  type: 'short-answer',
                  question: 'What is your name?',
                  required: true,
                  placeholder: 'Enter your full name',
                },
              ],
              settings: {
                theme: 'modern',
                submitButtonText: 'Submit',
                thankYouMessage: 'Thank you for your submission!',
              },
            });
          }
          break;

        // Template Forms
        case 'student-registration':
          setGeneratedForm({
            title: 'Student Registration Form',
            description: 'Comprehensive student enrollment and information collection',
            questions: [
              {
                id: crypto.randomUUID(),
                type: 'short-answer',
                question: 'Student Full Name',
                required: true,
                placeholder: 'Enter student\'s full name'
              },
              {
                id: crypto.randomUUID(),
                type: 'email',
                question: 'Student Email Address',
                required: true,
                placeholder: 'student@school.edu'
              },
              {
                id: crypto.randomUUID(),
                type: 'date',
                question: 'Date of Birth',
                required: true
              },
              {
                id: crypto.randomUUID(),
                type: 'dropdown',
                question: 'Grade Level',
                required: true,
                options: ['9th Grade', '10th Grade', '11th Grade', '12th Grade']
              },
              {
                id: crypto.randomUUID(),
                type: 'long-answer',
                question: 'Parent/Guardian Contact Information',
                required: true,
                placeholder: 'Include name, phone, and email'
              }
            ],
            settings: {
              theme: 'modern',
              submitButtonText: 'Submit Registration',
              thankYouMessage: 'Thank you for your registration!'
            }
          });
          break;

        case 'job-application':
          setGeneratedForm({
            title: 'Job Application Form',
            description: 'Comprehensive job application with resume upload and screening questions',
            questions: [
              {
                id: crypto.randomUUID(),
                type: 'short-answer',
                question: 'Full Name',
                required: true,
                placeholder: 'Enter your full name'
              },
              {
                id: crypto.randomUUID(),
                type: 'email',
                question: 'Email Address',
                required: true,
                placeholder: 'your.email@example.com'
              },
              {
                id: crypto.randomUUID(),
                type: 'phone',
                question: 'Phone Number',
                required: true,
                placeholder: '(555) 123-4567'
              },
              {
                id: crypto.randomUUID(),
                type: 'file-upload',
                question: 'Resume Upload',
                required: true,
                description: 'Please upload your resume in PDF format'
              },
              {
                id: crypto.randomUUID(),
                type: 'long-answer',
                question: 'Why are you interested in this position?',
                required: true,
                placeholder: 'Describe your interest and qualifications...'
              }
            ],
            settings: {
              theme: 'professional',
              submitButtonText: 'Submit Application',
              thankYouMessage: 'Thank you for your application! We will review it and get back to you soon.'
            }
          });
          break;

        case 'parent-teacher-conference':
          setGeneratedForm({
            title: 'Parent-Teacher Conference Scheduling',
            description: 'Schedule meetings and collect parent feedback and concerns',
            questions: [
              {
                id: crypto.randomUUID(),
                type: 'short-answer',
                question: 'Parent/Guardian Name',
                required: true,
                placeholder: 'Enter your full name'
              },
              {
                id: crypto.randomUUID(),
                type: 'short-answer',
                question: 'Student Name',
                required: true,
                placeholder: 'Enter student\'s full name'
              },
              {
                id: crypto.randomUUID(),
                type: 'dropdown',
                question: 'Preferred Meeting Time',
                required: true,
                options: ['Morning (8:00-11:00 AM)', 'Afternoon (12:00-3:00 PM)', 'Evening (4:00-6:00 PM)']
              },
              {
                id: crypto.randomUUID(),
                type: 'long-answer',
                question: 'Topics you\'d like to discuss',
                required: false,
                placeholder: 'Any specific concerns or questions about your child\'s progress...'
              }
            ],
            settings: {
              theme: 'educational',
              submitButtonText: 'Schedule Conference',
              thankYouMessage: 'Thank you! We will confirm your conference time soon.'
            }
          });
          break;

        case 'employee-satisfaction':
          setGeneratedForm({
            title: 'Employee Satisfaction Survey',
            description: 'Help us improve your workplace experience',
            questions: [
              {
                id: crypto.randomUUID(),
                type: 'dropdown',
                question: 'Department',
                required: true,
                options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Other']
              },
              {
                id: crypto.randomUUID(),
                type: 'linear-scale',
                question: 'How satisfied are you with your current role?',
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: 'Very Dissatisfied',
                scaleMaxLabel: 'Very Satisfied'
              },
              {
                id: crypto.randomUUID(),
                type: 'linear-scale',
                question: 'How would you rate work-life balance?',
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: 'Poor',
                scaleMaxLabel: 'Excellent'
              },
              {
                id: crypto.randomUUID(),
                type: 'long-answer',
                question: 'What improvements would you suggest?',
                required: false,
                placeholder: 'Share your suggestions for improving the workplace...'
              }
            ],
            settings: {
              theme: 'professional',
              submitButtonText: 'Submit Feedback',
              thankYouMessage: 'Thank you for your valuable feedback!'
            }
          });
          break;
          
        default:
          // For any other template methods, generate a basic form
          if (currentConfig.inputType === 'template') {
            setGeneratedForm({
              title: currentConfig.title,
              description: currentConfig.description,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'short-answer',
                  question: 'Name',
                  required: true,
                  placeholder: 'Enter your name'
                },
                {
                  id: crypto.randomUUID(),
                  type: 'email',
                  question: 'Email Address',
                  required: true,
                  placeholder: 'your.email@example.com'
                },
                {
                  id: crypto.randomUUID(),
                  type: 'long-answer',
                  question: 'Additional Information',
                  required: false,
                  placeholder: 'Please provide any additional details...'
                }
              ],
              settings: {
                theme: 'modern',
                submitButtonText: 'Submit',
                thankYouMessage: 'Thank you for your submission!'
              }
            });
          } else {
            result = await aiBackend.generateForm(formData.content);
          }
      }
      
      // If we received an AI-generated form, trim to desired question count (if set)
      if (result) {
        const desiredCount = formData.questionCount || 5;
        if (Array.isArray(result.questions) && result.questions.length > desiredCount) {
          result = {
            ...result,
            questions: result.questions.slice(0, desiredCount),
          };
        }
        setGeneratedForm(result);
      }

      handleNext();
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate form. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveForm = () => {
    if (generatedForm) {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      
      if (isEditing && id) {
        // Update existing form
        const formIndex = savedForms.findIndex((f: any) => f.id === id);
        if (formIndex !== -1) {
          savedForms[formIndex] = {
            ...savedForms[formIndex],
            ...generatedForm,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('savedForms', JSON.stringify(savedForms));
          alert('Form updated successfully!');
        }
      } else {
        // Create new form
        const newForm = {
          id: Date.now().toString(),
          ...generatedForm,
          createdAt: new Date().toISOString(),
          method: method || 'blank',
          status: 'active',
          responses: 0
        };
        savedForms.push(newForm);
        localStorage.setItem('savedForms', JSON.stringify(savedForms));
      }
      
      navigate('/forms');
    }
  };

  const addNewQuestion = () => {
    if (!generatedForm) return;
    
    const newQuestion: FormQuestion = {
      id: `question_${Date.now()}`,
      type: 'short-answer',
      question: 'New Question',
      required: false,
      placeholder: 'Enter your answer'
    };
    
    setGeneratedForm({
      ...generatedForm,
      questions: [...generatedForm.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, updatedQuestion: FormQuestion) => {
    if (!generatedForm) return;
    
    const updatedQuestions = [...generatedForm.questions];
    updatedQuestions[index] = updatedQuestion;
    setGeneratedForm({
      ...generatedForm,
      questions: updatedQuestions
    });
  };

  const deleteQuestion = (index: number) => {
    if (!generatedForm) return;
    
    const updatedQuestions = generatedForm.questions.filter((_, i) => i !== index);
    setGeneratedForm({
      ...generatedForm,
      questions: updatedQuestions
    });
  };

  const duplicateQuestion = (index: number) => {
    if (!generatedForm) return;
    
    const questionToDuplicate = generatedForm.questions[index];
    const duplicatedQuestion: FormQuestion = {
      ...questionToDuplicate,
      id: `question_${Date.now()}`,
      question: `${questionToDuplicate.question} (Copy)`
    };
    
    const updatedQuestions = [...generatedForm.questions];
    updatedQuestions.splice(index + 1, 0, duplicatedQuestion);
    setGeneratedForm({
      ...generatedForm,
      questions: updatedQuestions
    });
  };

  const renderStepContent = () => {
    if (!currentConfig) return null;

    switch (currentStep) {
      case 1:
        // For editing mode, show form information instead of content input
        if (isEditing) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Form Information
                </h2>
                <p className="text-gray-600">
                  Update your form's basic information
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Form Title
                </label>
                <input
                  type="text"
                  value={generatedForm?.title || ''}
                  onChange={(e) => generatedForm && setGeneratedForm({ ...generatedForm, title: e.target.value })}
                  placeholder="Enter a title for your form"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={generatedForm?.description || ''}
                  onChange={(e) => generatedForm && setGeneratedForm({ ...generatedForm, description: e.target.value })}
                  placeholder="Add a description for your form"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Form Settings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={generatedForm?.settings?.submitButtonText || 'Submit'}
                      onChange={(e) => generatedForm && setGeneratedForm({
                        ...generatedForm,
                        settings: { ...generatedForm.settings, submitButtonText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={generatedForm?.settings?.theme || 'modern'}
                      onChange={(e) => generatedForm && setGeneratedForm({
                        ...generatedForm,
                        settings: { ...generatedForm.settings, theme: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="educational">Educational</option>
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="visual">Visual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thank You Message
                  </label>
                  <textarea
                    value={generatedForm?.settings?.thankYouMessage || 'Thank you for your submission!'}
                    onChange={(e) => generatedForm && setGeneratedForm({
                      ...generatedForm,
                      settings: { ...generatedForm.settings, thankYouMessage: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        }

        // For blank forms, show Form Setup
        if (method === 'blank') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Form Setup
                </h2>
                <p className="text-gray-600">
                  Set up your form's basic information and settings
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Form Title
                </label>
                <input
                  type="text"
                  value={generatedForm?.title || ''}
                  onChange={(e) => generatedForm && setGeneratedForm({ ...generatedForm, title: e.target.value })}
                  placeholder="Enter a title for your form"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={generatedForm?.description || ''}
                  onChange={(e) => generatedForm && setGeneratedForm({ ...generatedForm, description: e.target.value })}
                  placeholder="Add a description for your form"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Form Settings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={generatedForm?.settings?.submitButtonText || 'Submit'}
                      onChange={(e) => generatedForm && setGeneratedForm({
                        ...generatedForm,
                        settings: { ...generatedForm.settings, submitButtonText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={generatedForm?.settings?.theme || 'modern'}
                      onChange={(e) => generatedForm && setGeneratedForm({
                        ...generatedForm,
                        settings: { ...generatedForm.settings, theme: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="educational">Educational</option>
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="visual">Visual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thank You Message
                  </label>
                  <textarea
                    value={generatedForm?.settings?.thankYouMessage || 'Thank you for your submission!'}
                    onChange={(e) => generatedForm && setGeneratedForm({
                      ...generatedForm,
                      settings: { ...generatedForm.settings, thankYouMessage: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        }

        // Original content for new form creation
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentConfig.steps[0]}
              </h2>
              <p className="text-gray-600">
                Provide the source content for your {currentConfig.title.toLowerCase()}
              </p>
            </div>

            {currentConfig.inputType === 'file' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload your {method?.includes('image') ? 'image' : method?.includes('video') ? 'video' : 'PDF'} file
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop or click to browse files
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept={
                    method?.includes('image') ? 'image/*' : 
                    method?.includes('video') ? 'video/*' : 
                    method?.includes('pdf') ? '.pdf' : '*'
                  }
                  className="hidden"
                  id="file-upload"
                />
                <Button onClick={() => document.getElementById('file-upload')?.click()}>
                  Choose File
                </Button>
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">
                    File selected: {formData.file.name}
                  </p>
                )}
              </div>
            )}

            {currentConfig.inputType === 'url' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {method?.includes('news') ? 'News Article URL' : 'Website URL'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/article"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {(currentConfig.inputType === 'text' || currentConfig.inputType === 'reference') && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {currentConfig.inputType === 'reference' ? 'Reference Quiz or Content' : 'Content'}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={
                    currentConfig.inputType === 'reference' 
                      ? "Paste the quiz or content you want to create something similar to..."
                      : `Paste your ${method?.includes('story') ? 'story' : 'content'} here...`
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Form Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a title for your form"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add a description for your form"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentConfig.steps[1]}
              </h2>
              <p className="text-gray-600">
                Configure settings for AI generation
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the questions you want to generate..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions with AI
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Generation Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <select 
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value={3}>3 questions</option>
                    <option value={5}>5 questions</option>
                    <option value={10}>10 questions</option>
                    <option value={15}>15 questions</option>
                    <option value={20}>20 questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select 
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        // For editing mode, show question editing
        if (isEditing) {
          return (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the questions you want to generate..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Edit Questions
                  </h2>
                  <p className="text-gray-600">
                    Modify your form questions and settings
                  </p>
                </div>
                <Button onClick={addNewQuestion} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              {generatedForm && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <input
                      type="text"
                      value={generatedForm.title}
                      onChange={(e) => setGeneratedForm({ ...generatedForm, title: e.target.value })}
                      className="text-lg font-semibold bg-transparent border-none outline-none w-full"
                      placeholder="Form Title"
                    />
                    <textarea
                      value={generatedForm.description}
                      onChange={(e) => setGeneratedForm({ ...generatedForm, description: e.target.value })}
                      className="text-gray-600 bg-transparent border-none outline-none w-full mt-1 resize-none"
                      placeholder="Form Description"
                      rows={2}
                    />
                  </div>
                  
                  {generatedForm.questions.map((question, index) => (
                    <QuestionBuilder
                      key={question.id}
                      question={question}
                      onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                      onDelete={() => deleteQuestion(index)}
                      onDuplicate={() => duplicateQuestion(index)}
                    />
                  ))}

                  {generatedForm.questions.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                      <p className="text-gray-600 mb-4">Add your first question to get started</p>
                      <Button onClick={addNewQuestion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Question
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        // Original question editing for new forms
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentConfig.steps[2]}
              </h2>
              <p className="text-gray-600">
                Review and edit the AI-generated questions for your form
              </p>
            </div>

            {generatedForm && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <input
                    type="text"
                    value={generatedForm.title}
                    onChange={(e) => setGeneratedForm({ ...generatedForm, title: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-none outline-none w-full"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={generatedForm.description}
                    onChange={(e) => setGeneratedForm({ ...generatedForm, description: e.target.value })}
                    className="text-gray-600 bg-transparent border-none outline-none w-full mt-1 resize-none"
                    placeholder="Form Description"
                    rows={2}
                  />
                </div>
                
                {generatedForm.questions.map((question, index) => (
                  <QuestionBuilder
                    key={question.id}
                    question={question}
                    onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                    onDelete={() => deleteQuestion(index)}
                    onDuplicate={() => duplicateQuestion(index)}
                  />
                ))}

                {generatedForm.questions.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-4">Add your first question to get started</p>
                    <Button onClick={addNewQuestion}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Question
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isEditing ? 'Save Changes' : 'Review & Publish'}
              </h2>
              <p className="text-gray-600">
                {isEditing ? 'Your changes are ready to be saved.' : 'Your form is ready! Review the final version and publish it.'}
              </p>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {isEditing ? 'Form Updated Successfully!' : 'Form Generated Successfully!'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isEditing 
                      ? 'Your form has been updated and is ready to use.' 
                      : `Your ${currentConfig.title.toLowerCase()} has been created with ${method === 'blank' ? 'custom' : 'AI-powered'} questions.`
                    }
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Form
                    </Button>
                    <Button onClick={handleSaveForm}>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Save Changes' : 'Save & Publish Form'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {generatedForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Form Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Questions Generated:</span>
                        <span className="font-medium">{generatedForm.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span className="font-medium">{Math.ceil(generatedForm.questions.length * 0.5)}-{Math.ceil(generatedForm.questions.length * 1)} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty Level:</span>
                        <span className="font-medium capitalize">{formData.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Form Type:</span>
                        <span className="font-medium">{method}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sharing Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Get Embed Code
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Copy Share Link
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentConfig) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Creation Method</h1>
        <Button onClick={() => navigate('/create')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Creation Methods
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(isEditing ? '/forms' : '/create')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {currentConfig.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentConfig.title}</h1>
            <p className="text-gray-600">{currentConfig.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        {currentConfig.steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700">
              {step}
            </div>
            {index < currentConfig.steps.length - 1 && (
              <div 
                className={`w-16 h-0.5 mx-4 ${
                  index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          {currentStep < currentConfig.steps.length ? (
            <Button onClick={handleNext} disabled={currentStep === 2 && isGenerating}>
              Next Step
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/forms')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Send className="w-4 h-4 mr-2" />
              Go to Forms
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder; 