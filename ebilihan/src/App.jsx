import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ShieldAlert, Sparkles, User, Fingerprint, Lock } from 'lucide-react';
import POS from './POS'; // Importing our new component
import Loans from './Loans';
import Reports from './Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [userRole, setUserRole] = useState(null); // 'owner' or 'bantay'

  // --- AUTHENTICATION SCREEN ---
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-slate-900">
        <div className="w-full max-w-md h-[100vh] md:h-[844px] bg-blue-700 shadow-2xl md:rounded-[40px] flex flex-col border-0 md:border-8 border-slate-800 relative overflow-hidden">
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">eBilihan</h1>
            <p className="text-blue-200 text-sm mb-12">Where Every Sari-Sari Store Grows Smarter.</p>

            <div className="w-full space-y-4">
              <button 
                onClick={() => setUserRole('owner')}
                className="w-full bg-white text-blue-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform">
                <Fingerprint className="w-6 h-6 text-blue-600" />
                Login via eGovPH SSO
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-blue-500"></div>
                <span className="flex-shrink-0 mx-4 text-blue-300 text-xs font-semibold uppercase">Or</span>
                <div className="flex-grow border-t border-blue-500"></div>
              </div>

              <button 
                onClick={() => setUserRole('bantay')}
                className="w-full bg-blue-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-blue-600 hover:bg-blue-900 transition-colors">
                <Lock className="w-5 h-5 text-blue-300" />
                Bantay Mode (PIN)
              </button>
            </div>
          </div>
          <p className="text-center text-blue-400 text-[10px] pb-6">EgovPH Hackathon 2026</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP SHELL ---
  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-slate-900">
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
            <p className="text-[10px] text-blue-200">
              {userRole === 'owner' ? 'Admin Access Granted' : 'Restricted POS Access'}
            </p>
          </div>
          <div className="bg-blue-800 flex items-center gap-2 text-blue-50 px-2.5 py-1.5 rounded-full text-xs font-medium border border-blue-600 shadow-inner">
            <User className="w-3 h-3 text-amber-300" />
            {userRole === 'owner' ? "Aling Nena" : "Bantay"}
            <button onClick={() => setUserRole(null)} className="ml-1 text-blue-300 hover:text-white underline text-[9px]">Logout</button>
          </div>
        </header>

        {/* Dynamic Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-20">
          {activeTab === 'pos' && <POS />}
          {activeTab === 'loans' && <Loans />}
          {activeTab === 'reports' && <Reports />}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center pb-safe">
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