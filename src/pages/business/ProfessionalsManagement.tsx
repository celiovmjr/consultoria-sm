
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { mockProfessionals, mockServices, Professional, Service } from '@/lib/mockData';

const ProfessionalsManagement = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [services] = useState<Service[]>(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: '',
    services: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfessional) {
      // Update existing professional
      setProfessionals(professionals.map(professional => 
        professional.id === editingProfessional.id 
          ? { 
              ...professional, 
              ...formData, 
              commission: parseInt(formData.commission),
              services: formData.services
            }
          : professional
      ));
    } else {
      // Create new professional
      const newProfessional: Professional = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessId: '1',
        services: formData.services,
        workingHours: {
          monday: { start: '09:00', end: '18:00', active: true },
          tuesday: { start: '09:00', end: '18:00', active: true },
          wednesday: { start: '09:00', end: '18:00', active: true },
          thursday: { start: '09:00', end: '18:00', active: true },
          friday: { start: '09:00', end: '18:00', active: true },
          saturday: { start: '09:00', end: '17:00', active: true },
          sunday: { start: '09:00', end: '15:00', active: false }
        },
        commission: parseInt(formData.commission),
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProfessionals([...professionals, newProfessional]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      commission: '',
      services: [],
      status: 'active'
    });
    setEditingProfessional(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      commission: professional.commission.toString(),
      services: professional.services,
      status: professional.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (professionalId: string) => {
    setProfessionals(professionals.filter(professional => professional.id !== professionalId));
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, services: [...formData.services, serviceId] });
    } else {
      setFormData({ ...formData, services: formData.services.filter(id => id !== serviceId) });
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Profissionais</h1>
              <p className="text-gray-600">Gerencie a equipe do seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Profissional
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProfessional ? 'Edite as informações do profissional' : 'Adicione um novo profissional à sua equipe'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Ana Costa"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ana@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commission">Comissão (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        value={formData.commission}
                        onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                        placeholder="60"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Serviços que pode realizar</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                          />
                          <Label htmlFor={service.id} className="text-sm">
                            {service.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingProfessional ? 'Atualizar' : 'Criar'} Profissional
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
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Profissionais Cadastrados
              </CardTitle>
              <CardDescription>
                {professionals.length} profissionais na equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Serviços</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium">{professional.name}</TableCell>
                      <TableCell>{professional.email}</TableCell>
                      <TableCell>{professional.phone}</TableCell>
                      <TableCell>{professional.commission}%</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {professional.services.slice(0, 2).map((serviceId) => (
                            <Badge key={serviceId} variant="secondary" className="text-xs">
                              {getServiceName(serviceId)}
                            </Badge>
                          ))}
                          {professional.services.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{professional.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={professional.status === 'active' ? 'default' : 'secondary'}>
                          {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(professional)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(professional.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalsManagement;
