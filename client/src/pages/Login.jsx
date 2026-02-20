// ============================================================
// LOGIN PAGE
// Authentication page for System Admin / Provincial Admin.
// Currently frontend-only; will connect to .NET backend later.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication - will be replaced with .NET API call
    setTimeout(() => {
      if (email === 'admin@transport.gov.lk' && password === 'admin123') {
        navigate('/');
      } else {
        setError('Invalid email or password. Try admin@transport.gov.lk / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-600/30">
            <Bus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Public Transport Complaint System
          </h1>
          <p className="text-blue-200 mt-2 text-sm">
            Ministry of Transport - Sri Lanka
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@transport.gov.lk"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-slate-600">
              Email: <code className="bg-slate-200 px-1 rounded">admin@transport.gov.lk</code>
            </p>
            <p className="text-xs text-slate-600">
              Password: <code className="bg-slate-200 px-1 rounded">admin123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300/50 text-xs mt-6">
          &copy; 2026 Ministry of Transport, Sri Lanka. All rights reserved.
        </p>
      </div>
    </div>
  );
}
