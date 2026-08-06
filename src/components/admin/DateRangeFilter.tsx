import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ChevronDown,
  Check,
  X,
  CalendarDays,
  ArrowRight,
  SlidersHorizontal,
  Clock,
} from 'lucide-react';
import {
  DateRangePreset,
  DateWindow,
  PRESET_OPTIONS,
  calculateDateWindow,
  formatDateToYYYYMMDD,
} from '../../admin/dateUtils';

interface DateRangeFilterProps {
  currentPreset: DateRangePreset;
  customStartDate?: string;
  customEndDate?: string;
  onFilterChange: (preset: DateRangePreset, startDate?: string, endDate?: string) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  currentPreset,
  customStartDate,
  customEndDate,
  onFilterChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Local state for custom range inputs before applying
  const todayStr = formatDateToYYYYMMDD(new Date());
  const [tempStartDate, setTempStartDate] = useState<string>(customStartDate || todayStr);
  const [tempEndDate, setTempEndDate] = useState<string>(customEndDate || todayStr);
  const [customError, setCustomError] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Compute active date window details for display in trigger button
  const dateWindow: DateWindow = calculateDateWindow(currentPreset, customStartDate, customEndDate);

  // Sync temp dates when custom props change
  useEffect(() => {
    if (customStartDate) setTempStartDate(customStartDate);
    if (customEndDate) setTempEndDate(customEndDate);
  }, [customStartDate, customEndDate]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowCustomPicker(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectPreset = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomPicker(true);
      return;
    }

    setShowCustomPicker(false);
    setIsOpen(false);
    setCustomError('');
    onFilterChange(preset);
  };

  const handleApplyCustomRange = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!tempStartDate || !tempEndDate) {
      setCustomError('Please select both start and end dates.');
      return;
    }

    if (tempStartDate > tempEndDate) {
      setCustomError('Start date cannot be after end date.');
      return;
    }

    setCustomError('');
    setShowCustomPicker(false);
    setIsOpen(false);
    onFilterChange('custom', tempStartDate, tempEndDate);
  };

  const handleQuickCustomShortcut = (daysAgo: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);

    const startS = formatDateToYYYYMMDD(start);
    const endS = formatDateToYYYYMMDD(end);

    setTempStartDate(startS);
    setTempEndDate(endS);
    setCustomError('');
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Filter Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Filter analytics date range"
        className="group bg-white hover:bg-emerald-50/60 active:bg-emerald-100 text-[#0B6B4E] font-semibold text-xs py-2 px-3.5 rounded-xl border border-emerald-900/20 hover:border-[#0B6B4E]/40 shadow-xs flex items-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
      >
        <div className="p-1 bg-emerald-100/80 rounded-lg text-[#0B6B4E] group-hover:bg-[#0B6B4E] group-hover:text-white transition-colors">
          <CalendarDays className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] text-emerald-800/70 uppercase tracking-wider font-extrabold leading-none">
            Period
          </span>
          <span className="text-xs font-bold text-[#0B6B4E] flex items-center gap-1.5 leading-tight mt-0.5">
            {dateWindow.label}
            <span className="hidden sm:inline font-normal text-[11px] text-emerald-900/60 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-900/10">
              {dateWindow.formattedRangeStr}
            </span>
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-emerald-800 shrink-0 transition-transform duration-200 ml-1 ${
            isOpen ? 'rotate-180 text-[#0B6B4E]' : ''
          }`}
        />
      </button>

      {/* Floating Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-emerald-900/15 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-[#F5F1E8] border-b border-emerald-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0B6B4E] font-bold text-xs">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Select Analytics Timeframe</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-emerald-800/60 hover:text-emerald-950 p-1 rounded-lg hover:bg-emerald-900/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!showCustomPicker ? (
            /* Presets List View */
            <div className="p-2 space-y-0.5 max-h-[380px] overflow-y-auto">
              {PRESET_OPTIONS.map((option) => {
                const isSelected = currentPreset === option.id;
                const optWindow = calculateDateWindow(
                  option.id,
                  option.id === 'custom' ? tempStartDate : undefined,
                  option.id === 'custom' ? tempEndDate : undefined
                );

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectPreset(option.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B6B4E] text-white font-bold shadow-xs'
                        : 'text-emerald-950 hover:bg-[#F5F1E8] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#0B6B4E]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs">{option.label}</div>
                        {option.id !== 'custom' && (
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-emerald-100' : 'text-emerald-800/70'
                            }`}
                          >
                            {optWindow.formattedRangeStr}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                      {option.id === 'custom' && !isSelected && (
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-800/60" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Range Picker Form View */
            <form onSubmit={handleApplyCustomRange} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B6B4E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Custom Date Window
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomPicker(false)}
                  className="text-[11px] font-bold text-emerald-800 hover:underline"
                >
                  ← Back to presets
                </button>
              </div>

              {customError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium rounded-lg">
                  {customError}
                </div>
              )}

              {/* Start Date & End Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900/80 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempStartDate}
                    onChange={(e) => {
                      setTempStartDate(e.target.value);
                      setCustomError('');
                    }}
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-2.5 py-1.5 text-xs text-[#0B6B4E] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-900/80 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempEndDate}
                    onChange={(e) => {
                      setTempEndDate(e.target.value);
                      setCustomError('');
                    }}
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-2.5 py-1.5 text-xs text-[#0B6B4E] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-emerald-900/60 mb-1.5">
                  Quick Shortcuts
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickCustomShortcut(0)}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0B6B4E] text-[10px] font-bold rounded-lg border border-emerald-900/10 cursor-pointer"
                  >
                    Today Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCustomShortcut(7)}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0B6B4E] text-[10px] font-bold rounded-lg border border-emerald-900/10 cursor-pointer"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCustomShortcut(30)}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0B6B4E] text-[10px] font-bold rounded-lg border border-emerald-900/10 cursor-pointer"
                  >
                    Last 30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCustomShortcut(90)}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0B6B4E] text-[10px] font-bold rounded-lg border border-emerald-900/10 cursor-pointer"
                  >
                    Last 90 Days
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-900/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomPicker(false);
                    setCustomError('');
                  }}
                  className="px-3 py-1.5 bg-[#F5F1E8] hover:bg-gray-200 text-emerald-900 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Date Range</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Info Banner */}
          <div className="p-2.5 bg-emerald-900/5 text-[10px] text-emerald-900/70 font-medium text-center border-t border-emerald-900/10">
            Analytics & charts refresh automatically for the selected timeframe.
          </div>
        </div>
      )}
    </div>
  );
};
