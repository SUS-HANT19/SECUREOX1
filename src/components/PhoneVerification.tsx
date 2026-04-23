import { useState } from 'react';
import { Phone, Shield, ArrowLeft, Loader2 } from 'lucide-react';

interface PhoneVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

export default function PhoneVerification({ email, onBack, onVerified }: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const code = generateCode();
      setGeneratedCode(code);
      setMessage(`Demo mode: Your verification code is ${code}`);
      setStep('code');
    } catch (err: any) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    if (verificationCode !== generatedCode) {
      setError('Invalid verification code. Please check the code and try again.');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage('Phone number verified successfully!');
      setTimeout(() => {
        onVerified();
      }, 1000);
    } catch (err: any) {
      setError('Invalid verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleSkipVerification = () => {
    onVerified();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 text-white"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Two-Step Verification</h2>
            <p className="text-gray-600 mt-2">
              {step === 'phone'
                ? 'Enter your phone number to receive a verification code'
                : 'Enter the 6-digit code sent to your phone'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Signed in as: {email}</p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <p className="text-xs text-amber-800 text-center font-medium">
                  Demo Mode: A verification code will be generated and displayed on screen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="+1 (555) 123-4567"
                    maxLength={15}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your phone number including country code
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Phone size={20} />
                    Generate Verification Code
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkipVerification}
                className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                Skip verification (Demo)
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl mb-4">
                <p className="text-xs text-green-800 text-center font-medium mb-2">
                  Your verification code is:
                </p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-green-700 tracking-widest bg-white px-6 py-3 rounded-lg inline-block shadow-md">
                    {generatedCode}
                  </span>
                </div>
                <p className="text-xs text-green-700 text-center mt-2">
                  Copy and enter this code below
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  For demo: {phoneNumber}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Verify Code
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setVerificationCode('');
                  }}
                  className="flex-1 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  disabled={loading}
                >
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={handleSkipVerification}
                  className="flex-1 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
                  disabled={loading}
                >
                  Skip (Demo)
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 text-center font-medium mb-1">
              Demo Mode Information
            </p>
            <p className="text-xs text-blue-700 text-center">
              In production, two-step verification adds an extra layer of security by sending a real SMS to your phone. This demo generates codes on-screen for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
