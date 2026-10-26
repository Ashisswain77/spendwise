import SpendWiseLogo from '../common/Logo'

export default function Footer() {
  return (
    <footer className="bg-black text-slate-400 border-t border-zinc-800/80 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div>
            <a href="#" className="inline-block mb-3" aria-label="SpendWise">
              <SpendWiseLogo className="h-7 w-auto text-white" textColor="#FFFFFF" />
            </a>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Personal finance, expense tracking, and category budgeting engineered with privacy and Indian Rupee (₹) standards.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">
              Dashboard Demo
            </a>
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
