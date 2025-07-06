import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { QuestionBuilder } from '../components/QuestionBuilder';
import { ConditionalLogicBuilder } from '../components/ConditionalLogicBuilder';
import { MultiStepFormBuilder } from '../components/MultiStepFormBuilder';
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { OmnichannelFeatures } from '../components/OmnichannelFeatures';
import { UserManagement } from '../components/UserManagement';
import { PaymentIntegration } from '../components/PaymentIntegration';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';
import { IntegrationsHub } from '../components/IntegrationsHub';
import { apiService } from '../services/apiService';
import { aiService } from '../services/aiService';
import { enhancedAiService } from '../services/enhancedAiService';
import { 
  Save, 
  Eye, 
  Share2, 
  Settings, 
  Palette, 
  Smartphone, 
  Monitor,
  Sparkles,
  Plus,
  Trash2,
  Workflow,
  Users,
  CreditCard,
  BarChart3,
  Zap,
  Brain,
  Globe,
  ArrowLeft,
  MessageSquare,
  Lock,
  Crown,
  FileText,
  Calendar,
  TestTube,
  Languages,
  Shield
} from 'lucide-react';
import { FORM_TEMPLATES } from '@/data/formTemplates';

interface FormPage {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
  settings: {
    showProgress: boolean;
    allowBack: boolean;
    customNextText?: string;
    customBackText?: string;
  };
}

interface ConditionalRule {
  id: string;
  sourceQuestionId: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string;
  action: 'show' | 'hide' | 'jump_to' | 'required' | 'optional';
  targetQuestionIds: string[];
  jumpToPage?: number;
}

interface Workflow {
  id: string;
  name: string;
  enabled: boolean;
  requiresApproval: boolean;
  approvalSteps: any[];
  postSubmissionActions: any[];
  settings: {
    allowResubmission: boolean;
    notifySubmitterOnApproval: boolean;
    notifySubmitterOnRejection: boolean;
    autoArchiveAfterDays?: number;
  };
}

interface FormSettings {
  theme: string;
  brandColor: string;
  customCSS?: string;
  submitButtonText: string;
  thankYouMessage: string;
  redirectUrl?: string;
  collectEmails: boolean;
  requireLogin: boolean;
  allowAnonymous: boolean;
  enableProgress: boolean;
  showQuestionNumbers: boolean;
  randomizeQuestions: boolean;
  timeLimit?: number;
  allowSaveProgress: boolean;
  enablePasswordProtection: boolean;
  password?: string;
  enableRecaptcha: boolean;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  enableAnalytics: boolean;
  trackingId?: string;
  enableCookieConsent: boolean;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  languages: string[];
  defaultLanguage: string;
  enableTranslation: boolean;
  accessibilityMode: boolean;
  highContrastMode: boolean;
  screenReaderOptimized: boolean;
}

const EnhancedFormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const isEditing = Boolean(id && id !== 'new');
  
  const [activeTab, setActiveTab] = useState('builder');
  const [form, setForm] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [pages, setPages] = useState<FormPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([]);
  const [isFormSaved, setIsFormSaved] = useState(isEditing);
  const [workflow, setWorkflow] = useState<Workflow>({
    id: 'default',
    name: 'Default Workflow',
    enabled: false,
    requiresApproval: false,
    approvalSteps: [],
    postSubmissionActions: [],
    settings: {
      allowResubmission: true,
      notifySubmitterOnApproval: true,
      notifySubmitterOnRejection: true
    }
  });
  
  const [formSettings, setFormSettings] = useState<FormSettings>({
    theme: 'modern',
    brandColor: '#3b82f6',
    submitButtonText: 'Submit',
    thankYouMessage: 'Thank you for your submission!',
    collectEmails: false,
    requireLogin: false,
    allowAnonymous: true,
    enableProgress: true,
    showQuestionNumbers: true,
    randomizeQuestions: false,
    allowSaveProgress: false,
    enablePasswordProtection: false,
    enableRecaptcha: false,
    enableAnalytics: true,
    enableCookieConsent: true,
    languages: ['en'],
    defaultLanguage: 'en',
    enableTranslation: false,
    accessibilityMode: false,
    highContrastMode: false,
    screenReaderOptimized: false
  });

  const [isAIMode, setIsAIMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Mock data for advanced features
  const [currentUser] = useState({
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner' as const,
    status: 'active' as const,
    lastActive: new Date(),
    permissions: [],
    groups: []
  });

  const [users] = useState([currentUser]);
  const [groups] = useState([]);
  const [ssoProviders] = useState([]);
  const [paymentProviders] = useState([]);
  const [subscriptionPlans] = useState([]);
  const [paymentForms] = useState([]);
  const [integrations] = useState([]);

  useEffect(() => {
    if (isEditing && id) {
      loadForm(id);
    } else {
      initializeNewForm();
    }
  }, [id, isEditing, method]);

  const loadForm = async (formId: string) => {
    try {
      const response = await apiService.getForm(formId);
      if (!response.success || !response.data) return;

      const formData: any = response.data as any;

      setForm(formData);
      setQuestions(formData.questions || []);
      setPages((formData.pages as any) || [{ 
        id: 'page1', 
        title: 'Page 1', 
        questionIds: formData.questions?.map((q: any) => q.id) || [],
        settings: { showProgress: true, allowBack: true }
      }]);
      setConditionalRules((formData.conditionalRules as any) || []);
      setWorkflow((formData.workflow as any) || workflow);
      setFormSettings({ ...formSettings, ...(formData.settings || {}) });
      setIsFormSaved(true);
    } catch (error) {
      console.error('Error loading form:', error);
    }
  };

  const initializeNewForm = () => {
    // Get template data based on method parameter
    const templateData = getTemplateData(method);
    
    const newForm = {
      id: crypto.randomUUID(),
      title: templateData.title,
      description: templateData.description,
      questions: templateData.questions,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    setForm(newForm);
    setQuestions(templateData.questions);
    setPages([{ 
      id: 'page1', 
      title: 'Page 1', 
      questionIds: templateData.questions.map(q => q.id),
      settings: { showProgress: true, allowBack: true }
    }]);

    // Apply template settings
    if (templateData.settings) {
      setFormSettings(prev => ({
        ...prev,
        ...templateData.settings
      }));
    }
    
    // If it's a template, enable AI mode for easy customization
    if (method && method !== 'blank') {
      setIsAIMode(true);
    }
  };

  const getTemplateData = (method: string | null) => {
    if (!method || method === 'blank') {
      return {
        title: 'New Enhanced Form',
        description: 'Create your form with advanced features',
        questions: [],
        settings: {
          theme: 'modern',
          brandColor: '#3b82f6',
          submitButtonText: 'Submit',
          thankYouMessage: 'Thank you for your submission!',
          collectEmails: false,
          requireLogin: false,
          allowAnonymous: true,
          enableProgress: true,
          showQuestionNumbers: true,
          randomizeQuestions: false,
          allowSaveProgress: false,
          enablePasswordProtection: false,
          enableRecaptcha: false,
          enableAnalytics: true,
          enableCookieConsent: true,
          languages: ['en'],
          defaultLanguage: 'en',
          enableTranslation: false,
          accessibilityMode: false,
          highContrastMode: false,
          screenReaderOptimized: false
        }
      };
    }

    const template = FORM_TEMPLATES[method as keyof typeof FORM_TEMPLATES];
    if (template) {
      return {
        ...template,
        questions: template.questions.map(q => ({
          ...q,
          id: crypto.randomUUID()
        })),
        settings: {
          ...template.settings,
          collectEmails: template.settings?.collectEmails ?? false,
          requireLogin: template.settings?.requireLogin ?? false,
          allowAnonymous: template.settings?.allowAnonymous ?? true,
          enableProgress: template.settings?.enableProgress ?? true,
          showQuestionNumbers: template.settings?.showQuestionNumbers ?? true,
          randomizeQuestions: template.settings?.randomizeQuestions ?? false,
          allowSaveProgress: template.settings?.allowSaveProgress ?? false,
          enablePasswordProtection: template.settings?.enablePasswordProtection ?? false,
          enableRecaptcha: template.settings?.enableRecaptcha ?? false,
          enableAnalytics: template.settings?.enableAnalytics ?? true,
          enableCookieConsent: template.settings?.enableCookieConsent ?? true,
          languages: template.settings?.languages ?? ['en'],
          defaultLanguage: template.settings?.defaultLanguage ?? 'en',
          enableTranslation: template.settings?.enableTranslation ?? false,
          accessibilityMode: template.settings?.accessibilityMode ?? false,
          highContrastMode: template.settings?.highContrastMode ?? false,
          screenReaderOptimized: template.settings?.screenReaderOptimized ?? false
        }
      };
    }

    return {
      title: 'New Enhanced Form',
      description: 'Create your form with advanced features',
      questions: [],
      settings: {
        theme: 'modern',
        brandColor: '#3b82f6',
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you for your submission!',
        collectEmails: false,
        requireLogin: false,
        allowAnonymous: true,
        enableProgress: true,
        showQuestionNumbers: true,
        randomizeQuestions: false,
        allowSaveProgress: false,
        enablePasswordProtection: false,
        enableRecaptcha: false,
        enableAnalytics: true,
        enableCookieConsent: true,
        languages: ['en'],
        defaultLanguage: 'en',
        enableTranslation: false,
        accessibilityMode: false,
        highContrastMode: false,
        screenReaderOptimized: false
      }
    };
  };

  const saveForm = async () => {
    if (!form) return;

    const formData = {
      ...form,
      questions,
      pages,
      conditionalRules,
      workflow,
      settings: formSettings,
      updated: new Date().toISOString()
    };

    try {
      if (isEditing) {
        await apiService.updateForm(form.id, formData);
      } else {
        await apiService.createForm(formData);
      }
      
      // Mark form as saved to enable sharing and analytics tabs
      setIsFormSaved(true);
      
      // Show success message
      alert('Form saved successfully! You can now access sharing options and analytics.');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    }
  };

  const generateWithAI = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const generatedForm = await aiService.generateFormFromText(prompt);
      setQuestions(generatedForm.questions);
      setForm(prev => ({
        ...prev,
        title: generatedForm.title,
        description: generatedForm.description
      }));
      
      // Update pages with new questions
      setPages([{
        id: 'page1',
        title: 'Page 1',
        questionIds: generatedForm.questions.map(q => q.id),
        settings: { showProgress: true, allowBack: true }
      }]);
    } catch (error) {
      console.error('Error generating form:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeWithAI = async () => {
    if (questions.length === 0) return;

    try {
      const analysis = await enhancedAiService.analyzeFormPerformance(form.id, {
        questions,
        responses: [],
        settings: formSettings
      });
      
      console.log('Form analysis:', analysis);
      // Show analysis results in a modal or panel
    } catch (error) {
      console.error('Error analyzing form:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: 'short-answer',
      question: 'New Question',
      required: false,
      placeholder: '',
      description: ''
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Add to current page
    if (pages[currentPage]) {
      const updatedPages = [...pages];
      updatedPages[currentPage].questionIds.push(newQuestion.id);
      setPages(updatedPages);
    }
  };

  const updateQuestion = (questionId: string, updates: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    
    // Remove from all pages
    const updatedPages = pages.map(page => ({
      ...page,
      questionIds: page.questionIds.filter(id => id !== questionId)
    }));
    setPages(updatedPages);
    
    // Remove from conditional rules
    setConditionalRules(conditionalRules.filter(rule => 
      rule.sourceQuestionId !== questionId && 
      !rule.targetQuestionIds.includes(questionId)
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'builder':
        return (
          <div className="space-y-6">
            {/* Form Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Form Information</CardTitle>
                    <p className="text-sm text-gray-600">Basic details about your form</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={isAIMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsAIMode(!isAIMode)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI Mode
                    </Button>
                    <Button variant="outline" size="sm" onClick={analyzeWithAI}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Form Title</Label>
                  <Input
                    value={form?.title || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter form title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form?.description || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>
                
                {isAIMode && (
                  <div>
                    <Label>AI Prompt</Label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Describe the form you want to create..."
                        rows={2}
                        id="ai-prompt"
                      />
                      <Button 
                        onClick={() => {
                          const prompt = (document.getElementById('ai-prompt') as HTMLTextAreaElement)?.value;
                          if (prompt) generateWithAI(prompt);
                        }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Multi-Step Form Builder */}
            <MultiStepFormBuilder
              questions={questions}
              pages={pages}
              onPagesChange={setPages}
              onQuestionsChange={setQuestions}
              currentPage={currentPage}
              onCurrentPageChange={setCurrentPage}
            />

            {/* Question Builder */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Questions</CardTitle>
                  <Button onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions yet. Add your first question to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionBuilder
                        key={question.id}
                        question={question}
                        index={index}
                        onUpdate={(updates) => updateQuestion(question.id, updates)}
                        onDelete={() => deleteQuestion(question.id)}
                        onDuplicate={() => {
                          const duplicated = { ...question, id: crypto.randomUUID() };
                          setQuestions([...questions, duplicated]);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'logic':
        return (
          <ConditionalLogicBuilder
            questions={questions}
            rules={conditionalRules}
            onRulesChange={setConditionalRules}
          />
        );

      case 'workflow':
        return (
          <WorkflowBuilder
            workflow={workflow}
            onWorkflowChange={setWorkflow}
          />
        );

      case 'design':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Design & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Theme</Label>
                  <select
                    value={formSettings.theme}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="colorful">Colorful</option>
                  </select>
                </div>
                
                <div>
                  <Label>Brand Color</Label>
                  <Input
                    type="color"
                    value={formSettings.brandColor}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Custom CSS</Label>
                <Textarea
                  value={formSettings.customCSS || ''}
                  onChange={(e) => setFormSettings(prev => ({ ...prev, customCSS: e.target.value }))}
                  placeholder="Enter custom CSS..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">High Contrast Mode</Label>
                  <p className="text-sm text-gray-600">Improve accessibility with high contrast colors</p>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.highContrastMode}
                  onChange={(e) => setFormSettings(prev => ({ ...prev, highContrastMode: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Screen Reader Optimized</Label>
                  <p className="text-sm text-gray-600">Optimize for screen readers and assistive technology</p>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.screenReaderOptimized}
                  onChange={(e) => setFormSettings(prev => ({ ...prev, screenReaderOptimized: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Form Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Submit Button Text</Label>
                    <Input
                      value={formSettings.submitButtonText}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, submitButtonText: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      value={formSettings.timeLimit || ''}
                      onChange={(e) => setFormSettings(prev => ({ 
                        ...prev, 
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div>
                  <Label>Thank You Message</Label>
                  <Textarea
                    value={formSettings.thankYouMessage}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, thankYouMessage: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Require Login</Label>
                      <p className="text-sm text-gray-600">Users must be logged in to submit</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formSettings.requireLogin}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, requireLogin: e.target.checked }))}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Enable Password Protection</Label>
                      <p className="text-sm text-gray-600">Protect form with a password</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formSettings.enablePasswordProtection}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, enablePasswordProtection: e.target.checked }))}
                      className="rounded"
                    />
                  </div>

                  {formSettings.enablePasswordProtection && (
                    <div>
                      <Label>Form Password</Label>
                      <Input
                        type="password"
                        value={formSettings.password || ''}
                        onChange={(e) => setFormSettings(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Enable Progress Bar</Label>
                      <p className="text-sm text-gray-600">Show completion progress</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formSettings.enableProgress}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, enableProgress: e.target.checked }))}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Randomize Questions</Label>
                      <p className="text-sm text-gray-600">Show questions in random order</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formSettings.randomizeQuestions}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Allow Save Progress</Label>
                      <p className="text-sm text-gray-600">Let users save and continue later</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formSettings.allowSaveProgress}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, allowSaveProgress: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  SEO & Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={formSettings.seoTitle || ''}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Page title for search engines"
                  />
                </div>
                <div>
                  <Label>SEO Description</Label>
                  <Textarea
                    value={formSettings.seoDescription || ''}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Description for search engines"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Social Media Image URL</Label>
                  <Input
                    value={formSettings.socialImage || ''}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, socialImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Enable Cookie Consent</Label>
                    <p className="text-sm text-gray-600">Show cookie consent banner</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formSettings.enableCookieConsent}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, enableCookieConsent: e.target.checked }))}
                    className="rounded"
                  />
                </div>

                <div>
                  <Label>Privacy Policy URL</Label>
                  <Input
                    value={formSettings.privacyPolicyUrl || ''}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                    placeholder="https://example.com/privacy"
                  />
                </div>

                <div>
                  <Label>Terms of Service URL</Label>
                  <Input
                    value={formSettings.termsOfServiceUrl || ''}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                    placeholder="https://example.com/terms"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'sharing':
        if (!isFormSaved) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Share2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Your Form First</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Sharing options will be available after you save your form. This ensures you're sharing a complete, working form.
                    </p>
                  </div>
                  <Button onClick={saveForm} className="mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Form to Enable Sharing
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
        return form ? (
          <OmnichannelFeatures
            formId={form.id}
            formTitle={form.title}
            formUrl={`${window.location.origin}/form/${form.id}`}
          />
        ) : null;

      case 'users':
        return (
          <UserManagement
            currentUser={currentUser}
            users={users}
            groups={groups}
            ssoProviders={ssoProviders}
            onUserUpdate={() => {}}
            onUserDelete={() => {}}
            onUserInvite={() => {}}
            onGroupUpdate={() => {}}
            onSSOUpdate={() => {}}
          />
        );

      case 'payments':
        return (
          <PaymentIntegration
            providers={paymentProviders}
            subscriptionPlans={subscriptionPlans}
            paymentForms={paymentForms}
            onProviderUpdate={() => {}}
            onPlanUpdate={() => {}}
            onPaymentFormUpdate={() => {}}
          />
        );

      case 'analytics':
        if (!isFormSaved) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Your Form First</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Analytics and insights will be available after you save your form and start collecting responses.
                    </p>
                  </div>
                  <Button onClick={saveForm} className="mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Form to Enable Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
        return form ? (
          <AdvancedAnalytics
            formId={form.id}
            dateRange={{ start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() }}
          />
        ) : null;

      case 'integrations':
        return (
          <IntegrationsHub
            integrations={integrations}
            onIntegrationUpdate={() => {}}
            onIntegrationConnect={(_id, _data) => {}}
            onIntegrationDisconnect={() => {}}
          />
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/forms')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {form.title || 'Untitled Form'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditing ? 'Editing form' : 'Creating new form'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              
              <Button onClick={saveForm}>
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="logic" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Logic
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className={`flex items-center gap-2 ${!isFormSaved ? 'opacity-50' : ''}`}
              disabled={!isFormSaved}
            >
              <Share2 className="w-4 h-4" />
              Sharing
              {!isFormSaved && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className={`flex items-center gap-2 ${!isFormSaved ? 'opacity-50' : ''}`}
              disabled={!isFormSaved}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
              {!isFormSaved && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedFormBuilder; 