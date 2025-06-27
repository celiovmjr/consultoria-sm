
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Building, Users, TrendingUp, DollarSign } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total de Negócios',
      value: '1,247',
      change: '+12.3%',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Usuários Ativos',
      value: '8,932',
      change: '+8.1%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.2K',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Crescimento',
      value: '23.4%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Visão geral da plataforma</p>
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
                        <p className="text-sm text-green-600">{stat.change}</p>
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
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Atividade Recente
                </CardTitle>
                <CardDescription>Últimas atividades na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Novo negócio cadastrado: Salão Bella Vista</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">125 novos usuários registrados hoje</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Pagamento processado: R$ 2.450,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Negócios</CardTitle>
                <CardDescription>Negócios com mais agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Salão Bella Vista</span>
                    <span className="text-green-600">342 agendamentos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Barbearia do João</span>
                    <span className="text-green-600">298 agendamentos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Studio Hair</span>
                    <span className="text-green-600">187 agendamentos</span>
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
