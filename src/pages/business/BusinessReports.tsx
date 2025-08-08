
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { useAppointments } from '@/hooks/useAppointments';

const BusinessReports = () => {
  const { data: appointments = [], isLoading } = useAppointments();

  const monthsPT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const now = new Date();

  // Monthly revenue for last 6 months from completed appointments
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const keyMonth = date.getMonth();
    const keyYear = date.getFullYear();
    const revenue = appointments.reduce((sum: number, apt: any) => {
      if (!apt.appointment_date) return sum;
      const d = new Date(apt.appointment_date);
      const isSameMonth = d.getMonth() === keyMonth && d.getFullYear() === keyYear;
      return isSameMonth && apt.status === 'completed'
        ? sum + Number(apt.services?.price ?? 0)
        : sum;
    }, 0);
    return { month: monthsPT[keyMonth], revenue };
  });

  // Service distribution
  const serviceCount: Record<string, number> = {};
  appointments.forEach((apt: any) => {
    const name = apt.services?.name || 'Outros';
    serviceCount[name] = (serviceCount[name] || 0) + 1;
  });
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#34d399'];
  const serviceDistribution = Object.entries(serviceCount).map(([name, value], idx) => ({ name, value, color: colors[idx % colors.length] }));

  // Appointments by weekday
  const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const weekdayCounts = new Array(7).fill(0);
  appointments.forEach((apt: any) => {
    if (!apt.appointment_date) return;
    const d = new Date(apt.appointment_date);
    weekdayCounts[d.getDay()] += 1;
  });
  const dailyAppointments = weekdays.map((day, i) => ({ day, appointments: weekdayCounts[i] }));

  // KPIs
  const totalRevenue = appointments.filter((a:any)=>a.status==='completed').reduce((s:number,a:any)=> s + Number(a.services?.price ?? 0), 0);
  const totalAppointments = appointments.length;
  const uniqueClients = new Set(appointments.map((a:any)=> a.client_email || a.client_name)).size;
  const ticketAverage = totalAppointments ? totalRevenue / totalAppointments : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600">Análise detalhada do desempenho do negócio</p>
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
                    <p className="text-2xl font-bold text-green-600">R$ 12.450</p>
                    <p className="text-sm text-green-600">+15% vs mês anterior</p>
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
                    <p className="text-2xl font-bold text-blue-600">162</p>
                    <p className="text-sm text-blue-600">+8% vs mês anterior</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Novos Clientes</p>
                    <p className="text-2xl font-bold text-purple-600">28</p>
                    <p className="text-sm text-purple-600">+12% vs mês anterior</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-orange-600">R$ 76,85</p>
                    <p className="text-sm text-orange-600">+5% vs mês anterior</p>
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
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
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
                <CardTitle>Distribuição de Serviços</CardTitle>
                <CardDescription>Serviços mais procurados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceDistribution.map((entry, index) => (
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
              <CardTitle>Agendamentos por Dia da Semana</CardTitle>
              <CardDescription>Distribuição de agendamentos ao longo da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessReports;
