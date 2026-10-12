import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Competitors() {
  const { token } = useAuth()
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompetitors()
  }, [])

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/competitors', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCompetitors(data.competitors || [])
    } catch (error) {
      console.error('Error fetching competitors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading competitor data...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🏪 Competitor Prices</h1>
        <p className="text-xl text-gray-600">Stay competitive with nearby shop prices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {competitors.map((competitor, index) => (
          <div key={index} className="card group hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{competitor.shopName}</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold rounded-full shadow-sm">
                {competitor.location}
              </span>
            </div>
            
            <div className="space-y-3">
              {competitor.products.slice(0, 6).map((product, pIndex) => (
                <div key={pIndex} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="font-bold text-2xl text-orange-600">₹{product.price}</span>
                </div>
              ))}
            </div>
            
            {competitor.products.length > 6 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                +{competitor.products.length - 6} more items
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center">
        <div className="text-5xl mb-6">📊</div>
        <h3 className="text-2xl font-bold mb-4">Price Yourself Right</h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Beat these prices by 2-5% to attract more customers. 
          Use Smart Pricing tool for perfect margins.
        </p>
        <button className="btn-primary px-12 py-4 text-lg">
          Adjust Prices Now →
        </button>
      </div>
    </div>
  )
}

