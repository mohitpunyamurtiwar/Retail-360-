export default function StatsCard({ title, value, icon, trend, isBad = false }) {
  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            trend.startsWith('+') 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {value}
        </p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  )
}

