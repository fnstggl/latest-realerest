
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Sliders } from 'lucide-react';
import PropertyFilters from '@/components/PropertyFilters';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  isFiltersCollapsed: boolean;
  setIsFiltersCollapsed: (collapsed: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  isFiltersCollapsed,
  setIsFiltersCollapsed
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center neo-button">
              <div className="flex items-center font-semibold">
                <Sliders size={18} className="mr-2" />
                Filters
              </div>
              <ChevronDown size={16} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] pt-8">
            <PropertyFilters onFilterChange={onFilterChange} />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className={`hidden lg:block transition-all duration-300 ${isFiltersCollapsed ? 'w-12' : 'w-72'} shrink-0`}>
        <div className="sticky top-8">
          <Button 
            variant="ghost" 
            onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            className="mb-4 w-full flex justify-between items-center"
          >
            <span className={isFiltersCollapsed ? 'hidden' : 'block'}>Filters</span>
            <ChevronDown className={`transform transition-transform ${isFiltersCollapsed ? 'rotate-90' : ''}`} />
          </Button>
          <div className={`overflow-hidden transition-all duration-300 ${isFiltersCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
            <PropertyFilters onFilterChange={onFilterChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
