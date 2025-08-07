import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSettingsForm {
  app_name: string;
  hero_title: string;
  hero_subtitle: string;
  features_title: string;
  features_subtitle: string;
  testimonials_title: string;
  testimonials_subtitle: string;
  pricing_title: string;
  pricing_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
}

const AppSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'app_name', 'hero_title', 'hero_subtitle', 'features_title', 
          'features_subtitle', 'testimonials_title', 'testimonials_subtitle', 
          'pricing_title', 'pricing_subtitle', 'cta_title', 'cta_subtitle'
        ]);
      
      if (error) throw error;
      
      // Transform array to object for easier access
      const settingsObj: { [key: string]: string } = {};
      data?.forEach(item => {
        if (item.setting_value) {
          settingsObj[item.setting_key] = typeof item.setting_value === 'string' 
            ? JSON.parse(item.setting_value) 
            : item.setting_value;
        }
      });
      
      return settingsObj;
    }
  });

  const [formData, setFormData] = useState<AppSettingsForm>({
    app_name: '',
    hero_title: '',
    hero_subtitle: '',
    features_title: '',
    features_subtitle: '',
    testimonials_title: '',
    testimonials_subtitle: '',
    pricing_title: '',
    pricing_subtitle: '',
    cta_title: '',
    cta_subtitle: ''
  });

  // Update form data when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        app_name: settings.app_name || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        features_title: settings.features_title || '',
        features_subtitle: settings.features_subtitle || '',
        testimonials_title: settings.testimonials_title || '',
        testimonials_subtitle: settings.testimonials_subtitle || '',
        pricing_title: settings.pricing_title || '',
        pricing_subtitle: settings.pricing_subtitle || '',
        cta_title: settings.cta_title || '',
        cta_subtitle: settings.cta_subtitle || ''
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: AppSettingsForm) => {
      const promises = Object.entries(data).map(([key, value]) => 
        supabase
          .from('system_settings')
          .upsert({ 
            setting_key: key, 
            setting_value: JSON.stringify(value) 
          })
      );
      
      const results = await Promise.all(promises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(errors[0].error?.message || 'Erro ao salvar configurações');
      }
      
      return results;
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações da aplicação foram atualizadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof AppSettingsForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configurações da Aplicação</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="app_name">Nome da Aplicação</Label>
              <Input
                id="app_name"
                value={formData.app_name}
                onChange={(e) => handleInputChange('app_name', e.target.value)}
                placeholder="AgendaPro"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Principal (Hero)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Título Principal</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="Revolucione seu Salão com Agendamentos Inteligentes"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Subtítulo</Label>
              <Textarea
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="A plataforma completa para gestão de agendamentos..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção de Recursos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="features_title">Título</Label>
              <Input
                id="features_title"
                value={formData.features_title}
                onChange={(e) => handleInputChange('features_title', e.target.value)}
                placeholder="Tudo que você precisa em uma plataforma"
              />
            </div>
            <div>
              <Label htmlFor="features_subtitle">Subtítulo</Label>
              <Textarea
                id="features_subtitle"
                value={formData.features_subtitle}
                onChange={(e) => handleInputChange('features_subtitle', e.target.value)}
                placeholder="Recursos pensados especialmente para o seu tipo de negócio"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção de Depoimentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testimonials_title">Título</Label>
              <Input
                id="testimonials_title"
                value={formData.testimonials_title}
                onChange={(e) => handleInputChange('testimonials_title', e.target.value)}
                placeholder="O que nossos clientes dizem"
              />
            </div>
            <div>
              <Label htmlFor="testimonials_subtitle">Subtítulo</Label>
              <Input
                id="testimonials_subtitle"
                value={formData.testimonials_subtitle}
                onChange={(e) => handleInputChange('testimonials_subtitle', e.target.value)}
                placeholder="Histórias reais de sucesso"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção de Planos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pricing_title">Título</Label>
              <Input
                id="pricing_title"
                value={formData.pricing_title}
                onChange={(e) => handleInputChange('pricing_title', e.target.value)}
                placeholder="Planos que crescem com seu negócio"
              />
            </div>
            <div>
              <Label htmlFor="pricing_subtitle">Subtítulo</Label>
              <Input
                id="pricing_subtitle"
                value={formData.pricing_subtitle}
                onChange={(e) => handleInputChange('pricing_subtitle', e.target.value)}
                placeholder="Escolha o plano ideal para o seu estabelecimento"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção de Chamada para Ação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cta_title">Título</Label>
              <Input
                id="cta_title"
                value={formData.cta_title}
                onChange={(e) => handleInputChange('cta_title', e.target.value)}
                placeholder="Pronto para transformar seu negócio?"
              />
            </div>
            <div>
              <Label htmlFor="cta_subtitle">Subtítulo</Label>
              <Textarea
                id="cta_subtitle"
                value={formData.cta_subtitle}
                onChange={(e) => handleInputChange('cta_subtitle', e.target.value)}
                placeholder="Junte-se a centenas de profissionais que já revolucionaram seus salões"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateSettingsMutation.isPending}
            className="min-w-[120px]"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppSettings;