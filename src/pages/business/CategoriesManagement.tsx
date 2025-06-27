
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';

const CategoriesManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cabelos', description: 'Serviços relacionados a cabelos', servicesCount: 8, color: '#3b82f6' },
    { id: 2, name: 'Unhas', description: 'Manicure e pedicure', servicesCount: 5, color: '#ef4444' },
    { id: 3, name: 'Estética', description: 'Tratamentos estéticos', servicesCount: 12, color: '#10b981' },
    { id: 4, name: 'Massagem', description: 'Massagens terapêuticas', servicesCount: 3, color: '#f59e0b' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: row.original.color }}
          />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'servicesCount',
      header: 'Serviços',
      cell: ({ row }: any) => (
        <Badge variant="secondary">
          {row.getValue('servicesCount')} serviços
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    } else {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        servicesCount: 0
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Categoria criada",
        description: "A nova categoria foi criada com sucesso.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6'
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
              <p className="text-gray-600">Gerencie as categorias dos seus serviços</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory 
                      ? 'Atualize as informações da categoria' 
                      : 'Crie uma nova categoria para organizar seus serviços'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Cabelos, Unhas, Estética..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva os tipos de serviços desta categoria"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Lista de Categorias
              </CardTitle>
              <CardDescription>
                Organize seus serviços por categorias para facilitar a busca dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={categories} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CategoriesManagement;
