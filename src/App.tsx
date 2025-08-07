
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BusinessManagement from "./pages/admin/BusinessManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import PlansManagement from "./pages/admin/PlansManagement";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessReports from "./pages/business/BusinessReports";
import BusinessSettings from "./pages/business/BusinessSettings";
import AppointmentsManagement from "./pages/business/AppointmentsManagement";
import ProfessionalsManagement from "./pages/business/ProfessionalsManagement";
import ServicesManagement from "./pages/business/ServicesManagement";
import StoresManagement from "./pages/business/StoresManagement";
import CategoriesManagement from "./pages/business/CategoriesManagement";
import LandingCustomization from "./pages/business/LandingCustomization";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalProfile from "./pages/professional/ProfessionalProfile";
import AppointmentHistory from "./pages/professional/AppointmentHistory";
import Unavailability from "./pages/professional/Unavailability";
import BusinessLanding from "./pages/client/BusinessLanding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/negocios" element={<BusinessManagement />} />
              <Route path="/admin/usuarios" element={<UsersManagement />} />
              <Route path="/admin/planos" element={<PlansManagement />} />
              <Route path="/admin/relatorios" element={<AdminReports />} />
              <Route path="/admin/configuracoes" element={<AdminSettings />} />
              
              {/* Business Owner Routes */}
              <Route path="/negocio/dashboard" element={<BusinessDashboard />} />
              <Route path="/negocio/agendamentos" element={<AppointmentsManagement />} />
              <Route path="/negocio/profissionais" element={<ProfessionalsManagement />} />
              <Route path="/negocio/servicos" element={<ServicesManagement />} />
              <Route path="/negocio/lojas" element={<StoresManagement />} />
              <Route path="/negocio/categorias" element={<CategoriesManagement />} />
              <Route path="/negocio/landing" element={<LandingCustomization />} />
              <Route path="/negocio/relatorios" element={<BusinessReports />} />
              <Route path="/negocio/configuracoes" element={<BusinessSettings />} />
              
              {/* Professional Routes */}
              <Route path="/profissional/dashboard" element={<ProfessionalDashboard />} />
              <Route path="/profissional/perfil" element={<ProfessionalProfile />} />
              <Route path="/profissional/historico" element={<AppointmentHistory />} />
              <Route path="/profissional/indisponibilidade" element={<Unavailability />} />
              
              {/* Client Routes */}
              <Route path="/cliente/:businessSlug" element={<BusinessLanding />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
