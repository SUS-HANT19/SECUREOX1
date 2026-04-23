import { useState } from 'react';
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, XCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateEmail, validatePassword } from '../lib/validation';
import { rateLimiter, RATE_LIMITS, getRateLimitIdentifier } from '../lib/rateLimiter';
import { handleError, logError } from '../lib/errorHandler';

interface AuthProps {
  onBack: () => void;
  onSuccess: (userId: string, email: string) => void;
}

type AuthMode = 'login' | 'signup';

const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  if (password.length === 0) return { strength: 0, label: '', color: '' };
  if (password.length < 12) return { strength: 1, label: 'Too short', color: 'bg-red-500' };

  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 1) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
  if (strength === 2) return { strength: 2, label: 'Fair', color: 'bg-orange-500' };
  if (strength === 3) return { strength: 3, label: 'Good', color: 'bg-yellow-500' };
  return { strength: 4, label: 'Strong', color: 'bg-green-500' };
};

export default function Auth({ onBack, onSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Invalid password');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const rateLimitKey = mode === 'signup' ? 'SIGNUP' : 'LOGIN';
    const rateLimitId = getRateLimitIdentifier(rateLimitKey, emailValidation.sanitized);
    const rateCheck = rateLimiter.check(rateLimitId, RATE_LIMITS[rateLimitKey]);

    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil((rateCheck.resetTime - Date.now()) / 60000);
      setError(`Too many attempts. Please try again in ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''}.`);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: emailValidation.sanitized!,
          password,
        });

        if (signUpError) {
          if (signUpError.message?.includes('already registered') || signUpError.message?.includes('already exists')) {
            setError('This email is already registered. Please use the login option instead.');
            setLoading(false);
            setTimeout(() => {
              setMode('login');
              setError('');
            }, 2000);
            return;
          }
          throw signUpError;
        }

        if (data.user) {
          rateLimiter.reset(rateLimitId);

          if (data.user.identities && data.user.identities.length === 0) {
            setError('This email is already registered. Please use the login option instead.');
            setLoading(false);
            setTimeout(() => {
              setMode('login');
              setError('');
            }, 2000);
            return;
          }

          setMessage('Account created successfully! You can now login with your credentials.');
          setLoading(false);

          setTimeout(() => {
            setMode('login');
            setConfirmPassword('');
            setMessage('');
            setError('');
          }, 2000);
          return;
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: emailValidation.sanitized!,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          rateLimiter.reset(rateLimitId);
          setMessage('Login successful! Proceeding to phone verification...');
          setTimeout(() => {
            onSuccess(data.user!.id, emailValidation.sanitized!);
          }, 1500);
        }
      }
    } catch (err: unknown) {
      const appError = handleError(err);
      logError(appError, { mode, email: emailValidation.sanitized });

      let errorMessage = 'An error occurred. Please try again.';

      if (appError.userMessage && typeof appError.userMessage === 'string') {
        errorMessage = appError.userMessage;

        if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
          errorMessage = 'Please confirm your email address before logging in. Check your inbox for the confirmation link.';
        } else if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = mode === 'login'
            ? 'Invalid email or password. Please double-check your credentials.'
            : 'Invalid email or password.';
        } else if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
          errorMessage = 'This email is already registered. Please use the login option instead.';
          setTimeout(() => {
            setMode('login');
            setError('');
          }, 2000);
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {mode === 'signup' && password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => {
                      const { strength, color } = getPasswordStrength(password);
                      return (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= strength ? color : 'bg-gray-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Shield className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">{getPasswordStrength(password).label}</p>
                      <p className="text-gray-500">Minimum 12 characters with uppercase, lowercase, number, and special character</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2 animate-fadeIn">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className={`p-4 border rounded-xl text-sm flex items-start gap-2 animate-fadeIn ${
                message.includes('check your email') || message.includes('confirmation')
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'signup' && password !== confirmPassword)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setMessage('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={loading}
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
