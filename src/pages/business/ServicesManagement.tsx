
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Scissors, Clock, DollarSign, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  storeId: string;
  storeName: string;
  isActive: boolean;
  createdAt: string;
}

const ServicesManagement = () => {
  const { toast } = useToast();
  
  // Mock data for stores
  const stores = [
    { id: '1', name: 'Filial Centro' },
    { id: '2', name: 'Filial Shopping' }
  ];
  
  const categories = [
    'Cabelos', 'Unhas', 'Estética', 'Massagem'
  ];

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte Feminino',
      description: 'Corte moderno personalizado',
      duration: 60,
      price: 80.00,
      category: 'Cabelos',
      storeId: '1',
      storeName: 'Filial Centro',
      isActive: true,
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Manicure Completa',
      description: 'Cuidado completo das unhas',
      duration: 45,
      price: 35.00,
      category: 'Unhas',
      storeId: '2',
      storeName: 'Filial Shopping',
      isActive: true,
      createdAt: '2024-11-28'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    storeId: '',
    isActive: true
  });

  const columns = [
    {
      key: 'name',
      label: 'Serviço',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Scissors className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'storeName',
      label: 'Loja/Filial',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Store className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Categoria',
    },
    {
      key: 'duration',
      label: 'Duração',
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value}min</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-medium">R$ {value.toFixed(2)}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStore = stores.find(store => store.id === formData.storeId);
    
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              ...formData,
              duration: parseInt(formData.duration),
              price: parseFloat(formData.price),
              storeName: selectedStore?.name || ''
            }
          : service
      ));
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        storeName: selectedStore?.name || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setServices([...services, newService]);
      toast({
        title: "Serviço criado",
        description: "O novo serviço foi criado com sucesso.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      storeId: service.storeId,
      isActive: service.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setServices(services.filter(s => s.id !== service.id));
    toast({
      title: "Serviço excluído",
      description: "O serviço foi excluído com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      category: '',
      storeId: '',
      isActive: true
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão de Serviços</h1>
              <p className="text-muted-foreground">Gerencie todos os serviços do seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingService 
                      ? 'Atualize as informações do serviço' 
                      : 'Crie um novo serviço para o seu negócio'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="storeId">Loja/Filial</Label>
                    <Select value={formData.storeId} onValueChange={(value) => setFormData({...formData, storeId: value})}>
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
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Corte Feminino"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva o serviço oferecido"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
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
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="60"
                        min="15"
                        max="480"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="80.00"
                      min="0"
                      required
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingService ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="w-5 h-5 mr-2 text-blue-600" />
                Lista de Serviços
              </CardTitle>
              <CardDescription>
                Gerencie todos os serviços oferecidos pelas suas lojas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleteConfirmMessage="Tem certeza que deseja excluir este serviço? Esta ação removerá todos os agendamentos futuros associados e não pode ser desfeita."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServicesManagement;
