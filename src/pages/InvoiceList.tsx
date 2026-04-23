import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { InvoiceFormData } from '../types/invoice';
import InvoiceCard from '../components/InvoiceCard';
import FilterDropdown from '../components/FilterDropdown';
import InvoiceForm from '../components/InvoiceForm';

interface InvoiceListProps {
  onSelectInvoice: (id: string) => void;
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
    <div className="mb-10">
      <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="121" cy="100" r="80" fill="#F9FAFE" className="dark:fill-[#252945]"/>
        <ellipse cx="121" cy="100" rx="40" ry="53" fill="white" stroke="#DFE3FA"/>
        <path d="M101 80h40M101 95h40M101 110h25" stroke="#7C5DFA" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="160" cy="55" r="18" fill="#EC375A"/>
        <path d="M160 46v12M160 61v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-5">There is nothing here</h2>
    <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] max-w-[193px] leading-relaxed">
      Create an invoice by clicking the <strong>New Invoice</strong> button and get started
    </p>
  </div>
);

const InvoiceList: React.FC<InvoiceListProps> = ({ onSelectInvoice }) => {
  const { filteredInvoices, filterStatus, addInvoice } = useInvoices();
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: InvoiceFormData, isDraft = false) => {
    addInvoice(data, isDraft);
    setShowForm(false);
  };

  const countText =
    filteredInvoices.length === 0
      ? 'No invoices'
      : `${filteredInvoices.length} ${filterStatus === 'all' ? 'total' : filterStatus} invoice${filteredInvoices.length !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen">
      <main className="md:ml-[103px] px-6 md:px-12 lg:px-[163px] pt-[88px] pb-16 md:pt-20 md:pb-20 max-w-[1440px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#0C0E16] dark:text-white tracking-tight">
              Invoices
            </h1>
            <p className="text-xs text-[#888EB0] dark:text-[#DFE3FA] mt-1 md:mt-2">
              {countText}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            <FilterDropdown />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 md:gap-4 bg-[#7C5DFA] hover:bg-[#9277FF] text-white rounded-full pl-2 pr-4 md:pr-5 py-2 font-bold text-sm transition-colors"
            >
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.313 10.023v-4.21h4.21V4.21h-4.21V0h-1.6v4.21H.5v1.604h4.21v4.21h1.604z" fill="#7C5DFA"/>
                </svg>
              </span>
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={() => onSelectInvoice(invoice.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Invoice Form */}
      {showForm && (
        <InvoiceForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default InvoiceList;
