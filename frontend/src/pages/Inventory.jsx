import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Inventory() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({ name: '', stock: 0, costPrice: 0, sellingPrice: 0 })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      })
      
      setNewProduct({ name: '', stock: 0, costPrice: 0, sellingPrice: 0 })
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const startEdit = (product) => {
    setNewProduct(product)
    setEditingId(product._id)
  }

  if (loading) return <div className="p-8 text-center">Loading inventory...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📦 Inventory Management</h1>
        <p className="text-xl text-gray-600">Add products and track stock levels</p>
      </div>

      {/* Add/Edit Form */}
      <div className="card mb-8 max-w-2xl">
        <h3 className="text-xl font-semibold mb-6">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: parseFloat(e.target.value) || 0})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cost Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.costPrice}
              onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value) || 0})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Selling Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.sellingPrice}
              onChange={(e) => setNewProduct({...newProduct, sellingPrice: parseFloat(e.target.value) || 0})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full py-4 text-lg font-semibold">
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">All Products ({products.length})</h3>
          <button onClick={fetchProducts} className="btn-secondary">
            🔄 Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const profitMargin = ((product.sellingPrice - product.costPrice) / product.costPrice * 100).toFixed(1)
                const lowStock = product.lowStock || product.stock <= (product.threshold || 5)
                
                return (
                  <tr key={product._id} className={lowStock ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lowStock 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.costPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹{product.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        profitMargin > 20 ? 'text-emerald-600' : 'text-gray-900'
                      }`}>
                        {profitMargin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

