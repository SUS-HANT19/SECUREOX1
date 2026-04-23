import { useState } from 'react';
import { Mail, User, Building2, Phone, MessageSquare, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateEmail, validateText, validatePhone } from '../lib/validation';
import { rateLimiter, RATE_LIMITS, getRateLimitIdentifier } from '../lib/rateLimiter';
import { handleError, logError } from '../lib/errorHandler';

interface RequestDemoProps {
  onBack: () => void;
}

export default function RequestDemo({ onBack }: RequestDemoProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    const nameValidation = validateText(formData.fullName, 'Full name', 2, 100);
    if (!nameValidation.isValid) {
      setError(nameValidation.error || 'Invalid name');
      return;
    }

    const companyValidation = validateText(formData.company, 'Company name', 2, 100);
    if (!companyValidation.isValid) {
      setError(companyValidation.error || 'Invalid company name');
      return;
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Invalid phone number');
        return;
      }
    }

    if (formData.message) {
      const messageValidation = validateText(formData.message, 'Message', 0, 1000);
      if (!messageValidation.isValid) {
        setError(messageValidation.error || 'Invalid message');
        return;
      }
    }

    const rateLimitId = getRateLimitIdentifier('DEMO_REQUEST', emailValidation.sanitized);
    const rateCheck = rateLimiter.check(rateLimitId, RATE_LIMITS.DEMO_REQUEST);

    if (!rateCheck.allowed) {
      const waitHours = Math.ceil((rateCheck.resetTime - Date.now()) / 3600000);
      setError(`You've already submitted a demo request. Please wait ${waitHours} hour${waitHours > 1 ? 's' : ''} before submitting another.`);
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('demo_requests')
        .insert([
          {
            full_name: nameValidation.sanitized,
            email: emailValidation.sanitized,
            company: companyValidation.sanitized,
            phone: formData.phone || null,
            message: formData.message || null,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: unknown) {
      const appError = handleError(err);
      logError(appError, { email: emailValidation.sanitized });
      setError(appError.userMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted!</h2>
            <p className="text-gray-600 mb-2">
              Thank you for your interest in SecureOX!
            </p>
            <p className="text-gray-600 mb-8">
              Our team will contact you within 24-48 hours to schedule your personalized demo.
            </p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <button
          onClick={onBack}
          className="mb-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 text-white"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Request a Demo</h2>
            <p className="text-gray-600 mt-2">
              Schedule a personalized demonstration of SecureOX
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="john@company.com"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Acme Corp"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="+1 (555) 123-4567"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your security needs..."
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
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
                  Submitting Request...
                </>
              ) : (
                'Submit Demo Request'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to be contacted by our sales team.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
