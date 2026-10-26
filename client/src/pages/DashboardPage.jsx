import AuthenticatedDashboard from '../components/dashboard/AuthenticatedDashboard'

export default function DashboardPage({ activeTab, onTabChange }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AuthenticatedDashboard activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
