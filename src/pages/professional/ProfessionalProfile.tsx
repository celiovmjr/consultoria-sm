
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { User, Camera, Clock, Shield } from 'lucide-react';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';
import { mockProfessionals, mockServices, WorkingHours } from '@/lib/mockData';

const ProfessionalProfile = () => {
  const [professional] = useState(mockProfessionals[0]);
  const [services] = useState(mockServices);
  
  const [profileData, setProfileData] = useState({
    name: professional.name,
    email: professional.email,
    phone: professional.phone,
    bio: 'Especialista em cabelos com 8 anos de experiência. Apaixonada por transformar e realçar a beleza natural de cada cliente.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>(professional.workingHours);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    // Aqui seria implementada a lógica de atualização do perfil
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    console.log('Password updated');
    // Aqui seria implementada a lógica de alteração de senha
    setProfileData({
      ...profileData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleWorkingHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Working hours updated:', workingHours);
    // Aqui seria implementada a lógica de atualização dos horários
  };

  const updateWorkingHours = (day: keyof WorkingHours, field: keyof WorkingHours[keyof WorkingHours], value: string | boolean) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value
      }
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
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Profile Photo */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-600" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre sua experiência e especialidades..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" variant="outline">
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Horário de Trabalho
              </CardTitle>
              <CardDescription>
                Configure seus horários de disponibilidade
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
                        checked={workingHours[key as keyof WorkingHours].active}
                        onCheckedChange={(checked) => updateWorkingHours(key as keyof WorkingHours, 'active', checked)}
                      />
                      <span className="text-sm text-gray-600">Ativo</span>
                    </div>
                    {workingHours[key as keyof WorkingHours].active && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Das</Label>
                          <Input
                            type="time"
                            value={workingHours[key as keyof WorkingHours].start}
                            onChange={(e) => updateWorkingHours(key as keyof WorkingHours, 'start', e.target.value)}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">às</Label>
                          <Input
                            type="time"
                            value={workingHours[key as keyof WorkingHours].end}
                            onChange={(e) => updateWorkingHours(key as keyof WorkingHours, 'end', e.target.value)}
                            className="w-24"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                <Button type="submit" className="w-full mt-6">
                  Salvar Horários
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle>Serviços que Realizo</CardTitle>
              <CardDescription>
                Serviços autorizados para seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.services.map((serviceId) => {
                  const service = services.find(s => s.id === serviceId);
                  if (!service) return null;
                  
                  return (
                    <div key={serviceId} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.duration} min</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">R$ {service.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Comissão: {professional.commission}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalProfile;
