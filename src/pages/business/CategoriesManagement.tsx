
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tag, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import DataTable from '@/components/common/DataTable';

interface Category {
  id: string;
  name: string;
  color: string;
  serviceCount: number;
  createdAt: string;
}

const CategoriesManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Cabelos',
      color: '#8884d8',
      serviceCount: 8,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Unhas',
      color: '#82ca9d',
      serviceCount: 5,
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      name: 'Estética',
      color: '#ffc658',
      serviceCount: 12,
      createdAt: '2024-01-17'
    },
    {
      id: '4',
      name: 'Massagem',
      color: '#ff7c7c',
      serviceCount: 3,
      createdAt: '2024-01-18'
    },
    {
      id: '5',
      name: 'Depilação',
      color: '#a78bfa',
      serviceCount: 6,
      createdAt: '2024-01-19'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#8884d8'
  });

  const predefinedColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa',
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id 
          ? { ...category, name: formData.name, color: formData.color }
          : category
      ));
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        color: formData.color,
        serviceCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Categoria criada",
        description: "A nova categoria foi criada com sucesso.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#8884d8'
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (category.serviceCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria possui serviços associados. Remova os serviços primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    setCategories(categories.filter(c => c.id !== category.id));
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso.",
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value: string, row: Category) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'serviceCount',
      label: 'Serviços',
      render: (value: number) => (
        <Badge variant="secondary">
          {value} serviço{value !== 1 ? 's' : ''}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categorias de Serviços</h1>
              <p className="text-gray-600">Organize seus serviços em categorias</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory ? 'Edite as informações da categoria' : 'Crie uma nova categoria para organizar seus serviços'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Cabelos, Unhas, Estética"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#8884d8"
                        className="flex-1"
                      />
                    </div>
                    
                    <div className="mt-3">
                      <Label className="text-sm text-gray-600">Cores sugeridas:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData({ ...formData, color })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Categorias Cadastradas
              </CardTitle>
              <CardDescription>
                {categories.length} categoria{categories.length !== 1 ? 's' : ''} cadastrada{categories.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>

          {/* Color Preview */}
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                Visualização das Cores
              </CardTitle>
              <CardDescription>
                Como as categorias aparecem na interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="p-4 rounded-lg border text-center" style={{ backgroundColor: category.color + '20', borderColor: category.color }}>
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.serviceCount} serviços</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CategoriesManagement;
