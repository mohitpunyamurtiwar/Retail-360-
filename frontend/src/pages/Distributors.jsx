import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Distributors() {
  const { token } = useAuth()
  const [distributors, setDistributors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDistributors()
  }, [])

  const fetchDistributors = async () => {
    try {
      const res = await fetch('/api/distributors', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setDistributors(data.distributors || [])
    } catch (error) {
      console.error('Error fetching distributors:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBestPrice = (productName) => {
    const matches = distributors
      .flatMap(d => d.products.filter(p => p.name.toLowerCase().includes(productName.toLowerCase())))
      .sort((a, b) => a.bulkPrice - b.bulkPrice)
    return matches[0]
  }

  if (loading) return <div className="p-8 text-center">Loading distributors...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🚚 Distributors</h1>
        <p className="text-xl text-gray-600">Find cheapest suppliers & place orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {distributors.slice(0, 4).map((distributor) => (
          <div key={distributor.name} className="card p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{distributor.name}</h3>
                <p className="text-primary-600 font-semibold">{distributor.contact}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl">⭐</div>
                <div className="text-sm text-gray-500">Reliable</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {distributor.products.slice(0, 4).map((product, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Min: {product.minOrder} {product.unit}s
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{product.bulkPrice}
                    </div>
                    <div className="text-xs text-gray-500">per {product.unit}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full btn-primary py-3 font-semibold text-lg shadow-xl hover:shadow-2xl">
              📞 Order Now
            </button>
          </div>
        ))}
      </div>

      {/* Quick Search */}
      <div className="card p-8">
        <h3 className="text-xl font-bold mb-6 text-center">🔍 Quick Product Search</h3>
        <div className="max-w-md mx-auto">
          <div className="flex mb-6">
            <input
              type="text"
              placeholder="Search atta, biscuits, oil..."
              className="flex-1 px-6 py-4 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="bg-primary-600 text-white px-8 py-4 rounded-r-xl font-semibold hover:bg-primary-700">
              Search
            </button>
          </div>
          <div className="text-center text-gray-500">
            <p>Find best supplier prices instantly</p>
          </div>
        </div>
      </div>
    </div>
  )
}

