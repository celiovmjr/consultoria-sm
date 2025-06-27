
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BusinessManagement from "./pages/admin/BusinessManagement";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import ServicesManagement from "./pages/business/ServicesManagement";
import ProfessionalsManagement from "./pages/business/ProfessionalsManagement";
import AppointmentsManagement from "./pages/business/AppointmentsManagement";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import AppointmentHistory from "./pages/professional/AppointmentHistory";
import Unavailability from "./pages/professional/Unavailability";
import ProfessionalProfile from "./pages/professional/ProfessionalProfile";
import BusinessLanding from "./pages/client/BusinessLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/negocios" element={<BusinessManagement />} />
          
          {/* Business Owner Routes */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/servicos" element={<ServicesManagement />} />
          <Route path="/business/profissionais" element={<ProfessionalsManagement />} />
          <Route path="/business/agendamentos" element={<AppointmentsManagement />} />
          
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
