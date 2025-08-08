import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  placeholder = "Selecione categorias..."
}: MultiSelectCategoriesProps) => {
  const [open, setOpen] = useState(false);

  // Ensure arrays are always defined and valid
  const safeCategories = React.useMemo(() => 
    Array.isArray(categories) ? categories : [], 
    [categories]
  );
  const safeSelectedIds = React.useMemo(() => 
    Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [], 
    [selectedCategoryIds]
  );
  
  const selectedCategories = React.useMemo(() => 
    safeCategories.filter(cat => cat && cat.id && safeSelectedIds.includes(cat.id)),
    [safeCategories, safeSelectedIds]
  );

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

  const handleSelect = (categoryId: string) => {
    if (safeSelectedIds.includes(categoryId)) {
      onSelectionChange(safeSelectedIds.filter(id => id !== categoryId));
    } else {
      onSelectionChange([...safeSelectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    onSelectionChange(safeSelectedIds.filter(id => id !== categoryId));
  };

  return (
    <div className="space-y-2">
      <Label>Categorias</Label>
      
      {/* Selected categories display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
          {selectedCategories.map((category) => (
            <Badge 
              key={category.id} 
              variant="secondary" 
              className="flex items-center gap-1 pr-1"
              style={{ backgroundColor: `${category.color}15`, borderColor: category.color }}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              {category.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeCategory(category.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Category selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length > 0 
              ? `${selectedCategories.length} categoria(s) selecionada(s)`
              : placeholder
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup>
              {safeCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleSelect(category.id)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelectedIds.includes(category.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectCategories;