
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, User, CheckCircle, X } from 'lucide-react';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';
import { useToast } from '@/hooks/use-toast';

interface TodayAppointment {
  id: string;
  time: string;
  client: string;
  service: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}

const ProfessionalDashboard = () => {
  const { toast } = useToast();
  
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([
    {
      id: '1',
      time: '09:00',
      client: 'Ana Silva',
      service: 'Corte Feminino',
      duration: 60,
      price: 45.00,
      status: 'confirmed'
    },
    {
      id: '2',
      time: '10:30',
      client: 'Maria Santos',
      service: 'Coloração',
      duration: 120,
      price: 85.00,
      status: 'confirmed'
    },
    {
      id: '3',
      time: '14:00',
      client: 'Patricia Lima',
      service: 'Escova',
      duration: 45,
      price: 35.00,
      status: 'completed'
    },
    {
      id: '4',
      time: '15:30',
      client: 'Carla Oliveira',
      service: 'Corte + Escova',
      duration: 90,
      price: 65.00,
      status: 'confirmed'
    }
  ]);

  const handleStatusChange = (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    setTodayAppointments(appointments => 
      appointments.map(appointment =>
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    
    const statusText = newStatus === 'completed' ? 'concluído' : 'cancelado';
    toast({
      title: "Status atualizado",
      description: `Agendamento marcado como ${statusText}.`,
    });
  };

  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.length.toString(),
      subtitle: `${todayAppointments.filter(a => a.status === 'completed').length} concluídos`,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Receita do Dia',
      value: `R$ ${todayAppointments.filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + a.price, 0).toFixed(2)}`,
      subtitle: 'Comissão: 60%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Próximo Cliente',
      value: todayAppointments.find(a => a.status === 'confirmed')?.time || 'Nenhum',
      subtitle: todayAppointments.find(a => a.status === 'confirmed')?.client || '',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Minha Agenda</h1>
            <p className="text-muted-foreground text-sm md:text-base">Gerencie seus agendamentos de hoje</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="bg-gradient-card hover-lift border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Today's Appointments */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground text-lg">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                Agendamentos de Hoje
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 md:p-4 bg-muted/50 rounded-lg transition-smooth hover:bg-muted/70 border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex-shrink-0">
                          <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-base md:text-lg font-semibold text-foreground">{appointment.time}</span>
                            <Badge className={`${getStatusColor(appointment.status)} text-xs w-fit`}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <User className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="font-medium text-sm md:text-base">{appointment.client}</span>
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {appointment.service} • {appointment.duration} min • R$ {appointment.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {appointment.status === 'confirmed' && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                            className="bg-success hover:bg-success/90 transition-smooth hover-glow text-xs md:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 transition-smooth text-xs md:text-sm"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <div className="text-success font-medium text-sm md:text-base flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Serviço Concluído
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {todayAppointments.length === 0 && (
                  <div className="text-center py-8 md:py-12">
                    <Calendar className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Nenhum agendamento para hoje
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Você está livre hoje! Aproveite o tempo livre.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
