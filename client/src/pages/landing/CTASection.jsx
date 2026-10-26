import { SignUpButton, Show } from '@clerk/react'
import { ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none animate-pulseGlow" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Start Tracking Today</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Ready to take control of your money?
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-4 leading-relaxed">
          Join SpendWise today and experience simple, transparent expense tracking and budgeting designed for India.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 cursor-pointer group">
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
          </Show>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Explore Dashboard</span>
          </a>
        </div>
      </div>
    </section>
  )
}


