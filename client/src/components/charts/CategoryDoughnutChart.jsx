import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { formatINR } from '../../utils/currency'

export default function CategoryDoughnutChart({
  categoryData,
  totalExpenses,
  dateRange,
  onAddExpense,
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Expenses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution by Category ({dateRange.replace('_', ' ')})</p>
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Total: {formatINR(totalExpenses)}
          </span>
        </div>

        {/* Doughnut Chart Content or Empty State */}
        {categoryData.length === 0 || totalExpenses === 0 ? (
          <div className="h-68 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <PieIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No expenses recorded</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No expense transactions found for this period.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddExpense}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              + Add First Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 pt-2">
            {/* Recharts Doughnut Pie */}
            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [formatINR(val), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center of Doughnut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {formatINR(totalExpenses)}
                </span>
              </div>
            </div>

            {/* Category Legend with Amounts & Percentages */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-900 dark:text-white">{formatINR(cat.value)}</span>
                    <span className="text-[10px] text-slate-400">{cat.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Active Categories</span>
        <span className="font-semibold text-slate-900 dark:text-white">{categoryData.length} items</span>
      </div>
    </div>
  )
}
