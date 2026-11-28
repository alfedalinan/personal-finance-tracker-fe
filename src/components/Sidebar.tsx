import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, Wallet, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuth()
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">Finance Tracker</h1>
            <p className="text-xs text-slate-500">Personal Wealth</p>
          </div>
        </div>
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Session & Logout Footer */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        {user && (
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user.username}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Active Session</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 text-sm font-semibold transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (persistent on md and up) */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay and Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
