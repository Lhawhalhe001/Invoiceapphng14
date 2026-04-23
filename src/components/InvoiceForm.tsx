import React, { useState, useEffect, useRef } from 'react';
import { Invoice, InvoiceFormData, InvoiceItem } from '../types/invoice';
import { generateItemId } from '../utils/helpers';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave: (data: InvoiceFormData, isDraft?: boolean) => void;
  onClose: () => void;
  isEdit?: boolean;
}

interface FormErrors {
  clientName?: string;
  clientEmail?: string;
  description?: string;
  createdAt?: string;
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  items?: string;
  [key: string]: string | undefined;
}

const emptyForm: InvoiceFormData = {
  createdAt: new Date().toISOString().split('T')[0],
  description: '',
  paymentTerms: 30,
  clientName: '',
  clientEmail: '',
  status: 'pending',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSave, onClose, isEdit }) => {
  const [form, setForm] = useState<InvoiceFormData>(
    invoice
      ? {
          createdAt: invoice.createdAt,
          description: invoice.description,
          paymentTerms: invoice.paymentTerms,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          status: invoice.status,
          senderAddress: { ...invoice.senderAddress },
          clientAddress: { ...invoice.clientAddress },
          items: invoice.items.map((i) => ({ ...i })),
        }
      : { ...emptyForm }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when form is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = (skipItems = false): boolean => {
    const newErrors: FormErrors = {};
    if (!form.clientName.trim()) newErrors.clientName = 'Required';
    if (!form.clientEmail.trim()) {
      newErrors.clientEmail = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(form.clientEmail)) {
      newErrors.clientEmail = 'Must be a valid email';
    }
    if (!form.description.trim()) newErrors.description = 'Required';
    if (!form.createdAt) newErrors.createdAt = 'Required';
    if (!form.senderAddress.street.trim()) newErrors.senderStreet = 'Required';
    if (!form.senderAddress.city.trim()) newErrors.senderCity = 'Required';
    if (!form.senderAddress.postCode.trim()) newErrors.senderPostCode = 'Required';
    if (!form.senderAddress.country.trim()) newErrors.senderCountry = 'Required';
    if (!form.clientAddress.street.trim()) newErrors.clientStreet = 'Required';
    if (!form.clientAddress.city.trim()) newErrors.clientCity = 'Required';
    if (!form.clientAddress.postCode.trim()) newErrors.clientPostCode = 'Required';
    if (!form.clientAddress.country.trim()) newErrors.clientCountry = 'Required';

    if (!skipItems) {
      if (form.items.length === 0) {
        newErrors.items = 'An item must be added';
      } else {
        form.items.forEach((item, idx) => {
          if (!item.name.trim()) newErrors[`item_name_${idx}`] = 'Required';
          if (item.quantity <= 0) newErrors[`item_qty_${idx}`] = 'Must be > 0';
          if (item.price < 0) newErrors[`item_price_${idx}`] = 'Must be >= 0';
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(form, false);
    }
  };

  const handleSaveDraft = () => {
    onSave(form, true);
  };

  const updateSender = (field: keyof typeof form.senderAddress, value: string) => {
    setForm((prev) => ({ ...prev, senderAddress: { ...prev.senderAddress, [field]: value } }));
  };

  const updateClient = (field: keyof typeof form.clientAddress, value: string) => {
    setForm((prev) => ({ ...prev, clientAddress: { ...prev.clientAddress, [field]: value } }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: generateItemId(), name: '', quantity: 1, price: 0, total: 0 }],
    }));
  };

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setForm((prev) => {
      const updated = prev.items.map((item, i) => {
        if (i !== idx) return item;
        const newItem = { ...item, [field]: value };
        newItem.total = Number(newItem.quantity) * Number(newItem.price);
        return newItem;
      });
      return { ...prev, items: updated };
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-md border text-sm font-bold text-[#0C0E16] dark:text-white bg-white dark:bg-[#1E2139] outline-none transition-colors ${
      hasError
        ? 'border-[#EC375A]'
        : 'border-[#DFE3FA] dark:border-[#252945] focus:border-[#7C5DFA] dark:focus:border-[#7C5DFA]'
    }`;

  const labelClass = 'block text-xs font-medium text-[#7E88C3] dark:text-[#DFE3FA] mb-2';

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Form Panel */}
      <div className="relative md:ml-[103px] w-full max-w-[719px] bg-white dark:bg-[#141625] h-full flex flex-col shadow-2xl rounded-r-[20px]">
        {/* Header */}
        <div className="px-6 md:px-14 pt-14 pb-4">
          <h1 className="text-2xl font-bold text-[#0C0E16] dark:text-white">
            {isEdit ? (
              <>Edit <span className="text-[#888EB0]">#</span>{invoice?.id}</>
            ) : (
              'New Invoice'
            )}
          </h1>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="invoice-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 md:px-14 pb-8 space-y-10"
          noValidate
        >
          {/* Bill From */}
          <section>
            <h2 className="text-xs font-bold text-[#7C5DFA] mb-6">Bill From</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass.replace(' mb-2', '')} htmlFor="senderStreet">Street Address</label>
                  {errors.senderStreet && <span className="text-xs text-[#EC375A]">{errors.senderStreet}</span>}
                </div>
                <input
                  ref={firstInputRef}
                  id="senderStreet"
                  className={inputClass(!!errors.senderStreet)}
                  value={form.senderAddress.street}
                  onChange={(e) => updateSender('street', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="senderCity">City</label>
                    {errors.senderCity && <span className="text-xs text-[#EC375A]">{errors.senderCity}</span>}
                  </div>
                  <input id="senderCity" className={inputClass(!!errors.senderCity)} value={form.senderAddress.city} onChange={(e) => updateSender('city', e.target.value)} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="senderPostCode">Post Code</label>
                    {errors.senderPostCode && <span className="text-xs text-[#EC375A]">{errors.senderPostCode}</span>}
                  </div>
                  <input id="senderPostCode" className={inputClass(!!errors.senderPostCode)} value={form.senderAddress.postCode} onChange={(e) => updateSender('postCode', e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="senderCountry">Country</label>
                    {errors.senderCountry && <span className="text-xs text-[#EC375A]">{errors.senderCountry}</span>}
                  </div>
                  <input id="senderCountry" className={inputClass(!!errors.senderCountry)} value={form.senderAddress.country} onChange={(e) => updateSender('country', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section>
            <h2 className="text-xs font-bold text-[#7C5DFA] mb-6">Bill To</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass.replace(' mb-2', '')} htmlFor="clientName">Client's Name</label>
                  {errors.clientName && <span className="text-xs text-[#EC375A]">{errors.clientName}</span>}
                </div>
                <input id="clientName" className={inputClass(!!errors.clientName)} value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass.replace(' mb-2', '')} htmlFor="clientEmail">Client's Email</label>
                  {errors.clientEmail && <span className="text-xs text-[#EC375A]">{errors.clientEmail}</span>}
                </div>
                <input id="clientEmail" type="email" className={inputClass(!!errors.clientEmail)} value={form.clientEmail} onChange={(e) => setForm((p) => ({ ...p, clientEmail: e.target.value }))} placeholder="e.g. email@example.com" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass.replace(' mb-2', '')} htmlFor="clientStreet">Street Address</label>
                  {errors.clientStreet && <span className="text-xs text-[#EC375A]">{errors.clientStreet}</span>}
                </div>
                <input id="clientStreet" className={inputClass(!!errors.clientStreet)} value={form.clientAddress.street} onChange={(e) => updateClient('street', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="clientCity">City</label>
                    {errors.clientCity && <span className="text-xs text-[#EC375A]">{errors.clientCity}</span>}
                  </div>
                  <input id="clientCity" className={inputClass(!!errors.clientCity)} value={form.clientAddress.city} onChange={(e) => updateClient('city', e.target.value)} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="clientPostCode">Post Code</label>
                    {errors.clientPostCode && <span className="text-xs text-[#EC375A]">{errors.clientPostCode}</span>}
                  </div>
                  <input id="clientPostCode" className={inputClass(!!errors.clientPostCode)} value={form.clientAddress.postCode} onChange={(e) => updateClient('postCode', e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass.replace(' mb-2', '')} htmlFor="clientCountry">Country</label>
                    {errors.clientCountry && <span className="text-xs text-[#EC375A]">{errors.clientCountry}</span>}
                  </div>
                  <input id="clientCountry" className={inputClass(!!errors.clientCountry)} value={form.clientAddress.country} onChange={(e) => updateClient('country', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* Invoice Details */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass.replace(' mb-2', '')} htmlFor="invoiceDate">Invoice Date</label>
                  {errors.createdAt && <span className="text-xs text-[#EC375A]">{errors.createdAt}</span>}
                </div>
                <input
                  id="invoiceDate"
                  type="date"
                  className={inputClass(!!errors.createdAt)}
                  value={form.createdAt}
                  onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
                  disabled={isEdit && invoice?.status !== 'draft'}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="paymentTerms">Payment Terms</label>
                <select
                  id="paymentTerms"
                  className={inputClass(false) + ' cursor-pointer'}
                  value={form.paymentTerms}
                  onChange={(e) => setForm((p) => ({ ...p, paymentTerms: Number(e.target.value) }))}
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelClass.replace(' mb-2', '')} htmlFor="description">Project Description</label>
                {errors.description && <span className="text-xs text-[#EC375A]">{errors.description}</span>}
              </div>
              <input id="description" className={inputClass(!!errors.description)} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. Graphic Design Service" />
            </div>
          </section>

          {/* Item List */}
          <section>
            <h2 className="text-lg font-bold text-[#777F98] mb-6">Item List</h2>
            {form.items.length > 0 && (
              <div className="hidden md:grid grid-cols-[1fr_80px_110px_80px_24px] gap-4 mb-4">
                <span className={labelClass}>Item Name</span>
                <span className={labelClass}>Qty.</span>
                <span className={labelClass}>Price</span>
                <span className={labelClass}>Total</span>
                <span />
              </div>
            )}
            <div className="space-y-6">
              {form.items.map((item, idx) => (
                <div key={item.id}>
                  {/* Mobile Item */}
                  <div className="md:hidden space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className={labelClass.replace(' mb-2', '')} htmlFor={`item-name-${idx}`}>Item Name</label>
                        {errors[`item_name_${idx}`] && <span className="text-xs text-[#EC375A]">{errors[`item_name_${idx}`]}</span>}
                      </div>
                      <input id={`item-name-${idx}`} className={inputClass(!!errors[`item_name_${idx}`])} value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-[80px_1fr_80px_24px] gap-4 items-end">
                      <div>
                        <label className={labelClass} htmlFor={`item-qty-${idx}`}>Qty.</label>
                        <input id={`item-qty-${idx}`} type="number" min="1" className={inputClass(!!errors[`item_qty_${idx}`])} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor={`item-price-${idx}`}>Price</label>
                        <input id={`item-price-${idx}`} type="number" min="0" step="0.01" className={inputClass(!!errors[`item_price_${idx}`])} value={item.price} onChange={(e) => updateItem(idx, 'price', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className={labelClass}>Total</label>
                        <p className="text-sm font-bold text-[#888EB0] pt-3">{item.total.toFixed(2)}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(idx)} className="mb-1 text-[#888EB0] hover:text-[#EC375A] transition-colors" aria-label="Remove item">
                        <svg width="13" height="16" viewBox="0 0 13 16" fill="none"><path d="M11.583 3.556h-2.417V2.278A1.278 1.278 0 008.889 1H4.111a1.278 1.278 0 00-1.278 1.278v1.278H.417a.417.417 0 000 .833h.986l.84 9.527A1.278 1.278 0 003.52 15h5.96a1.278 1.278 0 001.278-1.084l.84-9.527h.985a.417.417 0 000-.833zm-7.917-1.278a.444.444 0 01.445-.445h4.778a.444.444 0 01.444.445v1.278H3.666V2.278zm6.107 11.565a.445.445 0 01-.443.379H3.52a.445.445 0 01-.443-.379L2.24 4.39h8.52l-.57 9.453z" fill="currentColor"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Item */}
                  <div className="hidden md:grid grid-cols-[1fr_80px_110px_80px_24px] gap-4 items-center">
                    <div>
                      {errors[`item_name_${idx}`] && <span className="text-xs text-[#EC375A] block mb-1">{errors[`item_name_${idx}`]}</span>}
                      <input aria-label="Item name" className={inputClass(!!errors[`item_name_${idx}`])} value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                    </div>
                    <input aria-label="Quantity" type="number" min="1" className={inputClass(!!errors[`item_qty_${idx}`])} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} />
                    <input aria-label="Price" type="number" min="0" step="0.01" className={inputClass(!!errors[`item_price_${idx}`])} value={item.price} onChange={(e) => updateItem(idx, 'price', Number(e.target.value))} />
                    <p className="text-sm font-bold text-[#888EB0]">{item.total.toFixed(2)}</p>
                    <button type="button" onClick={() => removeItem(idx)} className="text-[#888EB0] hover:text-[#EC375A] transition-colors flex justify-center" aria-label="Remove item">
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none"><path d="M11.583 3.556h-2.417V2.278A1.278 1.278 0 008.889 1H4.111a1.278 1.278 0 00-1.278 1.278v1.278H.417a.417.417 0 000 .833h.986l.84 9.527A1.278 1.278 0 003.52 15h5.96a1.278 1.278 0 001.278-1.084l.84-9.527h.985a.417.417 0 000-.833zm-7.917-1.278a.444.444 0 01.445-.445h4.778a.444.444 0 01.444.445v1.278H3.666V2.278zm6.107 11.565a.445.445 0 01-.443.379H3.52a.445.445 0 01-.443-.379L2.24 4.39h8.52l-.57 9.453z" fill="currentColor"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="mt-4 text-xs text-[#EC375A] font-semibold">{errors.items}</p>
            )}

            <button
              type="button"
              onClick={addItem}
              className="mt-6 w-full py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors"
            >
              + Add New Item
            </button>
          </section>
        </form>

        {/* Footer Buttons */}
        <div className="px-6 md:px-14 py-8 bg-white dark:bg-[#141625] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
          {!isEdit ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 px-5 py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors"
              >
                Discard
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-4 rounded-full text-sm font-bold text-[#888EB0] dark:text-[#DFE3FA] bg-[#373B53] dark:bg-[#373B53] hover:bg-[#0C0E16] transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                form="invoice-form"
                className="px-5 py-4 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition-colors"
              >
                Save & Send
              </button>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="invoice-form"
                className="px-6 py-4 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
