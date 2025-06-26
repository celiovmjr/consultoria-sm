
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Clock, TrendingUp, Scissors } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

const BusinessDashboard = () => {
  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: '24',
      change: '+3 vs ontem',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Profissionais Ativos',
      value: '8',
      change: '2 disponíveis agora',
      changeType: 'neutral',
      icon: Users,
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 12,450',
      change: '+18% vs mês anterior',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Taxa de Ocupação',
      value: '87%',
      change: '+5% vs semana anterior',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const todayAppointments = [
    { time: '09:00', client: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana Costa', status: 'Confirmado' },
    { time: '10:00', client: 'João Santos', service: 'Barba + Cabelo', professional: 'Carlos Lima', status: 'Em andamento' },
    { time: '11:30', client: 'Patricia Oliveira', service: 'Manicure', professional: 'Lucia Mendes', status: 'Aguardando' },
    { time: '14:00', client: 'Ricardo Silva', service: 'Corte Masculino', professional: 'Carlos Lima', status: 'Confirmado' },
  ];

  const topServices = [
    { name: 'Corte Feminino', bookings: 156, revenue: 'R$ 4,680' },
    { name: 'Barba + Cabelo', bookings: 98, revenue: 'R$ 2,940' },
    { name: 'Escova', bookings: 87, revenue: 'R$ 1,740' },
    { name: 'Manicure', bookings: 76, revenue: 'R$ 1,520' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard - Salão Bella Vista</h1>
            <p className="text-gray-600">Visão geral do seu negócio hoje</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Appointments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Agendamentos de Hoje
                </CardTitle>
                <CardDescription>
                  {todayAppointments.length} agendamentos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.time}</p>
                          <p className="text-sm text-gray-600">{appointment.client}</p>
                          <p className="text-xs text-gray-500">{appointment.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{appointment.professional}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scissors className="w-5 h-5 mr-2 text-purple-600" />
                  Serviços Mais Populares
                </CardTitle>
                <CardDescription>Este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.bookings} agendamentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{service.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Operações frequentes do seu negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="font-semibold text-gray-900">Novo Agendamento</p>
                    <p className="text-sm text-gray-600">Criar agendamento manual</p>
                  </button>
                  <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <Users className="w-8 h-8 text-green-600 mb-2" />
                    <p className="font-semibold text-gray-900">Adicionar Profissional</p>
                    <p className="text-sm text-gray-600">Cadastrar novo membro</p>
                  </button>
                  <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <Scissors className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="font-semibold text-gray-900">Novo Serviço</p>
                    <p className="text-sm text-gray-600">Adicionar serviço ao catálogo</p>
                  </button>
                  <button className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
                    <p className="font-semibold text-gray-900">Relatórios</p>
                    <p className="text-sm text-gray-600">Ver métricas detalhadas</p>
                  </button>
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
