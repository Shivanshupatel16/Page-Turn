import { useState } from 'react';
import ForgotPassword from '@/components/ui/auth/ForgetPassword';
import OtpVerification from '@/components/ui/auth/OtpVerification';
import ResetPassword from '@/components/ui/auth/ResetPassword';

const AuthPage = () => {
  const [step, setStep] = useState('forgot');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {step === 'forgot' && (
          <ForgotPassword 
            setStep={setStep} 
            setEmail={setEmail} 
          />
        )}
        {step === 'otp' && (
          <OtpVerification 
            setStep={setStep} 
            email={email} 
          />
        )}
        {step === 'reset' && (
          <ResetPassword 
            setStep={setStep} 
            email={email} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;