import { ShieldCheck, Lock, EyeOff, Server, KeyRound, CheckCircle } from 'lucide-react'

const securityPoints = [
  {
    icon: Lock,
    title: '256-Bit TLS Data Encryption',
    description: 'Every interaction between your browser and our API is encrypted in transit using industry-standard TLS cryptographic protocols.',
  },
  {
    icon: KeyRound,
    title: 'Clerk Enterprise Authentication',
    description: 'Battle-tested authentication with multi-factor authentication (MFA), breach detection, and session security.',
  },
  {
    icon: EyeOff,
    title: 'Strict Privacy: Zero Data Monetization',
    description: 'Your financial entries are private to you. We never sell, rent, or monetize your spending patterns to third-party ad networks.',
  },
  {
    icon: Server,
    title: 'Isolated Tenancy & Hardened API',
    description: 'Protected with rate limiting, Helmet HTTP security headers, CORS origin verification, and isolated database records.',
  },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Security &amp; Privacy First</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Your financial records belong only to you.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3">
              We design every layer of SpendWise with strict privacy and security standards so you can manage your wealth with full confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityPoints.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              OWASP Security Principles
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              No Bank Account Scraping Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Safe JWT Session Validation
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
