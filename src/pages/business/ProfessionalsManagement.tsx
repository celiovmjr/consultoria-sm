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
import { useProfessionals, Professional } from '@/hooks/useProfessionals';
import { useServices } from '@/hooks/useServices';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';

const ProfessionalsManagement = () => {
  const { toast } = useToast();
  const { professionals, loading, createProfessional, updateProfessional, deleteProfessional } = useProfessionals();
  const { services } = useServices();
  const { stores } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: 60,
    password: '',
    status: 'active' as 'active' | 'inactive',
    store_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProfessional) {
        await updateProfessional(
          editingProfessional.id, 
          {
            ...formData,
            store_id: formData.store_id || undefined
          }, 
          selectedServiceIds,
          formData.password || undefined
        );
      } else {
        await createProfessional(
          {
            ...formData,
            store_id: formData.store_id || undefined,
            is_active: formData.status === 'active'
          }, 
          selectedServiceIds,
          formData.password
        );
      }
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      commission: 60,
      password: '',
      status: 'active',
      store_id: ''
    });
    setSelectedServiceIds([]);
    setEditingProfessional(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone || '',
      commission: professional.commission,
      password: '', // Don't prefill password
      status: professional.status,
      store_id: professional.store_id || ''
    });
    
    // Set selected services (simplified for now)
    setSelectedServiceIds(professional.services || []);
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (professional: Professional) => {
    await deleteProfessional(professional.id);
  };

  const handleServiceAdd = (serviceId: string) => {
    if (!selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const handleServiceRemove = (serviceId: string) => {
    setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const availableServices = services.filter(service => !selectedServiceIds.includes(service.id));

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
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                    <Label htmlFor="store_id">Loja/Filial</Label>
                    <Select value={formData.store_id} onValueChange={(value) => setFormData({ ...formData, store_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores
                          .filter(store => store.is_active)
                          .map((store) => (
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
                        onChange={(e) => setFormData({ ...formData, commission: parseInt(e.target.value) || 0 })}
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
                    <Label htmlFor="password">Senha {editingProfessional ? '(deixe em branco para manter a atual)' : ''}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Digite a senha"
                      required={!editingProfessional}
                    />
                  </div>
                  
                  
                  
                  <div>
                    <Label>Serviços que pode realizar</Label>
                    <div className="space-y-3 mt-2">
                      {/* Selected Services */}
                      {selectedServiceIds.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Serviços Selecionados:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedServiceIds.map((serviceId) => {
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
                      
                      {availableServices.length === 0 && selectedServiceIds.length > 0 && (
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
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="text-muted-foreground">Carregando profissionais...</div>
                </div>
              ) : (
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
                          <span className="text-sm">
                            {stores.find(s => s.id === professional.store_id)?.name || 'Não definida'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{professional.email}</TableCell>
                      <TableCell>{professional.phone || '-'}</TableCell>
                      <TableCell>{professional.commission}%</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(professional.services || []).slice(0, 2).map((serviceId) => (
                            <Badge key={serviceId} variant="secondary" className="text-xs">
                              {getServiceName(serviceId)}
                            </Badge>
                          ))}
                          {(professional.services?.length || 0) > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(professional.services?.length || 0) - 2}
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
                              onClick={() => handleDelete(professional)}
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalsManagement;
