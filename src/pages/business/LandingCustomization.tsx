
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Eye, Save, Upload, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

const LandingCustomization = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: 'Salão Bella Vista',
    description: 'Salão de beleza especializado em cabelos e estética com mais de 10 anos de experiência.',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    email: 'contato@bellavista.com',
    workingHours: 'Seg-Sex: 9h às 18h | Sáb: 9h às 17h',
    socialMedia: {
      instagram: '@bellavista',
      facebook: 'bellavista',
      whatsapp: '11999999999'
    },
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#f8fafc'
    },
    features: {
      onlineBooking: true,
      showPrices: true,
      showProfessionals: true,
      showReviews: true,
      allowCancellation: true
    },
    seo: {
      metaTitle: 'Salão Bella Vista - Beleza e Estética',
      metaDescription: 'Transforme seu visual no Salão Bella Vista. Serviços de cabelo, estética e muito mais.',
      keywords: 'salão, beleza, cabelo, estética, manicure'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Landing page atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handlePreview = () => {
    window.open('/business-landing-preview', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personalizar Landing Page</h1>
              <p className="text-gray-600">Configure a página inicial da sua loja para os clientes</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="features">Funcionalidades</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Loja</CardTitle>
                  <CardDescription>
                    Configure as informações básicas que aparecerão na sua landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Nome da Loja</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                      <Input
                        id="workingHours"
                        value={formData.workingHours}
                        onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Redes Sociais</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => setFormData({
                            ...formData, 
                            socialMedia: {...formData.socialMedia, instagram: e.target.value}
                          })}
                          placeholder="@usuario"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => setFormData({
                            ...formData, 
                            socialMedia: {...formData.socialMedia, facebook: e.target.value}
                          })}
                          placeholder="pagina"
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp" className="text-sm">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          value={formData.socialMedia.whatsapp}
                          onChange={(e) => setFormData({
                            ...formData, 
                            socialMedia: {...formData.socialMedia, whatsapp: e.target.value}
                          })}
                          placeholder="11999999999"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Design e Cores
                  </CardTitle>
                  <CardDescription>
                    Personalize as cores e aparência da sua landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={formData.theme.primaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, primaryColor: e.target.value}
                          })}
                          className="w-16"
                        />
                        <Input
                          value={formData.theme.primaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, primaryColor: e.target.value}
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={formData.theme.secondaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, secondaryColor: e.target.value}
                          })}
                          className="w-16"
                        />
                        <Input
                          value={formData.theme.secondaryColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, secondaryColor: e.target.value}
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={formData.theme.backgroundColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, backgroundColor: e.target.value}
                          })}
                          className="w-16"
                        />
                        <Input
                          value={formData.theme.backgroundColor}
                          onChange={(e) => setFormData({
                            ...formData, 
                            theme: {...formData.theme, backgroundColor: e.target.value}
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Logo da Loja</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Funcionalidades</CardTitle>
                  <CardDescription>
                    Configure quais recursos estarão disponíveis na sua landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="onlineBooking">Agendamento Online</Label>
                        <p className="text-sm text-gray-500">Permitir que clientes façam agendamentos diretamente</p>
                      </div>
                      <Switch 
                        id="onlineBooking"
                        checked={formData.features.onlineBooking}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          features: {...formData.features, onlineBooking: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showPrices">Exibir Preços</Label>
                        <p className="text-sm text-gray-500">Mostrar os preços dos serviços</p>
                      </div>
                      <Switch 
                        id="showPrices"
                        checked={formData.features.showPrices}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          features: {...formData.features, showPrices: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showProfessionals">Mostrar Profissionais</Label>
                        <p className="text-sm text-gray-500">Exibir a equipe de profissionais</p>
                      </div>
                      <Switch 
                        id="showProfessionals"
                        checked={formData.features.showProfessionals}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          features: {...formData.features, showProfessionals: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showReviews">Exibir Avaliações</Label>
                        <p className="text-sm text-gray-500">Mostrar avaliações de clientes</p>
                      </div>
                      <Switch 
                        id="showReviews"
                        checked={formData.features.showReviews}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          features: {...formData.features, showReviews: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allowCancellation">Permitir Cancelamento</Label>
                        <p className="text-sm text-gray-500">Clientes podem cancelar agendamentos online</p>
                      </div>
                      <Switch 
                        id="allowCancellation"
                        checked={formData.features.allowCancellation}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          features: {...formData.features, allowCancellation: checked}
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    SEO e Visibilidade
                  </CardTitle>
                  <CardDescription>
                    Otimize sua página para aparecer melhor nos mecanismos de busca
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Título da Página (Meta Title)</Label>
                    <Input
                      id="metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo: {...formData.seo, metaTitle: e.target.value}
                      })}
                      placeholder="Título que aparece na aba do navegador e Google"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 60 caracteres</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Descrição da Página (Meta Description)</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo: {...formData.seo, metaDescription: e.target.value}
                      })}
                      placeholder="Descrição que aparece nos resultados do Google"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 160 caracteres</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input
                      id="keywords"
                      value={formData.seo.keywords}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo: {...formData.seo, keywords: e.target.value}
                      })}
                      placeholder="salão, beleza, cabelo, estética (separadas por vírgula)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separe as palavras-chave por vírgula</p>
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

export default LandingCustomization;
