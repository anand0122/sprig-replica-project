import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import EnhancedFormBuilder from './pages/EnhancedFormBuilder';
import Forms from './pages/Forms';
import PublicForm from './pages/PublicForm';
import QuizBuilder from './pages/QuizBuilder';
import QuizTaker from './pages/QuizTaker';
import Analytics from './pages/Analytics';
import FormAnalytics from './pages/FormAnalytics';
import QuizAnalytics from './pages/QuizAnalytics';
import Responses from './pages/Responses';
import Settings from './pages/Settings';
import CreateForm from './pages/CreateForm';
import FormEmbed from './pages/FormEmbed';
import EmbeddedForm from './pages/EmbeddedForm';
import LandingPage from './pages/LandingPage';
import Pricing from './pages/Pricing';
import Integrations from './pages/Integrations';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Public Form Routes */}
          <Route path="/form/:id" element={<PublicForm />} />
          <Route path="/quiz/:id" element={<QuizTaker />} />
          <Route path="/embed/:id" element={<EmbeddedForm />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Form Management */}
          <Route path="/forms" element={
            <ProtectedRoute>
              <Forms />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateForm />
            </ProtectedRoute>
          } />
          <Route path="/forms/new" element={
            <ProtectedRoute>
              <CreateForm />
            </ProtectedRoute>
          } />
          <Route path="/forms/new/edit" element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/forms/:id/edit" element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/forms/:id/enhanced" element={
            <ProtectedRoute>
              <EnhancedFormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/forms/:id/analytics" element={
            <ProtectedRoute>
              <FormAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/forms/:id/responses" element={
            <ProtectedRoute>
              <Responses />
            </ProtectedRoute>
          } />
          <Route path="/forms/:id/embed" element={
            <ProtectedRoute>
              <FormEmbed />
            </ProtectedRoute>
          } />
          
          {/* Quiz Management */}
          <Route path="/quiz/new" element={
            <ProtectedRoute>
              <QuizBuilder />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:id/edit" element={
            <ProtectedRoute>
              <QuizBuilder />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:id/analytics" element={
            <ProtectedRoute>
              <QuizAnalytics />
            </ProtectedRoute>
          } />
          
          {/* Analytics & Reports */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/responses" element={
            <ProtectedRoute>
              <Responses />
            </ProtectedRoute>
          } />
          
          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Integrations */}
          <Route path="/integrations" element={
            <ProtectedRoute>
              <Integrations />
            </ProtectedRoute>
          } />
          
          {/* Blog */}
          <Route path="/blog" element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
