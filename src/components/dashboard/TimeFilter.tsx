import React from 'react';
import { ChevronDown, Calendar, Clock, BarChart3 } from 'lucide-react';

export type TimeRange = 'monthly' | 'weekly' | 'annually';

interface TimeFilterProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ selectedTimeRange, onTimeRangeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const timeRangeOptions = [
    { value: 'monthly' as TimeRange, label: 'Monthly', icon: Calendar, description: 'Hiển thị các ngày trong tháng' },
    { value: 'weekly' as TimeRange, label: 'Weekly', icon: Clock, description: 'Hiển thị các ngày trong tuần' },
    { value: 'annually' as TimeRange, label: 'Annually', icon: BarChart3, description: 'Hiển thị các tháng trong năm' },
  ];

  const selectedOption = timeRangeOptions.find(option => option.value === selectedTimeRange);

  const handleOptionClick = (timeRange: TimeRange) => {
    onTimeRangeChange(timeRange);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#43AC78] focus:border-[#43AC78] transition-colors"
      >
        {selectedOption && <selectedOption.icon className="w-4 h-4" />}
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {timeRangeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = option.value === selectedTimeRange;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-[#A8EDCB]/20 border-r-2 border-[#43AC78]' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-[#43AC78]' : 'text-gray-400'}`} />
                    <div>
                      <div className={`text-sm font-medium ${isSelected ? 'text-[#43AC78]' : 'text-gray-900'}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeFilter;
