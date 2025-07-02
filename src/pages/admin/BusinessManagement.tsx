import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Search, Plus, Edit, Trash2, Mail, Phone, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
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
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
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
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
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
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Negócios</h1>
            <p className="text-muted-foreground">Administre todos os negócios da plataforma</p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center text-foreground">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Lista de Negócios
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {businesses.length} negócios cadastrados
                  </CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => resetForm()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Negócio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border">
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
                      <Input
                        placeholder="Plano"
                        value={formData.plan}
                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                        required
                        className="bg-background border-border text-foreground"
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                        <Button type="submit">Criar Negócio</Button>
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

              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Negócio</TableHead>
                    <TableHead className="text-muted-foreground">Proprietário</TableHead>
                    <TableHead className="text-muted-foreground">Descrição</TableHead>
                    <TableHead className="text-muted-foreground">Plano</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business.id} className="border-border">
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{business.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {business.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{business.owner}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {business.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{business.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border text-foreground">{business.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(business.status)}>
                          {business.status === 'active' ? 'Ativo' : business.status === 'inactive' ? 'Inativo' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(business)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          {business.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleStatusChange(business.id, 'inactive')}
                              className="text-yellow-600"
                            >
                              Desativar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleStatusChange(business.id, 'active')}
                              className="text-green-600"
                            >
                              Ativar
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-background border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Tem certeza que deseja excluir o negócio "{business.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(business.id)} className="bg-red-600 hover:bg-red-700">
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

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-background border-border">
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
                <Input
                  placeholder="Plano"
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  required
                  className="bg-background border-border text-foreground"
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
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
