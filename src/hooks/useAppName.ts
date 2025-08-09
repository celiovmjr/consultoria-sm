import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAppName = () => {
  return useQuery({
    queryKey: ['app-name'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'app_name')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }
      
      // Normalize value coming from jsonb
      const normalize = (val: any) => {
        if (val === null || val === undefined) return 'Agenda.AI';
        if (typeof val === 'string') {
          const s = val.trim();
          if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
            try { return JSON.parse(s); } catch { return s.slice(1, -1); }
          }
          return s;
        }
        return val as string;
      };
      
      return normalize(data?.setting_value) || 'Agenda.AI';
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};