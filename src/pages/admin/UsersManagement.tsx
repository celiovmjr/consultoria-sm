import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useProfessionals } from '@/hooks/useProfessionals';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { UserStatsCards } from '@/components/admin/users/UserStatsCards';
import { UserSearchBar } from '@/components/admin/users/UserSearchBar';
import { UserForm } from '@/components/admin/users/UserForm';
import { UserListItem } from '@/components/admin/users/UserListItem';
import { UserDeleteDialog } from '@/components/admin/users/UserDeleteDialog';

const UsersManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const { data: professionals = [], isLoading: professionalsLoading } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalUsers = users.length;
  const businessOwners = users.filter(u => u.role === 'business_owner').length;
  const totalProfessionals = professionals.length;
  const clients = totalUsers - businessOwners; // Simplified calculation

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
          <UserStatsCards
            totalUsers={totalUsers}
            businessOwners={businessOwners}
            totalProfessionals={totalProfessionals}
            clients={clients}
            isLoading={isLoading}
          />

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
                <UserForm
                  businesses={businesses}
                  editingUser={editingUser}
                  onEdit={setEditingUser}
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

              {/* Users List */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      onEdit={setEditingUser}
                      getStatusColor={getStatusColor}
                      getRoleColor={getRoleColor}
                      getRoleLabel={getRoleLabel}
                      getBusinessName={getBusinessName}
                      deleteComponent={<UserDeleteDialog user={user} onDelete={handleDelete} />}
                    />
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