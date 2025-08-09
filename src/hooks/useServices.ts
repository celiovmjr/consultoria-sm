import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  service_categories?: Array<{
    categories: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          stores(name),
          service_categories(categories(id, name, color))
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

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>, categoryIds: string[] = []) => {
    try {
      const { category_id, service_categories, ...cleanServiceData } = serviceData;
      
      const dataToInsert = {
        ...cleanServiceData,
        business_id: profile?.business_id || null
      };
      
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert([dataToInsert])
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Insert service categories
      if (categoryIds.length > 0) {
        const serviceCategoriesData = categoryIds.map(categoryId => ({
          service_id: service.id,
          category_id: categoryId
        }));

        const { error: categoriesError } = await supabase
          .from('service_categories')
          .insert(serviceCategoriesData);

        if (categoriesError) throw categoriesError;
      }

      // Fetch the complete service with categories
      const { data: completeService, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          stores(name),
          service_categories(categories(id, name, color))
        `)
        .eq('id', service.id)
        .single();

      if (fetchError) throw fetchError;
      
      setServices(prev => [completeService, ...prev]);
      toast({
        title: "Serviço criado com sucesso!",
      });
      return completeService;
    } catch (error: any) {
      toast({
        title: "Erro ao criar serviço",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>, categoryIds?: string[]) => {
    try {
      const { category_id, service_categories, ...cleanServiceData } = serviceData;
      
      const dataToUpdate = {
        ...cleanServiceData,
        business_id: profile?.business_id || null
      };
      
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Update service categories if provided
      if (categoryIds !== undefined) {
        // Delete existing categories
        const { error: deleteError } = await supabase
          .from('service_categories')
          .delete()
          .eq('service_id', id);

        if (deleteError) throw deleteError;

        // Insert new categories
        if (categoryIds.length > 0) {
          const serviceCategoriesData = categoryIds.map(categoryId => ({
            service_id: id,
            category_id: categoryId
          }));

          const { error: insertError } = await supabase
            .from('service_categories')
            .insert(serviceCategoriesData);

          if (insertError) throw insertError;
        }
      }

      // Fetch the complete service with categories
      const { data: completeService, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          stores(name),
          service_categories(categories(id, name, color))
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      setServices(prev => prev.map(service => 
        service.id === id ? completeService : service
      ));
      toast({
        title: "Serviço atualizado com sucesso!",
      });
      return completeService;
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