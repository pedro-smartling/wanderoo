import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterControlsProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

const FILTER_OPTIONS = [
  { id: 'outdoors', label: 'Outdoors', icon: '🏞️', color: 'fun-green' },
  { id: 'museums', label: 'Museums', icon: '🏛️', color: 'accent' },
  { id: 'arts', label: 'Arts', icon: '🎨', color: 'fun-pink' },
  { id: 'indoors', label: 'Indoors', icon: '🏠', color: 'secondary' },
  { id: 'sports', label: 'Sports', icon: '🏃‍♂️', color: 'fun-orange' },
];

const FilterControls: React.FC<FilterControlsProps> = ({ activeFilters, onFilterToggle }) => {
  return (
    <div className="p-4 bg-muted/30 rounded-2xl mb-6">
      <h3 className="text-lg font-bold text-center mb-4 text-primary">
        🎛️ Choose Your Adventure
      </h3>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterToggle(filter.id)}
              className={cn(
                "transition-all duration-300 hover:scale-105 border-2",
                isActive 
                  ? "bg-primary text-white shadow-lg animate-bounce-in" 
                  : "hover:bg-primary/10 border-primary/20"
              )}
            >
              <span className="mr-1 text-base">{filter.icon}</span>
              {filter.label}
            </Button>
          );
        })}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => activeFilters.forEach(filter => onFilterToggle(filter))}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>
      )}
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        {activeFilters.length === 0 
          ? "Select categories to filter activities" 
          : `Filtering by: ${activeFilters.join(', ')}`
        }
      </p>
    </div>
  );
};

export default FilterControls;