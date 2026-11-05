import { ArrowUp } from 'lucide-react'
import SpendWiseLogo from '../common/Logo'
import { smoothScrollTo } from '../../utils/scroll'

export default function Footer() {
  const handleLinkClick = (e, target) => {
    e.preventDefault()
    smoothScrollTo(target)
  }

  return (
    <footer className="bg-black text-slate-400 border-t border-zinc-800/80 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div>
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, '#')}
              className="inline-block mb-3"
              aria-label="SpendWise"
            >
              <SpendWiseLogo className="h-7 w-auto text-white" textColor="#FFFFFF" />
            </a>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Personal finance, expense tracking, and category budgeting engineered with privacy and Indian Rupee (₹) standards.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm">
            <a
              href="#demo"
              onClick={(e) => handleLinkClick(e, '#demo')}
              className="hover:text-emerald-400 transition-colors"
            >
              Live Demo
            </a>
            <a
              href="#features"
              onClick={(e) => handleLinkClick(e, '#features')}
              className="hover:text-emerald-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleLinkClick(e, '#how-it-works')}
              className="hover:text-emerald-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={(e) => handleLinkClick(e, '#faq')}
              className="hover:text-emerald-400 transition-colors"
            >
              FAQ
            </a>
            <button
              type="button"
              onClick={() => smoothScrollTo('#')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-300 hover:text-emerald-400 border border-zinc-800 transition-all text-xs font-semibold cursor-pointer"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SpendWise. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Secured with Clerk &bull; INR (&#8377;) Format</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
