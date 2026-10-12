import { useState } from 'react'

export default function Pricing() {
  const [bulkData, setBulkData] = useState({
    bulkQuantity: '',
    bulkPrice: '',
    marginPercent: 10,
    unit: 'unit'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculatePrice = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/pricing/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      })
      
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('Pricing calculation error:', error)
      alert('Calculation failed. Using local logic.')
      // Fallback local calculation
      const qty = parseFloat(bulkData.bulkQuantity)
      const price = parseFloat(bulkData.bulkPrice)
      if (qty && price) {
        const costPerUnit = price / qty
        const sellingPrice = costPerUnit * (1 + bulkData.marginPercent / 100)
        setResult({
          costPerUnit: parseFloat(costPerUnit.toFixed(2)),
          suggestedSellingPrice: parseFloat(sellingPrice.toFixed(2)),
          marginPercent: bulkData.marginPercent,
          unit: bulkData.unit
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🧮 Smart Pricing Engine</h1>
        <p className="text-xl text-gray-600 mb-4">Convert bulk purchase to smart unit pricing</p>
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">💡 Example:</h3>
          <p className="text-emerald-800">
            200 biscuits ₹590 → <strong>₹2.95 cost/unit → ₹3.25 selling (10% margin)</strong>
          </p>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">📊 Bulk to Unit Calculator</h3>
          <form onSubmit={calculatePrice} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Bulk Quantity</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={bulkData.bulkQuantity}
                  onChange={(e) => setBulkData({...bulkData, bulkQuantity: e.target.value})}
                  placeholder="200"
                  className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <select
                  value={bulkData.unit}
                  onChange={(e) => setBulkData({...bulkData, unit: e.target.value})}
                  className="w-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="unit">unit</option>
                  <option value="kg">kg</option>
                  <option value="liter">L</option>
                  <option value="pack">pack</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Bulk Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={bulkData.bulkPrice}
                onChange={(e) => setBulkData({...bulkData, bulkPrice: e.target.value})}
                placeholder="590"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Margin (%)</label>
              <input
                type="range"
                min="5"
                max="50"
                value={bulkData.marginPercent}
                onChange={(e) => setBulkData({...bulkData, marginPercent: parseInt(e.target.value)})}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {bulkData.marginPercent}%
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate Smart Price'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">✅ Results</h3>
          {result ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-4 border-emerald-200 p-8 rounded-2xl text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h4 className="text-3xl font-bold text-emerald-800 mb-2">
                  Perfect Price Found!
                </h4>
                <div className="space-y-2 text-2xl font-bold">
                  <div>Cost per {result.unit}: ₹{result.costPerUnit}</div>
                  <div className="text-emerald-700">
                    Selling Price: ₹{result.suggestedSellingPrice}
                  </div>
                </div>
                <div className="text-lg text-emerald-700 mt-4 bg-white/50 px-4 py-2 rounded-xl font-semibold">
                  {result.example}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center p-6 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹{result.costPerUnit}</div>
                  <div className="text-sm text-gray-500">Cost/{result.unit}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">₹{result.suggestedSellingPrice}</div>
                  <div className="text-sm text-gray-500">Sell/{result.unit}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💰</div>
                <p>Enter bulk details to calculate smart pricing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OCR Section */}
      <div className="bg-white p-8 text-center rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-6">📱 Bill Scanner (OCR Coming Soon)</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload bill image → Auto extract items → Bulk pricing → Add to inventory
        </p>
        <div className="bg-gray-100 p-12 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Drag & Drop Bill Image</p>
          <p className="text-gray-500 mb-6">Tesseract.js OCR extracts items automatically</p>
          className="px-8 py-3 text-lg bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            Scan Bill
          </button>
        </div>
