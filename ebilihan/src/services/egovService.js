const BASE_URL = import.meta.env.VITE_EGOV_BASE_URL;
const EMESSAGE_BASE_URL = import.meta.env.VITE_EMESSAGE_BASE_URL;
const EMESSAGE_TOKEN = import.meta.env.VITE_EMESSAGE_TOKEN;

let activeOTP = "1234"; 

// --- 1. SSO LOGIN & PROFILE FETCH ---
export const loginWithSSO = async (exchangeCode) => {
  console.log(`[API Call] POST ${BASE_URL}/api/token`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (exchangeCode) {
        resolve({ 
          status: 200, 
          data: { 
            access_token: "eyJh...mock_token...xyz",
            // Simulating profile payload from eGovPH based on your test account
            profile: {
              name: "JOSE CRUZ DELA PEÑA",
              email: "josie@yopmail.com",
              egov_id: "EGOV-2026-8899"
            }
          } 
        });
      } else {
        reject({ status: 422, message: "Invalid exchange code" });
      }
    }, 1200);
  });
};

// --- 2. EMESSAGE LIVE SMS API ---
export const sendLiveOTP = async () => {
  // Generate random 4-digit OTP
  activeOTP = Math.floor(1000 + Math.random() * 9000).toString();
  const messageBody = `eBilihan Hackathon: Your authorization OTP is ${activeOTP}.`;

  // Hardcoded to your number for the live presentation
  const formattedNumber = "+639060585188";

  console.log(`[eMessage API] Sending live SMS to ${formattedNumber}`);

  try {
    const response = await fetch(`${EMESSAGE_BASE_URL}/messaging/v1/sms/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-EMESSAGE-Auth': EMESSAGE_TOKEN
      },
      body: JSON.stringify({
        number: formattedNumber,
        message: messageBody
      })
    });

    if (!response.ok) {
       const errData = await response.json().catch(() => ({}));
       throw new Error(errData.message || `HTTP Error ${response.status}`);
    }
    
    return { status: 200, message: "OTP sent successfully" };
  } catch (error) {
    console.error("eMessage API Error:", error);
    throw error; // Will alert in UI if token is wrong
  }
};

// --- 3. OTP VERIFICATION ---
export const verifyOTP = async (otpCode) => {
  console.log(`[Auth] Verifying inputted OTP: ${otpCode} against actual OTP: ${activeOTP}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otpCode === activeOTP) { 
        resolve({ status: 200, message: "Account Verified" });
      } else {
        reject({ status: 400, message: "Invalid OTP Code" });
      }
    }, 800);
  });
};

// --- 4. MOCK PSGC API FOR LOCATIONS ---
export const fetchLocations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "Cabanatuan City, Nueva Ecija",
        "Palayan City, Nueva Ecija",
        "San Jose City, Nueva Ecija",
        "Gapan City, Nueva Ecija",
        "Quezon City, Metro Manila",
        "Makati City, Metro Manila"
      ]);
    }, 500);
  });
};