
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BusinessManagement from "./pages/admin/BusinessManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import PlansManagement from "./pages/admin/PlansManagement";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import ServicesManagement from "./pages/business/ServicesManagement";
import CategoriesManagement from "./pages/business/CategoriesManagement";
import ProfessionalsManagement from "./pages/business/ProfessionalsManagement";
import AppointmentsManagement from "./pages/business/AppointmentsManagement";
import StoresManagement from "./pages/business/StoresManagement";
import LandingCustomization from "./pages/business/LandingCustomization";
import BusinessReports from "./pages/business/BusinessReports";
import BusinessSettings from "./pages/business/BusinessSettings";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import AppointmentHistory from "./pages/professional/AppointmentHistory";
import Unavailability from "./pages/professional/Unavailability";
import ProfessionalProfile from "./pages/professional/ProfessionalProfile";
import BusinessLanding from "./pages/client/BusinessLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="/business/servicos" element={<ServicesManagement />} />
              <Route path="/business/categorias" element={<CategoriesManagement />} />
              <Route path="/business/profissionais" element={<ProfessionalsManagement />} />
              <Route path="/business/agendamentos" element={<AppointmentsManagement />} />
              <Route path="/business/lojas" element={<StoresManagement />} />
              <Route path="/business/landing" element={<LandingCustomization />} />
              <Route path="/business/relatorios" element={<BusinessReports />} />
              <Route path="/business/configuracoes" element={<BusinessSettings />} />
              
              {/* Professional Routes */}
              <Route path="/professional/agenda" element={<ProfessionalDashboard />} />
              <Route path="/professional/historico" element={<AppointmentHistory />} />
              <Route path="/professional/indisponibilidades" element={<Unavailability />} />
              <Route path="/professional/perfil" element={<ProfessionalProfile />} />
              
              {/* Client Routes */}
              <Route path="/business/:slug" element={<BusinessLanding />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
