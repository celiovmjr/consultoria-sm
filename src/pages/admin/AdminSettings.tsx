import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Bell, Wrench, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useSystemSettings, PlatformSettings, EmailSettings, NotificationSettings } from '@/hooks/useSystemSettings';
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

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    platformSettings,
    emailSettings,
    notificationSettings,
    isLoading,
    isSaving,
    error,
    updatePlatformSettings,
    updateEmailSettings,
    updateNotificationSettings,
    generateBackup,
    resetSystemSettings,
    clearCache,
  } = useSystemSettings();

  // Fetch app settings
  const { data: appSettings, isLoading: appSettingsLoading } = useQuery({
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

  // Local state for form inputs
  const [localPlatformSettings, setLocalPlatformSettings] = useState<PlatformSettings>({
    name: 'Agenda.AI',
    description: 'Plataforma completa para gestão de agendamentos',
    supportEmail: 'suporte@agenda.ai',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
  });

  const [localEmailSettings, setLocalEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'sistema@agenda.ai',
    smtpPassword: '',
    fromName: 'Agenda.AI',
    fromEmail: 'noreply@agenda.ai',
  });

  const [localNotifications, setLocalNotifications] = useState<NotificationSettings>({
    newBusinessSignup: true,
    paymentAlerts: true,
    systemUpdates: true,
    maintenanceAlerts: true,
    securityAlerts: true,
  });

  const [appSettingsForm, setAppSettingsForm] = useState<AppSettingsForm>({
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

  // Sync local state with loaded data
  useEffect(() => {
    if (platformSettings) {
      setLocalPlatformSettings(platformSettings);
    }
  }, [platformSettings]);

  useEffect(() => {
    if (emailSettings) {
      setLocalEmailSettings(emailSettings);
    }
  }, [emailSettings]);

  useEffect(() => {
    if (notificationSettings) {
      setLocalNotifications(notificationSettings);
    }
  }, [notificationSettings]);

  // Sync app settings
  useEffect(() => {
    if (appSettings) {
      setAppSettingsForm({
        app_name: appSettings.app_name || '',
        hero_title: appSettings.hero_title || '',
        hero_subtitle: appSettings.hero_subtitle || '',
        features_title: appSettings.features_title || '',
        features_subtitle: appSettings.features_subtitle || '',
        testimonials_title: appSettings.testimonials_title || '',
        testimonials_subtitle: appSettings.testimonials_subtitle || '',
        pricing_title: appSettings.pricing_title || '',
        pricing_subtitle: appSettings.pricing_subtitle || '',
        cta_title: appSettings.cta_title || '',
        cta_subtitle: appSettings.cta_subtitle || ''
      });
    }
  }, [appSettings]);

  // App settings mutation
  const updateAppSettingsMutation = useMutation({
    mutationFn: async (data: AppSettingsForm) => {
      const promises = Object.entries(data).map(([key, value]) => 
        supabase
          .from('system_settings')
          .upsert({ 
            setting_key: key, 
            setting_value: JSON.stringify(value) 
          }, {
            onConflict: 'setting_key'
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
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  });

  const handlePlatformSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(localPlatformSettings);
  };

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailSettings(localEmailSettings);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationSettings(localNotifications);
  };

  const handleSystemReset = async () => {
    if (window.confirm('Tem certeza que deseja resetar as configurações do sistema? Esta ação não pode ser desfeita.')) {
      await resetSystemSettings();
    }
  };

  const handleAppSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettingsMutation.mutate(appSettingsForm);
  };

  const handleAppInputChange = (field: keyof AppSettingsForm, value: string) => {
    setAppSettingsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar configurações: {error.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 lg:mb-8 pt-16 lg:pt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações do Sistema</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Gerencie as configurações gerais da plataforma</p>
          </div>

          <Tabs defaultValue="platform" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 gap-1">
              <TabsTrigger value="platform" className="flex items-center text-xs lg:text-sm">
                <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Plataforma</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center text-xs lg:text-sm">
                <Mail className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center text-xs lg:text-sm">
                <Bell className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Notificações</span>
                <span className="sm:hidden">Notif</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="platform">
              <Card className="bg-gradient-card border-border/50 shadow-lg hover-lift">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Settings className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-primary" />
                    Configurações da Plataforma
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Configure as informações básicas da plataforma e aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlatformSettingsSubmit} className="space-y-4 lg:space-y-6">
                    {/* Application Settings Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Configurações da Aplicação</h3>
                      
                      {/* General Settings */}
                      <Card className="bg-gradient-secondary border-border/50">
                        <CardHeader>
                          <CardTitle className="text-base text-foreground">Informações Gerais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="app_name" className="text-foreground">Nome da Aplicação</Label>
                            <Input
                              id="app_name"
                              value={appSettingsForm.app_name}
                              onChange={(e) => handleAppInputChange('app_name', e.target.value)}
                              placeholder="AgendaPro"
                              className="transition-fast focus:border-primary/50"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Hero Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Seção Principal (Hero)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="hero_title">Título Principal</Label>
                            <Input
                              id="hero_title"
                              value={appSettingsForm.hero_title}
                              onChange={(e) => handleAppInputChange('hero_title', e.target.value)}
                              placeholder="Revolucione seu Salão com Agendamentos Inteligentes"
                            />
                          </div>
                          <div>
                            <Label htmlFor="hero_subtitle">Subtítulo</Label>
                            <Textarea
                              id="hero_subtitle"
                              value={appSettingsForm.hero_subtitle}
                              onChange={(e) => handleAppInputChange('hero_subtitle', e.target.value)}
                              placeholder="A plataforma completa para gestão de agendamentos..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Features Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Seção de Recursos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="features_title">Título</Label>
                            <Input
                              id="features_title"
                              value={appSettingsForm.features_title}
                              onChange={(e) => handleAppInputChange('features_title', e.target.value)}
                              placeholder="Tudo que você precisa em uma plataforma"
                            />
                          </div>
                          <div>
                            <Label htmlFor="features_subtitle">Subtítulo</Label>
                            <Textarea
                              id="features_subtitle"
                              value={appSettingsForm.features_subtitle}
                              onChange={(e) => handleAppInputChange('features_subtitle', e.target.value)}
                              placeholder="Recursos pensados especialmente para o seu tipo de negócio"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Testimonials Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Seção de Depoimentos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="testimonials_title">Título</Label>
                            <Input
                              id="testimonials_title"
                              value={appSettingsForm.testimonials_title}
                              onChange={(e) => handleAppInputChange('testimonials_title', e.target.value)}
                              placeholder="O que nossos clientes dizem"
                            />
                          </div>
                          <div>
                            <Label htmlFor="testimonials_subtitle">Subtítulo</Label>
                            <Input
                              id="testimonials_subtitle"
                              value={appSettingsForm.testimonials_subtitle}
                              onChange={(e) => handleAppInputChange('testimonials_subtitle', e.target.value)}
                              placeholder="Histórias reais de sucesso"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pricing Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Seção de Planos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="pricing_title">Título</Label>
                            <Input
                              id="pricing_title"
                              value={appSettingsForm.pricing_title}
                              onChange={(e) => handleAppInputChange('pricing_title', e.target.value)}
                              placeholder="Planos que crescem com seu negócio"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pricing_subtitle">Subtítulo</Label>
                            <Input
                              id="pricing_subtitle"
                              value={appSettingsForm.pricing_subtitle}
                              onChange={(e) => handleAppInputChange('pricing_subtitle', e.target.value)}
                              placeholder="Escolha o plano ideal para o seu estabelecimento"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* CTA Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Seção de Chamada para Ação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="cta_title">Título</Label>
                            <Input
                              id="cta_title"
                              value={appSettingsForm.cta_title}
                              onChange={(e) => handleAppInputChange('cta_title', e.target.value)}
                              placeholder="Pronto para transformar seu negócio?"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cta_subtitle">Subtítulo</Label>
                            <Textarea
                              id="cta_subtitle"
                              value={appSettingsForm.cta_subtitle}
                              onChange={(e) => handleAppInputChange('cta_subtitle', e.target.value)}
                              placeholder="Junte-se a centenas de profissionais que já revolucionaram seus salões"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Platform Settings Section */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold border-b pb-2">Configurações da Plataforma</h3>
                      
                      <div>
                        <Label htmlFor="platformName" className="text-sm lg:text-base">Nome da Plataforma (Admin)</Label>
                        <Input
                          id="platformName"
                          value={localPlatformSettings.name}
                          onChange={(e) => setLocalPlatformSettings({...localPlatformSettings, name: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="platformDescription" className="text-sm lg:text-base">Descrição</Label>
                        <Textarea
                          id="platformDescription"
                          value={localPlatformSettings.description}
                          onChange={(e) => setLocalPlatformSettings({...localPlatformSettings, description: e.target.value})}
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="supportEmail" className="text-sm lg:text-base">Email de Suporte</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={localPlatformSettings.supportEmail}
                          onChange={(e) => setLocalPlatformSettings({...localPlatformSettings, supportEmail: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-4 lg:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                          <div className="flex-1">
                            <Label className="font-medium text-sm lg:text-base">Modo de Manutenção</Label>
                            <p className="text-xs lg:text-sm text-muted-foreground">Bloquear acesso temporariamente</p>
                          </div>
                          <Switch
                            checked={localPlatformSettings.maintenanceMode}
                            onCheckedChange={(checked) => setLocalPlatformSettings({...localPlatformSettings, maintenanceMode: checked})}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                          <div className="flex-1">
                            <Label className="font-medium text-sm lg:text-base">Permitir Novos Cadastros</Label>
                            <p className="text-xs lg:text-sm text-muted-foreground">Habilitar registro de novos usuários</p>
                          </div>
                          <Switch
                            checked={localPlatformSettings.allowRegistrations}
                            onCheckedChange={(checked) => setLocalPlatformSettings({...localPlatformSettings, allowRegistrations: checked})}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                          <div className="flex-1">
                            <Label className="font-medium text-sm lg:text-base">Verificação de Email</Label>
                            <p className="text-xs lg:text-sm text-muted-foreground">Exigir verificação de email no cadastro</p>
                          </div>
                          <Switch
                            checked={localPlatformSettings.requireEmailVerification}
                            onCheckedChange={(checked) => setLocalPlatformSettings({...localPlatformSettings, requireEmailVerification: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        onClick={handleAppSettingsSubmit}
                        disabled={updateAppSettingsMutation.isPending}
                        className="flex-1"
                      >
                        {updateAppSettingsMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando App...
                          </>
                        ) : (
                          'Salvar Configurações da Aplicação'
                        )}
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Configurações da Plataforma
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-600" />
                    Configurações de Email
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Configure o servidor SMTP para envio de emails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSettingsSubmit} className="space-y-4 lg:space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <Label htmlFor="smtpHost" className="text-sm lg:text-base">Servidor SMTP</Label>
                        <Input
                          id="smtpHost"
                          value={localEmailSettings.smtpHost}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, smtpHost: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort" className="text-sm lg:text-base">Porta</Label>
                        <Input
                          id="smtpPort"
                          value={localEmailSettings.smtpPort}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, smtpPort: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <Label htmlFor="smtpUsername" className="text-sm lg:text-base">Usuário</Label>
                        <Input
                          id="smtpUsername"
                          value={localEmailSettings.smtpUsername}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, smtpUsername: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword" className="text-sm lg:text-base">Senha</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={localEmailSettings.smtpPassword}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, smtpPassword: e.target.value})}
                          placeholder="Nova senha SMTP"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <Label htmlFor="fromName" className="text-sm lg:text-base">Nome do Remetente</Label>
                        <Input
                          id="fromName"
                          value={localEmailSettings.fromName}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, fromName: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromEmail" className="text-sm lg:text-base">Email do Remetente</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={localEmailSettings.fromEmail}
                          onChange={(e) => setLocalEmailSettings({...localEmailSettings, fromEmail: e.target.value})}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Configurações de Email
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-purple-600" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Configure quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNotificationsSubmit} className="space-y-4 lg:space-y-6">
                    
                    <div className="space-y-4 lg:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                        <div className="flex-1">
                          <Label className="font-medium text-sm lg:text-base">Novos Negócios</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground">Notificar quando um novo negócio se cadastrar</p>
                        </div>
                        <Switch
                          checked={localNotifications.newBusinessSignup}
                          onCheckedChange={(checked) => setLocalNotifications({...localNotifications, newBusinessSignup: checked})}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                        <div className="flex-1">
                          <Label className="font-medium text-sm lg:text-base">Alertas de Pagamento</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground">Notificar sobre problemas de pagamento</p>
                        </div>
                        <Switch
                          checked={localNotifications.paymentAlerts}
                          onCheckedChange={(checked) => setLocalNotifications({...localNotifications, paymentAlerts: checked})}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                        <div className="flex-1">
                          <Label className="font-medium text-sm lg:text-base">Atualizações do Sistema</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground">Notificar sobre atualizações importantes</p>
                        </div>
                        <Switch
                          checked={localNotifications.systemUpdates}
                          onCheckedChange={(checked) => setLocalNotifications({...localNotifications, systemUpdates: checked})}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                        <div className="flex-1">
                          <Label className="font-medium text-sm lg:text-base">Alertas de Manutenção</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground">Notificar sobre manutenções programadas</p>
                        </div>
                        <Switch
                          checked={localNotifications.maintenanceAlerts}
                          onCheckedChange={(checked) => setLocalNotifications({...localNotifications, maintenanceAlerts: checked})}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
                        <div className="flex-1">
                          <Label className="font-medium text-sm lg:text-base">Alertas de Segurança</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground">Notificar sobre problemas de segurança</p>
                        </div>
                        <Switch
                          checked={localNotifications.securityAlerts}
                          onCheckedChange={(checked) => setLocalNotifications({...localNotifications, securityAlerts: checked})}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Preferências
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;