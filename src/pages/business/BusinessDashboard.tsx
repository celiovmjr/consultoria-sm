
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

const BusinessDashboard = () => {
  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: '24',
      change: '+3 desde ontem',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Receita do Mês',
      value: 'R$ 12.450',
      change: '+15% vs mês anterior',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Clientes Ativos',
      value: '142',
      change: '+8 novos este mês',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: '85%',
      change: '+5% esta semana',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const todayAppointments = [
    { time: '09:00', client: 'Ana Silva', service: 'Corte Feminino', professional: 'Maria', status: 'confirmed' },
    { time: '10:30', client: 'João Santos', service: 'Barba', professional: 'Carlos', status: 'completed' },
    { time: '11:00', client: 'Patricia Lima', service: 'Escova', professional: 'Ana', status: 'in-progress' },
    { time: '14:00', client: 'Roberto Costa', service: 'Corte Masculino', professional: 'João', status: 'confirmed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'confirmed':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em andamento';
      case 'confirmed':
        return 'Confirmado';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.change}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Agendamentos de Hoje
                </CardTitle>
                <CardDescription>
                  {todayAppointments.length} agendamentos para hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.time}</div>
                          <div className="text-sm text-gray-600">{appointment.client}</div>
                          <div className="text-sm text-gray-500">{appointment.service} - {appointment.professional}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Resumo Semanal
                </CardTitle>
                <CardDescription>Desempenho dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Agendamentos Realizados</span>
                    <span className="text-green-600 font-semibold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Receita Gerada</span>
                    <span className="text-green-600 font-semibold">R$ 8.750</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Novos Clientes</span>
                    <span className="text-blue-600 font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Comparecimento</span>
                    <span className="text-purple-600 font-semibold">92%</span>
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

export default BusinessDashboard;
