import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SituationsPage from "./pages/SituationsPage";
import SituationDetailPage from "./pages/SituationDetailPage";
import QuizzesPage from "./pages/QuizzesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProgressPage from "./pages/ProgressPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import QuizDetailPage from "./pages/QuizDetailPage";
import ProfilePage from "./pages/ProfilePage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/situacoes" element={<SituationsPage />} />
            <Route path="/situacoes/:situationId" element={<SituationDetailPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quizzes/:quizId" element={<QuizDetailPage />} />
            <Route path="/recursos" element={<ResourcesPage />} />
            <Route path="/progresso" element={<ProgressPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/perfil" element={<ProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
