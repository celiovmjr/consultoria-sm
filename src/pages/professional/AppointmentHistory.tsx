
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, Filter, Clock, User } from 'lucide-react';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';

interface AppointmentHistory {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  duration: number;
  price: number;
  commission: number;
  status: 'completed' | 'cancelled' | 'no-show';
}

const AppointmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  const appointmentHistory: AppointmentHistory[] = [
    {
      id: '1',
      date: '2024-12-26',
      time: '09:00',
      client: 'Ana Silva',
      service: 'Corte Feminino',
      duration: 60,
      price: 45.00,
      commission: 27.00,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-12-26',
      time: '10:30',
      client: 'Maria Santos',
      service: 'Coloração',
      duration: 120,
      price: 85.00,
      commission: 51.00,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-12-25',
      time: '14:00',
      client: 'Patricia Lima',
      service: 'Escova',
      duration: 45,
      price: 35.00,
      commission: 21.00,
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-12-24',
      time: '15:30',
      client: 'Carla Oliveira',
      service: 'Corte + Escova',
      duration: 90,
      price: 65.00,
      commission: 39.00,
      status: 'no-show'
    },
    {
      id: '5',
      date: '2024-12-23',
      time: '11:00',
      client: 'Julia Costa',
      service: 'Hidratação',
      duration: 75,
      price: 55.00,
      commission: 33.00,
      status: 'cancelled'
    }
  ];

  const filteredHistory = appointmentHistory.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    let matchesMonth = true;
    if (monthFilter !== 'all') {
      const appointmentMonth = new Date(appointment.date).getMonth();
      matchesMonth = appointmentMonth === parseInt(monthFilter);
    }
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const totalEarnings = filteredHistory
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.commission, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no-show':
        return 'Faltou';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Histórico de Agendamentos</h1>
            <p className="text-gray-600">Acompanhe seu histórico de atendimentos e ganhos</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {filteredHistory.filter(a => a.status === 'completed').length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ganhos Totais</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {totalEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">R$</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Comparecimento</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round((filteredHistory.filter(a => a.status === 'completed').length / filteredHistory.length) * 100) || 0}%
                    </p>
                  </div>
                  <User className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Histórico Detalhado
              </CardTitle>
              <CardDescription>
                Visualize todos os seus atendimentos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por cliente ou serviço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no-show">Faltou</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Meses</SelectItem>
                    <SelectItem value="11">Dezembro</SelectItem>
                    <SelectItem value="10">Novembro</SelectItem>
                    <SelectItem value="9">Outubro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {appointment.client}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{appointment.duration} min</TableCell>
                      <TableCell className="font-medium">
                        R$ {appointment.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        R$ {appointment.commission.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredHistory.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum agendamento encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;
