/**
 * SpendWise Canonical Category Definitions
 * Kept consistent across all category dropdowns, budgets, transactions, and charts.
 */

export const EXPENSE_CATEGORIES = [
  'Food & drink',
  'Shopping',
  'Transport',
  'Home',
  'Bills & fees',
  'Entertainment',
  'Car',
  'Travel',
  'Family & personal',
  'Healthcare',
  'Education',
  'Groceries',
  'Gifts',
  'Sport & hobbies',
  'Beauty',
  'Work',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Work',
  'Gifts',
  'Allowance',
  'Other',
]

export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  'Salary',
  'Freelance',
  'Investments',
  'Allowance',
  'Other',
]

export const CATEGORY_CONFIG = {
  'Food & drink': {
    name: 'Food & drink',
    color: '#f97316',
    badgeColor: 'bg-orange-500',
    iconName: 'Citrus',
    bgLight: 'bg-orange-50 border-orange-200/80 text-orange-600',
    bgDark: 'dark:bg-orange-950/70 dark:border-orange-800/60 dark:text-orange-400',
  },
  Shopping: {
    name: 'Shopping',
    color: '#ec4899',
    badgeColor: 'bg-pink-500',
    iconName: 'ShoppingBag',
    bgLight: 'bg-pink-50 border-pink-200/80 text-pink-600',
    bgDark: 'dark:bg-pink-950/70 dark:border-pink-800/60 dark:text-pink-400',
  },
  Transport: {
    name: 'Transport',
    color: '#eab308',
    badgeColor: 'bg-amber-500',
    iconName: 'Car',
    bgLight: 'bg-amber-50 border-amber-200/80 text-amber-600',
    bgDark: 'dark:bg-amber-950/70 dark:border-amber-800/60 dark:text-amber-400',
  },
  Home: {
    name: 'Home',
    color: '#854d0e',
    badgeColor: 'bg-amber-800',
    iconName: 'Home',
    bgLight: 'bg-stone-100 border-stone-200/80 text-stone-700',
    bgDark: 'dark:bg-stone-900/80 dark:border-stone-800/60 dark:text-stone-300',
  },
  'Bills & fees': {
    name: 'Bills & fees',
    color: '#14b8a6',
    badgeColor: 'bg-teal-500',
    iconName: 'Receipt',
    bgLight: 'bg-teal-50 border-teal-200/80 text-teal-600',
    bgDark: 'dark:bg-teal-950/70 dark:border-teal-800/60 dark:text-teal-400',
  },
  Entertainment: {
    name: 'Entertainment',
    color: '#fb923c',
    badgeColor: 'bg-orange-500',
    iconName: 'Clapperboard',
    bgLight: 'bg-orange-50 border-orange-200/80 text-orange-600',
    bgDark: 'dark:bg-orange-950/70 dark:border-orange-800/60 dark:text-orange-400',
  },
  Car: {
    name: 'Car',
    color: '#0ea5e9',
    badgeColor: 'bg-sky-500',
    iconName: 'Car',
    bgLight: 'bg-sky-50 border-sky-200/80 text-sky-600',
    bgDark: 'dark:bg-sky-950/70 dark:border-sky-800/60 dark:text-sky-400',
  },
  Travel: {
    name: 'Travel',
    color: '#e11d48',
    badgeColor: 'bg-rose-500',
    iconName: 'Plane',
    bgLight: 'bg-rose-50 border-rose-200/80 text-rose-600',
    bgDark: 'dark:bg-rose-950/70 dark:border-rose-800/60 dark:text-rose-400',
  },
  'Family & personal': {
    name: 'Family & personal',
    color: '#38bdf8',
    badgeColor: 'bg-blue-400',
    iconName: 'Users',
    bgLight: 'bg-sky-50 border-sky-200/80 text-sky-600',
    bgDark: 'dark:bg-sky-950/70 dark:border-sky-800/60 dark:text-sky-400',
  },
  Healthcare: {
    name: 'Healthcare',
    color: '#f43f5e',
    badgeColor: 'bg-rose-500',
    iconName: 'HeartPulse',
    bgLight: 'bg-rose-50 border-rose-200/80 text-rose-600',
    bgDark: 'dark:bg-rose-950/70 dark:border-rose-800/60 dark:text-rose-400',
  },
  Education: {
    name: 'Education',
    color: '#2563eb',
    badgeColor: 'bg-blue-600',
    iconName: 'GraduationCap',
    bgLight: 'bg-blue-50 border-blue-200/80 text-blue-600',
    bgDark: 'dark:bg-blue-950/70 dark:border-blue-800/60 dark:text-blue-400',
  },
  Groceries: {
    name: 'Groceries',
    color: '#ea580c',
    badgeColor: 'bg-amber-600',
    iconName: 'ShoppingCart',
    bgLight: 'bg-amber-50 border-amber-200/80 text-amber-600',
    bgDark: 'dark:bg-amber-950/70 dark:border-amber-800/60 dark:text-amber-400',
  },
  Gifts: {
    name: 'Gifts',
    color: '#10b981',
    badgeColor: 'bg-emerald-500',
    iconName: 'Gift',
    bgLight: 'bg-emerald-50 border-emerald-200/80 text-emerald-600',
    bgDark: 'dark:bg-emerald-950/70 dark:border-emerald-800/60 dark:text-emerald-400',
  },
  'Sport & hobbies': {
    name: 'Sport & hobbies',
    color: '#22c55e',
    badgeColor: 'bg-green-500',
    iconName: 'Dumbbell',
    bgLight: 'bg-green-50 border-green-200/80 text-green-600',
    bgDark: 'dark:bg-green-950/70 dark:border-green-800/60 dark:text-green-400',
  },
  Beauty: {
    name: 'Beauty',
    color: '#8b5cf6',
    badgeColor: 'bg-purple-500',
    iconName: 'Sparkles',
    bgLight: 'bg-purple-50 border-purple-200/80 text-purple-600',
    bgDark: 'dark:bg-purple-950/70 dark:border-purple-800/60 dark:text-purple-400',
  },
  Work: {
    name: 'Work',
    color: '#475569',
    badgeColor: 'bg-slate-600',
    iconName: 'Briefcase',
    bgLight: 'bg-slate-100 border-slate-200/80 text-slate-700',
    bgDark: 'dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-300',
  },

  // Income & Fallback Categories
  Salary: {
    name: 'Salary',
    color: '#10b981',
    badgeColor: 'bg-emerald-500',
    iconName: 'CircleDollarSign',
    bgLight: 'bg-emerald-50 border-emerald-200/80 text-emerald-600',
    bgDark: 'dark:bg-emerald-950/70 dark:border-emerald-800/60 dark:text-emerald-400',
  },
  Freelance: {
    name: 'Freelance',
    color: '#06b6d4',
    badgeColor: 'bg-cyan-500',
    iconName: 'Laptop',
    bgLight: 'bg-cyan-50 border-cyan-200/80 text-cyan-600',
    bgDark: 'dark:bg-cyan-950/70 dark:border-cyan-800/60 dark:text-cyan-400',
  },
  Investments: {
    name: 'Investments',
    color: '#6366f1',
    badgeColor: 'bg-indigo-500',
    iconName: 'TrendingUp',
    bgLight: 'bg-indigo-50 border-indigo-200/80 text-indigo-600',
    bgDark: 'dark:bg-indigo-950/70 dark:border-indigo-800/60 dark:text-indigo-400',
  },
  Allowance: {
    name: 'Allowance',
    color: '#3b82f6',
    badgeColor: 'bg-blue-500',
    iconName: 'Wallet',
    bgLight: 'bg-blue-50 border-blue-200/80 text-blue-600',
    bgDark: 'dark:bg-blue-950/70 dark:border-blue-800/60 dark:text-blue-400',
  },
  Other: {
    name: 'Other',
    color: '#64748b',
    badgeColor: 'bg-slate-500',
    iconName: 'HelpCircle',
    bgLight: 'bg-slate-100 border-slate-200/80 text-slate-600',
    bgDark: 'dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-400',
  },
}

// Flat map of colors for charts
export const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => [cat, cfg.color])
)

// Legacy alias mappings so older entries map cleanly
CATEGORY_COLORS['Food & Dining'] = CATEGORY_COLORS['Food & drink']
CATEGORY_COLORS['Housing & Rent'] = CATEGORY_COLORS['Home']
CATEGORY_COLORS['Utilities & Bills'] = CATEGORY_COLORS['Bills & fees']
