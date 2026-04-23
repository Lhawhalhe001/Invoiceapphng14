import React from 'react';
import { InvoiceStatus } from '../types/invoice';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig = {
  paid: {
    label: 'Paid',
    bg: 'bg-[#33D69F]/10 dark:bg-[#33D69F]/10',
    dot: 'bg-[#33D69F]',
    text: 'text-[#33D69F]',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-[#FF8F00]/10 dark:bg-[#FF8F00]/10',
    dot: 'bg-[#FF8F00]',
    text: 'text-[#FF8F00]',
  },
  draft: {
    label: 'Draft',
    bg: 'bg-[#373B53]/10 dark:bg-[#DFE3FA]/10',
    dot: 'bg-[#373B53] dark:bg-[#DFE3FA]',
    text: 'text-[#373B53] dark:text-[#DFE3FA]',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold ${config.bg} ${config.text} min-w-[104px] justify-center`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
