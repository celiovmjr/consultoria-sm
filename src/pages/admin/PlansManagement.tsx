
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Edit, Plus, Search } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

const PlansManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      id: 1,
      name: 'Básico',
      price: 29.90,
      features: ['Até 3 profissionais', 'Agendamentos ilimitados', 'Suporte por email'],
      maxProfessionals: 3,
      maxBusinesses: 1,
      isActive: true,
      subscribersCount: 145
    },
    {
      id: 2,
      name: 'Premium',
      price: 79.90,
      features: ['Até 10 profissionais', 'Relatórios avançados', 'Suporte prioritário', 'Integração com WhatsApp'],
      maxProfessionals: 10,
      maxBusinesses: 1,
      isActive: true,
      subscribersCount: 89
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 149.90,
      features: ['Profissionais ilimitados', 'Múltiplos negócios', 'API dedicada', 'Suporte 24/7'],
      maxProfessionals: -1,
      maxBusinesses: -1,
      isActive: true,
      subscribersCount: 23
    }
  ];

  const handleCreatePlan = () => {
    toast({
      title: "Plano criado",
      description: "O novo plano foi criado com sucesso.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    toast({
      title: "Plano atualizado",
      description: "O plano foi atualizado com sucesso.",
    });
    setIsEditDialogOpen(false);
    setSelectedPlan(null);
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Planos</h1>
              <p className="text-gray-600">Gerencie os planos de assinatura da plataforma</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Plano</DialogTitle>
                  <DialogDescription>
                    Adicione um novo plano de assinatura
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input id="name" placeholder="Ex: Premium Plus" />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input id="price" type="number" placeholder="79.90" step="0.01" />
                  </div>
                  <div>
                    <Label htmlFor="maxProfessionals">Máximo de Profissionais</Label>
                    <Input id="maxProfessionals" type="number" placeholder="10" />
                  </div>
                  <Button onClick={handleCreatePlan} className="w-full">
                    Criar Plano
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar planos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <Card key={plan.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      {plan.name}
                    </CardTitle>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {plan.subscribersCount} assinantes ativos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">R$ {plan.price}</p>
                      <p className="text-sm text-gray-600">por mês</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recursos inclusos:</h4>
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Plano
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Plano</DialogTitle>
                <DialogDescription>
                  Altere as informações do plano
                </DialogDescription>
              </DialogHeader>
              {selectedPlan && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Nome do Plano</Label>
                    <Input id="editName" defaultValue={selectedPlan.name} />
                  </div>
                  <div>
                    <Label htmlFor="editPrice">Preço (R$)</Label>
                    <Input id="editPrice" type="number" defaultValue={selectedPlan.price} step="0.01" />
                  </div>
                  <div>
                    <Label htmlFor="editMaxProfessionals">Máximo de Profissionais</Label>
                    <Input id="editMaxProfessionals" type="number" defaultValue={selectedPlan.maxProfessionals} />
                  </div>
                  <Button onClick={handleUpdatePlan} className="w-full">
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default PlansManagement;
