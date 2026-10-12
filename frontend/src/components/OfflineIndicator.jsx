export default function OfflineIndicator({ offline }) {
  if (!offline) return null

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 text-center text-sm font-medium shadow-lg">
      <span>🌐 Offline Mode - Data will sync when online</span>
    </div>
  )
}

