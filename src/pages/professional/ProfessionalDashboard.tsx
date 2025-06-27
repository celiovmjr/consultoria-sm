
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
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Minha Agenda</h1>
            <p className="text-gray-600">Gerencie seus agendamentos de hoje</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.subtitle}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Today's Appointments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Agendamentos de Hoje
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{appointment.time}</span>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">{appointment.client}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.service} • {appointment.duration} min • R$ {appointment.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {appointment.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <div className="text-green-600 font-medium">
                          ✓ Serviço Concluído
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {todayAppointments.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum agendamento para hoje</p>
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
