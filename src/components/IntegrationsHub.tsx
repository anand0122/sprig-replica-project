import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Zap, 
  Users, 
  FileSpreadsheet, 
  Mail,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Webhook,
  Database,
  Cloud,
  Globe,
  Smartphone,
  MessageSquare,
  Calendar,
  CreditCard,
  BarChart3,
  Brain,
  Shield,
  FileText,
  GraduationCap
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'automation' | 'crm' | 'spreadsheet' | 'email' | 'communication' | 'analytics' | 'payment' | 'ai' | 'devtools' | 'security' | 'education' | 'documents' | 'localization';
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  config: {
    apiKey?: string;
    webhookUrl?: string;
    accountId?: string;
    listId?: string;
    spreadsheetId?: string;
    sheetName?: string;
    folderId?: string;
    baseId?: string;
    tableId?: string;
    publicKey?: string;
    secretKey?: string;
    siteId?: string;
    clientId?: string;
    clientSecret?: string;
    siteKey?: string;
    trackingId?: string;
    measurementId?: string;
    databaseId?: string;
    [key: string]: any;
  };
  triggers: string[];
  actions: string[];
  lastSync?: Date;
  syncCount?: number;
  credentials?: {
    apiKey?: string;
    client_email?: string;
    private_key?: string;
    [key: string]: any;
  };
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  integrations: string[];
  workflow: {
    trigger: string;
    actions: {
      integration: string;
      action: string;
      config: any;
    }[];
  };
}

const integrationCategories = {
  automation: { name: 'Automation', icon: Zap, color: 'text-yellow-500' },
  crm: { name: 'CRM & Marketing', icon: Users, color: 'text-blue-500' },
  spreadsheet: { name: 'Productivity & Storage', icon: FileSpreadsheet, color: 'text-green-500' },
  email: { name: 'Email & Communication', icon: Mail, color: 'text-purple-500' },
  communication: { name: 'Communication', icon: MessageSquare, color: 'text-indigo-500' },
  analytics: { name: 'Analytics & Reporting', icon: BarChart3, color: 'text-orange-500' },
  ai: { name: 'AI & ML Services', icon: Brain, color: 'text-pink-500' },
  payment: { name: 'Payments & Subscriptions', icon: CreditCard, color: 'text-emerald-500' },
  devtools: { name: 'DevOps & Developer Tools', icon: Settings, color: 'text-gray-500' },
  security: { name: 'Security & Identity', icon: Shield, color: 'text-red-500' },
  education: { name: 'Learning & Education', icon: GraduationCap, color: 'text-indigo-500' },
  documents: { name: 'Documents & Legal', icon: FileText, color: 'text-cyan-500' },
  localization: { name: 'Localization & Translation', icon: Globe, color: 'text-teal-500' }
};

