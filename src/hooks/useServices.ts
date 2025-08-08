import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  business_id?: string;
  store_id?: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
  category_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stores?: {
    name: string;
  };
  categories?: {
    name: string;
    color: string;
  };
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          stores(name),
          categories(name, color)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select(`
          *,
          stores(name),
          categories(name, color)
        `)
        .single();

      if (error) throw error;
      
      setServices(prev => [data, ...prev]);
      toast({
        title: "Serviço criado com sucesso!",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar serviço",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select(`
          *,
          stores(name),
          categories(name, color)
        `)
        .single();

      if (error) throw error;
      
      setServices(prev => prev.map(service => 
        service.id === id ? data : service
      ));
      toast({
        title: "Serviço atualizado com sucesso!",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Serviço excluído com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
};