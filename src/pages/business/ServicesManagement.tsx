
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Scissors } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { mockServices, Service } from '@/lib/mockData';

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    category: '',
    status: 'active' as 'active' | 'inactive'
  });

  const categories = ['Cabelos', 'Unhas', 'Estética', 'Massagem', 'Depilação'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData, duration: parseInt(formData.duration), price: parseFloat(formData.price) }
          : service
      ));
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        category: formData.category,
        businessId: '1',
        status: formData.status
      };
      setServices([...services, newService]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      price: '',
      category: '',
      status: 'active'
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      status: service.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Serviços</h1>
              <p className="text-gray-600">Gerencie os serviços oferecidos pelo seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingService ? 'Edite as informações do serviço' : 'Adicione um novo serviço ao seu catálogo'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Corte Feminino"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duração (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="60"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="45.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingService ? 'Atualizar' : 'Criar'} Serviço
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
                <Scissors className="w-5 h-5 mr-2 text-purple-600" />
                Serviços Cadastrados
              </CardTitle>
              <CardDescription>
                {services.length} serviços cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                          {service.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(service.id)}
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

export default ServicesManagement;
