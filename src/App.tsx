
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailDetection from "./pages/EmailDetection";
import RoleSelection from "./pages/RoleSelection";
import TeamCreation from "./pages/TeamCreation";
import TeamSize from "./pages/TeamSize";
import Dashboard from "./pages/Dashboard";
import Studies from "./pages/Studies";
import NewStudy from "./pages/NewStudy";
import Analytics from "./pages/Analytics";
import StudyPreview from "./pages/StudyPreview";
import People from "./pages/People";
import Dashboards from "./pages/Dashboards";
import DataHub from "./pages/DataHub";
import Connect from "./pages/Connect";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-detection" element={<EmailDetection />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/team-creation" element={<TeamCreation />} />
            <Route path="/team-size" element={<TeamSize />} />
            <Route path="/study/:studyId/preview" element={<StudyPreview />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/studies" element={
              <ProtectedRoute>
                <Studies />
              </ProtectedRoute>
            } />
            <Route path="/new-study" element={
              <ProtectedRoute>
                <NewStudy />
              </ProtectedRoute>
            } />
            <Route path="/analytics/:studyId" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/people" element={
              <ProtectedRoute>
                <People />
              </ProtectedRoute>
            } />
            <Route path="/dashboards" element={
              <ProtectedRoute>
                <Dashboards />
              </ProtectedRoute>
            } />
            <Route path="/data-hub" element={
              <ProtectedRoute>
                <DataHub />
              </ProtectedRoute>
            } />
            <Route path="/connect" element={
              <ProtectedRoute>
                <Connect />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
