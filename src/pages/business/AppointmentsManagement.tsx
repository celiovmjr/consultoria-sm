
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Search, Filter, Clock, User, CheckCircle, X, XCircle } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  professional: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  clientPhone?: string;
  notes?: string;
}

const AppointmentsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-12-27',
      time: '09:00',
      client: 'Ana Silva',
      service: 'Corte Feminino',
      professional: 'Maria Costa',
      duration: 60,
      price: 45.00,
      status: 'confirmed',
      clientPhone: '(11) 99999-9999',
      notes: 'Cliente prefere corte mais curto'
    },
    {
      id: '2',
      date: '2024-12-27',
      time: '10:30',
      client: 'João Santos',
      service: 'Barba',
      professional: 'Carlos Lima',
      duration: 30,
      price: 25.00,
      status: 'completed',
      clientPhone: '(11) 88888-8888'
    },
    {
      id: '3',
      date: '2024-12-27',
      time: '14:00',
      client: 'Patricia Oliveira',
      service: 'Escova',
      professional: 'Ana Costa',
      duration: 45,
      price: 35.00,
      status: 'confirmed',
      clientPhone: '(11) 77777-7777'
    },
    {
      id: '4',
      date: '2024-12-27',
      time: '16:00',
      client: 'Carlos Mendes',
      service: 'Corte Masculino',
      professional: 'João Silva',
      duration: 30,
      price: 30.00,
      status: 'no-show',
      clientPhone: '(11) 66666-6666'
    }
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.professional.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'completed' | 'cancelled' | 'no-show') => {
    setAppointments(appointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    ));
    toast({
      title: "Status atualizado",
      description: `Agendamento marcado como ${getStatusText(newStatus)}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
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

  const getAppointmentStats = () => {
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const noShow = appointments.filter(a => a.status === 'no-show').length;
    
    return { confirmed, completed, cancelled, noShow };
  };

  const stats = getAppointmentStats();

  return (
    <div className="min-h-screen bg-background flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestão de Agendamentos</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie todos os agendamentos</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmados</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cancelados</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                  </div>
                  <X className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faltaram</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.noShow}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Lista de Agendamentos
              </CardTitle>
              <CardDescription>
                {appointments.length} agendamentos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por cliente, serviço ou profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no-show">Faltou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {appointment.time} ({appointment.duration}min)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center font-medium">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            {appointment.client}
                          </div>
                          {appointment.clientPhone && (
                            <div className="text-sm text-muted-foreground ml-6">
                              {appointment.clientPhone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{appointment.professional}</TableCell>
                      <TableCell className="font-medium">
                        R$ {appointment.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {appointment.status === 'confirmed' && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Concluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Concluir Agendamento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Confirma que o agendamento de {appointment.client} foi concluído com sucesso?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancelar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja cancelar o agendamento de {appointment.client}? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Cancelar Agendamento
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(appointment.id, 'no-show')}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Não Veio
                              </Button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <Badge variant="outline" className="text-green-600 dark:text-green-400">
                              ✓ Finalizado
                            </Badge>
                          )}
                          {appointment.status === 'cancelled' && (
                            <Badge variant="outline" className="text-red-600 dark:text-red-400">
                              ✗ Cancelado
                            </Badge>
                          )}
                          {appointment.status === 'no-show' && (
                            <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                              - Faltou
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAppointments.length === 0 && (
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

export default AppointmentsManagement;
