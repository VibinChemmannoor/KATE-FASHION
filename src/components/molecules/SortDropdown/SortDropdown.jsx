import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  'Most Popular',
  'Price: Low-High',
  'Price: High-Low',
  'Newest Arrivals'
];

export function SortDropdown({ value, onChange }) {
  // In a real app we'd want an actual dropdown accessible menu, 
  // but for mock purposes we'll use a native select styled to look custom
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#6B4F3B]/60">Sort by:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent font-bold text-[#4A3525] text-sm pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D47112] rounded"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4A3525] pointer-events-none" />
      </div>
    </div>
  );
}
