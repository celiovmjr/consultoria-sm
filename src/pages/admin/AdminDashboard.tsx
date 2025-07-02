import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, CheckCircle, CreditCard, File, Loader2, MessageSquare, PlusCircle, Users } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useUsers } from '@/hooks/useUsers';
import { useAppointments } from '@/hooks/useAppointments';
import { usePlans } from '@/hooks/usePlans';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: plans = [], isLoading: plansLoading } = usePlans();

  const isLoading = businessesLoading || usersLoading || appointmentsLoading || plansLoading;

  // Calculate metrics
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const totalUsers = users.length;

  // Get recent businesses
  const recentBusinesses = businesses.slice(0, 5);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Administrativo</h1>
            <p className="text-gray-600 dark:text-gray-300">Visão geral da plataforma e métricas principais</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Negócios</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBusinesses}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activeBusinesses} ativos</p>
                      </div>
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Usuários</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
                        <p className="text-xs text-green-600 mt-1">+8% vs mês anterior</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Plano Mais Popular</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Premium</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">72% dos usuários</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Novos Agendamentos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">325</p>
                        <p className="text-xs text-green-600 mt-1">+15% vs semana anterior</p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Business and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900 dark:text-white">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      Negócios Recentes
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Últimos negócios cadastrados na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBusinesses.map((business) => (
                        <div key={business.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{business.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{business.owner}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(business.created_at)}</p>
                          </div>
                          <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                            {business.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900 dark:text-white">
                      <PlusCircle className="w-5 h-5 mr-2 text-green-600" />
                      Ações Rápidas
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Ações importantes para gerenciar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        Gerenciar Usuários
                      </button>
                      <button className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
                        <File className="w-5 h-5 mr-2 text-green-600" />
                        Criar Relatório
                      </button>
                      <button className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
                        <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                        Enviar Notificação
                      </button>
                      <button className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
                        <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                        Verificar Pagamentos
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
