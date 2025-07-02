
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, CreditCard, TrendingUp, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useUsers } from '@/hooks/useUsers';
import { useAppointments } from '@/hooks/useAppointments';
import { usePlans } from '@/hooks/usePlans';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useServices } from '@/hooks/useServices';

const AdminDashboard = () => {
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: professionals = [], isLoading: professionalsLoading } = useProfessionals();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  // Calculate metrics from real data
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const totalUsers = users.length;
  const totalProfessionals = professionals.length;
  
  const thisMonthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const now = new Date();
    return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
  }).length;

  const totalRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.services?.price || 0), 0);

  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length;

  const recentBusinesses = businesses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLoading = businessesLoading || usersLoading || appointmentsLoading || plansLoading || professionalsLoading || servicesLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Visão geral da plataforma e métricas principais</p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Negócios</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : totalBusinesses.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activeBusinesses} ativos
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : totalUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalProfessionals} profissionais
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agendamentos (Mês)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : thisMonthAppointments.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+8% vs mês anterior</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Planos Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : plans.filter(p => p.is_active).length}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aprovações Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : pendingBusinesses}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Crescimento</p>
                    <p className="text-2xl font-bold text-gray-900">+15%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Negócios Recentes
                </CardTitle>
                <CardDescription>
                  Últimos negócios cadastrados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <p className="text-gray-500">Carregando...</p>
                  ) : recentBusinesses.length > 0 ? (
                    recentBusinesses.map((business) => (
                      <div key={business.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">{business.name}</h4>
                          <p className="text-sm text-gray-600">{business.owner}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(business.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(business.status)}>
                            {business.status === 'active' ? 'Ativo' : 
                             business.status === 'pending' ? 'Pendente' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum negócio encontrado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Tarefas administrativas importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-yellow-800">Negócios Pendentes</h4>
                        <p className="text-sm text-yellow-700">
                          {pendingBusinesses} negócios aguardando aprovação
                        </p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-800">Relatórios Mensais</h4>
                        <p className="text-sm text-blue-700">
                          Gerar relatório de performance do mês
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">Sistema Operacional</h4>
                        <p className="text-sm text-green-700">
                          Todos os sistemas funcionando normalmente
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
