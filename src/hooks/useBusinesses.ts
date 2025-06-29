
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      console.log('Fetching businesses from Supabase...');
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching businesses:', error);
        throw error;
      }
      
      console.log('Businesses fetched:', data);
      return data;
    }
  });
};
