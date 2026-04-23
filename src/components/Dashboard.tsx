import { ArrowLeft } from 'lucide-react';
import TextEncryption from './TextEncryption';
import ImageOCR from './ImageOCR';
import Logo from './Logo';

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500">

      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-6 py-3 md:py-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <Logo size="small" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">SecureOX</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn hover:shadow-3xl transition-shadow duration-300">
            <div className="p-4 md:p-6 lg:p-8">
              <TextEncryption />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn hover:shadow-3xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="p-4 md:p-6 lg:p-8">
              <ImageOCR />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