const mockIntegrations: Integration[] = [
  // Email & Communication
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'email',
    description: 'Email marketing platform with advanced automation',
    icon: 'https://logos-world.net/wp-content/uploads/2021/02/Mailchimp-Logo.png',
    status: 'connected',
    config: { apiKey: 'mc_api_key_789', listId: 'mc_list_abc123' },
    triggers: ['form_submitted'],
    actions: ['add_subscriber', 'update_subscriber', 'send_email'],
    lastSync: new Date(),
    syncCount: 567
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    category: 'email',
    description: 'Email marketing for creators and businesses',
    icon: 'https://seeklogo.com/images/C/convertkit-logo-6428C6CDB9-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['add_subscriber', 'tag_subscriber'],
    syncCount: 0
  },
  {
    id: 'sendinblue',
    name: 'Sendinblue',
    category: 'email',
    description: 'All-in-one digital marketing platform',
    icon: 'https://seeklogo.com/images/S/sendinblue-logo-7A5F8F5B5E-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['add_contact', 'send_transactional_email'],
    syncCount: 0
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    category: 'email',
    description: 'Reliable transactional email delivery',
    icon: 'https://seeklogo.com/images/S/sendgrid-logo-7B1F4B6D8A-seeklogo.com.png',
    status: 'connected',
    config: { apiKey: 'sg_api_key_123' },
    triggers: ['form_submitted'],
    actions: ['send_email', 'add_to_list'],
    lastSync: new Date(),
    syncCount: 1200
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'email',
    description: 'SMS, WhatsApp, and voice notifications',
    icon: 'https://seeklogo.com/images/T/twilio-logo-red-A78B5A1C01-seeklogo.com.png',
    status: 'connected',
    config: { accountSid: 'twilio_sid_123', authToken: 'twilio_token_456' },
    triggers: ['form_submitted'],
    actions: ['send_sms', 'send_whatsapp'],
    lastSync: new Date(),
    syncCount: 340
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'email',
    description: 'Team collaboration and form notifications',
    icon: 'https://logos-world.net/wp-content/uploads/2020/12/Slack-Logo.png',
    status: 'connected',
    config: { webhookUrl: 'https://hooks.slack.com/services/...' },
    triggers: ['form_submitted', 'form_completed'],
    actions: ['send_message', 'create_channel'],
    lastSync: new Date(),
    syncCount: 89
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'email',
    description: 'Community notifications and alerts',
    icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['send_message', 'create_webhook'],
    syncCount: 0
  },

  // Analytics & Reporting
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    category: 'analytics',
    description: 'Track form traffic and conversion rates',
    icon: 'https://seeklogo.com/images/G/google-analytics-logo-4A7C5A8F36-seeklogo.com.png',
    status: 'connected',
    config: { trackingId: 'GA-123456789', measurementId: 'G-ABCDEFGHIJ' },
    triggers: ['form_viewed', 'form_submitted'],
    actions: ['track_event', 'track_conversion'],
    lastSync: new Date(),
    syncCount: 5600
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    category: 'analytics',
    description: 'Advanced usage analytics and user behavior',
    icon: 'https://seeklogo.com/images/M/mixpanel-logo-EE1B7E2FF3-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted', 'question_answered'],
    actions: ['track_event', 'update_profile'],
    syncCount: 0
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    category: 'analytics',
    description: 'Form heatmaps and user session recordings',
    icon: 'https://seeklogo.com/images/H/hotjar-logo-5F2C9B5703-seeklogo.com.png',
    status: 'connected',
    config: { siteId: 'hj_site_123' },
    triggers: ['form_viewed'],
    actions: ['track_heatmap', 'record_session'],
    lastSync: new Date(),
    syncCount: 2300
  },

  // AI & ML Services
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    category: 'ai',
    description: 'Form generation, question improvement, response analysis',
    icon: 'https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png',
    status: 'connected',
    config: { apiKey: 'sk-openai-key-123', model: 'gpt-4' },
    triggers: ['form_created', 'response_received'],
    actions: ['generate_questions', 'analyze_responses', 'improve_form'],
    lastSync: new Date(),
    syncCount: 1500
  },
  {
    id: 'google_gemini',
    name: 'Google Gemini',
    category: 'ai',
    description: 'Advanced LLM-based AI tasks and analysis',
    icon: 'https://seeklogo.com/images/G/google-gemini-logo-A5787B2669-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_created'],
    actions: ['generate_content', 'analyze_sentiment'],
    syncCount: 0
  },
  {
    id: 'anthropic_claude',
    name: 'Anthropic Claude',
    category: 'ai',
    description: 'AI-powered form enhancements and analysis',
    icon: 'https://seeklogo.com/images/A/anthropic-logo-E1B24F0267-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['response_received'],
    actions: ['analyze_text', 'generate_insights'],
    syncCount: 0
  },

  // Payments & Subscriptions
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Accept payments and manage subscriptions',
    icon: 'https://seeklogo.com/images/S/stripe-logo-3F334C75B8-seeklogo.com.png',
    status: 'connected',
    config: { publicKey: 'pk_test_123', secretKey: 'sk_test_456' },
    triggers: ['payment_required'],
    actions: ['create_payment', 'create_subscription'],
    lastSync: new Date(),
    syncCount: 890
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'payment',
    description: 'Global payment processing solution',
    icon: 'https://logos-world.net/wp-content/uploads/2020/06/PayPal-Logo.png',
    status: 'disconnected',
    config: {},
    triggers: ['payment_required'],
    actions: ['create_payment', 'process_subscription'],
    syncCount: 0
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    category: 'payment',
    description: 'Payment gateway for India and Southeast Asia',
    icon: 'https://seeklogo.com/images/R/razorpay-logo-4E0B3E8E7D-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['payment_required'],
    actions: ['create_payment', 'verify_payment'],
    syncCount: 0
  },

  // Productivity & File Storage
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    category: 'spreadsheet',
    description: 'Automatically save form responses to spreadsheets',
    icon: 'https://seeklogo.com/images/G/google-sheets-logo-D2A35FF8A4-seeklogo.com.png',
    status: 'connected',
    config: { spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', sheetName: 'Form Responses' },
    triggers: ['form_submitted'],
    actions: ['add_row', 'update_row'],
    lastSync: new Date(),
    syncCount: 2100
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    category: 'spreadsheet',
    description: 'Store file uploads and form attachments',
    icon: 'https://seeklogo.com/images/G/google-drive-logo-C066D48EAB-seeklogo.com.png',
    status: 'connected',
    config: { folderId: 'drive_folder_123' },
    triggers: ['file_uploaded'],
    actions: ['upload_file', 'create_folder'],
    lastSync: new Date(),
    syncCount: 450
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'spreadsheet',
    description: 'Cloud storage for form file uploads',
    icon: 'https://seeklogo.com/images/D/dropbox-logo-E711E7A71C-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['file_uploaded'],
    actions: ['upload_file', 'share_link'],
    syncCount: 0
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'spreadsheet',
    description: 'Export responses to Notion databases',
    icon: 'https://seeklogo.com/images/N/notion-logo-E26F38C9AC-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['create_page', 'update_database'],
    syncCount: 0
  },
  {
    id: 'airtable',
    name: 'Airtable',
    category: 'spreadsheet',
    description: 'Organize form data in flexible databases',
    icon: 'https://seeklogo.com/images/A/airtable-logo-216B9AF035-seeklogo.com.png',
    status: 'connected',
    config: { baseId: 'airtable_base_123', tableId: 'table_456' },
    triggers: ['form_submitted'],
    actions: ['create_record', 'update_record'],
    lastSync: new Date(),
    syncCount: 670
  },

  // CRM & Marketing Automation
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Complete CRM and marketing automation platform',
    icon: 'https://seeklogo.com/images/H/hubspot-logo-A36C8D5D0A-seeklogo.com.png',
    status: 'connected',
    config: { apiKey: 'hub_api_key_123', accountId: 'hub_account_456' },
    triggers: ['form_submitted'],
    actions: ['create_contact', 'update_contact', 'create_deal'],
    lastSync: new Date(),
    syncCount: 890
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'World\'s leading CRM platform',
    icon: 'https://seeklogo.com/images/S/salesforce-logo-C4E7A3C0F5-seeklogo.com.png',
    status: 'error',
    config: { apiKey: 'sf_api_key_error', instanceUrl: 'https://mycompany.salesforce.com' },
    triggers: ['form_submitted'],
    actions: ['create_lead', 'update_contact', 'create_opportunity'],
    syncCount: 0
  },
  {
    id: 'zoho_crm',
    name: 'Zoho CRM',
    category: 'crm',
    description: 'Comprehensive business CRM solution',
    icon: 'https://seeklogo.com/images/Z/zoho-logo-6B5F6F1E3C-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['create_lead', 'update_contact'],
    syncCount: 0
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    description: 'Sales-focused CRM for growing teams',
    icon: 'https://seeklogo.com/images/P/pipedrive-logo-4B1B1E8E4D-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['create_person', 'create_deal'],
    syncCount: 0
  },

  // Integration Platforms
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    description: 'Connect with 5000+ apps through automation',
    icon: 'https://seeklogo.com/images/Z/zapier-logo-1B48C7B4C4-seeklogo.com.png',
    status: 'connected',
    config: { webhookUrl: 'https://hooks.zapier.com/hooks/catch/12345/abcdef' },
    triggers: ['form_submitted', 'form_completed', 'response_received'],
    actions: ['send_to_zapier'],
    lastSync: new Date(),
    syncCount: 1250
  },
  {
    id: 'make',
    name: 'Make.com',
    category: 'automation',
    description: 'Visual platform for complex automation workflows',
    icon: 'https://avatars.githubusercontent.com/u/85462759?s=200&v=4',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['trigger_scenario'],
    syncCount: 0
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'automation',
    description: 'Open-source workflow automation tool',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/n8n.svg',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['trigger_workflow'],
    syncCount: 0
  },

  // DevOps & Developer Tools
  {
    id: 'github',
    name: 'GitHub Actions',
    category: 'devtools',
    description: 'Automate workflows based on form inputs',
    icon: 'https://seeklogo.com/images/G/github-logo-2E3852456C-seeklogo.com.png',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['trigger_action', 'create_issue'],
    syncCount: 0
  },
  {
    id: 'webhook',
    name: 'Custom Webhooks',
    category: 'devtools',
    description: 'Send form data to any HTTP endpoint',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/webhook.svg',
    status: 'connected',
    config: { webhookUrl: 'https://api.example.com/webhook' },
    triggers: ['form_submitted'],
    actions: ['send_webhook'],
    lastSync: new Date(),
    syncCount: 320
  },

  // Security & Identity
  {
    id: 'google_oauth',
    name: 'Google OAuth',
    category: 'security',
    description: 'Single sign-on with Google accounts',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg',
    status: 'connected',
    config: { clientId: 'google_client_123', clientSecret: 'google_secret_456' },
    triggers: ['user_login'],
    actions: ['authenticate_user'],
    lastSync: new Date(),
    syncCount: 150
  },
  {
    id: 'recaptcha',
    name: 'reCAPTCHA',
    category: 'security',
    description: 'Protect forms from spam and bots',
    icon: 'https://www.google.com/recaptcha/about/images/reCaptcha-logo@2x.png',
    status: 'connected',
    config: { siteKey: 'recaptcha_site_key', secretKey: 'recaptcha_secret' },
    triggers: ['form_submitted'],
    actions: ['verify_captcha'],
    lastSync: new Date(),
    syncCount: 890
  },

  // Learning & Education
  {
    id: 'google_classroom',
    name: 'Google Classroom',
    category: 'education',
    description: 'Integrate with educational workflows',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googleclassroom.svg',
    status: 'disconnected',
    config: {},
    triggers: ['quiz_completed'],
    actions: ['create_assignment', 'grade_submission'],
    syncCount: 0
  },

  // Documents & Legal
  {
    id: 'docusign',
    name: 'DocuSign',
    category: 'documents',
    description: 'Electronic signature integration',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docusign.svg',
    status: 'disconnected',
    config: {},
    triggers: ['form_submitted'],
    actions: ['send_for_signature', 'create_envelope'],
    syncCount: 0
  },

  // Localization & Translation
  {
    id: 'google_translate',
    name: 'Google Translate',
    category: 'localization',
    description: 'Auto-translate forms to multiple languages',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googletranslate.svg',
    status: 'disconnected',
    config: {},
    triggers: ['form_created'],
    actions: ['translate_text', 'detect_language'],
    syncCount: 0
  }
];

