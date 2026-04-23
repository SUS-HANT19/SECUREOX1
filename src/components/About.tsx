import { Shield, Lock, Brain, TrendingUp, Eye, Activity, ArrowLeft } from 'lucide-react';

interface AboutProps {
  onBack?: () => void;
}

export default function About({ onBack }: AboutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 md:mb-8 p-2 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <ArrowLeft size={18} className="md:w-5 md:h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        )}
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">About SecureOX</h2>
        <p className="text-lg md:text-xl lg:text-2xl font-semibold text-blue-600 mb-4 md:mb-6">
          Strength. Intelligence. Relentless Protection.
        </p>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          SecureOX was founded with a single mission: to build cybersecurity solutions that are as strong and
          dependable as the ox itself.
        </p>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mt-3 md:mt-4">
          In an era where digital threats evolve by the minute, organizations need more than reactive security
          — they need resilient, intelligent defense systems designed to stand firm under pressure. SecureOX
          exists to deliver exactly that.
        </p>
      </div>

      <section className="mb-8 md:mb-12 bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl border border-slate-200">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Who We Are</h3>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          SecureOX is a forward-thinking cybersecurity platform focused on protecting digital infrastructure,
          sensitive data, and mission-critical systems.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
          We combine modern cryptography, intelligent monitoring, and layered defense architecture to create
          security solutions that are:
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 text-center">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900 text-sm md:text-base">Reliable</p>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 text-center">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-teal-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900 text-sm md:text-base">Scalable</p>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 text-center">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900 text-sm md:text-base">Adaptive</p>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 text-center">
            <Eye className="w-6 h-6 md:w-8 md:h-8 text-teal-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900 text-sm md:text-base">Enterprise-ready</p>
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-4 md:mt-6">
          Our approach is rooted in technical excellence and practical security design — ensuring protection
          without unnecessary complexity.
        </p>
      </section>

      <section className="mb-8 md:mb-12 bg-gradient-to-br from-blue-600 to-teal-600 text-white p-4 md:p-6 lg:p-8 rounded-xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">What We Believe</h3>
        <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6">We believe that cybersecurity should be:</p>
        <div className="space-y-4 md:space-y-5">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg mb-1">Proactive, Not Reactive</h4>
              <p className="text-sm md:text-base text-white/90">Threats should be anticipated and neutralized before they escalate.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg mb-1">Intelligent</h4>
              <p className="text-sm md:text-base text-white/90">Security must evolve with emerging risks and attack patterns.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg mb-1">Strong by Design</h4>
              <p className="text-sm md:text-base text-white/90">Defense should be built into the foundation — not added as an afterthought.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg mb-1">Scalable</h4>
              <p className="text-sm md:text-base text-white/90">Security solutions must grow alongside your business.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 md:mb-12 bg-slate-900 text-white p-4 md:p-6 lg:p-8 rounded-xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why the Ox?</h3>
        <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6">The ox symbolizes:</p>
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/10 p-3 md:p-4 rounded-lg">
            <p className="font-bold text-base md:text-lg">Strength</p>
          </div>
          <div className="bg-white/10 p-3 md:p-4 rounded-lg">
            <p className="font-bold text-base md:text-lg">Endurance</p>
          </div>
          <div className="bg-white/10 p-3 md:p-4 rounded-lg">
            <p className="font-bold text-base md:text-lg">Stability</p>
          </div>
          <div className="bg-white/10 p-3 md:p-4 rounded-lg">
            <p className="font-bold text-base md:text-lg">Protection</p>
          </div>
        </div>
        <p className="text-sm md:text-base text-white/90 font-semibold mb-3 md:mb-4">These values define SecureOX.</p>
        <p className="text-sm md:text-base text-white/90 leading-relaxed">
          Just as the ox stands firm in challenging conditions, SecureOX is built to withstand high-risk
          environments and evolving cyber threats — delivering dependable protection you can trust.
        </p>
      </section>

      <section className="mb-8 md:mb-12 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 md:p-6 lg:p-8 rounded-xl border border-teal-200">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Our Expertise</h3>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">SecureOX integrates:</p>
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <li className="flex items-start gap-2 md:gap-3">
            <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></span>
            <span className="text-sm md:text-base text-gray-700">End-to-end encryption standards</span>
          </li>
          <li className="flex items-start gap-2 md:gap-3">
            <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></span>
            <span className="text-sm md:text-base text-gray-700">Secure data processing frameworks</span>
          </li>
          <li className="flex items-start gap-2 md:gap-3">
            <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></span>
            <span className="text-sm md:text-base text-gray-700">Access control and authentication systems</span>
          </li>
          <li className="flex items-start gap-2 md:gap-3">
            <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></span>
            <span className="text-sm md:text-base text-gray-700">Real-time monitoring and threat intelligence</span>
          </li>
          <li className="flex items-start gap-2 md:gap-3">
            <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></span>
            <span className="text-sm md:text-base text-gray-700">Integrity verification mechanisms</span>
          </li>
        </ul>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold">
          Our solutions align with core security principles: confidentiality, integrity, and availability.
        </p>
      </section>

      <section className="mb-8 md:mb-12 bg-white p-4 md:p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Our Commitment</h3>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          We are committed to building security that empowers organizations to operate confidently in a
          digital-first world.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          Whether protecting enterprise systems, financial data, or secure applications, SecureOX stands
          as a guardian of digital trust.
        </p>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-teal-600 text-white p-4 md:p-6 lg:p-8 rounded-xl text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Looking Ahead</h3>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3 md:mb-4">
          As technology evolves, so do we.
        </p>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3 md:mb-4">
          SecureOX continues to innovate — refining our defense strategies, strengthening our architecture,
          and adapting to tomorrow's challenges.
        </p>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3 md:mb-4 font-semibold">
          Because security is not a one-time solution.<br />
          It is an ongoing commitment.
        </p>
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">SecureOX</h2>
          <p className="text-lg md:text-xl font-semibold">Unbreakable Protection. Intelligent Defense.</p>
        </div>
      </section>
      </div>
    </div>
  );
}
