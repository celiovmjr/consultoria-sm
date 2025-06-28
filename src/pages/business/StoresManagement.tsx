
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Store, MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  workingHours: string;
  isActive: boolean;
  createdAt: string;
}

const StoresManagement = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Filial Centro',
      description: 'Nossa loja principal no centro da cidade',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 99999-9999',
      email: 'centro@bellavista.com',
      manager: 'Maria Silva',
      workingHours: 'Seg-Sex: 9h às 18h | Sáb: 9h às 17h',
      isActive: true,
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Filial Shopping',
      description: 'Unidade localizada no Shopping Center',
      address: 'Av. Shopping, 456 - Centro Comercial',
      phone: '(11) 88888-8888',
      email: 'shopping@bellavista.com',
      manager: 'Ana Costa',
      workingHours: 'Seg-Dom: 10h às 22h',
      isActive: true,
      createdAt: '2024-11-15'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    workingHours: '',
    isActive: true
  });

  const columns = [
    {
      key: 'name',
      label: 'Nome da Loja',
      render: (value: string, row: Store) => (
        <div className="flex items-center space-x-2">
          <Store className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Endereço',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-gray-500" />
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
          <Phone className="w-3 h-3 text-gray-500" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativa' : 'Inativa'}
        </span>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStore) {
      setStores(stores.map(store => 
        store.id === editingStore.id 
          ? { ...store, ...formData }
          : store
      ));
      toast({
        title: "Loja atualizada",
        description: "A loja foi atualizada com sucesso.",
      });
    } else {
      const newStore: Store = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStores([...stores, newStore]);
      toast({
        title: "Loja criada",
        description: "A nova loja foi criada com sucesso.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.phone,
      email: store.email,
      manager: store.manager,
      workingHours: store.workingHours,
      isActive: store.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (store: Store) => {
    setStores(stores.filter(s => s.id !== store.id));
    toast({
      title: "Loja excluída",
      description: "A loja foi excluída com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      workingHours: '',
      isActive: true
    });
    setEditingStore(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lojas e Filiais</h1>
              <p className="text-gray-600">Gerencie todas as unidades do seu negócio</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Loja
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
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
                    <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                    <Input
                      id="workingHours"
                      value={formData.workingHours}
                      onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                      placeholder="Ex: Seg-Sex: 9h às 18h | Sáb: 9h às 17h"
                      required
                    />
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
                <Store className="w-5 h-5 mr-2 text-blue-600" />
                Lista de Lojas
              </CardTitle>
              <CardDescription>
                Gerencie todas as unidades do seu negócio em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={stores}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleteConfirmMessage="Tem certeza que deseja excluir esta loja? Esta ação removerá todos os serviços e profissionais associados e não pode ser desfeita."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoresManagement;
