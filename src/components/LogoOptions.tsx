import { useState } from 'react';
import { Check } from 'lucide-react';

interface LogoOptionProps {
  id: number;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  title: string;
}

function LogoOption({ id, selected, onSelect, children, title }: LogoOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
        selected
          ? 'bg-white border-4 border-blue-500 shadow-2xl scale-105'
          : 'bg-white/90 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl hover:scale-102'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 flex items-center justify-center">
          {children}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800">Option {id}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

interface LogoOptionsProps {
  onSelect: (logoId: number) => void;
  onClose: () => void;
}

export default function LogoOptions({ onSelect, onClose }: LogoOptionsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  const handleConfirm = () => {
    if (selected !== null) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Choose Your Logo</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <LogoOption id={1} selected={selected === 1} onSelect={() => handleSelect(1)} title="Shield Lock">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M50 10 L80 25 L80 50 C80 70 65 85 50 90 C35 85 20 70 20 50 L20 25 Z"
                  fill="url(#grad1)"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                <rect x="42" y="45" width="16" height="18" rx="2" fill="white" />
                <circle cx="50" cy="40" r="6" stroke="white" strokeWidth="3" fill="none" />
                <line x1="50" y1="46" x2="50" y2="40" stroke="white" strokeWidth="3" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>

            <LogoOption id={2} selected={selected === 2} onSelect={() => handleSelect(2)} title="OX Shield">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M50 10 L85 25 L85 50 C85 72 67 87 50 92 C33 87 15 72 15 50 L15 25 Z"
                  fill="url(#grad2)"
                />
                <text x="50" y="62" fontSize="40" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
                  OX
                </text>
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>

            <LogoOption id={3} selected={selected === 3} onSelect={() => handleSelect(3)} title="Cyber Shield">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M50 10 L80 25 L80 50 C80 70 65 85 50 90 C35 85 20 70 20 50 L20 25 Z"
                  fill="url(#grad3)"
                />
                <circle cx="35" cy="35" r="3" fill="white" opacity="0.6" />
                <circle cx="50" cy="30" r="3" fill="white" opacity="0.8" />
                <circle cx="65" cy="35" r="3" fill="white" opacity="0.6" />
                <circle cx="40" cy="50" r="3" fill="white" opacity="0.7" />
                <circle cx="60" cy="50" r="3" fill="white" opacity="0.7" />
                <circle cx="50" cy="65" r="3" fill="white" opacity="0.9" />
                <line x1="35" y1="35" x2="50" y2="30" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <line x1="50" y1="30" x2="65" y2="35" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <line x1="35" y1="35" x2="40" y2="50" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <line x1="65" y1="35" x2="60" y2="50" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <line x1="40" y1="50" x2="50" y2="65" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <line x1="60" y1="50" x2="50" y2="65" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <circle cx="50" cy="50" r="8" fill="white" />
                <circle cx="50" cy="50" r="5" fill="#2563eb" />
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>

            <LogoOption id={4} selected={selected === 4} onSelect={() => handleSelect(4)} title="Minimal Lock">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="url(#grad4)" />
                <rect x="38" y="48" width="24" height="26" rx="3" fill="white" stroke="#2563eb" strokeWidth="2" />
                <path
                  d="M 42 48 L 42 40 C 42 35 45 32 50 32 C 55 32 58 35 58 40 L 58 48"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="60" r="4" fill="#2563eb" />
                <line x1="50" y1="64" x2="50" y2="69" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>

            <LogoOption id={5} selected={selected === 5} onSelect={() => handleSelect(5)} title="Hex Lock (Current)">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="url(#grad5)" className="drop-shadow-lg" />
                <path
                  d="M 50 25 L 65 35 L 65 55 L 50 65 L 35 55 L 35 35 Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle cx="50" cy="45" r="8" fill="#2563eb" />
                <path
                  d="M 50 53 L 50 60"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 45 55 L 55 55"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>

            <LogoOption id={6} selected={selected === 6} onSelect={() => handleSelect(6)} title="Key Shield">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M50 10 L80 25 L80 50 C80 70 65 85 50 90 C35 85 20 70 20 50 L20 25 Z"
                  fill="url(#grad6)"
                />
                <circle cx="42" cy="42" r="8" stroke="white" strokeWidth="3" fill="none" />
                <line x1="48" y1="48" x2="62" y2="62" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="54" y1="54" x2="54" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <line x1="58" y1="58" x2="58" y2="62" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoOption>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selected === null
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              Apply Selected Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
