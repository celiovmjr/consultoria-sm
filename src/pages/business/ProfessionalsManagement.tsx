import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, X, Store } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { mockProfessionals, mockServices, Professional } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const ProfessionalsManagement = () => {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [services] = useState(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  
  // Mock data for stores
  const stores = [
    { id: '1', name: 'Filial Centro' },
    { id: '2', name: 'Filial Shopping' }
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: '',
    services: [] as string[],
    status: 'active' as 'active' | 'inactive',
    storeId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStore = stores.find(store => store.id === formData.storeId);
    
    if (editingProfessional) {
      // Update existing professional
      setProfessionals(professionals.map(professional => 
        professional.id === editingProfessional.id 
          ? { 
              ...professional, 
              ...formData, 
              commission: parseInt(formData.commission),
              services: formData.services,
              storeName: selectedStore?.name || ''
            }
          : professional
      ));
      toast({
        title: "Profissional atualizado",
        description: "As informações do profissional foram atualizadas com sucesso.",
      });
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
        createdAt: new Date().toISOString().split('T')[0],
        storeId: formData.storeId,
        storeName: selectedStore?.name || ''
      };
      setProfessionals([...professionals, newProfessional]);
      toast({
        title: "Profissional criado",
        description: "O novo profissional foi adicionado com sucesso.",
      });
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
      status: 'active',
      storeId: ''
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
      status: professional.status,
      storeId: professional.storeId || '1'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (professionalId: string) => {
    setProfessionals(professionals.filter(professional => professional.id !== professionalId));
    toast({
      title: "Profissional excluído",
      description: "O profissional foi removido com sucesso.",
    });
  };

  const handleServiceAdd = (serviceId: string) => {
    if (!formData.services.includes(serviceId)) {
      setFormData({ ...formData, services: [...formData.services, serviceId] });
    }
  };

  const handleServiceRemove = (serviceId: string) => {
    setFormData({ 
      ...formData, 
      services: formData.services.filter(id => id !== serviceId) 
    });
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const availableServices = services.filter(service => !formData.services.includes(service.id));

  return (
    <div className="min-h-screen bg-background flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão de Profissionais</h1>
              <p className="text-muted-foreground">Gerencie a equipe do seu negócio</p>
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
                    <Label htmlFor="storeId">Loja/Filial</Label>
                    <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                    <div className="space-y-3 mt-2">
                      {/* Selected Services */}
                      {formData.services.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Serviços Selecionados:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.services.map((serviceId) => {
                              const service = services.find(s => s.id === serviceId);
                              return service ? (
                                <Badge key={serviceId} variant="default" className="flex items-center gap-1">
                                  {service.name}
                                  <button
                                    type="button"
                                    onClick={() => handleServiceRemove(serviceId)}
                                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Service Selector */}
                      {availableServices.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Adicionar Serviço:</Label>
                          <Select onValueChange={handleServiceAdd}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border border-border shadow-lg max-h-48 overflow-y-auto z-50">
                              {availableServices.map((service) => (
                                <SelectItem key={service.id} value={service.id} className="hover:bg-accent">
                                  <div className="flex items-center justify-between w-full">
                                    <span>{service.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {service.duration}min - R$ {service.price.toFixed(2)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {availableServices.length === 0 && formData.services.length > 0 && (
                        <p className="text-sm text-muted-foreground">Todos os serviços disponíveis foram selecionados.</p>
                      )}
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

          <Card className="border-0 shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-card-foreground">
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
                    <TableHead>Loja/Filial</TableHead>
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
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Store className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{professional.storeName || 'Não definida'}</span>
                        </div>
                      </TableCell>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o profissional "{professional.name}"? 
                                  Esta ação removerá todos os agendamentos futuros associados e não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(professional.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
