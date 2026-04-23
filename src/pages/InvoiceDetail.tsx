import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { InvoiceFormData } from '../types/invoice';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';
import { formatCurrency, formatDate } from '../utils/helpers';

interface InvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoiceId, onBack }) => {
  const { getInvoice, deleteInvoice, markAsPaid, updateInvoice } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const invoice = getInvoice(invoiceId);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#888EB0] dark:text-[#DFE3FA] mb-4">Invoice not found.</p>
          <button onClick={onBack} className="text-[#7C5DFA] font-bold hover:text-[#9277FF]">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    onBack();
  };

  const handleUpdate = (data: InvoiceFormData) => {
    updateInvoice(invoice.id, data);
    setShowEditForm(false);
  };

  const tdLabel = 'text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-3 block';
  const tdValue = 'text-sm font-bold text-[#0C0E16] dark:text-white';

  return (
    <div className="min-h-screen">
      <main className="md:ml-[103px] px-6 md:px-12 lg:px-[163px] pt-[88px] pb-32 md:pt-20 md:pb-20 max-w-[1440px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-6 mb-8 group"
          aria-label="Go back to invoice list"
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-x-1 transition-transform">
            <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2"/>
          </svg>
          <span className="text-sm font-bold text-[#0C0E16] dark:text-white group-hover:text-[#888EB0] transition-colors">
            Go back
          </span>
        </button>

        {/* Status Bar */}
        <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6 shadow-sm">
          <div className="flex items-center justify-between md:justify-start gap-4 md:gap-5">
            <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Action buttons - desktop */}
          <div className="hidden md:flex items-center gap-2">
            {invoice.status !== 'paid' && (
              <button
                onClick={() => setShowEditForm(true)}
                className="px-6 py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-4 rounded-full text-sm font-bold text-white bg-[#EC375A] hover:bg-[#FF9DA7] transition-colors"
            >
              Delete
            </button>
            {invoice.status === 'pending' && (
              <button
                onClick={() => markAsPaid(invoice.id)}
                className="px-6 py-4 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition-colors"
              >
                Mark as Paid
              </button>
            )}
            {invoice.status === 'draft' && (
              <button
                onClick={() => setShowEditForm(true)}
                className="px-6 py-4 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition-colors"
              >
                Edit & Send
              </button>
            )}
          </div>
        </div>

        {/* Invoice Details Card */}
        <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 md:p-12 shadow-sm">
          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row md:justify-between mb-8 md:mb-12 gap-6">
            <div>
              <p className="text-sm font-bold text-[#0C0E16] dark:text-white mb-2">
                <span className="text-[#7E88C3]">#</span>{invoice.id}
              </p>
              <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">{invoice.description}</p>
            </div>
            <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] leading-relaxed md:text-right">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </address>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 md:mb-12">
            <div>
              <span className={tdLabel}>Invoice Date</span>
              <span className={tdValue}>{formatDate(invoice.createdAt)}</span>
              <span className={`${tdLabel} mt-8`}>Payment Due</span>
              <span className={tdValue}>{formatDate(invoice.paymentDue)}</span>
            </div>
            <div>
              <span className={tdLabel}>Bill To</span>
              <span className={`${tdValue} block mb-2`}>{invoice.clientName}</span>
              <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] leading-relaxed">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </address>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className={tdLabel}>Sent To</span>
              <span className={tdValue}>{invoice.clientEmail}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 py-5">
              <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Item Name</span>
              <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-center">QTY.</span>
              <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-right">Price</span>
              <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-right">Total</span>
            </div>

            {/* Items */}
            <div className="px-6 md:px-8 py-4 md:py-0 space-y-6 md:space-y-0">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="md:grid md:grid-cols-[1fr_80px_120px_120px] gap-4 md:py-5 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-bold text-[#0C0E16] dark:text-white">{item.name}</p>
                    <p className="md:hidden text-sm font-bold text-[#7E88C3] dark:text-[#888EB0] mt-2">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="hidden md:block text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] text-center">{item.quantity}</p>
                  <p className="hidden md:block text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] text-right">{formatCurrency(item.price)}</p>
                  <p className="text-sm font-bold text-[#0C0E16] dark:text-white md:text-right">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg px-6 md:px-8 py-8 flex justify-between items-center mt-4 md:mt-0">
              <span className="text-sm text-white">Amount Due</span>
              <span className="text-2xl font-bold text-white">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E2139] px-6 py-5 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-30">
        {invoice.status !== 'paid' && (
          <button
            onClick={() => setShowEditForm(true)}
            className="flex-1 py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-4 rounded-full text-sm font-bold text-white bg-[#EC375A] hover:bg-[#FF9DA7] transition-colors"
        >
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button
            onClick={() => markAsPaid(invoice.id)}
            className="flex-1 py-4 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition-colors"
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Edit Form */}
      {showEditForm && (
        <InvoiceForm
          invoice={invoice}
          onSave={handleUpdate}
          onClose={() => setShowEditForm(false)}
          isEdit
        />
      )}
    </div>
  );
};

export default InvoiceDetail;
