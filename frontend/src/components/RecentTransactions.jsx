export default function RecentTransactions({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📋</div>
        <p>No transactions yet</p>
        <p className="text-sm">Start using POS to track sales</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx._id} className="group flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 border-l-4 border-primary-500">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 truncate">
                {tx.customerName || `Sale #${tx._id.slice(-6)}`}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tx.type === 'sale' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {tx.type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{tx.items?.length || 0} items</span>
              <span>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</span>
              {tx.paymentMethod === 'UPI' && (
                <span className="text-emerald-600 font-medium">UPI</span>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-primary-600">
              ₹{tx.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">{tx.items?.length} items</div>
          </div>
        </div>
      ))}
    </div>
  )
}

