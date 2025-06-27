
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Bell, Shield, CreditCard } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [platformSettings, setPlatformSettings] = useState({
    name: 'Agenda.AI',
    description: 'Plataforma completa para gestão de agendamentos',
    supportEmail: 'suporte@agenda.ai',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'sistema@agenda.ai',
    smtpPassword: '****',
    fromName: 'Agenda.AI',
    fromEmail: 'noreply@agenda.ai'
  });

  const [notifications, setNotifications] = useState({
    newBusinessSignup: true,
    paymentAlerts: true,
    systemUpdates: true,
    maintenanceAlerts: true,
    securityAlerts: true
  });

  const handlePlatformSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações atualizadas",
      description: "As configurações da plataforma foram atualizadas com sucesso.",
    });
  };

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações de email salvas",
      description: "As configurações de email foram atualizadas com sucesso.",
    });
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-gray-600">Gerencie as configurações gerais da plataforma</p>
          </div>

          <Tabs defaultValue="platform" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="platform" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Plataforma
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="platform">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Configurações da Plataforma
                  </CardTitle>
                  <CardDescription>
                    Configure as informações básicas da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlatformSettingsSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="platformName">Nome da Plataforma</Label>
                      <Input
                        id="platformName"
                        value={platformSettings.name}
                        onChange={(e) => setPlatformSettings({...platformSettings, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="platformDescription">Descrição</Label>
                      <Textarea
                        id="platformDescription"
                        value={platformSettings.description}
                        onChange={(e) => setPlatformSettings({...platformSettings, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="supportEmail">Email de Suporte</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={platformSettings.supportEmail}
                        onChange={(e) => setPlatformSettings({...platformSettings, supportEmail: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Modo de Manutenção</Label>
                          <p className="text-sm text-gray-600">Bloquear acesso temporariamente</p>
                        </div>
                        <Switch
                          checked={platformSettings.maintenanceMode}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, maintenanceMode: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Permitir Novos Cadastros</Label>
                          <p className="text-sm text-gray-600">Habilitar registro de novos usuários</p>
                        </div>
                        <Switch
                          checked={platformSettings.allowRegistrations}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, allowRegistrations: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Verificação de Email</Label>
                          <p className="text-sm text-gray-600">Exigir verificação de email no cadastro</p>
                        </div>
                        <Switch
                          checked={platformSettings.requireEmailVerification}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, requireEmailVerification: checked})}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Salvar Configurações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-green-600" />
                    Configurações de Email
                  </CardTitle>
                  <CardDescription>
                    Configure o servidor SMTP para envio de emails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSettingsSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpHost">Servidor SMTP</Label>
                        <Input
                          id="smtpHost"
                          value={emailSettings.smtpHost}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">Porta</Label>
                        <Input
                          id="smtpPort"
                          value={emailSettings.smtpPort}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpUsername">Usuário</Label>
                        <Input
                          id="smtpUsername"
                          value={emailSettings.smtpUsername}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword">Senha</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fromName">Nome do Remetente</Label>
                        <Input
                          id="fromName"
                          value={emailSettings.fromName}
                          onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromEmail">Email do Remetente</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Salvar Configurações de Email
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-purple-600" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Novos Negócios</Label>
                          <p className="text-sm text-gray-600">Notificar quando um novo negócio se cadastrar</p>
                        </div>
                        <Switch
                          checked={notifications.newBusinessSignup}
                          onCheckedChange={(checked) => setNotifications({...notifications, newBusinessSignup: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Alertas de Pagamento</Label>
                          <p className="text-sm text-gray-600">Notificar sobre problemas de pagamento</p>
                        </div>
                        <Switch
                          checked={notifications.paymentAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, paymentAlerts: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Atualizações do Sistema</Label>
                          <p className="text-sm text-gray-600">Notificar sobre atualizações importantes</p>
                        </div>
                        <Switch
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Alertas de Manutenção</Label>
                          <p className="text-sm text-gray-600">Notificar sobre manutenções programadas</p>
                        </div>
                        <Switch
                          checked={notifications.maintenanceAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, maintenanceAlerts: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Alertas de Segurança</Label>
                          <p className="text-sm text-gray-600">Notificar sobre problemas de segurança</p>
                        </div>
                        <Switch
                          checked={notifications.securityAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Salvar Preferências
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Configurações de Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie as configurações de segurança da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">Ações Administrativas</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          Gerar Backup do Sistema
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Limpar Cache da Aplicação
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Revisar Logs de Segurança
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">Zona de Perigo</h4>
                      <p className="text-sm text-red-700 mb-4">
                        Estas ações são irreversíveis e podem afetar o funcionamento da plataforma.
                      </p>
                      <div className="space-y-2">
                        <Button variant="destructive" className="w-full justify-start">
                          Resetar Configurações do Sistema
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
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
