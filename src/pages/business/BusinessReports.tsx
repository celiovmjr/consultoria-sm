
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Calendar, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

const BusinessReports = () => {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 8500, appointments: 120 },
    { month: 'Fev', revenue: 9200, appointments: 135 },
    { month: 'Mar', revenue: 11800, appointments: 158 },
    { month: 'Abr', revenue: 10500, appointments: 142 },
    { month: 'Mai', revenue: 12400, appointments: 168 },
    { month: 'Jun', revenue: 13200, appointments: 185 },
  ];

  const servicesByCategory = [
    { name: 'Cabelos', value: 45, color: '#8884d8' },
    { name: 'Unhas', value: 25, color: '#82ca9d' },
    { name: 'Estética', value: 20, color: '#ffc658' },
    { name: 'Massagem', value: 10, color: '#ff7c7c' },
  ];

  const professionalPerformance = [
    { name: 'Ana Costa', appointments: 68, revenue: 3400, commission: 2040 },
    { name: 'Carlos Lima', appointments: 55, revenue: 2750, commission: 1650 },
    { name: 'Lucia Mendes', appointments: 42, revenue: 2100, commission: 1260 },
    { name: 'Pedro Silva', appointments: 38, revenue: 1900, commission: 1140 },
  ];

  const topServices = [
    { service: 'Corte Feminino', bookings: 156, revenue: 7020 },
    { service: 'Barba + Cabelo', bookings: 98, revenue: 4900 },
    { service: 'Manicure', bookings: 87, revenue: 2175 },
    { service: 'Escova', bookings: 76, revenue: 1900 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600">Acompanhe o desempenho do seu negócio</p>
            </div>
            
            <div className="flex space-x-3">
              <Select defaultValue="30">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 3 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="professionals">Profissionais</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Faturamento Mensal</p>
                        <p className="text-2xl font-bold text-gray-900">R$ 13,200</p>
                        <p className="text-sm text-green-600">+12% vs mês anterior</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                        <p className="text-2xl font-bold text-gray-900">185</p>
                        <p className="text-sm text-green-600">+8% vs mês anterior</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">142</p>
                        <p className="text-sm text-green-600">+15% vs mês anterior</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Taxa de Ocupação</p>
                        <p className="text-2xl font-bold text-gray-900">87%</p>
                        <p className="text-sm text-green-600">+3% vs mês anterior</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Faturamento Mensal</CardTitle>
                    <CardDescription>Evolução dos últimos 6 meses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                        <Bar dataKey="revenue" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Serviços por Categoria</CardTitle>
                    <CardDescription>Distribuição dos agendamentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={servicesByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {servicesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Evolução Financeira</CardTitle>
                  <CardDescription>Faturamento vs Agendamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                      <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professionals" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance dos Profissionais</CardTitle>
                  <CardDescription>Agendamentos e comissões do mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {professionalPerformance.map((prof, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{prof.name}</p>
                            <p className="text-sm text-gray-600">{prof.appointments} agendamentos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">R$ {prof.revenue.toFixed(2)}</p>
                          <p className="text-sm text-green-600">Comissão: R$ {prof.commission.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Serviços Mais Populares</CardTitle>
                  <CardDescription>Ranking de agendamentos e faturamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.service}</p>
                            <p className="text-sm text-gray-600">{service.bookings} agendamentos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">R$ {service.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BusinessReports;
