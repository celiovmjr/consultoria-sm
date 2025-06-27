
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building, Search } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { mockBusinesses, Business } from '@/lib/mockData';

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    owner: '',
    plan: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    phone: '',
    email: ''
  });

  const planOptions = [
    { value: 'starter', label: 'Starter - R$ 49/mês' },
    { value: 'professional', label: 'Professional - R$ 99/mês' },
    { value: 'enterprise', label: 'Enterprise - R$ 199/mês' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBusiness) {
      // Update existing business
      setBusinesses(businesses.map(business => 
        business.id === editingBusiness.id 
          ? { ...business, ...formData }
          : business
      ));
    } else {
      // Create new business
      const newBusiness: Business = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBusinesses([...businesses, newBusiness]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      owner: '',
      plan: '',
      status: 'active',
      phone: '',
      email: ''
    });
    setEditingBusiness(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name,
      slug: business.slug,
      description: business.description,
      owner: business.owner,
      plan: business.plan,
      status: business.status,
      phone: business.phone || '',
      email: business.email || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (businessId: string) => {
    setBusinesses(businesses.filter(business => business.id !== businessId));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativo', color: 'bg-green-100 text-green-800' };
      case 'inactive':
        return { label: 'Inativo', color: 'bg-red-100 text-red-800' };
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Negócios</h1>
              <p className="text-gray-600">Gerencie todos os negócios da plataforma</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Negócio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingBusiness ? 'Editar Negócio' : 'Novo Negócio'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBusiness ? 'Edite as informações do negócio' : 'Adicione um novo negócio à plataforma'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Negócio</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Salão Bella Vista"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug/URL</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="salao-bella-vista"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Breve descrição do negócio"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="owner">Proprietário</Label>
                      <Input
                        id="owner"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        placeholder="Nome do proprietário"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan">Plano</Label>
                      <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          {planOptions.map((plan) => (
                            <SelectItem key={plan.value} value={plan.value}>
                              {plan.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 3333-4444"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@negocio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingBusiness ? 'Atualizar' : 'Criar'} Negócio
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome do negócio ou proprietário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Businesses Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Negócios Cadastrados
              </CardTitle>
              <CardDescription>
                {filteredBusinesses.length} negócios encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negócio</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => {
                    const statusInfo = getStatusInfo(business.status);
                    return (
                      <TableRow key={business.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{business.name}</div>
                            <div className="text-sm text-gray-500">{business.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{business.owner}</div>
                            {business.email && (
                              <div className="text-sm text-gray-500">{business.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {business.plan.charAt(0).toUpperCase() + business.plan.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(business.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(business)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(business.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessManagement;
