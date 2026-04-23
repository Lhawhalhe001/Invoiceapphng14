import React from 'react';
import { Invoice } from '../types/invoice';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-[#1E2139] rounded-lg p-6 shadow-sm border border-transparent hover:border-[#7C5DFA] transition-all duration-200 cursor-pointer group"
    >
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-[#0C0E16] dark:text-white">
            <span className="text-[#7E88C3]">#</span>
            {invoice.id}
          </span>
          <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">{invoice.clientName}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">
              Due {formatDate(invoice.paymentDue)}
            </p>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white">
              {formatCurrency(invoice.total)}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[120px_1fr_1fr_1fr_140px_auto] items-center gap-4">
        <span className="text-sm font-bold text-[#0C0E16] dark:text-white">
          <span className="text-[#7E88C3]">#</span>
          {invoice.id}
        </span>
        <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">{invoice.clientName}</span>
        <span className="text-base font-bold text-[#0C0E16] dark:text-white text-right">
          {formatCurrency(invoice.total)}
        </span>
        <StatusBadge status={invoice.status} />
        <svg
          className="text-[#7C5DFA] group-hover:translate-x-1 transition-transform"
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" />
        </svg>
      </div>
    </button>
  );
};

export default InvoiceCard;
