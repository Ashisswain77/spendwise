import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'
import { Wallet, TrendingUp, ShieldCheck, PieChart, Sparkles, ArrowRight } from 'lucide-react'

export default function App() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              SpendWise
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 rounded-lg transition duration-150">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition duration-150">
                  Get Started
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                  Welcome, {user?.firstName || 'there'}!
                </span>
                <UserButton showName={false} />
              </div>
            </Show>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <Show when="signed-out">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Financial Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Take control of your spending with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                SpendWise
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Track expenses, set monthly budgets, and uncover actionable insights to reach your financial goals faster.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/25 transition">
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition">
                  Existing User? Sign In
                </button>
              </SignInButton>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
              <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">Expense Tracking</h3>
                <p className="text-sm text-slate-600">Log and categorize daily expenses in seconds with instant analytics.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">Budget Visuals</h3>
                <p className="text-sm text-slate-600">Visual breakdowns and charts showing where your money goes.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">Secure by Design</h3>
                <p className="text-sm text-slate-600">Enterprise-grade authentication and private, encrypted records.</p>
              </div>
            </div>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authenticated with Clerk
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome to your SpendWise dashboard!
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Signed in as <span className="font-medium text-slate-800">{user?.primaryEmailAddress?.emailAddress}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <UserButton />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">$0.00</p>
                <p className="text-xs text-slate-500 mt-1">Ready to add your first account</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">This Month's Spending</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">$0.00</p>
                <p className="text-xs text-slate-500 mt-1">0 transactions logged</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Budget</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">$0.00</p>
                <p className="text-xs text-slate-500 mt-1">Set a budget limit</p>
              </div>
            </div>
          </div>
        </Show>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        SpendWise &bull; Powered by React, Vite, Tailwind CSS, &amp; Clerk
      </footer>
    </div>
  )
}
