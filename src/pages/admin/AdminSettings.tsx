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
      
      // Normalize value coming from jsonb that may be stored as raw string or JSON string
      const normalize = (val: any) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          const s = val.trim();
          if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
            try { return JSON.parse(s); } catch { return s.slice(1, -1); }
          }
          return s;
        }
        return val as string;
      };
      
      // Transform array to object for easier access
      const settingsObj: { [key: string]: string } = {};
      data?.forEach((item) => {
        settingsObj[item.setting_key] = normalize(item.setting_value);
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

  // App settings mutation - only app_name
  const updateAppSettingsMutation = useMutation({
    mutationFn: async (appName: string) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: 'app_name', 
          setting_value: JSON.stringify(appName) 
        }, {
          onConflict: 'setting_key'
        });
      
      if (error) {
        throw new Error(error.message || 'Erro ao salvar nome da aplicação');
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Nome da aplicação salvo",
        description: "O nome da aplicação foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['app-name'] });
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o nome da aplicação.",
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
    updateAppSettingsMutation.mutate(appSettingsForm.app_name);
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

  if (isLoading || appSettingsLoading) {
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
    <div className="min-h-screen bg-gradient-main flex flex-col lg:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 lg:mb-8 pt-16 lg:pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações do Sistema</h1>
                <p className="text-muted-foreground text-sm lg:text-base mt-1">Gerencie as configurações gerais da plataforma</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generateBackup}
                  variant="outline"
                  size="sm"
                  className="hover-scale transition-fast"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Backup
                </Button>
                <Button
                  onClick={clearCache}
                  variant="outline"
                  size="sm"
                  className="hover-scale transition-fast"
                >
                  Limpar Cache
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="platform" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50 shadow-sm">
              <TabsTrigger 
                value="platform" 
                className="flex items-center text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-fast"
              >
                <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Plataforma</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="flex items-center text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-fast"
              >
                <Mail className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-fast"
              >
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
                      
                       {/* Only App Name Settings */}
                       <Card className="bg-gradient-card border-border/50 shadow-sm hover-lift transition-fast">
                         <CardHeader className="bg-gradient-subtle rounded-t-lg">
                           <CardTitle className="text-base text-foreground">Nome da Aplicação</CardTitle>
                           <CardDescription className="text-sm text-muted-foreground">
                             Configure apenas o nome que aparece na aplicação
                           </CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4 pt-6">
                           <div>
                             <Label htmlFor="app_name" className="text-foreground font-medium">Nome da Aplicação</Label>
                             <Input
                               id="app_name"
                               value={appSettingsForm.app_name}
                               onChange={(e) => handleAppInputChange('app_name', e.target.value)}
                               placeholder="Agenda.AI"
                               className="mt-1 transition-fast focus:border-primary/50 focus:shadow-glow"
                             />
                             <p className="text-xs text-muted-foreground mt-1">
                               Este nome aparecerá nas páginas de login, cadastro e landing page
                             </p>
                           </div>
                         </CardContent>
                       </Card>

                       {/* Save App Settings Button */}
                       <div className="flex justify-end">
                         <Button
                           type="button"
                           onClick={handleAppSettingsSubmit}
                           disabled={updateAppSettingsMutation.isPending}
                           className="bg-primary hover:bg-primary/90 text-primary-foreground transition-fast hover-scale"
                         >
                           {updateAppSettingsMutation.isPending ? (
                             <>
                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                               Salvando...
                             </>
                           ) : (
                             'Salvar Nome da Aplicação'
                           )}
                         </Button>
                       </div>
                     </div>

                      <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Configurações do Sistema</h3>

                        {/* Platform Settings Section */}
                        <div className="space-y-4">
                      
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
                      </div>

                      <Button type="submit" className="w-full" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Configurações da Plataforma
                      </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card className="bg-gradient-card border-border/50 shadow-lg hover-lift transition-fast">
                <CardHeader className="pb-4 bg-gradient-subtle rounded-t-lg">
                  <CardTitle className="flex items-center text-lg lg:text-xl text-foreground">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-primary" />
                    Configurações de Email
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base text-muted-foreground">
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
              <Card className="bg-gradient-card border-border/50 shadow-lg hover-lift transition-fast">
                <CardHeader className="pb-4 bg-gradient-subtle rounded-t-lg">
                  <CardTitle className="flex items-center text-lg lg:text-xl text-foreground">
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-primary" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base text-muted-foreground">
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