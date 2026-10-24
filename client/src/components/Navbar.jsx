import { useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'
import { Menu, X, ArrowRight } from 'lucide-react'
import SpendWiseLogo from './Logo'

export default function Navbar() {
  const { user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard Demo', href: '#demo' },
    { name: 'Budget Planner', href: '#budget' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security', href: '#security' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group focus:outline-hidden" aria-label="SpendWise Home">
          <SpendWiseLogo className="h-8 sm:h-9 w-auto text-slate-900 group-hover:opacity-90 transition-opacity" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth CTA Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100/80 rounded-xl transition duration-150 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-1.5 px-4.5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-sm shadow-emerald-600/30 transition duration-150 cursor-pointer">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
              <span className="text-xs font-medium text-slate-600 hidden lg:inline">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              <UserButton />
            </div>
          </Show>
        </div>

        {/* Mobile Menu Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <Show when="signed-out">
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <SignInButton mode="modal">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                >
                  Get Started Free
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </header>
  )
}
