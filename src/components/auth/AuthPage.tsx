import { useState } from 'react'
import { User, Mail, Lock, Phone, UserPlus, LogIn } from 'lucide-react'
import { Button } from '../ui/Button'
import { signUp, signIn, validateEmail, validatePassword, validatePhone } from '../../utils/auth'
import { AuthUser } from '../../types'

interface AuthPageProps {
  onLogin: (user: any) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'interviewee' as 'interviewer' | 'interviewee'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password)
        if (result.success && result.user) {
          onLogin(result.user)
        } else {
          setError(result.message || 'Login failed')
        }
      } else {
        const authData: AuthUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role
        }
        
        const result = await signUp(authData)
        if (result.success && result.user) {
          onLogin(result.user)
        } else {
          setError(result.message || 'Signup failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'interviewee'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to continue to InterviewAI' 
              : 'Join InterviewAI to start your interview journey'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'interviewee' }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.role === 'interviewee'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <User className="mx-auto mb-2" size={24} />
                        <div className="font-medium">Candidate</div>
                        <div className="text-xs text-gray-500">Take interviews</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'interviewer' }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.role === 'interviewer'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <UserPlus className="mx-auto mb-2" size={24} />
                        <div className="font-medium">Interviewer</div>
                        <div className="text-xs text-gray-500">Manage interviews</div>
                      </div>
                    </button>
                  </div>
                </div>

                {formData.role === 'interviewee' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                        required={!isLogin && formData.role === 'interviewee'}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isLogin ? <LogIn className="mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
