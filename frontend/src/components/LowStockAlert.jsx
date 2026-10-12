export default function LowStockAlert({ alerts }) {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-200/50 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-orange-100 rounded-xl mr-4">
          <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Low Stock Alert ⚠️
          </h3>
          <p className="text-orange-800">
            {alerts.length} items need attention
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.slice(0, 6).map((alert, index) => (
          <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-orange-100">
            <div className="font-semibold text-gray-900">{alert.name}</div>
            <div className="text-2xl font-bold text-orange-600">{alert.stock}</div>
            <div className="text-sm text-gray-500">Threshold: {alert.threshold}</div>
          </div>
        ))}
      </div>
      
      {alerts.length > 6 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">+{alerts.length - 6} more</span>
        </div>
      )}
    </div>
  )
}

