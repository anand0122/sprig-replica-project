
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EmailDetection from "./pages/EmailDetection";
import RoleSelection from "./pages/RoleSelection";
import TeamCreation from "./pages/TeamCreation";
import TeamSize from "./pages/TeamSize";
import Dashboard from "./pages/Dashboard";
import Studies from "./pages/Studies";
import NewStudy from "./pages/NewStudy";
import People from "./pages/People";
import Dashboards from "./pages/Dashboards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/email-detection" element={<EmailDetection />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/team-creation" element={<TeamCreation />} />
          <Route path="/team-size" element={<TeamSize />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/new-study" element={<NewStudy />} />
          <Route path="/people" element={<People />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
