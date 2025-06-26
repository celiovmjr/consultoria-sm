
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, CreditCard, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total de Negócios',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Building,
    },
    {
      title: 'Usuários Ativos',
      value: '8,932',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 87,430',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Agendamentos Hoje',
      value: '2,156',
      change: '+3%',
      changeType: 'positive',
      icon: Calendar,
    },
  ];

  const recentBusinesses = [
    { name: 'Salão Bella Vista', owner: 'Maria Silva', plan: 'Professional', status: 'Ativo' },
    { name: 'Barbearia do João', owner: 'João Santos', plan: 'Starter', status: 'Ativo' },
    { name: 'Estética Ana Costa', owner: 'Ana Costa', plan: 'Enterprise', status: 'Pendente' },
    { name: 'Studio Hair', owner: 'Carlos Lima', plan: 'Professional', status: 'Ativo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Visão geral da plataforma SAAS</p>
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
                        <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} vs mês anterior
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
            {/* Recent Businesses */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Negócios Recentes
                </CardTitle>
                <CardDescription>Últimos estabelecimentos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBusinesses.map((business, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{business.name}</p>
                        <p className="text-sm text-gray-600">{business.owner}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{business.plan}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          business.status === 'Ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {business.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart Placeholder */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Crescimento da Receita
                </CardTitle>
                <CardDescription>Evolução mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de crescimento</p>
                    <p className="text-sm text-gray-500">Em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Operações frequentes da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Building className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="font-semibold text-gray-900">Criar Negócio</p>
                    <p className="text-sm text-gray-600">Adicionar novo estabelecimento</p>
                  </button>
                  <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <CreditCard className="w-8 h-8 text-green-600 mb-2" />
                    <p className="font-semibold text-gray-900">Gerenciar Planos</p>
                    <p className="text-sm text-gray-600">Configurar preços e recursos</p>
                  </button>
                  <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="font-semibold text-gray-900">Suporte a Usuários</p>
                    <p className="text-sm text-gray-600">Atender solicitações</p>
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

export default AdminDashboard;
