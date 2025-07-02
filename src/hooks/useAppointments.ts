
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      console.log('Fetching appointments from Supabase...');
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          businesses(name),
          professionals(name),
          services(name, price)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      
      console.log('Appointments fetched:', data);
      return data;
    }
  });
};
