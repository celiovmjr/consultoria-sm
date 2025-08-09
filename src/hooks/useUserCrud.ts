import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'saas_admin' | 'business_owner' | 'professional' | 'client';
  business_id?: string;
  status: 'active' | 'inactive';
}

export const useUserCrud = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUser = async (userData: UserFormData) => {
    setLoading(true);
    try {
      if (!userData.password || userData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      // Criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Falha ao criar usuário na autenticação');
      }

      // Criar entrada na tabela users
      const userRecord = {
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        business_id: userData.business_id || null,
        status: userData.status
      };

      const { error: userError } = await supabase
        .from('users')
        .insert([userRecord]);

      if (userError) {
        console.error('Error creating user record:', userError);
      }

      // Se for um profissional, criar entrada na tabela professionals
      if (userData.role === 'professional' && userData.business_id) {
        const professionalData = {
          user_id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          business_id: userData.business_id,
          status: 'active',
          is_active: true
        };

        const { error: professionalError } = await supabase
          .from('professionals')
          .insert([professionalData]);

        if (professionalError) {
          console.error('Error creating professional record:', professionalError);
        }
      }

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });

      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso e pode fazer login na plataforma.",
      });

      return { success: true, user: authData.user };
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<UserFormData>) => {
    setLoading(true);
    try {
      // Dados para atualizar (sem senha)
      const updateData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        business_id: userData.business_id || null,
        status: userData.status
      };

      // Atualizar tabela users
      const { error: userError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (userError) throw userError;

      // Atualizar também o perfil
      await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          business_id: userData.business_id || null
        })
        .eq('id', userId);

      // Se for profissional, atualizar também na tabela professionals
      if (userData.role === 'professional') {
        await supabase
          .from('professionals')
          .update({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            business_id: userData.business_id,
            status: userData.status === 'active' ? 'active' : 'inactive',
            is_active: userData.status === 'active'
          })
          .eq('user_id', userId);
      }

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // Deletar registros relacionados em ordem
      // 1. Profissionais
      await supabase
        .from('professionals')
        .delete()
        .eq('user_id', userId);

      // 2. Usuário da tabela users
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) throw userError;

      // 3. Perfil (deve ser deletado automaticamente por cascade)
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    loading
  };
};