# FormPulse - AI-Powered Form Builder

FormPulse is a comprehensive form and quiz creation platform with AI-powered features, advanced analytics, and seamless embedding capabilities.

## 🚀 Features

### 🤖 AI-Powered Form Creation
- **Smart Form Generation**: Generate forms from text descriptions, images, PDFs, or URLs
- **Question Suggestions**: AI-powered question recommendations based on form context
- **Question Improvement**: Get AI suggestions to improve existing questions
- **Bloom's Taxonomy Quizzes**: Generate educational quizzes based on learning objectives
- **Performance Analysis**: AI-driven insights and optimization recommendations

### 📝 Advanced Form Builder
- **Multiple Question Types**: Text, email, textarea, radio, checkbox, select, rating, file upload, and more
- **Conditional Logic**: Show/hide questions based on previous answers
- **Custom Validation**: Set validation rules with custom error messages
- **Multi-step Forms**: Break long forms into manageable steps
- **Real-time Preview**: See how your form looks as you build it

### 🧠 Quiz System
- **Interactive Quiz Builder**: Create engaging quizzes with multiple question types
- **Scoring System**: Automatic scoring with customizable point values
- **Time Limits**: Set time limits for entire quizzes or individual questions
- **Result Analysis**: Detailed performance tracking and analytics
- **Retake Options**: Configure retake policies and attempt limits

### 📊 Advanced Analytics
- **Real-time Analytics**: Live visitor tracking and form performance metrics
- **Completion Funnel**: Identify drop-off points and optimize conversion
- **Response Analytics**: Detailed analysis of form responses and patterns
- **Geographic Insights**: See where your responses are coming from
- **Device Breakdown**: Understand how users interact across different devices
- **Export Data**: Export responses and analytics in multiple formats

### 🔗 Embedding & Integration
- **Multiple Embed Methods**: 
  - Simple iframe embedding
  - JavaScript SDK with full API control
  - Auto-initialization with data attributes
  - React component integration
- **Customizable Themes**: Match your brand colors and styling
- **Responsive Design**: Works perfectly on all devices
- **Event Handling**: Custom callbacks for form submissions and interactions
- **Auto-resize**: Embedded forms automatically adjust their height

### 🎨 Customization
- **Theme System**: Light/dark themes with custom color schemes
- **Brand Integration**: Add your logo and customize the appearance
- **Custom CSS**: Advanced styling options for complete control
- **White-label Options**: Remove FormPulse branding for premium users

### 🔒 Privacy & Security
- **Privacy-First Analytics**: Cookie-less tracking with IP anonymization
- **GDPR Compliance**: Built-in privacy controls and data management
- **Secure Submissions**: All form data is encrypted and securely stored
- **Data Ownership**: Full control over your data with export capabilities

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context + Local Storage
- **AI Integration**: Google Gemini API (configurable)
- **Analytics**: Custom privacy-focused tracking system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprig-replica-project
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your AI API key (optional):
```bash
# Add to .env file
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage Guide

### Creating Your First Form

1. **Sign up/Login**: Create an account or log in to access the dashboard
2. **Create Form**: Click "Create Form" and choose your method:
   - Start from scratch with the form builder
   - Use AI to generate from text description
   - Generate from uploaded image or PDF
3. **Customize**: Add questions, set validation rules, and customize the appearance
4. **Publish**: Make your form live and start collecting responses
5. **Embed**: Use any of the embedding methods to add the form to your website

### AI Form Generation

```javascript
// Example: Generate form from text
const formRequest = {
  type: 'text',
  content: 'Create a customer feedback survey for a restaurant',
  formType: 'feedback',
  tone: 'friendly',
  length: 'medium'
};

const generatedForm = await aiService.generateForm(formRequest);
```

### Embedding Forms

#### Method 1: Simple IFrame
```html
<iframe 
  src="https://your-domain.com/embed/form-id" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

#### Method 2: JavaScript SDK
```html
<script src="https://your-domain.com/embed-script.js"></script>
<script>
  FormPulseEmbed.init({
    formId: "your-form-id",
    container: "#form-container",
    theme: "light",
    primaryColor: "#3b82f6",
    onSubmit: function(data) {
      console.log('Form submitted:', data);
    }
  });
</script>
<div id="form-container"></div>
```

#### Method 3: Data Attributes
```html
<script src="https://your-domain.com/embed-script.js"></script>
<div 
  data-formpulse-form="your-form-id"
  data-theme="light"
  data-primary-color="#3b82f6">
</div>
```

#### Method 4: React Component
```jsx
import { FormPulseEmbed } from './FormPulseEmbed';

function MyComponent() {
  return (
    <FormPulseEmbed 
      formId="your-form-id"
      theme="light"
      primaryColor="#3b82f6"
      onSubmit={(data) => console.log('Submitted:', data)}
    />
  );
}
```

## 🎯 Key Features Implemented

### ✅ Core Functionality
- [x] User authentication and account management
- [x] Form builder with drag-and-drop interface
- [x] Multiple question types and validation
- [x] Quiz creation and management
- [x] Response collection and storage
- [x] Analytics and reporting dashboard

### ✅ AI Features
- [x] AI-powered form generation
- [x] Question suggestions and improvements
- [x] Performance analysis and optimization
- [x] Content extraction from various sources
- [x] Educational quiz generation (Bloom's Taxonomy)

### ✅ Advanced Features
- [x] Multi-step forms with progress tracking
- [x] Conditional logic and branching
- [x] Custom themes and branding
- [x] Real-time analytics and insights
- [x] Privacy-focused tracking system
- [x] Comprehensive embedding options

### ✅ Integration & Embedding
- [x] Multiple embedding methods (iframe, JS SDK, data attributes, React)
- [x] Custom event handling and callbacks
- [x] Responsive design and auto-resize
- [x] Theme customization and branding
- [x] Cross-domain messaging and security

### ✅ Analytics & Insights
- [x] Real-time visitor tracking
- [x] Completion funnel analysis
- [x] Geographic and device insights
- [x] Response pattern analysis
- [x] Export capabilities
- [x] AI-powered recommendations

## 🔧 Configuration

### Environment Variables
```bash
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Analytics Configuration
VITE_ANALYTICS_ENABLED=true
VITE_PRIVACY_MODE=true

# Embedding Configuration
VITE_EMBED_DOMAIN=your-domain.com
```

### Customization Options
- **Themes**: Light/dark themes with custom color schemes
- **Branding**: Logo upload and custom styling
- **Privacy**: Cookie-less tracking and GDPR compliance
- **Analytics**: Custom event tracking and reporting
- **Embedding**: White-label options and custom domains

## 📚 API Reference

### AI Service Methods
```typescript
// Generate form from text
aiService.generateForm(request: AIFormRequest): Promise<AIFormResponse>

// Get question suggestions
aiService.suggestQuestions(context: FormContext): Promise<AIGeneratedQuestion[]>

// Improve existing questions
aiService.improveQuestion(question: string, context?: string): Promise<ImprovementSuggestion>

// Analyze form performance
aiService.analyzeFormPerformance(analytics: FormAnalytics): Promise<PerformanceInsights>
```

### Embed API Methods
```javascript
// Initialize form embed
FormPulseEmbed.init(options)

// Initialize multiple forms
FormPulseEmbed.initMultiple(configs)

// Destroy embed
FormPulseEmbed.destroy(container)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React
- AI integration with Google Gemini
- Styled with Tailwind CSS

---

**FormPulse** - Transforming form creation with AI-powered intelligence and seamless integration capabilities.
