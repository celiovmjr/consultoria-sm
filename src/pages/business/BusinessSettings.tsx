
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Building, Clock, Bell, CreditCard, Shield } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import { useToast } from '@/hooks/use-toast';

const BusinessSettings = () => {
  const { toast } = useToast();
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Salão Bella Vista',
    description: 'Salão de beleza especializado em cabelos e estética',
    address: 'Rua das Flores, 123',
    phone: '(11) 99999-9999',
    email: 'contato@bellavista.com',
    website: 'www.bellavista.com'
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { start: '09:00', end: '18:00', active: true },
    tuesday: { start: '09:00', end: '18:00', active: true },
    wednesday: { start: '09:00', end: '18:00', active: true },
    thursday: { start: '09:00', end: '18:00', active: true },
    friday: { start: '09:00', end: '18:00', active: true },
    saturday: { start: '09:00', end: '17:00', active: true },
    sunday: { start: '10:00', end: '16:00', active: false }
  });

  const [notifications, setNotifications] = useState({
    newAppointments: true,
    appointmentReminders: true,
    cancellations: true,
    reviews: true,
    marketing: false
  });

  const handleBusinessInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Informações atualizadas",
      description: "As informações do negócio foram atualizadas com sucesso.",
    });
  };

  const handleWorkingHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Horários atualizados",
      description: "Os horários de funcionamento foram atualizados com sucesso.",
    });
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
          </div>

          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="business" className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Negócio
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Plano
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Informações do Negócio
                  </CardTitle>
                  <CardDescription>
                    Atualize as informações básicas do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBusinessInfoSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Negócio</Label>
                      <Input
                        id="name"
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={businessInfo.description}
                        onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={businessInfo.phone}
                          onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={businessInfo.email}
                          onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                        placeholder="www.seunegocio.com"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Horários de Funcionamento
                  </CardTitle>
                  <CardDescription>
                    Configure os horários de funcionamento do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWorkingHoursSubmit} className="space-y-4">
                    {daysOfWeek.map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-32">
                          <Label className="font-medium">{label}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={workingHours[key as keyof typeof workingHours].active}
                            onCheckedChange={(checked) => setWorkingHours({
                              ...workingHours,
                              [key]: { ...workingHours[key as keyof typeof workingHours], active: checked }
                            })}
                          />
                          <span className="text-sm text-gray-600">Aberto</span>
                        </div>
                        {workingHours[key as keyof typeof workingHours].active && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">Das</Label>
                              <Input
                                type="time"
                                value={workingHours[key as keyof typeof workingHours].start}
                                onChange={(e) => setWorkingHours({
                                  ...workingHours,
                                  [key]: { ...workingHours[key as keyof typeof workingHours], start: e.target.value }
                                })}
                                className="w-24"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">às</Label>
                              <Input
                                type="time"
                                value={workingHours[key as keyof typeof workingHours].end}
                                onChange={(e) => setWorkingHours({
                                  ...workingHours,
                                  [key]: { ...workingHours[key as keyof typeof workingHours], end: e.target.value }
                                })}
                                className="w-24"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    <Button type="submit" className="w-full">
                      Salvar Horários
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
                    Preferências de Notificação
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
                          <Label className="font-medium">Novos Agendamentos</Label>
                          <p className="text-sm text-gray-600">Receber notificação quando houver novos agendamentos</p>
                        </div>
                        <Switch
                          checked={notifications.newAppointments}
                          onCheckedChange={(checked) => setNotifications({...notifications, newAppointments: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Lembretes de Agendamento</Label>
                          <p className="text-sm text-gray-600">Lembrar sobre agendamentos próximos</p>
                        </div>
                        <Switch
                          checked={notifications.appointmentReminders}
                          onCheckedChange={(checked) => setNotifications({...notifications, appointmentReminders: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Cancelamentos</Label>
                          <p className="text-sm text-gray-600">Notificar sobre cancelamentos de agendamentos</p>
                        </div>
                        <Switch
                          checked={notifications.cancellations}
                          onCheckedChange={(checked) => setNotifications({...notifications, cancellations: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Avaliações</Label>
                          <p className="text-sm text-gray-600">Receber notificação sobre novas avaliações</p>
                        </div>
                        <Switch
                          checked={notifications.reviews}
                          onCheckedChange={(checked) => setNotifications({...notifications, reviews: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Marketing</Label>
                          <p className="text-sm text-gray-600">Receber dicas de marketing e atualizações da plataforma</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
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

            <TabsContent value="billing">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                    Plano e Cobrança
                  </CardTitle>
                  <CardDescription>
                    Gerencie seu plano e informações de cobrança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-blue-900">Plano Premium</h3>
                          <p className="text-blue-700">Recursos ilimitados para seu negócio</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-900">R$ 79,90</p>
                          <p className="text-sm text-blue-700">por mês</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recursos inclusos:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Agendamentos ilimitados
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Até 10 profissionais
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Relatórios avançados
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Suporte prioritário
                        </li>
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" className="flex-1">
                        Alterar Plano
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Histórico de Pagamentos
                      </Button>
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

export default BusinessSettings;
