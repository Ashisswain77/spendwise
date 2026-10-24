import { Briefcase, Laptop, Users, Check } from 'lucide-react'

const personas = [
  {
    icon: Briefcase,
    title: 'Salaried Employees',
    tagline: 'Take charge of your monthly paycheck',
    description:
      'Seamlessly plan monthly fixed commitments (Rent, EMIs, Utility bills) as soon as your salary hits. Automatically isolate your savings before discretionary spending starts.',
    highlights: [
      'Automated salary allocation on month start',
      'Track SIP & insurance premium renewals',
      'Plug subtle weekend food & cab leaks',
    ],
    badge: 'Corporate & Tech',
  },
  {
    icon: Laptop,
    title: 'Freelancers & Creators',
    tagline: 'Tame irregular and variable income',
    description:
      'Client payments rarely arrive on fixed dates. SpendWise helps you calculate your baseline survival budget and build a buffer fund to navigate dry cashflow months with total peace of mind.',
    highlights: [
      'Multi-currency / irregular milestone tracking',
      'Advance tax & GST reserve allocation',
      'Runway estimation based on average burn',
    ],
    badge: 'Independent Pros',
  },
  {
    icon: Users,
    title: 'Families & Early Starters',
    tagline: 'Collaborative clarity on household expenses',
    description:
      'Get transparent visibility over shared groceries, children education funds, home repairs, and vacation budgets. Cultivate mindful spending habits without marital budget friction.',
    highlights: [
      'Shared household category tracking',
      'Goal planning for family vacations & emergency fund',
      'Zero complex accounting jargon',
    ],
    badge: 'Households',
  },
]

export default function UseCases() {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <span>Built For Every Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Tailored for how you earn and spend.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Whether you earn a fixed monthly salary, invoice global freelance clients, or manage a busy family budget, SpendWise adapts to your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <div
                key={persona.title}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {persona.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{persona.title}</h3>
                  <p className="text-xs font-semibold text-emerald-600 mb-3">{persona.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{persona.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2.5">
                  {persona.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{h}</span>
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
