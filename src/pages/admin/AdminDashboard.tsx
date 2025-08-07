import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, CheckCircle, CreditCard, File, Loader2, MessageSquare, PlusCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useUsers } from '@/hooks/useUsers';
import { useAppointments } from '@/hooks/useAppointments';
import { usePlans } from '@/hooks/usePlans';
import { useBusinessesByPlan } from '@/hooks/useBusinessesByPlan';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: businessesByPlan = {}, isLoading: businessesByPlanLoading } = useBusinessesByPlan();

  const isLoading = businessesLoading || usersLoading || appointmentsLoading || plansLoading || businessesByPlanLoading;

  // Calculate metrics
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const totalUsers = users.length;
  const totalAppointments = appointments.length;

  // Get most popular plan based on actual subscriber count
  const plansWithRealCounts = plans.map(plan => ({
    ...plan,
    real_subscribers_count: businessesByPlan[plan.name] || 0
  }));

  const mostPopularPlan = plansWithRealCounts.reduce((prev, current) => 
    (prev.real_subscribers_count > current.real_subscribers_count) ? prev : current, 
    plansWithRealCounts[0] || { name: 'Premium', real_subscribers_count: 0 }
  );

  // Calculate percentage for most popular plan
  const totalRealSubscribers = Object.values(businessesByPlan).reduce((sum, count) => sum + count, 0);
  const popularPlanPercentage = totalRealSubscribers > 0 
    ? Math.round((mostPopularPlan.real_subscribers_count / totalRealSubscribers) * 100)
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
                <Card className="bg-gradient-card hover-lift border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Total de Negócios</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalBusinesses}</p>
                        <p className="text-xs text-success mt-1">{activeBusinesses} ativos</p>
                      </div>
                      <div className="p-3 rounded-full bg-info/10">
                        <Building className="w-6 h-6 md:w-8 md:h-8 text-info" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card hover-lift border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Total de Usuários</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalUsers}</p>
                        <p className="text-xs text-success mt-1">+8% vs mês anterior</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card hover-lift border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Plano Mais Popular</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{mostPopularPlan?.name || 'Premium'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{popularPlanPercentage}% dos usuários</p>
                      </div>
                      <div className="p-3 rounded-full bg-warning/10">
                        <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card hover-lift border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Novos Agendamentos</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{totalAppointments}</p>
                        <p className="text-xs text-success mt-1">+15% vs semana anterior</p>
                      </div>
                      <div className="p-3 rounded-full bg-success/10">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Business and Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground text-lg">
                      <Building className="w-4 h-4 md:w-5 md:h-5 mr-2 text-info" />
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
                          <div key={business.id} className="flex items-center justify-between p-3 md:p-4 bg-muted/50 rounded-lg transition-smooth hover:bg-muted/70 border border-border/50">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-foreground text-sm md:text-base truncate">{business.name}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">Status: {business.status}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(business.created_at)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant={business.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {business.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{business.plan}</span>
                            </div>
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

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground text-lg">
                      <PlusCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-success" />
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
                          className="w-full h-auto p-3 md:p-4 bg-info/10 hover:bg-info/20 border-info/20 transition-smooth hover-glow group"
                        >
                          <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-info group-hover:scale-110 transition-transform" />
                          <span className="text-foreground text-sm md:text-base">Gerenciar Usuários</span>
                        </Button>
                      </Link>
                      
                      <Link to="/admin/relatorios">
                        <Button 
                          variant="outline" 
                          className="w-full h-auto p-3 md:p-4 bg-success/10 hover:bg-success/20 border-success/20 transition-smooth hover-glow group"
                        >
                          <File className="w-4 h-4 md:w-5 md:h-5 mr-2 text-success group-hover:scale-110 transition-transform" />
                          <span className="text-foreground text-sm md:text-base">Criar Relatório</span>
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-3 md:p-4 bg-warning/10 hover:bg-warning/20 border-warning/20 transition-smooth hover-glow group"
                        onClick={() => {
                          alert('Funcionalidade de notificação em desenvolvimento');
                        }}
                      >
                        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2 text-warning group-hover:scale-110 transition-transform" />
                        <span className="text-foreground text-sm md:text-base">Enviar Notificação</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-3 md:p-4 bg-primary/10 hover:bg-primary/20 border-primary/20 transition-smooth hover-glow group"
                        onClick={() => {
                          alert('Verificação de pagamentos em desenvolvimento');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
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