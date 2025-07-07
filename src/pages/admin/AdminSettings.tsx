import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Bell, Shield, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useSystemSettings, PlatformSettings, EmailSettings, NotificationSettings } from '@/hooks/useSystemSettings';

const AdminSettings = () => {
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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
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
              <TabsTrigger value="security" className="flex items-center text-xs lg:text-sm">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Segurança</span>
                <span className="sm:hidden">Seg</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="platform">
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Settings className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                    Configurações da Plataforma
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Configure as informações básicas da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlatformSettingsSubmit} className="space-y-4 lg:space-y-6">
                    <div>
                      <Label htmlFor="platformName" className="text-sm lg:text-base">Nome da Plataforma</Label>
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

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Configurações
                    </Button>
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

            <TabsContent value="security">
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Shield className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-red-600" />
                    Configurações de Segurança
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Gerencie as configurações de segurança da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 lg:p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-3 text-sm lg:text-base">Ações Administrativas</h4>
                      <div className="space-y-2 lg:space-y-3">
                        <Button variant="outline" className="w-full justify-start text-sm lg:text-base" onClick={generateBackup}>
                          Gerar Backup do Sistema
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm lg:text-base" onClick={clearCache}>
                          Limpar Cache da Aplicação
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm lg:text-base">
                          Revisar Logs de Segurança
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-2 text-sm lg:text-base">Zona de Perigo</h4>
                      <p className="text-xs lg:text-sm text-red-700 dark:text-red-400 mb-4">
                        Estas ações são irreversíveis e podem afetar o funcionamento da plataforma.
                      </p>
                      <div className="space-y-2 lg:space-y-3">
                        <Button variant="destructive" className="w-full justify-start text-sm lg:text-base" onClick={handleSystemReset}>
                          Resetar Configurações do Sistema
                        </Button>
                        <Button variant="destructive" className="w-full justify-start text-sm lg:text-base">
                          Limpar Todos os Dados de Teste
                        </Button>
                      </div>
                    </div>
                  </div>
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