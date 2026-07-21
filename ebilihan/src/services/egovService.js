const BASE_URL = import.meta.env.VITE_EGOV_BASE_URL;
const PARTNER_CODE = import.meta.env.VITE_PARTNER_CODE;
const PARTNER_SECRET = import.meta.env.VITE_PARTNER_SECRET;

// Simulates the POST request to {{base_url}}/api/token
export const loginWithSSO = async (exchangeCode) => {
  console.log(`[API Call] POST ${BASE_URL}/api/token`);
  console.log("Payload:", {
    exchange_code: exchangeCode,
    scope: "SSO_AUTHENTICATION",
    partner_code: PARTNER_CODE,
    partner_secret: PARTNER_SECRET
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (exchangeCode) {
        resolve({
          status: 200,
          data: {
            access_token: "eyJh...mock_egov_token_from_test_agency...xyz"
          }
        });
      } else {
        reject({ status: 422, message: "Unprocessable Entity: Invalid exchange code" });
      }
    }, 1200); // 1.2 second delay for realistic loading state
  });
};

// Simulates the eMessage API for New User Registration
export const sendRegistrationOTP = async (mobileNumber) => {
  console.log(`[eMessage API] Sending SMS OTP to ${mobileNumber}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 200, message: "OTP successfully sent" }), 1000);
  });
};

// Simulates OTP Verification
export const verifyOTP = async (otpCode) => {
  console.log(`[Auth] Verifying OTP: ${otpCode}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otpCode === "1234") { // Hardcoded '1234' for demo purposes
        resolve({ status: 200, message: "Account Verified & Created" });
      } else {
        reject({ status: 400, message: "Invalid OTP Code" });
      }
    }, 800);
  });
};