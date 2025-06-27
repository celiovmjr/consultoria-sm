
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Search, Calendar } from 'lucide-react';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';
import { mockAppointments, mockServices, Appointment, Service } from '@/lib/mockData';

const AppointmentHistory = () => {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [services] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'completed', label: 'Concluídos' },
    { value: 'cancelled', label: 'Cancelados' },
    { value: 'no-show', label: 'Não compareceu' }
  ];

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const getServicePrice = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.price : 0;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Concluído', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      case 'no-show':
        return { label: 'Não compareceu', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'Agendado', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
  const averageTicket = completedAppointments.length > 0 ? totalRevenue / completedAppointments.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Histórico de Atendimentos</h1>
            <p className="text-gray-600">Acompanhe seu desempenho e histórico de atendimentos</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
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
                    <p className="text-2xl font-bold text-green-600">{completedAppointments.length}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-orange-600">R$ {averageTicket.toFixed(2)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome do cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Histórico de Atendimentos
              </CardTitle>
              <CardDescription>
                {filteredAppointments.length} atendimentos encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const statusInfo = getStatusInfo(appointment.status);
                    const servicePrice = getServicePrice(appointment.serviceId);
                    const commission = servicePrice * 0.6; // 60% de comissão
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                            <div className="text-sm text-gray-500">{appointment.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.clientName}</div>
                            <div className="text-sm text-gray-500">{appointment.clientPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceName(appointment.serviceId)}</TableCell>
                        <TableCell>R$ {servicePrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appointment.status === 'completed' ? (
                            <span className="text-green-600 font-medium">R$ {commission.toFixed(2)}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;
