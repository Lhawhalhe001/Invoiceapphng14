import React, { useEffect, useRef } from 'react';

interface DeleteModalProps {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ invoiceId, onConfirm, onCancel }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        // Focus trap
        const focusable = document.querySelectorAll<HTMLElement>(
          '[data-modal] button, [data-modal] [href], [data-modal] input, [data-modal] select, [data-modal] textarea, [data-modal] [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div data-modal className="bg-white dark:bg-[#1E2139] rounded-xl p-8 max-w-[480px] w-full shadow-2xl">
        <h2 id="delete-modal-title" className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-3">
          Confirm Deletion
        </h2>
        <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mb-8 leading-relaxed">
          Are you sure you want to delete invoice <strong className="text-[#0C0E16] dark:text-white">#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-6 py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-4 rounded-full text-sm font-bold text-white bg-[#EC375A] hover:bg-[#FF9DA7] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
