import { Award, Calendar, Clock, Filter, SortDesc, TrendingUp } from "lucide-react";
import { useState } from "react";


const FilterBar = ({ categories, selectedCategoryId, onCategoryChange }) => {
  const [activeFilter, setActiveFilter] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');

  const filterOptions = [
    { id: 'newest', label: 'Newest', icon: Clock },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex space-x-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategoryId === cat.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-blue-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="flex space-x-1">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeFilter === option.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <option.icon className="h-4 w-4 mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

