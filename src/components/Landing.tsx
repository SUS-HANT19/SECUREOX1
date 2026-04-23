import { Mail, MapPin, Shield, Lock, Eye, Zap, CheckCircle } from 'lucide-react';
import Logo from './Logo';

interface LandingProps {
  onGetStarted: () => void;
  onAbout: () => void;
}

export default function Landing({ onGetStarted, onAbout }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white">
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 pt-20 md:pt-0">
        <div className="text-center max-w-4xl">
          <div className="mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <Logo size="large" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3">SecureOX</h1>

          <p className="text-lg md:text-xl mb-4 md:mb-6">Lock it. Hide it. Protect it.</p>

          <p className="text-base md:text-lg text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Enterprise-grade cybersecurity solutions with military-level encryption, intelligent threat detection, and unbreakable defense systems.
          </p>

          <div className="flex justify-center px-4">
            <button
              onClick={onGetStarted}
              className="group w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-blue-600 rounded-full text-base md:text-lg font-semibold transition-all duration-300 active:scale-95 hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-20 px-4 md:px-6 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">
            Why Choose SecureOX?
          </h2>
          <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
            Industry-leading security features designed to protect what matters most
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Military-Grade Encryption</h3>
              <p className="text-sm text-white/80">AES-256-GCM encryption with PBKDF2 key derivation protects your sensitive data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">OCR Technology</h3>
              <p className="text-sm text-white/80">Extract text from images with advanced optical character recognition</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Zero-Knowledge Security</h3>
              <p className="text-sm text-white/80">Your encryption keys are never stored or transmitted to our servers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
              <p className="text-sm text-white/80">Optimized performance ensures quick encryption and decryption operations</p>
            </div>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Security Guarantees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">End-to-end encryption for all operations</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">Regular security audits and updates</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">GDPR and SOC 2 compliant infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo size="small" className="w-10 h-10" />
                <span className="font-bold text-lg">SecureOX</span>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Enterprise-grade cybersecurity solutions with military-level encryption and unbreakable defense systems.
              </p>
              <p className="text-xs text-white/70">
                &copy; {new Date().getFullYear()} SecureOX Corporation. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-sm text-white/80 mb-4">
                SecureOX is a leading cybersecurity company dedicated to protecting organizations and individuals with cutting-edge encryption technology and security solutions.
              </p>
              <button
                onClick={onAbout}
                className="text-sm text-white/90 hover:text-white transition-colors underline"
              >
                Learn more about our mission
              </button>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70" />
                  <div>
                    <p className="text-white/90 font-medium mb-1">Email</p>
                    <a href="mailto:2023EBCS180@online.bits-pilani.ac.in" className="text-white/80 hover:text-white transition-colors block text-xs">
                      2023EBCS180@online.bits-pilani.ac.in
                    </a>
                    <a href="mailto:2022EBCS255@online.bits-pilani.ac.in" className="text-white/80 hover:text-white transition-colors block text-xs">
                      2022EBCS255@online.bits-pilani.ac.in
                    </a>
                    <a href="mailto:2023EBCS542@online.bits-pilani.ac.in" className="text-white/80 hover:text-white transition-colors block text-xs">
                      2023EBCS542@online.bits-pilani.ac.in
                    </a>
                    <a href="mailto:2023EBCS054@online.bits-pilani.ac.in" className="text-white/80 hover:text-white transition-colors block text-xs">
                      2023EBCS054@online.bits-pilani.ac.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Location</h3>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70" />
                <div className="text-white/80">
                  <p className="font-medium text-white/90 mb-2">India</p>
                  <p className="font-medium text-white/90">USA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/70">
              <button onClick={onAbout} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span className="hidden md:inline">•</span>
              <button onClick={onAbout} className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <span className="hidden md:inline">•</span>
              <button onClick={onAbout} className="hover:text-white transition-colors">
                Security
              </button>
              <span className="hidden md:inline">•</span>
              <button onClick={onAbout} className="hover:text-white transition-colors">
                Compliance
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
