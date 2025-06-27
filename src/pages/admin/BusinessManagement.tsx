
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  plan: string;
  createdAt: string;
}

const BusinessManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Salão Bella Vista',
      owner: 'Maria Silva',
      email: 'maria@bellavista.com',
      phone: '(11) 99999-9999',
      category: 'Salão de Beleza',
      status: 'active',
      plan: 'Premium',
      createdAt: '2024-12-15'
    },
    {
      id: '2',
      name: 'Barbearia do João',
      owner: 'João Santos',
      email: 'joao@barbearia.com',
      phone: '(11) 88888-8888',
      category: 'Barbearia',
      status: 'active',
      plan: 'Basic',
      createdAt: '2024-12-10'
    }
  ]);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (businessId: string, newStatus: 'active' | 'inactive') => {
    setBusinesses(businesses.map(business =>
      business.id === businessId ? { ...business, status: newStatus } : business
    ));
    toast({
      title: "Status atualizado",
      description: `Status do negócio foi alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}.`,
    });
  };

  const handleDelete = (businessId: string) => {
    setBusinesses(businesses.filter(business => business.id !== businessId));
    toast({
      title: "Negócio excluído",
      description: "O negócio foi removido com sucesso.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Negócios</h1>
            <p className="text-gray-600">Administre todos os negócios da plataforma</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Lista de Negócios
                  </CardTitle>
                  <CardDescription>
                    {businesses.length} negócios cadastrados
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Negócio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou proprietário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negócio</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{business.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {business.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{business.owner}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {business.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{business.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(business.status)}>
                          {business.status === 'active' ? 'Ativo' : business.status === 'inactive' ? 'Inativo' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          {business.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleStatusChange(business.id, 'inactive')}
                              className="text-yellow-600"
                            >
                              Desativar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleStatusChange(business.id, 'active')}
                              className="text-green-600"
                            >
                              Ativar
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(business.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
