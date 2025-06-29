
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      console.log('Fetching plans from Supabase...');
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
      
      console.log('Plans fetched:', data);
      return data;
    }
  });
};
