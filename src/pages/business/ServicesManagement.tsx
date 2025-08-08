
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Scissors, Clock, DollarSign, Store as StoreIcon } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';
import MultiSelectCategories from '@/components/common/MultiSelectCategories';
import { useServices, Service } from '@/hooks/useServices';
import { useStores } from '@/hooks/useStores';
import { useCategories } from '@/hooks/useCategories';

const ServicesManagement = () => {
  const { services, loading, createService, updateService, deleteService } = useServices();
  const { stores } = useStores();
  const { categories, loading: categoriesLoading } = useCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    store_id: '',
    is_active: true
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
      key: 'stores',
      label: 'Loja/Filial',
      render: (value: any) => (
        <div className="flex items-center space-x-1">
          <StoreIcon className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'service_categories',
      label: 'Categorias',
      render: (value: any) => {
        if (!value || value.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded-full">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.categories.color }}
                />
                <span>{item.categories.name}</span>
              </div>
            ))}
          </div>
        );
      },
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
      key: 'is_active',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        await updateService(editingService.id, formData, selectedCategoryIds);
      } else {
        await createService(formData, selectedCategoryIds);
      }
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration || 60,
      price: service.price,
      store_id: service.store_id || '',
      is_active: service.is_active
    });
    
    // Set selected categories
    const categoryIds = service.service_categories?.map(item => item.categories.id) || [];
    setSelectedCategoryIds(categoryIds);
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: Service) => {
    await deleteService(service.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      store_id: '',
      is_active: true
    });
    setSelectedCategoryIds([]);
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
                    <Label htmlFor="store_id">Loja/Filial</Label>
                    <Select value={formData.store_id} onValueChange={(value) => setFormData({...formData, store_id: value})}>
                      <SelectTrigger className="bg-popover">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {stores
                          .filter(store => store.is_active) // Apenas lojas ativas
                          .map((store) => (
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
                  
                  
                  <div>
                    {!categoriesLoading && categories && categories.length > 0 ? (
                      <MultiSelectCategories
                        categories={categories}
                        selectedCategoryIds={selectedCategoryIds}
                        onSelectionChange={setSelectedCategoryIds}
                        placeholder="Selecione as categorias"
                      />
                    ) : (
                      <div>
                        <Label>Categorias</Label>
                        <div className="p-3 border rounded-md bg-muted/30 text-muted-foreground text-sm">
                          {categoriesLoading ? 'Carregando categorias...' : 'Nenhuma categoria disponível. Crie categorias primeiro.'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 60})}
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
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      placeholder="80.00"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Serviço Ativo</Label>
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
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="text-muted-foreground">Carregando serviços...</div>
                </div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={services}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                  deleteConfirmMessage="Tem certeza que deseja excluir este serviço?"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServicesManagement;
