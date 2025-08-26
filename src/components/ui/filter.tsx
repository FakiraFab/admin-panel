import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface SortOption {
  label: string;
  value: string;
}

interface FilterProps {
  onSortChange: (value: string) => void;
  selectedSort: string;
  sortOptions?: SortOption[];
  className?: string;
}

export const defaultSortOptions: SortOption[] = [
  { label: 'Latest Added', value: '-createdAt' },  // MongoDB descending order
  { label: 'Oldest First', value: 'createdAt' },   // MongoDB ascending order
  { label: 'Name (A-Z)', value: 'name' },          // MongoDB ascending order
  { label: 'Name (Z-A)', value: '-name' },         // MongoDB descending order
];

// Price sort options for products
export const productSortOptions: SortOption[] = [
  ...defaultSortOptions,
  { label: 'Price (Low to High)', value: 'price' },     // MongoDB ascending order
  { label: 'Price (High to Low)', value: '-price' },    // MongoDB descending order
];

// Sort options for inquiries
export const inquirySortOptions: SortOption[] = [
  { label: 'Latest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Customer Name (A-Z)', value: 'userName' },
  { label: 'Customer Name (Z-A)', value: '-userName' },
  { label: 'Product Name (A-Z)', value: 'productName' },
  { label: 'Product Name (Z-A)', value: '-productName' }
];

export const Filter: React.FC<FilterProps> = ({
  onSortChange,
  selectedSort,
  sortOptions = defaultSortOptions,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Sort by:
        </span>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="min-w-[180px] bg-white">
            <SelectValue placeholder="Select sort order" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
