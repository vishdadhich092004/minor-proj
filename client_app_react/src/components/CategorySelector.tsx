import type { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect?: (id: string) => void;
}

const CategorySelector = ({ categories, selectedCategory, onSelect }: CategorySelectorProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      <div 
        className={`flex flex-col items-center gap-2 min-w-[70px] cursor-pointer ${!selectedCategory ? 'opacity-100' : 'opacity-60'}`}
        onClick={() => onSelect?.('')}
      >
        <div className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ${!selectedCategory ? 'ring-2 ring-primary' : ''}`}>
             <span className="font-bold text-primary">All</span>
        </div>
        <span className="text-xs font-medium text-gray-700">All</span>
      </div>

      {categories.map((category) => (
        <div 
            key={category._id} 
            className={`flex flex-col items-center gap-2 min-w-[70px] cursor-pointer ${selectedCategory === category._id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
            onClick={() => onSelect?.(category._id)}
        >
             <div className={`w-14 h-14 rounded-full bg-gray-100 overflow-hidden ${selectedCategory === category._id ? 'ring-2 ring-primary' : ''}`}>
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
             </div>
             <span className="text-xs font-medium text-gray-700 line-clamp-1 text-center w-full">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