const mockTemplates: IntegrationTemplate[] = [
  {
    id: 'lead_generation',
    name: 'Lead Generation Workflow',
    description: 'Capture leads and sync to CRM, email marketing, and notifications',
    integrations: ['hubspot', 'mailchimp', 'slack'],
    workflow: {
      trigger: 'form_submitted',
      actions: [
        { integration: 'hubspot', action: 'create_contact', config: {} },
        { integration: 'mailchimp', action: 'add_subscriber', config: {} },
        { integration: 'slack', action: 'send_message', config: { channel: '#leads' } }
      ]
    }
  },
  {
    id: 'survey_analysis',
    name: 'Survey Data Collection',
    description: 'Collect survey responses and analyze in spreadsheets',
    integrations: ['google_sheets', 'zapier'],
    workflow: {
      trigger: 'form_submitted',
      actions: [
        { integration: 'google_sheets', action: 'add_row', config: {} },
        { integration: 'zapier', action: 'send_to_zapier', config: { zap: 'survey_analysis' } }
      ]
    }
  }
];

interface IntegrationsHubProps {
  integrations?: Integration[];
  onIntegrationUpdate: (integration: Integration) => void;
  onIntegrationConnect: (
    integrationId: string,
    data: { config: any; credentials: any }
  ) => void;
  onIntegrationDisconnect: (integrationId: string) => void;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({
  integrations = mockIntegrations,
  onIntegrationUpdate,
  onIntegrationConnect,
  onIntegrationDisconnect
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configuringIntegration, setConfiguringIntegration] = useState<Integration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalSyncs = integrations.reduce((sum, i) => sum + (i.syncCount || 0), 0);

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'connected') {
      onIntegrationDisconnect(integration.id);
      return;
    }

