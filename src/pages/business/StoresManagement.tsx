
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Store as StoreIcon, MapPin, Phone, User } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';
import WorkingHours from '@/components/common/WorkingHours';
import { useStores, Store } from '@/hooks/useStores';

const StoresManagement = () => {
  const { stores, loading, createStore, updateStore, deleteStore } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    working_hours: [],
    is_active: true
  });

  const columns = [
    {
      key: 'name',
      label: 'Nome da Loja',
      render: (value: string, row: Store) => (
        <div className="flex items-center space-x-2">
          <StoreIcon className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Endereço',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'manager',
      label: 'Gerente',
    },
    {
      key: 'phone',
      label: 'Telefone',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Phone className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
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
          {value ? 'Ativa' : 'Inativa'}
        </span>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        await updateStore(editingStore.id, formData);
      } else {
        await createStore(formData);
      }
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      description: store.description || '',
      address: store.address,
      phone: store.phone || '',
      email: store.email || '',
      manager: store.manager || '',
      working_hours: store.working_hours || [],
      is_active: store.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (store: Store) => {
    await deleteStore(store.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      working_hours: [],
      is_active: true
    });
    setEditingStore(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lojas e Filiais</h1>
              <p className="text-muted-foreground">Gerencie todas as unidades do seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Loja
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingStore ? 'Editar Loja' : 'Nova Loja'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStore 
                      ? 'Atualize as informações da loja' 
                      : 'Crie uma nova loja ou filial para expandir seu negócio'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Loja</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Filial Centro"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="manager">Gerente</Label>
                      <Input
                        id="manager"
                        value={formData.manager}
                        onChange={(e) => setFormData({...formData, manager: e.target.value})}
                        placeholder="Ex: Maria Silva"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva a localização e características da loja"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Rua, número, bairro, cidade, CEP"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="loja@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Horário de Funcionamento</Label>
                    <WorkingHours
                      value={formData.working_hours}
                      onChange={(schedule) => setFormData({...formData, working_hours: schedule})}
                    />
                  </div>
                   
                   <div className="flex items-center space-x-2">
                     <Switch
                       id="is_active"
                       checked={formData.is_active}
                       onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                     />
                     <Label htmlFor="is_active">Loja Ativa</Label>
                   </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingStore ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <StoreIcon className="w-5 h-5 mr-2 text-blue-600" />
                Lista de Lojas
              </CardTitle>
              <CardDescription>
                Gerencie todas as unidades do seu negócio em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="text-muted-foreground">Carregando lojas...</div>
                </div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={stores}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                  deleteConfirmMessage="Tem certeza que deseja excluir esta loja?"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoresManagement;
