import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HomeIcon,
  PackageIcon,
  CalculatorIcon,
  CreditCardIcon,
  ChartBarIcon,
  MapIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/inventory', label: 'Inventory', icon: PackageIcon },
  { path: '/pricing', label: 'Pricing', icon: CalculatorIcon },
  { path: '/pos', label: 'POS', icon: CreditCardIcon },
  { path: '/competitors', label: 'Competitors', icon: MapIcon },
  { path: '/distributors', label: 'Distributors', icon: TruckIcon }
]

export default function Navbar() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop nav */}
          <div className="flex items-center space-x-1 flex-1 justify-center">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Retail360
            </Link>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-gray-500">{user?.shopName}</div>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 text-base font-medium rounded-xl ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-6 w-6 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

