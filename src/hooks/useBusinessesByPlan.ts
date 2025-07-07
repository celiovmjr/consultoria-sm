import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinessesByPlan = () => {
  return useQuery({
    queryKey: ['businesses-by-plan'],
    queryFn: async () => {
      console.log('Fetching businesses grouped by plan...');
      const { data, error } = await supabase
        .from('businesses')
        .select('plan, status')
        .eq('status', 'active'); // Only count active businesses
      
      if (error) {
        console.error('Error fetching businesses by plan:', error);
        throw error;
      }
      
      // Group businesses by plan and count them
      const planCounts = data.reduce((acc, business) => {
        const plan = business.plan || 'Básico'; // Default to Básico if no plan
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Businesses by plan:', planCounts);
      return planCounts;
    }
  });
};