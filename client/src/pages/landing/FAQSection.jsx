import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'Is SpendWise completely free to use?',
    a: 'Yes! SpendWise offers a generous free tier that includes full daily transaction tracking, category budget allocations, visual cashflow analytics, and export capabilities. No credit card is required to sign up.',
  },
  {
    q: 'Does SpendWise support Indian Rupees (₹) and UPI payment modes?',
    a: 'Yes, SpendWise is designed from the ground up for the Indian financial ecosystem. All amounts are formatted using en-IN standards (lakhs and crores), and you can tag transactions with payment modes like UPI (Google Pay, PhonePe, Paytm), Credit Cards, Net Banking, and Cash.',
  },
  {
    q: 'Do I need to connect my bank account or share bank passwords?',
    a: 'No, absolutely not. SpendWise respects your privacy and does not require invasive screen-scraping of your net banking passwords or SMS permissions. You maintain full ownership and control over the transactions and budgets you log.',
  },
  {
    q: 'How does Clerk authentication keep my account safe?',
    a: 'We use Clerk—an industry-leading identity platform—to protect your logins with secure token authentication, optional multi-factor authentication (MFA), and Google OAuth. Your password and session credentials are encrypted with enterprise-grade standards.',
  },
  {
    q: 'Can I set budgets for custom spending categories?',
    a: 'Yes. You can configure monthly expenditure limits for categories such as Rent & Housing, Groceries, Dining Out, Utilities, EMIs, and SIP Investments. Visual progress meters alert you as you approach your threshold.',
  },
  {
    q: 'Can I export my financial reports for tax filing or personal audit?',
    a: 'Yes, you can export your transaction ledgers and categorized summaries to standard CSV and spreadsheet formats anytime from your dashboard.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Everything you need to know about tracking, budgeting, and privacy with SpendWise.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
