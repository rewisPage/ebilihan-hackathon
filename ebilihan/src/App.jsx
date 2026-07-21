import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, ShieldAlert, Sparkles, User, Fingerprint, Lock, ArrowLeft, Store, MapPin, CheckCircle } from 'lucide-react';
import POS from './POS';
import Loans from './Loans';
import Reports from './Reports';
import { loginWithSSO, sendLiveOTP, verifyOTP, fetchLocations } from './services/egovService';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [userRole, setUserRole] = useState(null); 

  // --- AUTHENTICATION STATES ---
  // Modes: 'main', 'register-intro', 'register-details', 'otp-verify', 'bantay'
  const [authMode, setAuthMode] = useState('main'); 
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  // Profile & Store States
  const [ssoProfile, setSsoProfile] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [locations, setLocations] = useState([]);
  
  // The exact exchange code for josie@yopmail.com
  const EXCHANGE_CODE = "q0UoUrzz78jc4jmvkWumNWQ2NFeWDkrp";

  useEffect(() => {
    fetchLocations().then(data => setLocations(data));
  }, []);

  // --- 1. LOGIN FLOW (SSO -> OTP -> Dashboard) ---
  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const response = await loginWithSSO(EXCHANGE_CODE);
      if (response.status === 200) {
        setSsoProfile(response.data.profile);
        await sendLiveOTP(); 
        setAuthMode('otp-verify');
      }
    } catch (error) {
      alert("SSO Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. REGISTRATION FLOW (SSO -> Details -> OTP -> Dashboard) ---
  const handleRegisterSSOClick = async () => {
    setLoading(true);
    try {
      const response = await loginWithSSO(EXCHANGE_CODE);
      if (response.status === 200) {
        setSsoProfile(response.data.profile);
        setAuthMode('register-details');
      }
    } catch (error) {
      alert("SSO Fetch Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendLiveOTP(); 
      setAuthMode('otp-verify');
    } catch (error) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. OTP VERIFICATION (Used for both Login & Register) ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(otpCode);
      setUserRole('owner');
    } catch (error) {
      alert("Verification Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for the 4-box OTP input
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtpArray = otpCode.padEnd(4, ' ').split('');
    newOtpArray[index] = value;
    const newOtp = newOtpArray.join('').trim();
    setOtpCode(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // --- 4. BANTAY MODE FLOW ---
  const [pin, setPin] = useState('');
  const handleBantayLogin = (e) => {
    e.preventDefault();
    if (pin === "0000") { 
      setUserRole('bantay');
    } else {
      alert("Invalid Bantay PIN.");
    }
  };

  // --- AUTHENTICATION SCREEN UI ---
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-slate-900">
        <div className="w-full max-w-md h-[100vh] md:h-[844px] bg-blue-700 shadow-2xl md:rounded-[40px] flex flex-col border-0 md:border-8 border-slate-800 relative overflow-hidden">
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50 shrink-0">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">eBilihan</h1>
            <p className="text-blue-200 text-sm mb-8">Where Every Sari-Sari Store Grows Smarter.</p>

            <div className="w-full space-y-4">
              
              {/* VIEW: MAIN LOGIN */}
              {authMode === 'main' && (
                <>
                  <button 
                    onClick={handleLoginClick}
                    disabled={loading}
                    className="w-full bg-white text-blue-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    {loading ? 'Connecting to eGovPH...' : 'Login via eGovPH SSO'}
                  </button>

                  <div className="text-center mt-2">
                    <span className="text-blue-200 text-sm">New store owner? </span>
                    <button onClick={() => setAuthMode('register-intro')} className="text-white text-sm font-bold hover:underline">
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

              {/* VIEW: REGISTER INTRO */}
              {authMode === 'register-intro' && (
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 text-left">
                  <button onClick={() => setAuthMode('main')} className="text-blue-200 mb-6 flex items-center text-sm hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                  </button>
                  <h3 className="text-white font-bold text-lg mb-2">Create eBilihan Account</h3>
                  <p className="text-blue-200 text-sm mb-6">We will securely pull your verified identity from your eGovPH app.</p>
                  
                  <button 
                    onClick={handleRegisterSSOClick}
                    disabled={loading}
                    className="w-full bg-white text-blue-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-transform disabled:opacity-70">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    {loading ? 'Pulling Details...' : 'Continue with eGovPH'}
                  </button>
                </div>
              )}

              {/* VIEW: REGISTER DETAILS (Pre-filled via SSO) */}
              {authMode === 'register-details' && ssoProfile && (
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 text-left">
                  {/* Added Back Button Here */}
                  <button onClick={() => setAuthMode('register-intro')} className="text-blue-200 mb-4 flex items-center text-sm hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>

                  <div className="flex items-center gap-2 mb-4 text-emerald-300 bg-emerald-900/30 p-2 rounded-lg border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-medium">eGovPH Identity Verified</span>
                  </div>
                  
                  <form onSubmit={handleRegisterDetailsSubmit} className="space-y-4">
                    {/* Read-Only SSO Data */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase mb-1">Verified Name</label>
                        <input type="text" disabled value={ssoProfile.name} className="w-full px-3 py-2 rounded-lg bg-blue-900/50 text-white border border-blue-500/50 opacity-70" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase mb-1">Email Address</label>
                        <input type="text" disabled value={ssoProfile.email} className="w-full px-3 py-2 rounded-lg bg-blue-900/50 text-white border border-blue-500/50 opacity-70" />
                      </div>
                    </div>

                    <hr className="border-blue-500/30 my-4" />

                    {/* Store Details Input */}
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Store Name</label>
                      <div className="relative">
                        <Store className="w-4 h-4 absolute left-3 top-3.5 text-blue-800" />
                        <input 
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl outline-none text-blue-900 text-sm font-medium"
                          placeholder="e.g. Aling Nena's Store"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-blue-800" />
                        <select 
                          value={storeLocation}
                          onChange={(e) => setStoreLocation(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl outline-none text-blue-900 text-sm font-medium appearance-none"
                          required
                        >
                          <option value="" disabled>Select Municipality/City</option>
                          {locations.map((loc, idx) => (
                            <option key={idx} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-amber-400 text-blue-900 font-bold py-3 mt-2 rounded-xl shadow-lg transition-colors">
                      {loading ? 'Sending OTP...' : 'Complete & Send OTP'}
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW: OTP VERIFICATION */}
              {authMode === 'otp-verify' && (
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 text-left">
                  <button onClick={() => { setAuthMode('main'); setOtpCode(''); }} className="text-blue-200 mb-6 flex items-center text-sm hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Login
                  </button>
                  <h3 className="text-white font-bold text-lg mb-2">2-Step Verification</h3>
                  <p className="text-blue-200 text-sm mb-6">
                    Enter the code sent via eMessage to <br/>
                    <strong className="text-white tracking-wider">+63 906 *** **88</strong>
                  </p>
                  
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    {/* 4-Box OTP Input */}
                    <div className="flex justify-between gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={otpCode[index] || ''}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl rounded-xl focus:ring-2 focus:ring-white outline-none text-blue-900 font-bold shadow-inner"
                          required
                        />
                      ))}
                    </div>
                    
                    <button type="submit" disabled={loading || otpCode.length < 4} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50">
                      {loading ? 'Verifying...' : 'Verify Identity'}
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW: BANTAY MODE */}
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
                    </div>
                    <button type="submit" className="w-full bg-blue-900 border border-blue-500 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                      Enter Shop
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
          <p className="text-center text-blue-400 text-[10px] pb-6 shrink-0">EgovPH Hackathon 2026</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP SHELL (DASHBOARD) ---
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
              {userRole === 'owner' ? storeName || 'My Store' : 'Restricted POS Access'}
            </p>
          </div>
          <div className="bg-blue-800 flex items-center gap-2 text-blue-50 px-2.5 py-1.5 rounded-full text-xs font-medium border border-blue-600 shadow-inner">
            <User className="w-3 h-3 text-amber-300" />
            {userRole === 'owner' ? (ssoProfile?.name || "Jose Dela Peña") : "Bantay"}
            <button onClick={() => { setUserRole(null); setAuthMode('main'); setOtpCode(''); }} className="ml-1 text-blue-300 hover:text-white underline text-[9px]">Logout</button>
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