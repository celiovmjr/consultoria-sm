
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/negocios" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <BusinessManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/usuarios" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <UsersManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/planos" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <PlansManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/relatorios" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/configuracoes" element={
                <ProtectedRoute allowedRoles={['saas_admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Business Owner Routes */}
              <Route path="/negocio/dashboard" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <BusinessDashboard />
                </ProtectedRoute>
              } />
              <Route path="/negocio/agendamentos" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <AppointmentsManagement />
                </ProtectedRoute>
              } />
              <Route path="/negocio/profissionais" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <ProfessionalsManagement />
                </ProtectedRoute>
              } />
              <Route path="/negocio/servicos" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <ServicesManagement />
                </ProtectedRoute>
              } />
              <Route path="/negocio/lojas" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <StoresManagement />
                </ProtectedRoute>
              } />
              <Route path="/negocio/categorias" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <CategoriesManagement />
                </ProtectedRoute>
              } />
              <Route path="/negocio/landing" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <LandingCustomization />
                </ProtectedRoute>
              } />
              <Route path="/negocio/relatorios" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <BusinessReports />
                </ProtectedRoute>
              } />
              <Route path="/negocio/configuracoes" element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <BusinessSettings />
                </ProtectedRoute>
              } />
              
              {/* Professional Routes */}
              <Route path="/profissional/dashboard" element={
                <ProtectedRoute allowedRoles={['professional']}>
                  <ProfessionalDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profissional/perfil" element={
                <ProtectedRoute allowedRoles={['professional']}>
                  <ProfessionalProfile />
                </ProtectedRoute>
              } />
              <Route path="/profissional/historico" element={
                <ProtectedRoute allowedRoles={['professional']}>
                  <AppointmentHistory />
                </ProtectedRoute>
              } />
              <Route path="/profissional/indisponibilidade" element={
                <ProtectedRoute allowedRoles={['professional']}>
                  <Unavailability />
                </ProtectedRoute>
              } />
              
              {/* Client Routes */}
              <Route path="/cliente/:businessSlug" element={<BusinessLanding />} />
              
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
