
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Building, Download, Calendar } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

const AdminReports = () => {
  const platformRevenue = [
    { month: 'Jan', revenue: 45000, businesses: 120 },
    { month: 'Fev', revenue: 52000, businesses: 135 },
    { month: 'Mar', revenue: 48000, businesses: 128 },
    { month: 'Abr', revenue: 61000, businesses: 145 },
    { month: 'Mai', revenue: 68000, businesses: 158 },
    { month: 'Jun', revenue: 75000, businesses: 172 },
  ];

  const planDistribution = [
    { name: 'Básico', value: 60, color: '#8884d8' },
    { name: 'Premium', value: 30, color: '#82ca9d' },
    { name: 'Enterprise', value: 10, color: '#ffc658' },
  ];

  const businessGrowth = [
    { month: 'Jan', new: 15, churned: 3 },
    { month: 'Fev', new: 22, churned: 5 },
    { month: 'Mar', new: 18, churned: 7 },
    { month: 'Abr', new: 28, churned: 4 },
    { month: 'Mai', new: 32, churned: 6 },
    { month: 'Jun', new: 25, churned: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios da Plataforma</h1>
              <p className="text-gray-600">Análise completa do desempenho da plataforma</p>
            </div>
            <div className="flex space-x-4">
              <Select defaultValue="month">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ 75.2K</p>
                    <p className="text-sm text-green-600">+18% vs mês anterior</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Negócios Ativos</p>
                    <p className="text-2xl font-bold text-blue-600">172</p>
                    <p className="text-sm text-blue-600">+9% vs mês anterior</p>
                  </div>
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
                    <p className="text-2xl font-bold text-purple-600">8,952</p>
                    <p className="text-sm text-purple-600">+15% vs mês anterior</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Crescimento</p>
                    <p className="text-2xl font-bold text-orange-600">+18.5%</p>
                    <p className="text-sm text-orange-600">vs mês anterior</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Receita da Plataforma</CardTitle>
                <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={platformRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
                <CardDescription>Planos mais populares</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Crescimento de Negócios</CardTitle>
              <CardDescription>Novos negócios vs. cancelamentos por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={businessGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="new" fill="#82ca9d" name="Novos" />
                  <Bar dataKey="churned" fill="#ff7300" name="Cancelados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
