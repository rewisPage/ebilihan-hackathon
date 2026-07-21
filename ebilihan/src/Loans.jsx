import React, { useState } from 'react';
import { FileText, ShieldCheck, Fingerprint, Send, AlertTriangle, CheckCircle2, History } from 'lucide-react';

export default function Loans() {
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [eodHash, setEodHash] = useState(null);

  const handleLoanSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const loanAmount = parseFloat(amount);
    
    // Simulate API delay
    setTimeout(() => {
      setStatus('success');
    }, loanAmount > 500 ? 3000 : 1000); // Longer delay for Tier 2 KYC
  };

  const handleEodSync = () => {
    // Generate a mock SHA-256 hash for the eGovchain commit
    const mockHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setEodHash(mockHash);
  };

  if (status === 'loading') {
    const isTier2 = parseFloat(amount) > 500;
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in zoom-in duration-300 py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700"></div>
        <h2 className="text-xl font-bold text-slate-800 text-center">
          {isTier2 ? "Initiating KYC..." : "Verifying eGovPH QR..."}
        </h2>
        {isTier2 && (
          <div className="space-y-2 text-sm text-slate-500 text-center flex flex-col items-center">
            <p className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-blue-500" /> Face Liveness API triggered</p>
            <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> NationalID eVerify check</p>
          </div>
        )}
      </div>
    );
  }

  if (status === 'success') {
    const isTier2 = parseFloat(amount) > 500;
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in zoom-in duration-300 py-12">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Loan Approved</h2>
          {isTier2 ? (
            <p className="text-sm text-slate-600 px-4">
              Smart contract PDF generated.<br/>Sent to {customer} via <strong>eMessage API</strong>.
            </p>
          ) : (
            <p className="text-sm text-slate-600 px-4">
              Micro-loan logged.<br/>Verified via trusted eGovPH QR.
            </p>
          )}
          <p className="text-3xl font-black text-blue-700 mt-4">₱{parseFloat(amount).toFixed(2)}</p>
        </div>
        <button 
          onClick={() => { setStatus('idle'); setAmount(''); setCustomer(''); }}
          className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg mt-8 w-full max-w-[80%]">
          New Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Risk Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800">Tiered Risk Management Active</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Loans &gt; ₱500 require Face Liveness & PDF Contracts.</p>
        </div>
      </div>

      {/* Loan Input Form */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Create Pautang Ledger
        </h2>
        <form onSubmit={handleLoanSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Customer Name / eGovPH ID</label>
            <input 
              type="text" 
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Juan Dela Cruz"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Loan Amount (₱)</label>
            <input 
              type="number" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-blue-900 transition-colors">
            <Send className="w-4 h-4" /> Process Loan
          </button>
        </form>
      </div>

      {/* eGovchain Batch EOD Sync */}
      <div className="mt-auto pt-6">
        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><History className="w-24 h-24 text-white" /></div>
          <h3 className="text-white font-bold mb-1">End of Day (EOD) Sync</h3>
          <p className="text-slate-400 text-xs mb-4">Commit daily aggregate to eGovchain</p>
          
          {eodHash ? (
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-emerald-400 text-[10px] font-bold mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Successfully committed to ledger
              </p>
              <p className="text-slate-300 font-mono text-[8px] break-all">{eodHash}</p>
            </div>
          ) : (
            <button 
              onClick={handleEodSync}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-3 rounded-xl font-bold text-sm transition-colors shadow-emerald-500/20 shadow-lg">
              Generate EOD Hash & Sync
            </button>
          )}
        </div>
      </div>
    </div>
  );
}