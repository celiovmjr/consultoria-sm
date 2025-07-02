
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfessionals = () => {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      console.log('Fetching professionals from Supabase...');
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          businesses(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching professionals:', error);
        throw error;
      }
      
      console.log('Professionals fetched:', data);
      return data;
    }
  });
};
