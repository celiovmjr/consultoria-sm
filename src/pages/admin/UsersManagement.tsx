
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Building, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useProfessionals } from '@/hooks/useProfessionals';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const UsersManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: professionals = [], isLoading: professionalsLoading } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'business_owner' as 'business_owner' | 'admin' | 'professional',
    business_id: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalUsers = users.length;
  const businessOwners = users.filter(u => u.role === 'business_owner').length;
  const totalProfessionals = professionals.length;
  const clients = totalUsers - businessOwners; // Simplified calculation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        console.log('Updating user:', editingUser.id, formData);
        const { error } = await supabase
          .from('users')
          .update(formData)
          .eq('id', editingUser.id);

        if (error) throw error;

        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso.",
        });
      } else {
        console.log('Creating user:', formData);
        const { error } = await supabase
          .from('users')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Usuário criado",
          description: "O novo usuário foi criado com sucesso.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      business_id: user.business_id || '',
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      console.log('Deleting user:', userId);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'business_owner',
      business_id: '',
      status: 'active'
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'business_owner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'professional':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'business_owner':
        return 'Proprietário';
      case 'professional':
        return 'Profissional';
      default:
        return role;
    }
  };

  const getBusinessName = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    return business?.name || '-';
  };

  const isLoading = usersLoading || businessesLoading || professionalsLoading;

  if (usersError) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">Erro ao carregar usuários: {usersError.message}</p>
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
          {/* Header */}
          <div className="mb-8 pt-16 md:pt-0">
            <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">Administre todos os usuários da plataforma</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                    <p className="text-2xl font-bold text-foreground">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proprietários</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : businessOwners.toLocaleString()}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profissionais</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalProfessionals.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : clients.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center text-foreground">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Lista de Usuários
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Gerencie todos os usuários cadastrados na plataforma
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">
                        {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {editingUser ? 'Atualize as informações do usuário' : 'Cadastre um novo usuário na plataforma'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-foreground">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="role" className="text-foreground">Tipo de Usuário</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as any})}>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="business_owner">Proprietário</SelectItem>
                            <SelectItem value="professional">Profissional</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="business_id" className="text-foreground">Negócio</Label>
                        <Select value={formData.business_id} onValueChange={(value) => setFormData({...formData, business_id: value})}>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Selecione um negócio (opcional)" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="">Nenhum negócio</SelectItem>
                            {businesses.map((business) => (
                              <SelectItem key={business.id} value={business.id}>
                                {business.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="status" className="text-foreground">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button type="submit" className="flex-1">
                          {editingUser ? 'Atualizar' : 'Criar'} Usuário
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>

              {/* Users List */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-card">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{user.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {user.email}
                                </span>
                                {user.phone && (
                                  <span className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {user.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 ml-14">
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                            {user.business_id && (
                              <span className="text-sm text-muted-foreground">
                                <Building className="w-3 h-3 inline mr-1" />
                                {getBusinessName(user.business_id)}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-2 ml-14">
                            Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UsersManagement;
