import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, Camera, Send, CheckCircle2, Info } from 'lucide-react';

export default function Reports() {
  const [incidentType, setIncidentType] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
        <h2 className="text-xl font-bold text-slate-800">Encrypting Report...</h2>
        <p className="text-sm text-slate-500">Transmitting to LGU via eReport API</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 py-12 animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-red-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Report Escalated</h2>
          <p className="text-sm text-slate-600 px-4">
            Incident securely logged with authorities via <strong>eReport API</strong>.
          </p>
          <p className="text-xs font-mono bg-slate-100 p-2 rounded mt-4">Ticket: ER-2026-{Math.floor(Math.random() * 9000) + 1000}</p>
        </div>
        <button 
          onClick={() => { setStatus('idle'); setIncidentType(''); }}
          className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-lg mt-8 w-full max-w-[80%]">
          File Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Strict Guideline Banner */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <p className="text-sm font-black text-red-800">Official eReport Gateway</p>
          <p className="text-xs text-red-700 mt-1">
            This module connects directly to government authorities. Strictly for fraud, theft, and severe security incidents. Do not use for unpaid micro-loans.
          </p>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-1">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-600" /> File an Incident
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Incident Type</label>
            <select 
              required
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500">
              <option value="" disabled>Select category...</option>
              <option value="gcash_scam">Fake GCash / Payment Scam</option>
              <option value="supplier_fraud">Wholesale Supplier Fraud</option>
              <option value="theft">Store Theft / Robbery</option>
              <option value="id_fraud">Identity Fraud (High-Value Loan)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Incident Description</label>
            <textarea 
              required
              rows="4"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
              placeholder="Provide exact details of the incident..."
            ></textarea>
          </div>

          <button 
            type="button"
            className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 border border-slate-300 border-dashed hover:bg-slate-200 transition-colors">
            <Camera className="w-4 h-4" /> Attach CCTV or Screenshot Evidence
          </button>

          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-red-700 transition-colors mt-4">
            <Send className="w-4 h-4" /> Escalate via eReport
          </button>
        </form>
      </div>
    </div>
  );
}