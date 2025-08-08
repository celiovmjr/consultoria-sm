import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface UserFormProps {
  businesses: any[];
  editingUser: any;
  onEdit: (user: any) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const UserForm = ({ 
  businesses, 
  editingUser, 
  onEdit, 
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

  // Sincronizar formData com editingUser quando mudar
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || '',
        role: editingUser.role,
        business_id: editingUser.business_id || '',
        status: editingUser.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'business_owner',
        business_id: '',
        status: 'active'
      });
    }
  }, [editingUser]);

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
    onEdit(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: any) => {
    onEdit(user);
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => onEdit(null)} className="bg-gradient-primary text-white hover-glow transition-smooth">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-card border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {editingUser ? 'Atualize as informações do usuário' : 'Cadastre um novo usuário na plataforma'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="bg-background border-border text-foreground transition-fast focus:border-primary/50"
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
              className="bg-background border-border text-foreground transition-fast focus:border-primary/50"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-foreground">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-background border-border text-foreground transition-fast focus:border-primary/50"
            />
          </div>
          
          <div>
            <Label htmlFor="role" className="text-foreground">Tipo de Usuário</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as any})}>
              <SelectTrigger className="bg-background border-border text-foreground transition-fast">
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
            <Select
              value={formData.business_id}
              onValueChange={(value) =>
                setFormData({ ...formData, business_id: value === '__none__' ? '' : value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground transition-fast">
                <SelectValue placeholder="Selecione um negócio (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-[60]">
                <SelectItem value="__none__">Nenhum negócio</SelectItem>
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
              <SelectTrigger className="bg-background border-border text-foreground transition-fast">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm} className="transition-smooth hover:bg-muted/50">
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover-glow transition-smooth">
              {editingUser ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};