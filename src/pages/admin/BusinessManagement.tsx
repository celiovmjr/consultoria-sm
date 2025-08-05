import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Search, Plus, Mail, Phone, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import DataTable from '@/components/common/DataTable';
import { useToast } from '@/hooks/use-toast';
import { useBusinesses } from '@/hooks/useBusinesses';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const BusinessManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: businesses = [], isLoading, error } = useBusinesses();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    description: '',
    plan: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating business:', formData);
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error } = await supabase
        .from('businesses')
        .insert([{
          ...formData,
          slug
        }]);

      if (error) {
        console.error('Error creating business:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Negócio criado",
        description: "O novo negócio foi criado com sucesso.",
      });
      resetForm();
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar negócio. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (business: any) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name,
      owner: business.owner,
      email: business.email || '',
      phone: business.phone || '',
      description: business.description || '',
      plan: business.plan,
      status: business.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;

    try {
      console.log('Updating business:', editingBusiness.id, formData);
      const { error } = await supabase
        .from('businesses')
        .update(formData)
        .eq('id', editingBusiness.id);

      if (error) {
        console.error('Error updating business:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Negócio atualizado",
        description: "As informações do negócio foram atualizadas com sucesso.",
      });
      resetForm();
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar negócio. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (businessId: string, newStatus: 'active' | 'inactive') => {
    try {
      console.log('Updating business status:', businessId, newStatus);
      const { error } = await supabase
        .from('businesses')
        .update({ status: newStatus })
        .eq('id', businessId);

      if (error) {
        console.error('Error updating business status:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Status atualizado",
        description: `Status do negócio foi alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}.`,
      });
    } catch (error) {
      console.error('Error updating business status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (businessId: string) => {
    try {
      console.log('Deleting business:', businessId);
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) {
        console.error('Error deleting business:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Negócio excluído",
        description: "O negócio foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir negócio. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      description: '',
      plan: '',
      status: 'active'
    });
    setEditingBusiness(null);
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const columns = [
    {
      key: 'business_info',
      label: 'Negócio',
      render: (value: any, row: any) => (
        <div className="min-w-[200px]">
          <div className="font-medium text-foreground">{row.name}</div>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'owner_info',
      label: 'Proprietário',
      render: (value: any, row: any) => (
        <div className="min-w-[150px]">
          <div className="font-medium text-foreground">{row.owner}</div>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value: any, row: any) => (
        <div className="max-w-[200px] truncate text-foreground" title={row.description}>
          {row.description || '-'}
        </div>
      )
    },
    {
      key: 'plan',
      label: 'Plano',
      render: (value: any, row: any) => (
        <Badge variant="outline" className="border-border text-foreground whitespace-nowrap">
          {row.plan}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any, row: any) => (
        <Badge className={getStatusColor(row.status)}>
          {row.status === 'active' ? 'Ativo' : row.status === 'inactive' ? 'Inativo' : 'Pendente'}
        </Badge>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">Erro ao carregar negócios: {error.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8 pt-16 lg:pt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gerenciamento de Negócios</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Administre todos os negócios da plataforma</p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="flex items-center text-foreground text-lg lg:text-xl">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Lista de Negócios
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {businesses.length} negócios cadastrados
                  </CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 w-full lg:w-auto" 
                      onClick={() => resetForm()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Negócio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border mx-4 max-w-md lg:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Novo Negócio</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Cadastre um novo negócio na plataforma
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                      <Input
                        placeholder="Nome do negócio"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="bg-background border-border text-foreground"
                      />
                      <Input
                        placeholder="Nome do proprietário"
                        value={formData.owner}
                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                        required
                        className="bg-background border-border text-foreground"
                      />
                      <Input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-background border-border text-foreground"
                      />
                      <Input
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="bg-background border-border text-foreground"
                      />
                      <Input
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-background border-border text-foreground"
                      />
                      <Select 
                        value={formData.plan} 
                        onValueChange={(value) => setFormData({...formData, plan: value})}
                      >
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratuito</SelectItem>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <DialogFooter className="flex-col lg:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={resetForm} className="w-full lg:w-auto">
                          Cancelar
                        </Button>
                        <Button type="submit" className="w-full lg:w-auto">Criar Negócio</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou proprietário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>

              <DataTable
                columns={columns}
                data={filteredBusinesses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleteConfirmMessage="Tem certeza que deseja excluir este negócio? Esta ação não pode ser desfeita."
              />
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-background border-border mx-4 max-w-md lg:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">Editar Negócio</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Atualize as informações do negócio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  placeholder="Nome do negócio"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-background border-border text-foreground"
                />
                <Input
                  placeholder="Nome do proprietário"
                  value={formData.owner}
                  onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  required
                  className="bg-background border-border text-foreground"
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-background border-border text-foreground"
                />
                <Input
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="bg-background border-border text-foreground"
                />
                <Input
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-background border-border text-foreground"
                />
                <Select 
                  value={formData.plan} 
                  onValueChange={(value) => setFormData({...formData, plan: value})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive' | 'pending'})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter className="flex-col lg:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} className="w-full lg:w-auto">
                    Cancelar
                  </Button>
                  <Button type="submit" className="w-full lg:w-auto">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default BusinessManagement;
