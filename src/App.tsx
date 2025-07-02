
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BusinessManagement from "./pages/admin/BusinessManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import PlansManagement from "./pages/admin/PlansManagement";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/negocios" element={<BusinessManagement />} />
              <Route path="/admin/usuarios" element={<UsersManagement />} />
              <Route path="/admin/planos" element={<PlansManagement />} />
              <Route path="/admin/relatorios" element={<AdminReports />} />
              <Route path="/admin/configuracoes" element={<AdminSettings />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
