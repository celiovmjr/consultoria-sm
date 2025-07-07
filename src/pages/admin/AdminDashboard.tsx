import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, CheckCircle, CreditCard, File, Loader2, MessageSquare, PlusCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useUsers } from '@/hooks/useUsers';
import { useAppointments } from '@/hooks/useAppointments';
import { usePlans } from '@/hooks/usePlans';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const totalAppointments = appointments.length;

  // Get most popular plan
  const mostPopularPlan = plans.reduce((prev, current) => 
    (prev.subscribers_count > current.subscribers_count) ? prev : current, 
    plans[0] || { name: 'Premium', subscribers_count: 0 }
  );

  // Calculate percentage for most popular plan
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers_count, 0);
  const popularPlanPercentage = totalSubscribers > 0 
    ? Math.round((mostPopularPlan.subscribers_count / totalSubscribers) * 100)
    : 0;

  // Get recent businesses (last 5)
  const recentBusinesses = businesses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground text-sm md:text-base">Visão geral da plataforma e métricas principais</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32 md:h-64">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Total de Negócios</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalBusinesses}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activeBusinesses} ativos</p>
                      </div>
                      <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Total de Usuários</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalUsers}</p>
                        <p className="text-xs text-green-600 mt-1">+8% vs mês anterior</p>
                      </div>
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Plano Mais Popular</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{mostPopularPlan?.name || 'Premium'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{popularPlanPercentage}% dos usuários</p>
                      </div>
                      <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Novos Agendamentos</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalAppointments}</p>
                        <p className="text-xs text-green-600 mt-1">+15% vs semana anterior</p>
                      </div>
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Business and Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground text-lg">
                      <Building className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                      Negócios Recentes
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      Últimos negócios cadastrados na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      {recentBusinesses.length > 0 ? (
                        recentBusinesses.map((business) => (
                          <div key={business.id} className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-foreground text-sm md:text-base truncate">{business.name}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{business.owner}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(business.created_at)}</p>
                            </div>
                            <Badge variant={business.status === 'active' ? 'default' : 'secondary'} className="ml-2 text-xs">
                              {business.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Nenhum negócio cadastrado ainda</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground text-lg">
                      <PlusCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                      Ações Rápidas
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      Ações importantes para gerenciar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <Link to="/admin/usuarios">
                        <Button 
                          variant="outline" 
                          className="w-full h-auto p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 border-blue-200 dark:border-blue-800"
                        >
                          <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                          <span className="text-foreground text-sm md:text-base">Gerenciar Usuários</span>
                        </Button>
                      </Link>
                      
                      <Link to="/admin/relatorios">
                        <Button 
                          variant="outline" 
                          className="w-full h-auto p-3 md:p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30 border-green-200 dark:border-green-800"
                        >
                          <File className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                          <span className="text-foreground text-sm md:text-base">Criar Relatório</span>
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-3 md:p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-800/30 border-orange-200 dark:border-orange-800"
                        onClick={() => {
                          // Implementar funcionalidade de notificação
                          alert('Funcionalidade de notificação em desenvolvimento');
                        }}
                      >
                        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2 text-orange-600" />
                        <span className="text-foreground text-sm md:text-base">Enviar Notificação</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30 border-purple-200 dark:border-purple-800"
                        onClick={() => {
                          // Implementar verificação de pagamentos
                          alert('Verificação de pagamentos em desenvolvimento');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
                        <span className="text-foreground text-sm md:text-base">Verificar Pagamentos</span>
                      </Button>
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