import {
  Receipt,
  PieChart,
  BarChart3,
  Target,
  Search,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Receipt,
    title: 'Daily Expense & Inflow Tracking',
    description:
      'Log cash, UPI, card, and net banking transactions in seconds. Organize spending with smart tags and real-time ledger updates.',
    badge: 'Real-Time Ledger',
    bullets: ['Instant UPI & card categorization', 'Support for multiple income streams', 'Recurring expense detection'],
  },
  {
    icon: PieChart,
    title: 'Custom INR Category Budgets',
    description:
      'Set monthly expenditure ceilings for Food, Rent, Entertainment, and Bills in Indian Rupees. Get visual alerts before you overspend.',
    badge: 'Budget Guard',
    bullets: ['Visual percentage progress bars', 'Flexible monthly reset schedules', 'Overspending prevention alerts'],
  },
  {
    icon: BarChart3,
    title: 'Visual Cashflow Analytics',
    description:
      'Interactive Recharts visualizations reveal spending velocity, monthly net retention, and savings ratios across custom periods.',
    badge: 'Smart Insights',
    bullets: ['Month-over-month trend comparisons', 'Category distribution breakdowns', 'Net savings rate calculation'],
  },
  {
    icon: Target,
    title: 'Milestone Savings Goals',
    description:
      'Define dedicated targets for Emergency Funds, Annual Tax Reserves, Vacations, or Tech Gadgets. Track deposit pace effortlessly.',
    badge: 'Goal Tracking',
    bullets: ['Target date timeline projections', 'Automatic contribution calculations', 'Milestone completion celebrations'],
  },
  {
    icon: Search,
    title: 'Instant Filter & Search',
    description:
      'Locate any historical transaction instantly with lightning-fast query filters by category, payment mode, date range, or merchant.',
    badge: 'Frictionless Search',
    bullets: ['Full-text merchant & note search', 'Filter by payment mode (UPI, Card, Cash)', 'Custom date-range scoping'],
  },
  {
    icon: FileSpreadsheet,
    title: 'Export & Tax-Ready Reports',
    description:
      'Export detailed transaction histories and categorized summaries to CSV or spreadsheet formats for tax filing and personal audit.',
    badge: 'Tax Ready',
    bullets: ['Clean CSV & spreadsheet exports', 'Categorized annual expense summaries', 'Audit-friendly documentation'],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <span>Everything You Need</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Engineered for complete financial control.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Say goodbye to messy spreadsheets and disconnected banking apps. SpendWise gives you unified clarity over every rupee.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70 space-y-2">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
