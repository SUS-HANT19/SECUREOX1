interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: number;
}

export default function Logo({ size = 'medium', className = '', variant }: LogoProps) {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const logoVariant = variant || parseInt(localStorage.getItem('selectedLogo') || '2');

  const renderLogo = () => {
    switch (logoVariant) {
      case 1:
        return (
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
        );

      case 2:
        return (
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
        );

      case 3:
        return (
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
        );

      case 4:
        return (
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
        );

      case 5:
        return (
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
        );

      default:
        return (
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
        );

      case 6:
        return (
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
        );
    }
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      {renderLogo()}
    </div>
  );
}
