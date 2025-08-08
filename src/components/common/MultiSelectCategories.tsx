import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface MultiSelectCategoriesProps {
  categories?: Category[];
  selectedCategoryIds?: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  placeholder?: string;
}

const MultiSelectCategories = ({ 
  categories = [], 
  selectedCategoryIds = [], 
  onSelectionChange,
  placeholder = "Selecione as categorias..."
}: MultiSelectCategoriesProps) => {
  
  // Ensure arrays are always defined and valid
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSelectedIds = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [];
  
  // Don't render if no categories available
  if (!safeCategories || safeCategories.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Categorias</Label>
        <div className="p-3 border rounded-md bg-muted/30 text-muted-foreground text-sm">
          Nenhuma categoria disponível
        </div>
      </div>
    );
  }

  const handleCategoryAdd = (categoryId: string) => {
    if (!safeSelectedIds.includes(categoryId)) {
      onSelectionChange([...safeSelectedIds, categoryId]);
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    onSelectionChange(safeSelectedIds.filter(id => id !== categoryId));
  };

  const getCategoryName = (categoryId: string) => {
    const category = safeCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = safeCategories.find(c => c.id === categoryId);
    return category ? category.color : '#3b82f6';
  };

  const availableCategories = safeCategories.filter(category => !safeSelectedIds.includes(category.id));

  return (
    <div>
      <Label>Categorias</Label>
      <div className="space-y-3 mt-2">
        {/* Selected Categories */}
        {safeSelectedIds.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Serviços Selecionados:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {safeSelectedIds.map((categoryId) => {
                const category = safeCategories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} variant="default" className="flex items-center gap-1" style={{ backgroundColor: `${category.color}20`, borderColor: category.color, color: category.color }}>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleCategoryRemove(categoryId)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        {/* Category Selector */}
        {availableCategories.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Adicionar Categoria:</Label>
            <Select onValueChange={handleCategoryAdd}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-lg max-h-48 overflow-y-auto z-50">
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {availableCategories.length === 0 && safeSelectedIds.length > 0 && (
          <p className="text-sm text-muted-foreground">Todas as categorias disponíveis foram selecionadas.</p>
        )}
      </div>
    </div>
  );
};

export default MultiSelectCategories;