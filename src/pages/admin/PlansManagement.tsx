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
    max_businesses: 1,
    max_professionals: 3,
    commission_percentage: 0,
    benefits: '',
    status: 'active'
  });

  // Helper function to extract features from JSONB
  const getPlanFeature = (features: any, key: string, defaultValue: string = 'N/A') => {
    try {
      const featuresObj = typeof features === 'string' ? JSON.parse(features) : features;
      const value = featuresObj?.[key];
      if (value === -1) return '∞';
      return value !== undefined ? value.toString() : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating plan:', formData);
      
      // Create features object
      const featuresObj = {
        max_businesses: formData.max_businesses,
        max_professionals: formData.max_professionals,
        commission_percentage: formData.commission_percentage
      };
      
      const { error } = await supabase
        .from('plans')
        .insert([{
          name: formData.name,
          price: formData.price,
          features: featuresObj,
          status: formData.status
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
    const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;
    setFormData({
      name: plan.name,
      price: plan.price,
      max_businesses: features?.max_businesses || 1,
      max_professionals: features?.max_professionals || 3,
      commission_percentage: features?.commission_percentage || 0,
      benefits: '', // Will be populated from display logic
      status: plan.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      console.log('Updating plan:', selectedPlan.id, formData);
      const featuresObj = {
        max_businesses: formData.max_businesses,
        max_professionals: formData.max_professionals,
        commission_percentage: formData.commission_percentage
      };
      
      const { error } = await supabase
        .from('plans')
        .update({
          name: formData.name,
          price: formData.price,
          features: featuresObj,
          status: formData.status
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

  const handleToggleStatus = async (planId: string, currentStatus: string) => {
    try {
      console.log('Toggling plan status:', planId, currentStatus);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('plans')
        .update({ status: newStatus })
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
      max_businesses: 1,
      max_professionals: 3,
      commission_percentage: 0,
      benefits: '',
      status: 'active'
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gerenciamento de Planos</h1>
              <p className="text-gray-600 text-sm md:text-base">Gerencie os planos de assinatura da plataforma</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 md:mb-6">
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
          <div className="mb-4 md:mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 sm:mx-auto">
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
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="maxBusinesses">Quantidade de Negócios</Label>
                      <Input
                        id="maxBusinesses"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formData.max_businesses}
                        onChange={(e) => setFormData({...formData, max_businesses: parseInt(e.target.value) || 1})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxProfessionals">Quantidade de Profissionais</Label>
                      <Input
                        id="maxProfessionals"
                        type="number"
                        placeholder="3"
                        min="1"
                        value={formData.max_professionals}
                        onChange={(e) => setFormData({...formData, max_professionals: parseInt(e.target.value) || 1})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="commission">Comissão (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.commission_percentage}
                        onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                    <Textarea
                      id="benefits"
                      placeholder="Agendamentos online&#10;Controle de horários&#10;Relatórios básicos&#10;Suporte por email"
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Os limites de negócios e profissionais serão adicionados automaticamente
                    </p>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">Criar Plano</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredPlans.map(plan => (
              <Card key={plan.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                      {plan.name}
                    </CardTitle>
                    <Badge variant={plan.status === 'active' ? "default" : "secondary"} className="text-xs">
                      {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Plano {plan.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-blue-600">R$ {plan.price}</p>
                      <p className="text-xs md:text-sm text-gray-600">por mês</p>
                    </div>
                    
                    {/* Plan Limits */}
                    <div className="grid grid-cols-3 gap-2 text-center py-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <p className="text-xs md:text-sm font-medium">{getPlanFeature(plan.features, 'max_professionals', 'N/A')}</p>
                        <p className="text-xs text-gray-500">Prof.</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Store className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                        </div>
                        <p className="text-xs md:text-sm font-medium">{getPlanFeature(plan.features, 'max_businesses', 'N/A')}</p>
                        <p className="text-xs text-gray-500">Negócios</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Percent className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                        </div>
                        <p className="text-xs md:text-sm font-medium">{getPlanFeature(plan.features, 'commission_percentage', '0')}%</p>
                        <p className="text-xs text-gray-500">Comissão</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-xs md:text-sm">Recursos inclusos:</h4>
                      <div className="max-h-24 overflow-y-auto">
                        {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-xs md:text-sm text-gray-600 mb-1">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="w-full text-xs md:text-sm"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Editar Plano
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(plan.id, plan.status)}
                          className="flex-1 text-xs md:text-sm"
                        >
                          {plan.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 px-2">
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o plano "{plan.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
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
            <DialogContent className="max-w-md mx-4 sm:mx-auto">
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
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="editMaxBusinesses">Quantidade de Negócios</Label>
                      <Input
                        id="editMaxBusinesses"
                        type="number"
                        min="1"
                        value={formData.max_businesses}
                        onChange={(e) => setFormData({...formData, max_businesses: parseInt(e.target.value) || 1})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editMaxProfessionals">Quantidade de Profissionais</Label>
                      <Input
                        id="editMaxProfessionals"
                        type="number"
                        min="1"
                        value={formData.max_professionals}
                        onChange={(e) => setFormData({...formData, max_professionals: parseInt(e.target.value) || 1})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCommission">Comissão (%)</Label>
                      <Input
                        id="editCommission"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.commission_percentage}
                        onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editBenefits">Benefícios (um por linha)</Label>
                    <Textarea
                      id="editBenefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Os limites de negócios e profissionais serão adicionados automaticamente
                    </p>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">Salvar Alterações</Button>
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