import SpendWiseLogo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info Column */}
          <div className="col-span-2">
            <a href="#" className="inline-block mb-4" aria-label="SpendWise">
              <SpendWiseLogo className="h-8 w-auto text-white" textColor="#FFFFFF" />
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              Modern personal finance, expense tracking, and ₹ INR budgeting engineered for complete clarity, privacy, and wealth compounding.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>INR (₹) Standard Enabled</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-emerald-400 transition">Features</a></li>
              <li><a href="#demo" className="hover:text-emerald-400 transition">Live Demo</a></li>
              <li><a href="#budget" className="hover:text-emerald-400 transition">Budget Calculator</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
            </ul>
          </div>

          {/* Column 2: Security */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Trust &amp; Privacy</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#security" className="hover:text-emerald-400 transition">Security Overview</a></li>
              <li><a href="#security" className="hover:text-emerald-400 transition">256-Bit Encryption</a></li>
              <li><a href="#security" className="hover:text-emerald-400 transition">Zero Ad-Selling</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition">Privacy FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Legal &amp; Stack</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-500">React 19 &amp; Vite</span></li>
              <li><span className="text-slate-500">Tailwind CSS v4</span></li>
              <li><span className="text-slate-500">Clerk Auth Engine</span></li>
              <li><span className="text-slate-500">MongoDB Database</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SpendWise. All rights reserved.</p>
          <p>
            Crafted for mindful spenders in India &bull; Powered by React, Vite, Tailwind CSS, &amp; Clerk
          </p>
        </div>
      </div>
    </footer>
  )
}
