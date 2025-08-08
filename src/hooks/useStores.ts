import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Store {
  id: string;
  business_id?: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  working_hours?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar lojas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: Omit<Store, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([storeData])
        .select()
        .single();

      if (error) throw error;
      
      setStores(prev => [data, ...prev]);
      toast({
        title: "Loja criada com sucesso!",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar loja",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateStore = async (id: string, storeData: Partial<Store>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(storeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setStores(prev => prev.map(store => 
        store.id === id ? data : store
      ));
      toast({
        title: "Loja atualizada com sucesso!",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar loja",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStores(prev => prev.filter(store => store.id !== id));
      toast({
        title: "Loja excluída com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir loja",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    createStore,
    updateStore,
    deleteStore,
    refetch: fetchStores
  };
};