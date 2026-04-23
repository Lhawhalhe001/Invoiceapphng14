import React, { createContext, useContext, useEffect, useState } from 'react';
import { Invoice, InvoiceFormData, InvoiceStatus } from '../types/invoice';
import { generateId, calculatePaymentDue, calculateTotal } from '../utils/helpers';

interface InvoiceContextType {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filterStatus: InvoiceStatus | 'all';
  setFilterStatus: (status: InvoiceStatus | 'all') => void;
  addInvoice: (data: InvoiceFormData, isDraft?: boolean) => void;
  updateInvoice: (id: string, data: InvoiceFormData) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType>({} as InvoiceContextType);

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ id: '1', name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90,
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { id: '2', name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { id: '3', name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 },
    ],
    total: 556.00,
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [{ id: '4', name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33,
  },
  {
    id: 'TY9141',
    createdAt: '2021-10-01',
    paymentDue: '2021-10-31',
    description: 'Logo Design',
    paymentTerms: 30,
    clientName: 'Thomas Wayne',
    clientEmail: 'thomas@dc.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Gotham Drive', city: 'Gotham', postCode: 'GC1 0AB', country: 'United States' },
    items: [{ id: '5', name: 'Logo Redesign', quantity: 1, price: 3102.04, total: 3102.04 }],
    total: 3102.04,
  },
  {
    id: 'FV2353',
    createdAt: '2021-11-05',
    paymentDue: '2021-11-12',
    description: 'Logo Re-design',
    paymentTerms: 7,
    clientName: 'Alysa Werner',
    clientEmail: 'alysa@email.co.uk',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3 Big Corn Street', city: 'Holt', postCode: 'NR25 6DN', country: 'United Kingdom' },
    items: [{ id: '6', name: 'Logo Re-design', quantity: 1, price: 102.04, total: 102.04 }],
    total: 102.04,
  },
];

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : SAMPLE_INVOICES;
  });

  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices =
    filterStatus === 'all' ? invoices : invoices.filter((inv) => inv.status === filterStatus);

  const addInvoice = (data: InvoiceFormData, isDraft = false) => {
    const id = generateId();
    const paymentDue = calculatePaymentDue(data.createdAt, data.paymentTerms);
    const total = calculateTotal(data.items);
    const newInvoice: Invoice = {
      ...data,
      id,
      paymentDue,
      total,
      status: isDraft ? 'draft' : 'pending',
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const updateInvoice = (id: string, data: InvoiceFormData) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...data,
              paymentDue: calculatePaymentDue(data.createdAt, data.paymentTerms),
              total: calculateTotal(data.items),
              status: inv.status === 'draft' ? 'pending' : inv.status,
            }
          : inv
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  };

  const getInvoice = (id: string) => invoices.find((inv) => inv.id === id);

  return (
    <InvoiceContext.Provider
      value={{ invoices, filteredInvoices, filterStatus, setFilterStatus, addInvoice, updateInvoice, deleteInvoice, markAsPaid, getInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);
