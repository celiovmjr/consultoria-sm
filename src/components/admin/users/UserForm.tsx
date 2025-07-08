import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface UserFormProps {
  businesses: any[];
  editingUser: any;
  setEditingUser: (user: any) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const UserForm = ({ 
  businesses, 
  editingUser, 
  setEditingUser, 
  isDialogOpen, 
  setIsDialogOpen 
}: UserFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'business_owner' as 'business_owner' | 'admin' | 'professional',
    business_id: '',
    status: 'active' as 'active' | 'inactive'
  });

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
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
          
          <DialogFooter className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingUser ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};