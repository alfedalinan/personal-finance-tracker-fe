import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, LogIn, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import RegisterModal from '../components/RegisterModal'

export default function LoginView() {
  const { login, successMessage, clearSuccessMessage } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    clearSuccessMessage()

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    const success = login(username.trim(), password)
    if (success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('Invalid username or password. (Hint: try demo / demo123 or admin / password123)')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-xl shadow-indigo-900/40 mb-4 ring-4 ring-indigo-500/20">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Finance Tracker</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your personal wealth</p>
        </div>

        {/* Success Banner (D2) */}
        {successMessage && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start space-x-3 text-emerald-300 text-sm backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-200">Registration Successful</p>
              <p className="mt-0.5">{successMessage}</p>
            </div>
            <button
              onClick={clearSuccessMessage}
              className="text-emerald-400 hover:text-emerald-200 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center space-x-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
            >
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span>Register here</span>
              </button>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Demo Credentials: <span className="text-slate-300 font-mono">demo / demo123</span>
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  )
}
