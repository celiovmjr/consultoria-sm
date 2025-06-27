
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { mockAppointments, mockProfessionals, mockServices, Appointment, Professional, Service } from '@/lib/mockData';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [professionals] = useState<Professional[]>(mockProfessionals);
  const [services] = useState<Service[]>(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    professionalId: '',
    date: '',
    time: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  });

  const statusOptions = [
    { value: 'scheduled', label: 'Agendado', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Concluído', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { value: 'no-show', label: 'Não compareceu', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAppointment) {
      // Update existing appointment
      setAppointments(appointments.map(appointment => 
        appointment.id === editingAppointment.id 
          ? { ...appointment, ...formData }
          : appointment
      ));
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
        businessId: '1',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAppointments([...appointments, newAppointment]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      professionalId: '',
      date: '',
      time: '',
      status: 'scheduled'
    });
    setEditingAppointment(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      clientEmail: appointment.clientEmail,
      serviceId: appointment.serviceId,
      professionalId: appointment.professionalId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
  };

  const getProfessionalName = (professionalId: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    return professional ? professional.name : 'Profissional não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Agendamentos</h1>
              <p className="text-gray-600">Gerencie todos os agendamentos do seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAppointment ? 'Edite as informações do agendamento' : 'Crie um novo agendamento manual'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Nome do Cliente</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Ex: Maria Silva"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Telefone</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail">E-mail</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="maria@email.com"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceId">Serviço</Label>
                      <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {service.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="professionalId">Profissional</Label>
                      <Select value={formData.professionalId} onValueChange={(value) => setFormData({ ...formData, professionalId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionals.map((professional) => (
                            <SelectItem key={professional.id} value={professional.id}>
                              {professional.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
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
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingAppointment ? 'Atualizar' : 'Criar'} Agendamento
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                {appointments.length} agendamentos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusInfo = getStatusInfo(appointment.status);
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.clientName}</div>
                            <div className="text-sm text-gray-500">{appointment.clientPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceName(appointment.serviceId)}</TableCell>
                        <TableCell>{getProfessionalName(appointment.professionalId)}</TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(appointment)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(appointment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

export default AppointmentsManagement;