    // For OAuth-based integrations, start connect immediately
    if (['google_sheets', 'notion'].includes(integration.id)) {
      onIntegrationConnect(integration.id, { config: {}, credentials: {} });
      return;
    }

    // Otherwise open configuration modal
    setConfiguringIntegration(integration);
  };

  const saveConfiguration = () => {
    if (configuringIntegration) {
      onIntegrationConnect(configuringIntegration.id, {
        config: configuringIntegration.config,
        credentials: configuringIntegration.credentials || {},
      });
      setConfiguringIntegration(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Syncs</p>
                <p className="text-2xl font-bold">{totalSyncs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(integrationCategories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {Object.entries(integrationCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              const count = integrations.filter(i => i.category === key).length;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="whitespace-nowrap"
                >
                  <IconComponent className={`w-4 h-4 mr-2 ${category.color}`} />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const categoryInfo = integrationCategories[integration.category];
              const IconComponent = categoryInfo.icon;
              
              return (
                <Card key={integration.id} className="relative h-[280px] flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
                          <img 
                            src={integration.icon} 
                            alt={`${integration.name} logo`}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              // Better fallback with brand colors
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallbackColors: { [key: string]: string } = {
                                'mailchimp': 'bg-yellow-400',
                                'hubspot': 'bg-orange-500', 
                                'salesforce': 'bg-blue-600',
                                'zapier': 'bg-orange-600',
                                'stripe': 'bg-indigo-600',
                                'google_sheets': 'bg-green-600',
                                'slack': 'bg-purple-600',
                                'google_analytics': 'bg-orange-500',
                                'openai': 'bg-gray-900',
                                'pipedrive': 'bg-green-500',
                                'make': 'bg-purple-500',
                                'zoho_crm': 'bg-red-600'
                              };
                              const color = fallbackColors[integration.id] || 'bg-gray-500';
                              const text = integration.id === 'google_analytics' ? 'GA' : 
                                          integration.id === 'openai' ? 'AI' : 
                                          integration.name.charAt(0);
                              target.parentElement!.innerHTML = `<div class="w-8 h-8 ${color} rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">${text}</span></div>`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold truncate">{integration.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <IconComponent className={`w-4 h-4 ${categoryInfo.color}`} />
                            <span className="text-sm text-gray-600 truncate">{categoryInfo.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge className={`${getStatusColor(integration.status)} text-xs px-2 py-1`}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2 h-10">{integration.description}</p>
                      
                      <div className="space-y-2 h-16">
                        {integration.status === 'connected' && integration.syncCount !== undefined && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Syncs:</span>
                              <span className="font-medium">{integration.syncCount.toLocaleString()}</span>
                            </div>
                            {integration.lastSync && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last sync:</span>
                                <span className="font-medium">
                                  {integration.lastSync.toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        
                        {integration.status === 'disconnected' && (
                          <div className="flex justify-between text-sm text-gray-500 h-5">
                            <span>Status:</span>
                            <span>Not connected</span>
                          </div>
                        )}
                        
                        {integration.status === 'error' && (
                          <div className="flex justify-between text-sm text-red-600 h-5">
                            <span>Status:</span>
                            <span>Connection error</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant={integration.status === 'connected' ? 'outline' : 'default'}
                        onClick={() => handleConnect(integration)}
                        className="flex-1"
                      >
                        {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                      
                      {integration.status === 'connected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfiguringIntegration(integration)}
                          className="px-3"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No integrations found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filter.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Integration Templates</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Required Integrations:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.integrations.map((integrationId) => {
                        const integration = integrations.find(i => i.id === integrationId);
                        return integration ? (
                          <Badge key={integrationId} variant="outline" className="flex items-center gap-1">
                            <img 
                              src={integration.icon} 
                              alt={`${integration.name} logo`}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            {integration.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Workflow:</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium">Trigger: {template.workflow.trigger}</div>
                      <div className="mt-2">
                        <div className="font-medium">Actions:</div>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {template.workflow.actions.map((action, index) => (
                            <li key={index}>
                              {action.integration}: {action.action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Custom Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Your Webhook URL</h4>
                <div className="flex gap-2">
                  <Input
                    value="https://api.formpulse.com/webhooks/your-form-id"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Use this URL to receive form submissions in real-time
                </p>
              </div>

              <div>
                <Label>Webhook Events</Label>
                <div className="mt-2 space-y-2">
                  {['form_submitted', 'form_completed', 'form_abandoned', 'response_updated'].map((event) => (
                    <div key={event} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Custom Headers</Label>
                <Textarea
                  placeholder="Authorization: Bearer your-token&#10;X-Custom-Header: value"
                  className="mt-1 font-mono text-sm"
                  rows={3}
                />
              </div>

              <Button>
                Save Webhook Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Modal */}
      {configuringIntegration && (
        <Card className="fixed inset-0 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 p-1.5 flex items-center justify-center">
                  <img 
                    src={configuringIntegration.icon} 
                    alt={`${configuringIntegration.name} logo`}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-5 h-5 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-600">' + configuringIntegration.name.charAt(0) + '</div>';
                    }}
                  />
                </div>
                Configure {configuringIntegration.name}
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => setConfiguringIntegration(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-600">{configuringIntegration.description}</p>

            {/* Configuration Fields */}
            <div className="space-y-4">
              {configuringIntegration.id === 'zapier' && (
                <div>
                  <Label>Webhook URL</Label>
                  <Input
                    value={configuringIntegration.config.webhookUrl || ''}
                    onChange={(e) => setConfiguringIntegration({
                      ...configuringIntegration,
                      config: { ...configuringIntegration.config, webhookUrl: e.target.value }
                    })}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                  />
                </div>
              )}

              {['hubspot', 'salesforce', 'mailchimp'].includes(configuringIntegration.id) && (
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={configuringIntegration.config.apiKey || ''}
                    onChange={(e) => setConfiguringIntegration({
                      ...configuringIntegration,
                      config: { ...configuringIntegration.config, apiKey: e.target.value }
                    })}
                    placeholder="Enter your API key"
                  />
                </div>
              )}

              {configuringIntegration.id === 'google_sheets' && (
                <>
                  <div>
                    <Label>Spreadsheet ID</Label>
                    <Input
                      value={configuringIntegration.config.spreadsheetId || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        config: { ...configuringIntegration.config, spreadsheetId: e.target.value }
                      })}
                      placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    />
                  </div>
                  <div>
                    <Label>Sheet Name</Label>
                    <Input
                      value={configuringIntegration.config.sheetName || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        config: { ...configuringIntegration.config, sheetName: e.target.value }
                      })}
                      placeholder="Form Responses"
                    />
                  </div>
                  <div>
                    <Label>Service Account Email</Label>
                    <Input
                      value={configuringIntegration.credentials?.client_email || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        credentials: {
                          ...configuringIntegration.credentials,
                          client_email: e.target.value,
                        },
                      })}
                      placeholder="service-account@project.iam.gserviceaccount.com"
                    />
                  </div>
                  <div>
                    <Label>Private Key</Label>
                    <Textarea
                      rows={4}
                      value={configuringIntegration.credentials?.private_key || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        credentials: {
                          ...configuringIntegration.credentials,
                          private_key: e.target.value,
                        },
                      })}
                      placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                    />
                  </div>
                </>
              )}

              {configuringIntegration.id === 'slack' && (
                <>
                  <div>
                    <Label>Webhook URL</Label>
                    <Input
                      value={configuringIntegration.config.webhookUrl || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        config: { ...configuringIntegration.config, webhookUrl: e.target.value }
                      })}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div>
                    <Label>Default Channel</Label>
                    <Input
                      value={configuringIntegration.config.channel || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        config: { ...configuringIntegration.config, channel: e.target.value }
                      })}
                      placeholder="#general"
                    />
                  </div>
                </>
              )}

              {configuringIntegration.id === 'notion' && (
                <>
                  <div>
                    <Label>Database ID</Label>
                    <Input
                      value={configuringIntegration.config.databaseId || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        config: { ...configuringIntegration.config, databaseId: e.target.value }
                      })}
                      placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                    />
                  </div>
                  <div>
                    <Label>Integration Secret (Notion API Key)</Label>
                    <Input
                      type="password"
                      value={configuringIntegration.credentials?.apiKey || ''}
                      onChange={(e) => setConfiguringIntegration({
                        ...configuringIntegration,
                        credentials: { ...configuringIntegration.credentials, apiKey: e.target.value }
                      })}
                      placeholder="secret_..."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Test Connection */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test Connection</h4>
              <p className="text-sm text-gray-600 mb-3">
                Test your configuration to ensure it's working correctly.
              </p>
              <Button variant="outline" size="sm">
                Test Connection
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveConfiguration} className="flex-1">
                Save & Connect
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfiguringIntegration(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 