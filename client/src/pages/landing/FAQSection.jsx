import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'

const faqs = [
  {
    q: 'Is SpendWise completely free to use?',
    a: 'Yes! SpendWise offers full daily transaction tracking, monthly category & overall budget limits, visual cashflow analytics, milestone savings goals, and Google Sheets CSV exports completely free.',
  },
  {
    q: 'Does SpendWise support Indian Rupees (₹) and UPI payment modes?',
    a: 'Yes, SpendWise is engineered from the ground up for the Indian financial ecosystem. All amounts use integer paise accuracy and en-IN formatting (lakhs and crores), with tags for UPI, Credit Cards, Debit Cards, Net Banking, AutoPay, and Cash.',
  },
  {
    q: 'Do I need to connect my bank account or share bank passwords?',
    a: 'No, never. SpendWise respects your privacy and does not require screen-scraping of net banking passwords or SMS permissions. You maintain 100% ownership and control over the transactions and budgets you record.',
  },
  {
    q: 'How does Clerk authentication keep my account safe?',
    a: 'We use Clerk to protect your account with cryptographic JWT session verification, Google OAuth, and strict per-user database isolation so only you can access your financial records.',
  },
  {
    q: 'Can I export my transactions to Google Sheets or Excel?',
    a: 'Yes! From your History tab, you can export your filtered transactions with a single click into a UTF-8 CSV file with clean YYYY-MM-DD dates ready for Google Sheets or Microsoft Excel.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-white dark:bg-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Everything you need to know about tracking, budgeting, and privacy with SpendWise.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <ScrollReveal key={faq.q} variant="fade-up" delay={idx * 60}>
                <div
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-emerald-500/70 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
