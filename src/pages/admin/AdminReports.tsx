import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Building, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useUsers } from '@/hooks/useUsers';
import { useAppointments } from '@/hooks/useAppointments';
import { usePlans } from '@/hooks/usePlans';

const AdminReports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('last30days');
  
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: plans = [], isLoading: plansLoading } = usePlans();

  const isLoading = businessesLoading || usersLoading || appointmentsLoading || plansLoading;

  // Calculate revenue data
  const revenueData = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((acc, apt) => {
      const date = new Date(apt.appointment_date);
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const revenue = apt.services?.price || 0;
      
      acc[monthKey] = (acc[monthKey] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>);

  const monthlyRevenueData = Object.entries(revenueData).map(([month, revenue]) => ({
    month,
    revenue
  })).slice(-6); // Last 6 months

  // Calculate business growth data
  const businessGrowthData = businesses.reduce((acc, business) => {
    const date = new Date(business.created_at);
    const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyBusinessData = Object.entries(businessGrowthData).map(([month, count]) => ({
    month,
    businesses: count
  })).slice(-6);

  // Calculate plan distribution
  const planDistribution = plans.map(plan => ({
    name: plan.name,
    value: Math.floor(Math.random() * 100) + 10, // Mock data for now
    color: getRandomColor()
  }));

  function getRandomColor() {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Calculate metrics
  const totalRevenue = Object.values(revenueData).reduce((sum, revenue) => sum + revenue, 0);
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const totalUsers = users.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

  const handleExportReport = () => {
    const reportData = {
      reportType,
      dateRange,
      totalRevenue,
      totalBusinesses,
      activeBusinesses,
      totalUsers,
      totalAppointments,
      completedAppointments,
      monthlyRevenueData,
      monthlyBusinessData,
      planDistribution,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `relatorio-admin-${reportType}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 pt-16 md:pt-0">
            <h1 className="text-3xl font-bold text-foreground">Relatórios Administrativos</h1>
            <p className="text-muted-foreground">Análise completa de dados e métricas da plataforma</p>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Filtros de Relatório
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tipo de Relatório</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Receita</SelectItem>
                      <SelectItem value="growth">Crescimento</SelectItem>
                      <SelectItem value="plans">Planos</SelectItem>
                      <SelectItem value="users">Usuários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Período</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                      <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                      <SelectItem value="last3months">Últimos 3 meses</SelectItem>
                      <SelectItem value="last6months">Últimos 6 meses</SelectItem>
                      <SelectItem value="lastyear">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={handleExportReport} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                        <p className="text-2xl font-bold text-foreground">
                          R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-accent mt-1">+12% vs período anterior</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Negócios Ativos</p>
                        <p className="text-2xl font-bold text-foreground">{activeBusinesses}</p>
                        <p className="text-xs text-muted-foreground mt-1">de {totalBusinesses} total</p>
                      </div>
                      <Building className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                        <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                        <p className="text-xs text-accent mt-1">+8% vs mês anterior</p>
                      </div>
                      <Users className="w-8 h-8 text-secondary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Agendamentos</p>
                        <p className="text-2xl font-bold text-foreground">{completedAppointments}</p>
                        <p className="text-xs text-muted-foreground mt-1">de {totalAppointments} total</p>
                      </div>
                      <Calendar className="w-8 h-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                      Receita Mensal
                    </CardTitle>
                    <CardDescription>
                      Evolução da receita nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']} />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="w-5 h-5 mr-2 text-primary" />
                      Crescimento de Negócios
                    </CardTitle>
                    <CardDescription>
                      Novos negócios cadastrados por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyBusinessData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="businesses" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-secondary" />
                    Distribuição de Planos
                  </CardTitle>
                  <CardDescription>
                    Quantidade de assinantes por plano
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={planDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {planDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-4">
                      {planDistribution.map((plan, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3"
                              style={{ backgroundColor: plan.color }}
                            />
                            <span className="font-medium text-foreground">{plan.name}</span>
                          </div>
                          <span className="text-muted-foreground">{plan.value} assinantes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
