import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './input';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  suggestions?: {
    materials?: string[];
    styles?: string[];
    colors?: string[];
  };
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search products...',
  debounceMs = 300,
  suggestions,
  isLoading = false,
  className = '',
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Handle clicks outside of search component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for search
    debounceTimer.current = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
  };

  const handleSuggestionClick = (value: string) => {
    setLocalValue(value);
    onChange?.(value);
    onSearch?.(value);
    setShowSuggestions(false);
  };

  const hasSuggestions = suggestions && (
    (suggestions.materials?.length || 0) +
    (suggestions.styles?.length || 0) +
    (suggestions.colors?.length || 0)
  ) > 0;

  return (
    <div ref={searchInputRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-10"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        ) : localValue ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && hasSuggestions && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
          <div className="py-2">
            {suggestions.materials && suggestions.materials.length > 0 && (
              <div className="px-3 py-1">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">Materials</h4>
                {suggestions.materials.map((material, index) => (
                  <button
                    key={`material-${index}`}
                    onClick={() => handleSuggestionClick(material)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {material}
                  </button>
                ))}
              </div>
            )}

            {suggestions.styles && suggestions.styles.length > 0 && (
              <div className="px-3 py-1">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">Styles</h4>
                {suggestions.styles.map((style, index) => (
                  <button
                    key={`style-${index}`}
                    onClick={() => handleSuggestionClick(style)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}

            {suggestions.colors && suggestions.colors.length > 0 && (
              <div className="px-3 py-1">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">Colors</h4>
                {suggestions.colors.map((color, index) => (
                  <button
                    key={`color-${index}`}
                    onClick={() => handleSuggestionClick(color)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};