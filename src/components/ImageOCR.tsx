import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Lock, Unlock, FileImage } from 'lucide-react';
import { logOperation, generateRequestId } from '../lib/logging';
import { validateAndScanFile } from '../lib/fileValidator';
import { rateLimiter, RATE_LIMITS, getRateLimitIdentifier } from '../lib/rateLimiter';
import { handleError, logError, ErrorCode } from '../lib/errorHandler';

export default function ImageOCR() {
  const [mode, setMode] = useState<'embed' | 'extract'>('embed');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textToEmbed, setTextToEmbed] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const requestIdRef = useRef<string>(generateRequestId());

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateAndScanFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    setSuccess('');
    setExtractedText('');
    setOutputImage(null);
    requestIdRef.current = generateRequestId();

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const embedTextInImage = async () => {
    if (!selectedImage || !textToEmbed) {
      setError('Please select an image and enter text to embed');
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
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedImage;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const textWithMarker = `STEGOTEXT:${textToEmbed}:ENDSTEGO`;
      const textBytes = new TextEncoder().encode(textWithMarker);

      const maxBytes = Math.floor((data.length / 4) * 3 / 8);
      if (textBytes.length > maxBytes) {
        throw new Error(`Text is too long for this image. Maximum ${maxBytes} bytes, got ${textBytes.length} bytes.`);
      }

      let byteIndex = 0;
      let bitIndex = 0;

      for (let i = 0; i < data.length && byteIndex < textBytes.length; i += 4) {
        for (let channel = 0; channel < 3 && byteIndex < textBytes.length; channel++) {
          const byte = textBytes[byteIndex];
          const bit = (byte >> (7 - bitIndex)) & 1;

          data[i + channel] = (data[i + channel] & 0xFE) | bit;

          bitIndex++;
          if (bitIndex === 8) {
            bitIndex = 0;
            byteIndex++;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const output = canvas.toDataURL('image/png');
      setOutputImage(output);
      setSuccess('Text embedded successfully! Click Download to save the image.');

      const latency = Math.round(performance.now() - startTime);
      await logOperation('encrypt', latency, 'success', requestIdRef.current);
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

  const extractTextFromImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
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
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedImage;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const extractedBytes: number[] = [];
      let currentByte = 0;
      let bitIndex = 0;

      for (let i = 0; i < data.length; i += 4) {
        for (let channel = 0; channel < 3; channel++) {
          const bit = data[i + channel] & 1;
          currentByte = (currentByte << 1) | bit;
          bitIndex++;

          if (bitIndex === 8) {
            extractedBytes.push(currentByte);
            currentByte = 0;
            bitIndex = 0;

            if (extractedBytes.length > 10000) break;
          }
        }
        if (extractedBytes.length > 10000) break;
      }

      const extractedText = new TextDecoder().decode(new Uint8Array(extractedBytes));
      const match = extractedText.match(/STEGOTEXT:(.*?):ENDSTEGO/s);

      if (match && match[1]) {
        setExtractedText(match[1]);
        setSuccess('Text extracted successfully!');
        const latency = Math.round(performance.now() - startTime);
        await logOperation('decrypt', latency, 'success', requestIdRef.current);
      } else {
        throw new Error('No embedded text found in this image');
      }
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

  const downloadImage = () => {
    if (!outputImage) return;

    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `stego-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setSelectedImage(null);
    setTextToEmbed('');
    setExtractedText('');
    setOutputImage(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Image Steganography</h2>
            <p className="text-xs md:text-sm text-gray-600">Hide and extract secret text within images</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-3 mb-6">
        <button
          onClick={() => {
            setMode('embed');
            resetForm();
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            mode === 'embed'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          Embed Text
        </button>
        <button
          onClick={() => {
            setMode('extract');
            resetForm();
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            mode === 'extract'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Extract Text
        </button>
      </div>

      {mode === 'embed' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Change Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">JPG or PNG (max 10MB)</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text to Embed
            </label>
            <textarea
              value={textToEmbed}
              onChange={(e) => setTextToEmbed(e.target.value)}
              placeholder="Enter the secret text you want to hide in the image..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-800 resize-none transition-all duration-200"
            />
          </div>

          <button
            onClick={embedTextInImage}
            disabled={!selectedImage || !textToEmbed || loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Embedding...
              </>
            ) : (
              <>
                <Lock size={20} />
                Embed Text in Image
              </>
            )}
          </button>

          {outputImage && (
            <div className="animate-fadeIn space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileImage className="w-4 h-4 text-green-600" />
                Output Image (with embedded text)
              </label>
              <div className="border-2 border-green-300 rounded-xl p-6 bg-green-50">
                <img
                  src={outputImage}
                  alt="Output with embedded text"
                  className="max-h-64 mx-auto rounded-lg shadow-sm mb-4"
                />
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Download size={20} />
                  Download Image
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image with Embedded Text
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Change Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">JPG or PNG (max 10MB)</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={extractTextFromImage}
            disabled={!selectedImage || loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Extracting...
              </>
            ) : (
              <>
                <Unlock size={20} />
                Extract Hidden Text
              </>
            )}
          </button>

          {extractedText && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-600" />
                Extracted Text
              </label>
              <div className="border-2 border-green-300 rounded-xl p-6 bg-green-50">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                  {extractedText}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fadeIn">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-fadeIn">
          {success}
        </div>
      )}

      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-teal-900 mb-2">How Steganography Works:</h3>
        <ul className="text-xs text-teal-800 space-y-1 list-disc list-inside">
          <li>Text is hidden in the least significant bits of image pixels</li>
          <li>Changes are imperceptible to the human eye</li>
          <li>Original image quality is preserved</li>
          <li>Only works with lossless PNG format for extraction</li>
        </ul>
      </div>
    </div>
  );
}
