import { useState, useRef } from 'react';
import { Lock, Copy, Check, Shield, Unlock } from 'lucide-react';
import { encryptText, decryptText } from '../lib/encryption';
import { logOperation, generateRequestId } from '../lib/logging';
import { rateLimiter, RATE_LIMITS, getRateLimitIdentifier } from '../lib/rateLimiter';
import { handleError, logError, ErrorCode } from '../lib/errorHandler';

export default function TextEncryption() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [decryptPassphrase, setDecryptPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const requestIdRef = useRef<string>(generateRequestId());

  const handleEncrypt = async () => {
    if (!plaintext || !passphrase) {
      setError('Please enter text and a passphrase');
      return;
    }

    const rateLimitId = getRateLimitIdentifier('ENCRYPTION');
    const rateCheck = rateLimiter.check(rateLimitId, RATE_LIMITS.ENCRYPTION);

    if (!rateCheck.allowed) {
      const waitSeconds = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
      setError(`Rate limit exceeded. Please wait ${waitSeconds} seconds before trying again.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    const startTime = performance.now();

    try {
      const encrypted = await encryptText(plaintext, passphrase);
      setCiphertext(encrypted);
      setSuccess('Text encrypted successfully!');
      const latency = Math.round(performance.now() - startTime);
      await logOperation('encrypt', latency, 'success', requestIdRef.current);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const appError = handleError(err);
      logError(appError);
      setError(appError.userMessage);
      const latency = Math.round(performance.now() - startTime);
      await logOperation('encrypt', latency, 'error', requestIdRef.current, undefined, ErrorCode.ENCRYPTION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !decryptPassphrase) {
      setError('Please enter ciphertext and passphrase');
      return;
    }

    const rateLimitId = getRateLimitIdentifier('ENCRYPTION');
    const rateCheck = rateLimiter.check(rateLimitId, RATE_LIMITS.ENCRYPTION);

    if (!rateCheck.allowed) {
      const waitSeconds = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
      setError(`Rate limit exceeded. Please wait ${waitSeconds} seconds before trying again.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    const startTime = performance.now();

    try {
      const decrypted = await decryptText(ciphertext, decryptPassphrase);
      setPlaintext(decrypted);
      setSuccess('Text decrypted successfully!');
      const latency = Math.round(performance.now() - startTime);
      await logOperation('decrypt', latency, 'success', requestIdRef.current);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const appError = handleError(err);
      logError(appError);
      setError(appError.userMessage);
      const latency = Math.round(performance.now() - startTime);
      await logOperation('decrypt', latency, 'error', requestIdRef.current, undefined, ErrorCode.DECRYPTION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Text Encryption</h2>
            <p className="text-xs md:text-sm text-gray-600">Secure your messages with AES-256-GCM encryption</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-3 mb-6">
        <button
          onClick={() => {
            setMode('encrypt');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            mode === 'encrypt'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt
        </button>
        <button
          onClick={() => {
            setMode('decrypt');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            mode === 'decrypt'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt
        </button>
      </div>

      {mode === 'encrypt' ? (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plaintext
            </label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt..."
              className="w-full h-32 md:h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 resize-none text-sm md:text-base transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Encryption Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter a strong passphrase"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 text-sm md:text-base transition-all duration-200"
            />
          </div>

          <button
            onClick={handleEncrypt}
            disabled={!plaintext || !passphrase || loading}
            className="w-full py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Encrypting...
              </>
            ) : (
              <>
                <Lock size={20} />
                Encrypt Text
              </>
            )}
          </button>

          {ciphertext && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" />
                Encrypted Ciphertext
              </label>
              <div className="relative">
                <textarea
                  value={ciphertext}
                  readOnly
                  className="w-full h-32 md:h-40 px-4 py-3 pr-14 border-2 border-green-300 rounded-xl bg-green-50 text-gray-800 resize-none text-sm md:text-base font-mono"
                />
                <button
                  onClick={() => copyToClipboard(ciphertext)}
                  className="absolute top-3 right-3 p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95 shadow-md"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciphertext
            </label>
            <textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="Paste ciphertext to decrypt..."
              className="w-full h-32 md:h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 resize-none text-sm md:text-base transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Decryption Passphrase
            </label>
            <input
              type="password"
              value={decryptPassphrase}
              onChange={(e) => setDecryptPassphrase(e.target.value)}
              placeholder="Enter the passphrase used for encryption"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 text-sm md:text-base transition-all duration-200"
            />
          </div>

          <button
            onClick={handleDecrypt}
            disabled={!ciphertext || !decryptPassphrase || loading}
            className="w-full py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Decrypting...
              </>
            ) : (
              <>
                <Unlock size={20} />
                Decrypt Text
              </>
            )}
          </button>

          {plaintext && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-600" />
                Decrypted Text
              </label>
              <div className="relative">
                <textarea
                  value={plaintext}
                  readOnly
                  className="w-full h-32 md:h-40 px-4 py-3 pr-14 border-2 border-green-300 rounded-xl bg-green-50 text-gray-800 resize-none text-sm md:text-base"
                />
                <button
                  onClick={() => copyToClipboard(plaintext)}
                  className="absolute top-3 right-3 p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95 shadow-md"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fadeIn">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Features:</h3>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>AES-256-GCM encryption with authenticated encryption</li>
          <li>PBKDF2 key derivation with 100,000 iterations</li>
          <li>Random salt and IV generated for each operation</li>
          <li>Zero-knowledge architecture - keys never stored</li>
        </ul>
      </div>
    </div>
  );
}
