
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Building, Clock, Users, CreditCard, Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

const BusinessSettings = () => {
  const { toast } = useToast();
  const [businessData, setBusinessData] = useState({
    name: 'Salão Bella Vista',
    description: 'O melhor em beleza e bem-estar',
    phone: '(11) 3333-4444',
    email: 'contato@bellavista.com',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    cnpj: '12.345.678/0001-90',
    website: 'https://bellavista.com',
    instagram: '@bellavista',
    facebook: 'bellavista',
    whatsapp: '11999887766'
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { active: true, start: '09:00', end: '18:00' },
    tuesday: { active: true, start: '09:00', end: '18:00' },
    wednesday: { active: true, start: '09:00', end: '18:00' },
    thursday: { active: true, start: '09:00', end: '20:00' },
    friday: { active: true, start: '09:00', end: '20:00' },
    saturday: { active: true, start: '08:00', end: '17:00' },
    sunday: { active: false, start: '09:00', end: '15:00' }
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsReminders: true,
    whatsappConfirmation: true,
    dailyReport: true,
    weeklyReport: false,
    monthlyReport: true
  });

  const [appearance, setAppearance] = useState({
    primaryColor: '#10b981',
    secondaryColor: '#3b82f6',
    logoUrl: '',
    bannerUrl: '',
    customCss: ''
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="hours">Horários</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="billing">Faturamento</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Informações do Negócio
                  </CardTitle>
                  <CardDescription>
                    Dados básicos e informações de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Negócio</Label>
                      <Input
                        id="name"
                        value={businessData.name}
                        onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={businessData.description}
                      onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessData.email}
                        onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={businessData.cnpj}
                        onChange={(e) => setBusinessData({...businessData, cnpj: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={businessData.address}
                      onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={businessData.city}
                        onChange={(e) => setBusinessData({...businessData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={businessData.state}
                        onChange={(e) => setBusinessData({...businessData, state: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={businessData.zipCode}
                        onChange={(e) => setBusinessData({...businessData, zipCode: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => handleSave('informações gerais')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Informações
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Redes Sociais e Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessData.website}
                        onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={businessData.whatsapp}
                        onChange={(e) => setBusinessData({...businessData, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={businessData.instagram}
                        onChange={(e) => setBusinessData({...businessData, instagram: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={businessData.facebook}
                        onChange={(e) => setBusinessData({...businessData, facebook: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Horários de Funcionamento
                  </CardTitle>
                  <CardDescription>
                    Configure os horários de atendimento para cada dia da semana
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={workingHours[day.key as keyof typeof workingHours].active}
                          onCheckedChange={(checked) => 
                            setWorkingHours({
                              ...workingHours,
                              [day.key]: { ...workingHours[day.key as keyof typeof workingHours], active: checked }
                            })
                          }
                        />
                        <span className="font-medium w-32">{day.label}</span>
                      </div>
                      
                      {workingHours[day.key as keyof typeof workingHours].active && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={workingHours[day.key as keyof typeof workingHours].start}
                            onChange={(e) => 
                              setWorkingHours({
                                ...workingHours,
                                [day.key]: { ...workingHours[day.key as keyof typeof workingHours], start: e.target.value }
                              })
                            }
                            className="w-32"
                          />
                          <span>até</span>
                          <Input
                            type="time"
                            value={workingHours[day.key as keyof typeof workingHours].end}
                            onChange={(e) => 
                              setWorkingHours({
                                ...workingHours,
                                [day.key]: { ...workingHours[day.key as keyof typeof workingHours], end: e.target.value }
                              })
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                      
                      {!workingHours[day.key as keyof typeof workingHours].active && (
                        <Badge variant="secondary">Fechado</Badge>
                      )}
                    </div>
                  ))}
                  
                  <Button onClick={() => handleSave('horários')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Horários
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure como e quando receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">E-mail para novos agendamentos</p>
                        <p className="text-sm text-gray-600">Receba um e-mail sempre que um cliente agendar</p>
                      </div>
                      <Switch
                        checked={notifications.emailBookings}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailBookings: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS de lembrete</p>
                        <p className="text-sm text-gray-600">Envie SMS de lembrete para clientes</p>
                      </div>
                      <Switch
                        checked={notifications.smsReminders}
                        onCheckedChange={(checked) => setNotifications({...notifications, smsReminders: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Confirmação via WhatsApp</p>
                        <p className="text-sm text-gray-600">Confirme agendamentos pelo WhatsApp</p>
                      </div>
                      <Switch
                        checked={notifications.whatsappConfirmation}
                        onCheckedChange={(checked) => setNotifications({...notifications, whatsappConfirmation: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório diário</p>
                        <p className="text-sm text-gray-600">Receba um resumo diário por e-mail</p>
                      </div>
                      <Switch
                        checked={notifications.dailyReport}
                        onCheckedChange={(checked) => setNotifications({...notifications, dailyReport: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório semanal</p>
                        <p className="text-sm text-gray-600">Receba um resumo semanal por e-mail</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório mensal</p>
                        <p className="text-sm text-gray-600">Receba um resumo mensal por e-mail</p>
                      </div>
                      <Switch
                        checked={notifications.monthlyReport}
                        onCheckedChange={(checked) => setNotifications({...notifications, monthlyReport: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => handleSave('notificações')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Notificações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Personalização Visual</CardTitle>
                  <CardDescription>
                    Personalize a aparência da sua página de agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={appearance.secondaryColor}
                          onChange={(e) => setAppearance({...appearance, secondaryColor: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input
                          value={appearance.secondaryColor}
                          onChange={(e) => setAppearance({...appearance, secondaryColor: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="logoUrl">URL do Logo</Label>
                    <Input
                      id="logoUrl"
                      value={appearance.logoUrl}
                      onChange={(e) => setAppearance({...appearance, logoUrl: e.target.value})}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bannerUrl">URL do Banner</Label>
                    <Input
                      id="bannerUrl"
                      value={appearance.bannerUrl}
                      onChange={(e) => setAppearance({...appearance, bannerUrl: e.target.value})}
                      placeholder="https://exemplo.com/banner.jpg"
                    />
                  </div>
                  
                  <Button onClick={() => handleSave('aparência')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Aparência
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Plano e Faturamento
                  </CardTitle>
                  <CardDescription>
                    Gerencie seu plano e informações de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-800">Plano Professional</h3>
                        <p className="text-sm text-green-600">Até 10 profissionais • Agendamentos ilimitados</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-800">R$ 89</p>
                        <p className="text-sm text-green-600">/mês</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Próxima cobrança</h4>
                    <p className="text-gray-600">15 de Janeiro de 2025 - R$ 89,00</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Método de pagamento</h4>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span>•••• •••• •••• 1234</span>
                      <Badge>Visa</Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      Alterar Plano
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Alterar Pagamento
                    </Button>
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

export default BusinessSettings;
