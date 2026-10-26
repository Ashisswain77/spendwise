import { useState, useEffect } from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react'
import SpendWiseLogo from '../common/Logo'
import { getStoredTheme, applyTheme } from '../../utils/theme'

export default function Navbar({ activeTab = 'Dashboard', onTabChange = () => {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const authenticatedLinks = [
    { name: 'Dashboard', id: 'Dashboard' },
    { name: 'History', id: 'History' },
    { name: 'Budget', id: 'Budget' },
    { name: 'Goals', id: 'Goals' },
  ]

  const publicLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-black/95 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 1. Brand Logo - Preserved Exactly */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onTabChange('Dashboard')
          }}
          className="flex items-center gap-2 group focus:outline-hidden shrink-0"
          aria-label="SpendWise Home"
        >
          <SpendWiseLogo className="h-8 w-auto text-slate-900 dark:text-white group-hover:opacity-90 transition-opacity" />
        </a>

        {/* 2. Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-6" aria-label="Main Navigation">
          <Show when="signed-in">
            {authenticatedLinks.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </Show>

          <Show when="signed-out">
            {publicLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150"
              >
                {link.name}
              </a>
            ))}
          </Show>
        </nav>

        {/* 3. Controls (Theme Toggle & Auth User Avatar) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer focus:outline-hidden"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Signed Out Auth CTAs */}
          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer">
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Signed In Clerk User Avatar */}
          <Show when="signed-in">
            <div className="p-0.5 rounded-full ring-2 ring-emerald-500/30 dark:ring-emerald-500/50 flex items-center justify-center">
              <UserButton />
            </div>
          </Show>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center md:hidden ml-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black px-4 pt-2 pb-5 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            <Show when="signed-in">
              {authenticatedLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-3 py-2 text-sm font-semibold rounded-lg transition ${
                    activeTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </Show>

            <Show when="signed-out">
              {publicLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg transition"
                >
                  {link.name}
                </a>
              ))}
            </Show>
          </nav>

          <Show when="signed-out">
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <SignInButton mode="modal">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </header>
  )
}
