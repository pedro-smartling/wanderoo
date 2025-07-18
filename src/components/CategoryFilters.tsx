import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryFiltersProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ activeFilters, onFilterToggle }) => {
  const categories = [
    { id: 'outdoors', label: 'Outdoors', icon: '🌳' },
    { id: 'museums', label: 'Museums', icon: '🏛️' },
    { id: 'arts', label: 'Arts', icon: '🎨' },
    { id: 'indoors', label: 'Indoors', icon: '🏠' },
    { id: 'sports', label: 'Sports', icon: '⚽' }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeFilters.includes(category.id);
          
          return (
            <Badge
              key={category.id}
              variant={isActive ? "default" : "secondary"}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => onFilterToggle(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilters;