import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiService, FormQuestion, GeneratedForm } from "@/services/aiService";
import { QuestionBuilder } from "@/components/QuestionBuilder";
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

  // Load existing form if editing
  useEffect(() => {
    if (isEditing && id) {
      loadExistingForm(id);
    } else if (method === 'blank') {
      // Initialize blank form - start at step 1 for proper flow
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
      setCurrentStep(1); // Start at step 1 for blank forms
    } else if (!method && !isEditing) {
      // If no method is provided and not editing, redirect to create form page
      navigate('/create');
    }
  }, [isEditing, id, method, navigate]);

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
      let result: GeneratedForm | FormQuestion[];
      
      switch (method) {
        case 'blooms-quiz':
          const result = await aiService.generateBloomsQuiz(formData.content, {
            taxonomyLevel: formData.taxonomyLevel,
            difficulty: formData.difficulty,
            questionCount: formData.questionCount
          });
          setGeneratedForm(result);
          break;
          
        case 'image-to-quiz':
          if (formData.file) {
            const imageResult = await aiService.generateQuestionsFromImage(formData.file.toString());
            setGeneratedForm(imageResult);
          } else {
            throw new Error('Please upload an image file');
          }
          break;
          
        case 'learn-from-url':
        case 'news-to-quiz':
          if (formData.url) {
            const extractedContent = await aiService.extractContentFromUrl(formData.url);
            const urlResult = await aiService.generateFormFromText(extractedContent, {
              formType: method,
              questionCount: formData.questionCount,
              difficulty: formData.difficulty
            });
            setGeneratedForm(urlResult);
          } else {
            throw new Error('Please provide a valid URL');
          }
          break;
          
        case 'similar-quiz':
          const similarResult = await aiService.generateSimilarQuiz(formData.content);
          setGeneratedForm(similarResult);
          break;
          
        case 'blank':
          setGeneratedForm({
            title: formData.title || "New Form",
            description: formData.description || "Custom form created from scratch",
            questions: [
              {
                id: 'question_1',
                type: 'short-answer',
                question: 'What is your name?',
                required: true,
                placeholder: 'Enter your full name'
              }
            ],
            settings: {
              theme: 'modern',
              submitButtonText: 'Submit',
              thankYouMessage: 'Thank you for your submission!'
            }
          });
          break;
          
        default:
          const defaultResult = await aiService.generateFormFromText(formData.content, {
            formType: method || 'default',
            questionCount: formData.questionCount,
            difficulty: formData.difficulty
          });
          setGeneratedForm(defaultResult);
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
          status: 'draft',
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
        // For editing mode, show question editing
        if (isEditing) {
          return (
            <div className="space-y-6">
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

        // Skip settings step for blank forms
        if (method === 'blank') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Add Questions
                </h2>
                <p className="text-gray-600">
                  Start building your form by adding questions
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
                  
                  {generatedForm.questions.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                      <p className="text-gray-600 mb-4">Add your first question to get started</p>
                      <Button onClick={addNewQuestion} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Question
                      </Button>
                    </div>
                  ) : (
                    <>
                      {generatedForm.questions.map((question, index) => (
                        <QuestionBuilder
                          key={question.id}
                          question={question}
                          onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                          onDelete={() => deleteQuestion(index)}
                          onDuplicate={() => duplicateQuestion(index)}
                        />
                      ))}
                      
                      <div className="text-center">
                        <Button 
                          onClick={addNewQuestion}
                          variant="outline"
                          className="border-dashed border-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Question
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        }
        
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

              {method === 'blooms-quiz' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bloom's Taxonomy Level
                  </label>
                  <select 
                    value={formData.taxonomyLevel}
                    onChange={(e) => setFormData({ ...formData, taxonomyLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="remember">Remember - Recall facts and basic concepts</option>
                    <option value="understand">Understand - Explain ideas or concepts</option>
                    <option value="apply">Apply - Use information in new situations</option>
                    <option value="analyze">Analyze - Draw connections among ideas</option>
                    <option value="evaluate">Evaluate - Justify a stand or decision</option>
                    <option value="create">Create - Produce new or original work</option>
                  </select>
                </div>
              )}

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
          </div>
        );

      case 3:
        // For editing mode, show form settings
        if (isEditing) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Form Settings
                </h2>
                <p className="text-gray-600">
                  Configure your form's appearance and behavior
                </p>
              </div>

              <div className="space-y-4">
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