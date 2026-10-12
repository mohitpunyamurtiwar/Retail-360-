import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LowStockAlert from '../components/LowStockAlert'
import StatsCard from '../components/StatsCard'
import RecentTransactions from '../components/RecentTransactions'
import ChartComponent from '../components/ChartComponent'

export default function Dashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Shopkeeper'} 👋
        </h1>
        <p className="text-xl text-gray-600">
          {user?.shopName} - Manage your kirana store efficiently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Products" value={stats.totalProducts || 0} icon="📦" />
        <StatsCard title="Monthly Sales" value={`₹${stats.monthlySales?.toLocaleString() || 0}`} 
                   icon="💰" trend="+12%" />
        <StatsCard title="Low Stock Alerts" value={stats.lowStockCount || 0} 
                   icon="⚠️" isBad={true} />
        <StatsCard title="Est. Monthly Profit" value={`₹${stats.profitEstimate?.toLocaleString() || 0}`} 
                   icon="📈" trend="+8%" />
      </div>

      {/* Alerts */}
      {stats.alerts?.length > 0 && (
        <div className="mb-8">
          <LowStockAlert alerts={stats.alerts} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            Recent Transactions
            <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
              Live
            </span>
          </h3>
          <RecentTransactions transactions={stats.recentTransactions || []} />
        </div>

        {/* Charts */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6">Sales Overview</h3>
          <ChartComponent />
        </div>
      </div>
    </div>
  )
}

