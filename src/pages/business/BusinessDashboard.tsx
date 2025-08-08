import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { useAppointments } from '@/hooks/useAppointments';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useServices } from '@/hooks/useServices';

const BusinessDashboard = () => {
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { professionals: professionalsData = [], loading: professionalsLoading } = useProfessionals();
  const { services, loading: servicesLoading } = useServices();

  const isLoading = appointmentsLoading || professionalsLoading || servicesLoading;

  // Calculate today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointment_date === today);
  
  // Calculate this month's revenue (mock calculation)
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyRevenue = appointments
    .filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate.getMonth() === thisMonth && 
             aptDate.getFullYear() === thisYear && 
             apt.status === 'completed';
    })
    .reduce((sum, apt) => {
      // Mock price calculation - in real app this would come from services table
      return sum + (apt.services?.price || 50);
    }, 0);

  // Calculate active clients (unique clients this month)
  const activeClients = new Set(
    appointments
      .filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear;
      })
      .map(apt => apt.client_email)
  ).size;

  // Calculate occupancy rate (mock calculation)
  const totalSlots = todayAppointments.length + 10; // Mock total available slots
  const occupancyRate = totalSlots > 0 ? Math.round((todayAppointments.length / totalSlots) * 100) : 0;

  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.length.toString(),
      change: '+3 desde ontem',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+15% vs mês anterior',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Clientes Ativos',
      value: activeClients.toString(),
      change: '+8 novos este mês',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: `${occupancyRate}%`,
      change: '+5% esta semana',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  // Get today's appointments with more details
  const todayAppointmentsDetailed = todayAppointments.map(apt => ({
    time: apt.appointment_date ? new Date(apt.appointment_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    client: apt.client_name,
    service: apt.services?.name || 'Serviço',
    professional: apt.professionals?.name || 'Profissional',
    status: apt.status
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'confirmed':
        return 'Confirmado';
      case 'scheduled':
        return 'Agendado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <BusinessSidebar />
      
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm md:text-base">Visão geral do seu negócio</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32 md:h-64">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="border-border bg-card">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                          </div>
                          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                      Agendamentos de Hoje
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {todayAppointmentsDetailed.length} agendamentos para hoje
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      {todayAppointmentsDetailed.length > 0 ? (
                        todayAppointmentsDetailed.map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex-shrink-0">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm md:text-base">{appointment.time}</div>
                                <div className="text-xs md:text-sm text-muted-foreground truncate">{appointment.client}</div>
                                <div className="text-xs text-muted-foreground truncate">{appointment.service} - {appointment.professional}</div>
                              </div>
                            </div>
                            <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                      Resumo Semanal
                    </CardTitle>
                    <CardDescription className="text-sm">Desempenho dos últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-medium">Agendamentos Realizados</span>
                        <span className="text-green-600 font-semibold text-sm md:text-base">
                          {appointments.filter(apt => apt.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-medium">Receita Gerada</span>
                        <span className="text-green-600 font-semibold text-sm md:text-base">
                          R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-medium">Novos Clientes</span>
                        <span className="text-blue-600 font-semibold text-sm md:text-base">{activeClients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-medium">Taxa de Comparecimento</span>
                        <span className="text-purple-600 font-semibold text-sm md:text-base">92%</span>
                      </div>
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

export default BusinessDashboard;