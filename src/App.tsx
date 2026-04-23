import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';

type View = 'list' | 'detail';

function AppContent() {
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectInvoice = (id: string) => {
    setSelectedId(id);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] transition-colors duration-300">
      <Sidebar />
      {view === 'list' && (
        <InvoiceList onSelectInvoice={handleSelectInvoice} />
      )}
      {view === 'detail' && selectedId && (
        <InvoiceDetail invoiceId={selectedId} onBack={handleBack} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <AppContent />
      </InvoiceProvider>
    </ThemeProvider>
  );
}
