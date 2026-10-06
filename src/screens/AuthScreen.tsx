import React, { useState } from 'react';
import { User, LogIn, LogOut, Lock, Phone, Mail, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ScreenId } from '../components/Navbar';

interface AuthScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, login, signup, loginWithProvider, resetPassword, logout, updateProfile } = useAuth();
  const { updateCustomerDetails } = useCart();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signin') {
        await login(name, phone, email, password);
        setSuccessNotice('Signed in successfully!');
      } else {
        await signup(name, phone, email, password);
        updateCustomerDetails({ name, phone, email, city: city || 'Chennai' });
        setSuccessNotice('Customer account created successfully!');
      }
    } catch (err: any) { setSuccessNotice(err.message || 'Unable to continue.'); }
  };

  const handleGuestLogin = () => {
    setSuccessNotice('Guest checkout is ready. You can continue without creating an account.');
    onNavigate('cart');
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setSuccessNotice('Enter your email address first.'); return; }
    try { await resetPassword(email); setSuccessNotice('Password reset instructions have been sent to your email.'); }
    catch (err: any) { setSuccessNotice(err.message || 'Unable to send reset instructions.'); }
  };

  return (
    <div className="py-12 max-w-xl mx-auto px-4 sm:px-6 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          <span>Customer Account Portal</span>
        </div>
        <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          {isAuthenticated ? 'My Customer Account' : 'Sign In or Register'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 max-w-md mx-auto">
          {isAuthenticated
            ? 'Manage your saved delivery details and quick WhatsApp order profile.'
            : 'Sign in to save your cart items, past orders history, and delivery details.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {isAuthenticated && user ? (
          /* Profile & Logout View */
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-display font-black text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 font-mono">
                  {user.phone}
                </p>
                {user.email && (
                  <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => onNavigate('myorders')}
                className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-center transition-colors cursor-pointer"
              >
                View My Orders
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className="py-3 px-4 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-200 dark:text-stone-200 light:text-stone-800 font-semibold text-center transition-colors cursor-pointer"
              >
                Open Current Cart
              </button>
            </div>

            <div className="pt-4 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500">Finished for now?</span>
              <button
                onClick={() => {
                  logout();
                  setSuccessNotice('Signed out successfully.');
                }}
                className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-400 text-xs font-bold border border-red-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Tabs & Form */
          <div className="space-y-6">
            
            {/* Tabs */}
            <div className="flex p-1 bg-stone-950 dark:bg-stone-950 light:bg-stone-100 rounded-xl border border-stone-800 dark:border-stone-800 light:border-stone-200">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                New Customer Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {mode === 'register' && (
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                  Mobile / WhatsApp Number {mode === 'register' && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    {...mode === 'register' ? { required: true } : {}}
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Your City / Town
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Madurai, Coimbatore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {mode === 'signin' && (
                <button type="button" onClick={handleForgotPassword} className="text-xs text-amber-400 hover:text-amber-300 underline">Forgot password?</button>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all cursor-pointer mt-2"
              >
                {mode === 'signin' ? 'Sign In Now' : 'Create My Account'}
              </button>

            </form>

            <div className="pt-4 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => loginWithProvider('google')} className="py-2 rounded-lg border border-stone-700 text-xs text-stone-200 hover:border-amber-500">Google</button>
              <button type="button" onClick={() => loginWithProvider('apple')} className="py-2 rounded-lg border border-stone-700 text-xs text-stone-200 hover:border-amber-500">Apple</button>
              <button type="button" onClick={() => loginWithProvider('azure')} className="py-2 rounded-lg border border-stone-700 text-xs text-stone-200 hover:border-amber-500">Microsoft</button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={handleGuestLogin}
                className="text-amber-500 hover:text-amber-400 font-semibold text-xs underline cursor-pointer"
              >
                Or Continue as Guest (1-Click Instant Sign In)
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
