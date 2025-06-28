
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, Edit, Plus, Search, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
  maxProfessionals: number;
  maxBusinesses: number;
  isActive: boolean;
  subscribersCount: number;
}

const PlansManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    features: '',
    maxProfessionals: 0,
    maxBusinesses: 1,
    isActive: true
  });

  const [plans, setPlans] = useState<Plan[]>([
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
  ]);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: Plan = {
      id: Math.max(...plans.map(p => p.id)) + 1,
      name: formData.name,
      price: formData.price,
      features: formData.features.split('\n').filter(f => f.trim()),
      maxProfessionals: formData.maxProfessionals,
      maxBusinesses: formData.maxBusinesses,
      isActive: formData.isActive,
      subscribersCount: 0
    };
    setPlans([...plans, newPlan]);
    toast({
      title: "Plano criado",
      description: "O novo plano foi criado com sucesso.",
    });
    resetForm();
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      features: plan.features.join('\n'),
      maxProfessionals: plan.maxProfessionals,
      maxBusinesses: plan.maxBusinesses,
      isActive: plan.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlan) {
      setPlans(plans.map(plan =>
        plan.id === selectedPlan.id
          ? {
              ...plan,
              name: formData.name,
              price: formData.price,
              features: formData.features.split('\n').filter(f => f.trim()),
              maxProfessionals: formData.maxProfessionals,
              maxBusinesses: formData.maxBusinesses,
              isActive: formData.isActive
            }
          : plan
      ));
      toast({
        title: "Plano atualizado",
        description: "O plano foi atualizado com sucesso.",
      });
      resetForm();
    }
  };

  const handleDeletePlan = (planId: number) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    toast({
      title: "Plano excluído",
      description: "O plano foi removido com sucesso.",
    });
  };

  const handleToggleStatus = (planId: number) => {
    setPlans(plans.map(plan =>
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
    toast({
      title: "Status atualizado",
      description: "O status do plano foi alterado com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      features: '',
      maxProfessionals: 0,
      maxBusinesses: 1,
      isActive: true
    });
    setSelectedPlan(null);
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
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

          {/* Create Button */}
          <div className="mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Novo Plano</DialogTitle>
                  <DialogDescription>
                    Adicione um novo plano de assinatura
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Premium Plus"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="79.90"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxProfessionals">Máximo de Profissionais</Label>
                    <Input
                      id="maxProfessionals"
                      type="number"
                      placeholder="10"
                      value={formData.maxProfessionals}
                      onChange={(e) => setFormData({...formData, maxProfessionals: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="features">Recursos (um por linha)</Label>
                    <Textarea
                      id="features"
                      placeholder="Agendamentos ilimitados&#10;Suporte por email&#10;Relatórios básicos"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Plano</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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

                    <div className="pt-4 border-t space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Plano
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(plan.id)}
                          className="flex-1"
                        >
                          {plan.isActive ? 'Desativar' : 'Ativar'}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o plano "{plan.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="bg-red-600 hover:bg-red-700">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Plano</DialogTitle>
                <DialogDescription>
                  Altere as informações do plano
                </DialogDescription>
              </DialogHeader>
              {selectedPlan && (
                <form onSubmit={handleUpdatePlan} className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Nome do Plano</Label>
                    <Input
                      id="editName"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPrice">Preço (R$)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editMaxProfessionals">Máximo de Profissionais</Label>
                    <Input
                      id="editMaxProfessionals"
                      type="number"
                      value={formData.maxProfessionals}
                      onChange={(e) => setFormData({...formData, maxProfessionals: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editFeatures">Recursos (um por linha)</Label>
                    <Textarea
                      id="editFeatures"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar Alterações</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default PlansManagement;
