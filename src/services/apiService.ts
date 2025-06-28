// API Service Layer for FormPulse
// This service handles all backend operations and can be easily switched between localStorage and real API

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  teamId?: string;
  createdAt: string;
  lastLoginAt?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  plan: 'free' | 'pro' | 'enterprise';
  settings: {
    allowGuestResponses: boolean;
    dataRetentionDays: number;
    customBranding: boolean;
  };
  createdAt: string;
}

interface TeamMember {
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  settings: FormSettings;
  branding: FormBranding;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdBy: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  analytics: FormAnalytics;
}

interface FormQuestion {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'date' | 'rating' | 'file' | 'matrix' | 'ranking' | 'signature';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: QuestionValidation;
  logic?: ConditionalLogic[];
  order: number;
}

interface QuestionValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  fileTypes?: string[];
  maxFileSize?: number;
}

interface ConditionalLogic {
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  action: 'show' | 'hide' | 'require' | 'skip_to';
  targetQuestionId?: string;
}

interface FormSettings {
  allowMultipleSubmissions: boolean;
  requireAuth: boolean;
  collectIP: boolean;
  showProgressBar: boolean;
  showQuestionNumbers: boolean;
  randomizeQuestions: boolean;
  submitButtonText: string;
  thankYouMessage: string;
  redirectUrl?: string;
  notificationEmails: string[];
  autoResponder: {
    enabled: boolean;
    subject: string;
    message: string;
  };
}

interface FormBranding {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  logo?: string;
  customCSS?: string;
  showPoweredBy: boolean;
}

interface FormAnalytics {
  totalViews: number;
  totalSubmissions: number;
  completionRate: number;
  averageTimeSpent: number;
  dropOffPoints: Record<string, number>;
  conversionFunnel: ConversionStep[];
}

interface ConversionStep {
  questionId: string;
  views: number;
  completions: number;
  dropOffRate: number;
}

interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
  timeSpent: number;
  userAgent: string;
  ipAddress?: string;
  location?: {
    country: string;
    city: string;
  };
  metadata: {
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

interface Analytics {
  overview: {
    totalForms: number;
    totalResponses: number;
    averageCompletionRate: number;
    totalViews: number;
  };
  timeSeriesData: TimeSeriesPoint[];
  topPerformingForms: FormPerformance[];
  geographicData: GeographicPoint[];
  deviceBreakdown: DeviceStats;
  trafficSources: TrafficSource[];
}

interface TimeSeriesPoint {
  date: string;
  views: number;
  submissions: number;
  completionRate: number;
}

interface FormPerformance {
  formId: string;
  title: string;
  views: number;
  submissions: number;
  completionRate: number;
  averageRating?: number;
}

interface GeographicPoint {
  country: string;
  responses: number;
  percentage: number;
}

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface TrafficSource {
  source: string;
  visits: number;
  conversions: number;
  conversionRate: number;
}

class ApiService {
  private baseUrl: string;
  private useLocalStorage: boolean;

  constructor(baseUrl = '/api', useLocalStorage = true) {
    this.baseUrl = baseUrl;
    this.useLocalStorage = useLocalStorage;
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    if (this.useLocalStorage) {
      return this.handleLogin({ email, password });
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    if (this.useLocalStorage) {
      return this.handleRegister(userData);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async logout(): Promise<ApiResponse<void>> {
    if (this.useLocalStorage) {
      return this.handleLogout();
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  // Form management methods
  async getForms(teamId?: string): Promise<ApiResponse<Form[]>> {
    if (this.useLocalStorage) {
      return this.getFormsLocal();
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async getForm(formId: string): Promise<ApiResponse<Form>> {
    if (this.useLocalStorage) {
      return this.getFormLocal(formId);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async createForm(formData: Partial<Form>): Promise<ApiResponse<Form>> {
    if (this.useLocalStorage) {
      return this.createFormLocal(formData);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async updateForm(formId: string, formData: Partial<Form>): Promise<ApiResponse<Form>> {
    if (this.useLocalStorage) {
      return this.updateFormLocal(formId, formData);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async deleteForm(formId: string): Promise<ApiResponse<void>> {
    if (this.useLocalStorage) {
      return this.deleteFormLocal(formId);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  // Response management methods
  async getResponses(formId?: string): Promise<ApiResponse<FormResponse[]>> {
    if (this.useLocalStorage) {
      return this.getResponsesLocal(formId);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  async createResponse(responseData: Partial<FormResponse>): Promise<ApiResponse<FormResponse>> {
    if (this.useLocalStorage) {
      return this.createResponseLocal(responseData);
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  // Analytics methods
  async getAnalytics(dateRange?: { start: string; end: string }): Promise<ApiResponse<Analytics>> {
    if (this.useLocalStorage) {
      return this.getAnalyticsLocal();
    }
    // Real API implementation would go here
    return { success: false, error: 'API not implemented' };
  }

  // LocalStorage implementation methods
  private handleLogin(credentials: { email: string; password: string }): ApiResponse<{ user: User; token: string }> {
    const users = JSON.parse(localStorage.getItem('formpulse_users') || '[]');
    const user = users.find((u: User) => u.email === credentials.email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In real implementation, verify password hash
    const token = btoa(`${user.id}:${Date.now()}`);
    localStorage.setItem('formpulse_token', token);
    localStorage.setItem('formpulse_current_user', JSON.stringify(user));

    return {
      success: true,
      data: { user, token },
      message: 'Login successful',
    };
  }

  private handleRegister(userData: Partial<User> & { password: string }): ApiResponse<{ user: User; token: string }> {
    const users = JSON.parse(localStorage.getItem('formpulse_users') || '[]');
    
    if (users.find((u: User) => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: userData.email!,
      name: userData.name!,
      role: 'admin',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
    };

    users.push(newUser);
    localStorage.setItem('formpulse_users', JSON.stringify(users));

    const token = btoa(`${newUser.id}:${Date.now()}`);
    localStorage.setItem('formpulse_token', token);
    localStorage.setItem('formpulse_current_user', JSON.stringify(newUser));

    return {
      success: true,
      data: { user: newUser, token },
      message: 'Registration successful',
    };
  }

  private handleLogout(): ApiResponse<void> {
    localStorage.removeItem('formpulse_token');
    localStorage.removeItem('formpulse_current_user');
    return { success: true, message: 'Logout successful' };
  }

  private getFormsLocal(): ApiResponse<Form[]> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    return { success: true, data: forms };
  }

  private getFormLocal(formId: string): ApiResponse<Form> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const form = forms.find((f: Form) => f.id === formId);
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }

    return { success: true, data: form };
  }

  private createFormLocal(formData: Partial<Form>): ApiResponse<Form> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('formpulse_current_user') || '{}');

    const newForm: Form = {
      id: crypto.randomUUID(),
      title: formData.title || 'Untitled Form',
      description: formData.description,
      questions: formData.questions || [],
      settings: formData.settings || {
        allowMultipleSubmissions: false,
        requireAuth: false,
        collectIP: false,
        showProgressBar: true,
        showQuestionNumbers: true,
        randomizeQuestions: false,
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you for your submission!',
        notificationEmails: [],
        autoResponder: {
          enabled: false,
          subject: 'Thank you for your submission',
          message: 'We have received your submission.',
        },
      },
      branding: formData.branding || {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        showPoweredBy: true,
      },
      status: 'draft',
      createdBy: currentUser.id || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analytics: {
        totalViews: 0,
        totalSubmissions: 0,
        completionRate: 0,
        averageTimeSpent: 0,
        dropOffPoints: {},
        conversionFunnel: [],
      },
    };

    forms.push(newForm);
    localStorage.setItem('formpulse_forms', JSON.stringify(forms));

    return { success: true, data: newForm };
  }

  private updateFormLocal(formId: string, formData: Partial<Form>): ApiResponse<Form> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const formIndex = forms.findIndex((f: Form) => f.id === formId);

    if (formIndex === -1) {
      return { success: false, error: 'Form not found' };
    }

    forms[formIndex] = {
      ...forms[formIndex],
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('formpulse_forms', JSON.stringify(forms));

    return { success: true, data: forms[formIndex] };
  }

  private deleteFormLocal(formId: string): ApiResponse<void> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const filteredForms = forms.filter((f: Form) => f.id !== formId);

    localStorage.setItem('formpulse_forms', JSON.stringify(filteredForms));

    return { success: true, message: 'Form deleted successfully' };
  }

  private getResponsesLocal(formId?: string): ApiResponse<FormResponse[]> {
    const responses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');
    
    if (formId) {
      const formResponses = responses.filter((r: FormResponse) => r.formId === formId);
      return { success: true, data: formResponses };
    }
    
    return { success: true, data: responses };
  }

  private createResponseLocal(responseData: Partial<FormResponse>): ApiResponse<FormResponse> {
    const responses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');

    const newResponse: FormResponse = {
      id: crypto.randomUUID(),
      formId: responseData.formId!,
      responses: responseData.responses || {},
      submittedAt: new Date().toISOString(),
      timeSpent: responseData.timeSpent || 0,
      userAgent: navigator.userAgent,
      metadata: responseData.metadata || {},
    };

    responses.push(newResponse);
    localStorage.setItem('formpulse_responses', JSON.stringify(responses));

    // Update form analytics
    this.updateFormAnalyticsLocal(responseData.formId!);

    return { success: true, data: newResponse };
  }

  private getAnalyticsLocal(): ApiResponse<Analytics> {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const responses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');

    // Generate analytics data
    const analytics: Analytics = {
      overview: {
        totalForms: forms.length,
        totalResponses: responses.length,
        averageCompletionRate: 0.75,
        totalViews: Math.floor(responses.length * 1.33), // Simulate some drop-off
      },
      timeSeriesData: this.generateTimeSeriesData(responses),
      topPerformingForms: this.generateTopPerformingForms(forms, responses),
      geographicData: this.generateGeographicData(),
      deviceBreakdown: {
        desktop: 0.6,
        mobile: 0.35,
        tablet: 0.05,
      },
      trafficSources: this.generateTrafficSources(),
    };

    return { success: true, data: analytics };
  }

  private updateFormAnalyticsLocal(formId: string): void {
    const forms = JSON.parse(localStorage.getItem('formpulse_forms') || '[]');
    const responses = JSON.parse(localStorage.getItem('formpulse_responses') || '[]');
    
    const formIndex = forms.findIndex((f: Form) => f.id === formId);
    if (formIndex === -1) return;

    const formResponses = responses.filter((r: FormResponse) => r.formId === formId);
    
    forms[formIndex].analytics = {
      totalViews: Math.max(Math.floor(formResponses.length * 1.33), forms[formIndex].analytics?.totalViews || 0),
      totalSubmissions: formResponses.length,
      completionRate: formResponses.length / Math.max(Math.floor(formResponses.length * 1.33), 1),
      averageTimeSpent: formResponses.reduce((acc: number, r: FormResponse) => acc + r.timeSpent, 0) / Math.max(formResponses.length, 1),
      dropOffPoints: {},
      conversionFunnel: [],
    };

    localStorage.setItem('formpulse_forms', JSON.stringify(forms));
  }

  private generateTimeSeriesData(responses: FormResponse[]): TimeSeriesPoint[] {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayResponses = responses.filter(r => 
        r.submittedAt.startsWith(dateStr)
      );

      last7Days.push({
        date: dateStr,
        views: Math.floor(dayResponses.length * 1.33),
        submissions: dayResponses.length,
        completionRate: dayResponses.length > 0 ? 0.75 : 0,
      });
    }
    return last7Days;
  }

  private generateTopPerformingForms(forms: Form[], responses: FormResponse[]): FormPerformance[] {
    return forms.slice(0, 5).map(form => {
      const formResponses = responses.filter(r => r.formId === form.id);
      return {
        formId: form.id,
        title: form.title,
        views: Math.floor(formResponses.length * 1.33),
        submissions: formResponses.length,
        completionRate: formResponses.length > 0 ? 0.75 : 0,
      };
    });
  }

  private generateGeographicData(): GeographicPoint[] {
    return [
      { country: 'United States', responses: 45, percentage: 45 },
      { country: 'Canada', responses: 20, percentage: 20 },
      { country: 'United Kingdom', responses: 15, percentage: 15 },
      { country: 'Australia', responses: 10, percentage: 10 },
      { country: 'Germany', responses: 10, percentage: 10 },
    ];
  }

  private generateTrafficSources(): TrafficSource[] {
    return [
      { source: 'Direct', visits: 150, conversions: 120, conversionRate: 0.8 },
      { source: 'Google', visits: 100, conversions: 75, conversionRate: 0.75 },
      { source: 'Social Media', visits: 80, conversions: 56, conversionRate: 0.7 },
      { source: 'Email', visits: 60, conversions: 48, conversionRate: 0.8 },
      { source: 'Referral', visits: 40, conversions: 28, conversionRate: 0.7 },
    ];
  }
}

// Export singleton instance
export const apiService = new ApiService();
export type { 
  User, 
  Team, 
  Form, 
  FormQuestion, 
  FormResponse, 
  Analytics, 
  ApiResponse 
}; 