import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AcademicCapIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';

const ResetPassword = ({ email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('api/password/reset-password',{email,password})

      const data = response.data;
      toast.success("Password reset successfully")
      navigate("/login")

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-emerald-50 overflow-auto">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
          style={{ minHeight: '80vh', maxHeight: '90vh' }}
        >
          <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-400/20"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-300/20"
            />
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <AcademicCapIcon className="h-10 w-10 text-white" />
                <h1 className="text-3xl font-bold text-white font-poppins">
                  PageTurn
                </h1>
              </div>
              
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ 
                  repeat: Infinity, 
                  duration: 15, 
                  ease: "linear" 
                }} 
                className="mx-auto mb-6"
              >
                <ArrowPathIcon className="h-20 w-20 text-white/30" />
              </motion.div>
              
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Create New Password</h2>
              <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">
                Choose a strong, secure password for your account
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <FaLock className="text-emerald-600 text-2xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reset Password</h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-emerald-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <ul className="mt-2 text-xs text-slate-500">
                  <li className={`flex items-center mb-1 ${password.length >= 8 ? 'text-emerald-500' : ''}`}>
                    {password.length >= 8 ? '✓' : '•'} At least 8 characters
                  </li>
                  <li className={`flex items-center mb-1 ${/\d/.test(password) ? 'text-emerald-500' : ''}`}>
                    {/\d/.test(password) ? '✓' : '•'} At least 1 number
                  </li>
                  <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-emerald-500' : ''}`}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '•'} At least 1 special character
                  </li>
                </ul>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-emerald-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70 shadow hover:shadow-md"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FaSyncAlt className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;