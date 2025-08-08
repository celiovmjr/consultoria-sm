import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_id?: string;
  store_id?: string;
  commission: number;
  password_hash?: string;
  status: 'active' | 'inactive';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stores?: {
    name: string;
  };
  services?: string[]; // Simplified for now
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals((data || []) as Professional[]);
    } catch (error: any) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>, serviceIds: string[] = [], password?: string) => {
    try {
      // Hash password if provided
      let password_hash = null;
      if (password) {
        // Simple hash for demo - in production use proper hashing
        password_hash = btoa(password);
      }

      const { services, stores, ...cleanData } = professionalData;
      const dataToInsert = {
        ...cleanData,
        password_hash
      };

      const { data: professional, error: professionalError } = await supabase
        .from('professionals')
        .insert([dataToInsert])
        .select()
        .single();

      if (professionalError) throw professionalError;

      // Note: For now we'll skip the services relationship since the table doesn't exist in types
      // This can be added later when the junction table is properly set up

      toast({
        title: "Sucesso",
        description: "Profissional criado com sucesso!",
      });

      await fetchProfessionals();
      return professional;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfessional = async (id: string, professionalData: Partial<Professional>, serviceIds?: string[], password?: string) => {
    try {
      const { services, stores, ...cleanData } = professionalData;
      
      // Update password if provided
      if (password) {
        cleanData.password_hash = btoa(password);
      }

      const { data: professional, error: professionalError } = await supabase
        .from('professionals')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (professionalError) throw professionalError;

      // Note: For now we'll skip the services relationship since the table doesn't exist in types
      // This can be added later when the junction table is properly set up

      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso!",
      });

      await fetchProfessionals();
      return professional;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Profissional excluído com sucesso!",
      });

      await fetchProfessionals();
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return {
    professionals,
    loading,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    refetch: fetchProfessionals
  };
};