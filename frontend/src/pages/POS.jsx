import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function POS() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(true)

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

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id)
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, productId: product._id, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, qty) {
    if (qty <= 0) {
      setCart(cart.filter(item => item.productId !== productId))
    } else {
      setCart(cart.map(item => 
        item.productId === productId
          ? { ...item, quantity: qty }
          : item
      ))
    }
  }

  const checkout = async () => {
    if (cart.length === 0) return

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.sellingPrice
          })),
          total: getTotal(),
          customerName,
          paymentMethod: 'cash'
        })
      })

      if (res.ok) {
        alert('✅ Bill generated successfully!')
        setCart([])
        setCustomerName('')
        fetchProducts() // Refresh stock
      }
    } catch (error) {
      alert('❌ Checkout failed')
    }
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0)
  }

  const UPIpay = async () => {
    try {
      const res = await fetch('/api/transactions/upi-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: getTotal(), upiId: 'user@paytm' })
      })
      const data = await res.json()
      alert(`✅ UPI Payment Success! TXN: ${data.transactionId}`)
      checkout()
    } catch (error) {
      alert('❌ UPI payment failed')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">💳 Tablet POS Mode</h1>
        <p className="text-xl text-gray-600">Quick billing for customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Grid */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Products (Tap to Add)</h3>
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    className="group card p-6 text-center hover:scale-105 transition-all duration-200 border-2 hover:border-primary-300 hover:shadow-xl"
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${
                      product.lowStock 
                        ? 'from-red-400 to-red-500 text-white' 
                        : 'from-emerald-400 to-emerald-500 text-white'
                    } flex items-center justify-center text-2xl font-bold`}>
                      {product.lowStock ? '⚠️' : '✅'}
                    </div>
                    <div className="font-bold text-lg mb-1 group-hover:text-primary-600">
                      {product.name}
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{product.sellingPrice}
                    </div>
                    <div className="text-sm text-gray-500">{product.stock} left</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div>
          <div className="card sticky top-6 h-fit">
            <h3 className="text-xl font-bold mb-6">🛒 Cart ({cart.length})</h3>
            
            {/* Customer */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Cash customer / Walk-in"
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">₹{item.sellingPrice}/unit</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Payment */}
            <div className="space-y-4">
              <div className="flex justify-between text-2xl font-bold text-gray-900 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                <span>Total:</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={checkout}
                  disabled={cart.length === 0}
                  className="btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💵 Cash
                </button>
                <button 
                  onClick={UPIpay}
                  disabled={cart.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💳 UPI Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

