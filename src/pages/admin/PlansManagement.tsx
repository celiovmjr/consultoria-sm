import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, Edit, Plus, Search, Trash2, Loader2, Store, Users, Percent } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { usePlans } from '@/hooks/usePlans';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const PlansManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: plans = [], isLoading, error } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    features: '',
    max_professionals: 0,
    max_businesses: 1,
    max_stores: 1,
    commission_percentage: 0,
    is_active: true
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating plan:', formData);
      const { error } = await supabase
        .from('plans')
        .insert([{
          name: formData.name,
          price: formData.price,
          features: formData.features.split('\n').filter(f => f.trim()),
          max_professionals: formData.max_professionals,
          max_businesses: formData.max_businesses,
          max_stores: formData.max_stores,
          commission_percentage: formData.commission_percentage,
          is_active: formData.is_active
        }]);

      if (error) {
        console.error('Error creating plan:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: "Plano criado",
        description: "O novo plano foi criado com sucesso.",
      });
      resetForm();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      max_professionals: plan.max_professionals,
      max_businesses: plan.max_businesses,
      max_stores: plan.max_stores || 1,
      commission_percentage: plan.commission_percentage || 0,
      is_active: plan.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      console.log('Updating plan:', selectedPlan.id, formData);
      const { error } = await supabase
        .from('plans')
        .update({
          name: formData.name,
          price: formData.price,
          features: formData.features.split('\n').filter(f => f.trim()),
          max_professionals: formData.max_professionals,
          max_businesses: formData.max_businesses,
          max_stores: formData.max_stores,
          commission_percentage: formData.commission_percentage,
          is_active: formData.is_active
        })
        .eq('id', selectedPlan.id);

      if (error) {
        console.error('Error updating plan:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: "Plano atualizado",
        description: "O plano foi atualizado com sucesso.",
      });
      resetForm();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      console.log('Deleting plan:', planId);
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) {
        console.error('Error deleting plan:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling plan status:', planId, !currentStatus);
      const { error } = await supabase
        .from('plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);

      if (error) {
        console.error('Error toggling plan status:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: "Status atualizado",
        description: "O status do plano foi alterado com sucesso.",
      });
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      features: '',
      max_professionals: 0,
      max_businesses: 1,
      max_stores: 1,
      commission_percentage: 0,
      is_active: true
    });
    setSelectedPlan(null);
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">Erro ao carregar planos: {error.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxProfessionals">Profissionais</Label>
                      <Input
                        id="maxProfessionals"
                        type="number"
                        placeholder="10"
                        value={formData.max_professionals}
                        onChange={(e) => setFormData({...formData, max_professionals: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxStores">Filiais/Lojas</Label>
                      <Input
                        id="maxStores"
                        type="number"
                        placeholder="3"
                        value={formData.max_stores}
                        onChange={(e) => setFormData({...formData, max_stores: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="commission">Comissão (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      placeholder="3.5"
                      step="0.01"
                      value={formData.commission_percentage}
                      onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value)})}
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
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {plan.subscribers_count} assinantes ativos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">R$ {plan.price}</p>
                      <p className="text-sm text-gray-600">por mês</p>
                    </div>
                    
                    {/* Plan Limits */}
                    <div className="grid grid-cols-3 gap-2 text-center py-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">{plan.max_professionals === -1 ? '∞' : plan.max_professionals}</p>
                        <p className="text-xs text-gray-500">Prof.</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Store className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-sm font-medium">{plan.max_stores === -1 ? '∞' : plan.max_stores}</p>
                        <p className="text-xs text-gray-500">Lojas</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Percent className="w-4 h-4 text-orange-600" />
                        </div>
                        <p className="text-sm font-medium">{plan.commission_percentage || 0}%</p>
                        <p className="text-xs text-gray-500">Comissão</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recursos inclusos:</h4>
                      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, index: number) => (
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
                          onClick={() => handleToggleStatus(plan.id, plan.is_active)}
                          className="flex-1"
                        >
                          {plan.is_active ? 'Desativar' : 'Ativar'}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editMaxProfessionals">Profissionais</Label>
                      <Input
                        id="editMaxProfessionals"
                        type="number"
                        value={formData.max_professionals}
                        onChange={(e) => setFormData({...formData, max_professionals: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editMaxStores">Filiais/Lojas</Label>
                      <Input
                        id="editMaxStores"
                        type="number"
                        value={formData.max_stores}
                        onChange={(e) => setFormData({...formData, max_stores: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editCommission">Comissão (%)</Label>
                    <Input
                      id="editCommission"
                      type="number"
                      step="0.01"
                      value={formData.commission_percentage}
                      onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value)})}
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