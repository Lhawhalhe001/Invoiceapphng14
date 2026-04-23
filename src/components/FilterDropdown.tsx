import React, { useState, useRef, useEffect } from 'react';
import { InvoiceStatus } from '../types/invoice';
import { useInvoices } from '../context/InvoiceContext';

const FilterDropdown: React.FC = () => {
  const { filterStatus, setFilterStatus } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: InvoiceStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: InvoiceStatus | 'all') => {
    setFilterStatus(value);
  };

  const displayLabel =
    filterStatus === 'all'
      ? 'Filter by status'
      : `Filter: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 font-bold text-sm text-[#0C0E16] dark:text-white hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="hidden sm:inline">{displayLabel}</span>
        <span className="sm:hidden">Filter</span>
        <svg
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 bg-white dark:bg-[#252945] rounded-lg shadow-2xl p-6 space-y-4 z-50"
        >
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
              role="option"
              aria-selected={filterStatus === opt.value}
            >
              <div
                className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${
                  filterStatus === opt.value
                    ? 'bg-[#7C5DFA]'
                    : 'bg-[#DFE3FA] dark:bg-[#1E2139] group-hover:border-[#7C5DFA] border-2 border-transparent'
                }`}
                onClick={() => handleToggle(opt.value)}
              >
                {filterStatus === opt.value && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4L3.5 6L8.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm font-bold text-[#0C0E16] dark:text-white"
                onClick={() => handleToggle(opt.value)}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
