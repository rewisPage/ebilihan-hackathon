import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ShieldAlert, BarChart3, User, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-slate-900">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-md h-[100vh] md:h-[844px] bg-slate-50 shadow-2xl md:rounded-[40px] flex flex-col overflow-hidden border-0 md:border-8 border-slate-800 relative">
        
        {/* Mobile Status Bar */}
        <div className="bg-blue-700 text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="bg-emerald-400 text-[10px] text-slate-900 px-1.5 py-0.5 rounded-full font-bold">eGovPH Active</span>
          </div>
        </div>

        {/* Header Title */}
        <header className="bg-blue-700 text-white px-4 pb-4 shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              eBilihan <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            </h1>
            <p className="text-xs text-blue-100">Smarter Micro-Retail for SMEs</p>
          </div>
          <div className="bg-blue-800 text-blue-100 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-600">
            Aling Nena's Store
          </div>
        </header>

        {/* Dynamic Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-20">
          {activeTab === 'pos' && (
            <div className="text-center py-10">
              <h2 className="text-lg font-bold text-slate-800">POS & Inventory View</h2>
              <p className="text-sm text-slate-500 mt-1">Ready for Phase 2 build...</p>
            </div>
          )}
          {activeTab === 'loans' && (
            <div className="text-center py-10">
              <h2 className="text-lg font-bold text-slate-800">Smart Loan Ledger (Pautang)</h2>
              <p className="text-sm text-slate-500 mt-1">Ready for Phase 3 build...</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-10">
              <h2 className="text-lg font-bold text-slate-800">eReport & Security</h2>
              <p className="text-sm text-slate-500 mt-1">Ready for Phase 4 build...</p>
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('pos')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'pos' ? 'text-blue-700' : 'text-slate-400'}`}>
            <ShoppingBag className="w-5 h-5" />
            <span>Store POS</span>
          </button>

          <button 
            onClick={() => setActiveTab('loans')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'loans' ? 'text-blue-700' : 'text-slate-400'}`}>
            <CreditCard className="w-5 h-5" />
            <span>Pautang</span>
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'reports' ? 'text-blue-700' : 'text-slate-400'}`}>
            <ShieldAlert className="w-5 h-5" />
            <span>eReport</span>
          </button>
        </nav>

      </div>
    </div>
  );
}