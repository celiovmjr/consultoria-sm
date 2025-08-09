import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessFormData {
  name: string;
  owner?: string;
  email?: string;
  phone?: string;
  description?: string;
  slug?: string;
  plan?: string;
  status: 'active' | 'inactive';
}

export const useBusinessCrud = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBusiness = async (businessData: BusinessFormData) => {
    setLoading(true);
    try {
      // Gerar slug se não fornecido
      if (!businessData.slug) {
        businessData.slug = businessData.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }

      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (error) throw error;

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['businesses'] });

      toast({
        title: "Negócio criado",
        description: "O novo negócio foi criado com sucesso.",
      });

      return { success: true, business: data };
    } catch (error: any) {
      console.error('Error creating business:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar negócio. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (businessId: string, businessData: Partial<BusinessFormData>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['businesses'] });

      toast({
        title: "Negócio atualizado",
        description: "As informações do negócio foram atualizadas com sucesso.",
      });

      return { success: true, business: data };
    } catch (error: any) {
      console.error('Error updating business:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar negócio. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBusiness = async (businessId: string) => {
    setLoading(true);
    try {
      // Primeiro, verificar se há relacionamentos que impedem a exclusão
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .eq('business_id', businessId);

      const { data: professionals } = await supabase
        .from('professionals')
        .select('id')
        .eq('business_id', businessId);

      const { data: services } = await supabase
        .from('services')
        .select('id')
        .eq('business_id', businessId);

      if (stores?.length || professionals?.length || services?.length) {
        toast({
          title: "Não é possível excluir",
          description: "Este negócio possui filiais, profissionais ou serviços associados. Remova-os primeiro.",
          variant: "destructive"
        });
        return { success: false, error: "Business has related records" };
      }

      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) throw error;

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['businesses'] });

      toast({
        title: "Negócio excluído",
        description: "O negócio foi removido com sucesso.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting business:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir negócio. Tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getBusinessWithRelations = async (businessId: string) => {
    setLoading(true);
    try {
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (businessError) throw businessError;

      // Buscar relacionamentos
      const [storesResult, professionalsResult, servicesResult] = await Promise.all([
        supabase.from('stores').select('*').eq('business_id', businessId),
        supabase.from('professionals').select('*').eq('business_id', businessId),
        supabase.from('services').select('*').eq('business_id', businessId)
      ]);

      return {
        success: true,
        business: {
          ...business,
          stores: storesResult.data || [],
          professionals: professionalsResult.data || [],
          services: servicesResult.data || []
        }
      };
    } catch (error: any) {
      console.error('Error fetching business with relations:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessWithRelations,
    loading
  };
};