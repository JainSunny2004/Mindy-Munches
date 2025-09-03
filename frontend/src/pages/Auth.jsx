import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const message = location.state?.message
  const productName = location.state?.productName

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required'
      else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})
    try {
      if (isLogin) {
        // REAL login
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        })
        const data = await response.json()
        if (data.success && data.data?.token) {
          login(data.data.user, data.data.token)
          navigate(from, { replace: true })
          setTimeout(() => {
            const notification = document.createElement('div')
            notification.className =
              'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
            notification.textContent =
              message && productName
                ? `Welcome back! You can now add ${productName} to your cart.`
                : 'Welcome back!'
            document.body.appendChild(notification)
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification) }, 4000)
          }, 100)
        } else {
          setErrors({ general: data.message || 'Login failed' })
        }
      } else {
        // Signup (Registration)
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })
        const data = await response.json()
        if (data.success && data.data?.token) {
          login(data.data.user, data.data.token)
          navigate(from, { replace: true })
          setTimeout(() => {
            const notification = document.createElement('div')
            notification.className =
              'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
            notification.textContent = 'Welcome to Mindy Munchs, ' + formData.name + '!'
            document.body.appendChild(notification)
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification) }, 4000)
          }, 100)
        } else {
          setErrors({ general: data.message || 'Signup failed' })
        }
      }
    } catch {
      setErrors({ general: 'Authentication failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setErrors({})
  }

  // Demo account options
  const demoAccounts = [
    { type: 'user', email: 'user@demo.com', password: 'demo123', label: 'Demo User', description: 'Regular customer account' },
    { type: 'admin', email: 'admin@demo.com', password: 'demo123', label: 'Demo Admin', description: 'Administrator account (pre-configured)' }
  ]

  const loginWithDemo = async (account) => {
    setIsLoading(true)
    setErrors({})
    try {
      const response = await fetch(`${API_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: account.type }),
      })
      const data = await response.json()
      if (data.success && data.data?.token) {
        login(data.data.user, data.data.token)
        navigate(from, { replace: true })
        setTimeout(() => {
          const notification = document.createElement('div')
          notification.className =
            'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
          notification.textContent = `Welcome back, ${data.data.user.name || account.label}!`
          document.body.appendChild(notification)
          setTimeout(() => {
            if (document.body.contains(notification)) document.body.removeChild(notification)
          }, 4000)
        }, 100)
      } else {
        setErrors({ general: data.message || 'Demo login failed.' })
      }
    } catch {
      setErrors({ general: 'Demo login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-md py-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-1">{isLogin ? 'Sign in' : 'Sign up'}</h2>
        <p className="mb-4 text-gray-600">
          {isLogin ? 'Sign in to your account to continue shopping' : 'Create your account and start your healthy snacking journey'}
        </p>
        {errors.general && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={isLoading}
            />
            {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                autoComplete="new-password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <div className="text-xs text-red-500 mt-1">{errors.confirmPassword}</div>}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="underline text-blue-600 text-sm"
            onClick={switchMode}
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </button>
        </div>
        <div className="mt-6">
          <div className="font-semibold mb-2">Demo accounts for testing:</div>
          <div className="flex flex-col gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => loginWithDemo(account)}
                className="py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={isLoading}
                type="button"
              >
                {account.label} ({account.email} / {account.password})
                <span className="block text-xs text-gray-600">{account.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Auth
