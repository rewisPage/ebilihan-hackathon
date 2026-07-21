import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ShieldAlert, Sparkles, User, Fingerprint, Lock, Phone, ArrowLeft } from 'lucide-react';
import POS from './POS'; // Importing our new component
import Loans from './Loans';
import Reports from './Reports';
import { loginWithSSO, sendRegistrationOTP, verifyOTP } from './services/egovService';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [userRole, setUserRole] = useState(null); // 'owner' or 'bantay'

  // --- NEW AUTHENTICATION STATES ---
  const [authMode, setAuthMode] = useState('main'); // 'main', 'register', 'bantay'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 1. OWNER SSO LOGIN FLOW ---
  const handleSSOLogin = async () => {
    setLoading(true);
    try {
      // Using the exact exchange code you generated
      const generatedExchangeCode = "Iq2fRTnvpF6EcnIPjLJr6Rdvuerr3bV0"; 
      const response = await loginWithSSO(generatedExchangeCode);
      
      if (response.status === 200) {
        setUserRole('owner');
      }
    } catch (error) {
      alert("SSO Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. NEW USER REGISTRATION FLOW ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendRegistrationOTP(mobileNumber);
    setLoading(false);
    setShowOtpInput(true);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(otpCode);
      setUserRole('owner');
    } catch (error) {
      alert("Registration Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. BANTAY MODE FLOW ---
  const handleBantayLogin = (e) => {
    e.preventDefault();
    if (pin === "0000") { // Hardcoded demo PIN
      setUserRole('bantay');
    } else {
      alert("Invalid Bantay PIN. Try 0000.");
    }
  };

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
              
              {/* MAIN AUTH VIEW */}
              {authMode === 'main' && (
                <>
                  <button 
                    onClick={handleSSOLogin}
                    disabled={loading}
                    className="w-full bg-white text-blue-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    {loading ? 'Authenticating...' : 'Login via eGovPH SSO'}
                  </button>

                  <div className="text-center mt-2">
                    <span className="text-blue-200 text-sm">New store owner? </span>
                    <button onClick={() => setAuthMode('register')} className="text-white text-sm font-bold hover:underline">
                      Register here
                    </button>
                  </div>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-blue-500"></div>
                    <span className="flex-shrink-0 mx-4 text-blue-300 text-xs font-semibold uppercase">Or</span>
                    <div className="flex-grow border-t border-blue-500"></div>
                  </div>

                  <button 
                    onClick={() => setAuthMode('bantay')}
                    className="w-full bg-blue-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-blue-600 hover:bg-blue-900 transition-colors">
                    <Lock className="w-5 h-5 text-blue-300" />
                    Bantay Mode (PIN)
                  </button>
                </>
              )}

              {/* REGISTER VIEW */}
              {authMode === 'register' && (
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 text-left">
                  <button onClick={() => { setAuthMode('main'); setShowOtpInput(false); }} className="text-blue-200 mb-4 flex items-center text-sm hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  
                  {!showOtpInput ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Mobile Number</label>
                        <div className="relative">
                          <Phone className="w-5 h-5 absolute left-3 top-3 text-blue-800" />
                          <input 
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-white outline-none text-blue-900 font-medium"
                            placeholder="0917 123 4567"
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-white text-blue-800 font-bold py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors">
                        {loading ? 'Sending OTP...' : 'Send eMessage OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Enter 4-Digit OTP</label>
                        <input 
                          type="text"
                          maxLength="4"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full px-4 py-3 text-center text-2xl tracking-[1em] rounded-xl focus:ring-2 focus:ring-white outline-none text-blue-900 font-bold"
                          required
                        />
                        <p className="text-xs text-center text-blue-200 mt-2">Demo OTP: 1234</p>
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-300 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition-colors">
                        {loading ? 'Verifying...' : 'Verify & Create Account'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* BANTAY PIN VIEW */}
              {authMode === 'bantay' && (
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 text-left">
                  <button onClick={() => setAuthMode('main')} className="text-blue-200 mb-4 flex items-center text-sm hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <form onSubmit={handleBantayLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Helper PIN</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3 top-3 text-blue-800" />
                        <input 
                          type="password"
                          maxLength="4"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-white outline-none text-blue-900 font-bold tracking-widest text-center"
                          placeholder="••••"
                          required
                        />
                      </div>
                      <p className="text-xs text-center text-blue-200 mt-2">Demo PIN: 0000</p>
                    </div>
                    <button type="submit" className="w-full bg-blue-900 border border-blue-500 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                      Enter Shop
                    </button>
                  </form>
                </div>
              )}

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
            <button onClick={() => { setUserRole(null); setAuthMode('main'); }} className="ml-1 text-blue-300 hover:text-white underline text-[9px]">Logout</button>
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