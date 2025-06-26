
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';

const ProfessionalDashboard = () => {
  const todayStats = {
    total: 8,
    completed: 5,
    pending: 2,
    cancelled: 1,
  };

  const todayAppointments = [
    { 
      time: '09:00', 
      client: 'Maria Silva', 
      service: 'Corte + Escova', 
      duration: '90 min',
      status: 'completed',
      phone: '(11) 99999-9999'
    },
    { 
      time: '10:30', 
      client: 'Ana Costa', 
      service: 'Coloração', 
      duration: '120 min',
      status: 'completed',
      phone: '(11) 88888-8888'
    },
    { 
      time: '13:00', 
      client: 'Patricia Oliveira', 
      service: 'Corte', 
      duration: '60 min',
      status: 'confirmed',
      phone: '(11) 77777-7777'
    },
    { 
      time: '14:30', 
      client: 'Juliana Santos', 
      service: 'Escova', 
      duration: '45 min',
      status: 'confirmed',
      phone: '(11) 66666-6666'
    },
    { 
      time: '16:00', 
      client: 'Carla Lima', 
      service: 'Manicure', 
      duration: '30 min',
      status: 'no-show',
      phone: '(11) 55555-5555'
    },
  ];

  const upcomingDays = [
    { date: '23/12', day: 'Segunda', appointments: 6 },
    { date: '24/12', day: 'Terça', appointments: 4 },
    { date: '25/12', day: 'Quarta', appointments: 0 },
    { date: '26/12', day: 'Quinta', appointments: 8 },
  ];

  const handleStatusChange = (appointmentIndex: number, newStatus: string) => {
    console.log(`Changing appointment ${appointmentIndex} status to ${newStatus}`);
    // Aqui seria implementada a lógica para alterar o status
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'no-show':
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
      case 'no-show':
        return 'Não compareceu';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Olá, Ana Costa!</h1>
            <p className="text-gray-600">Sua agenda para hoje - 22 de Dezembro</p>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hoje</p>
                    <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-blue-600">{todayStats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Não compareceu</p>
                    <p className="text-2xl font-bold text-red-600">{todayStats.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Agendamentos de Hoje
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus atendimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAppointments.map((appointment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{appointment.time} - {appointment.client}</p>
                              <p className="text-sm text-gray-600">{appointment.service}</p>
                              <p className="text-xs text-gray-500">Duração: {appointment.duration}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        {appointment.status === 'confirmed' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(index, 'completed')}
                            >
                              Marcar como Concluído
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusChange(index, 'no-show')}
                            >
                              Não Compareceu
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Days */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Próximos Dias
                  </CardTitle>
                  <CardDescription>
                    Visão da semana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDays.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{day.day}</p>
                          <p className="text-sm text-gray-600">{day.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{day.appointments}</p>
                          <p className="text-xs text-gray-500">agendamentos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Marcar Indisponibilidade
                  </Button>
                  <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Ver Histórico de Clientes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
