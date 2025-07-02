
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      console.log('Fetching services from Supabase...');
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          businesses(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      console.log('Services fetched:', data);
      return data;
    }
  });
};
