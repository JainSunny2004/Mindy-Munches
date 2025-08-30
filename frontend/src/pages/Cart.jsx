import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import EmptyState from '../components/EmptyState'

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isUpdating, setIsUpdating] = useState({})

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', {
        state: {
          from: location.pathname,
          message: 'Please login to view your cart and checkout'
        }
      })
    }
  }, [isAuthenticated, navigate, location.pathname])

  const formatPrice = (price) => {
    return `₹ ${(price / 100).toLocaleString('en-IN')}`
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    setIsUpdating(prev => ({ ...prev, [productId]: true }))
    
    // Simulate API delay for better UX
    setTimeout(() => {
      updateQuantity(productId, newQuantity)
      setIsUpdating(prev => ({ ...prev, [productId]: false }))
    }, 300)
  }

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setIsUpdating(prev => ({ ...prev, [productId]: true }))
      
      setTimeout(() => {
        removeItem(productId)
        setIsUpdating(prev => ({ ...prev, [productId]: false }))
      }, 300)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart()
      
      // Show notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
      notification.textContent = 'Cart cleared successfully!'
      document.body.appendChild(notification)
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    }
  }

  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null
  }

  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 5000 // Free shipping above ₹500
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-neutral-800">
                Your Cart
              </h1>
              <p className="text-neutral-600 mt-2">
                {getItemCount() > 0 
                  ? `${getItemCount()} ${getItemCount() === 1 ? 'item' : 'items'} in your cart`
                  : 'Your cart is empty'
                }
              </p>
            </div>
            
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">{user?.name}</p>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {items.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="Your cart is empty"
              description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
              action={
                <div className="space-y-3">
                  <Link to="/products" className="btn-primary block text-center">
                    Start Shopping
                  </Link>
                  <Link to="/" className="btn-secondary block text-center">
                    Back to Home
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Cart Header */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-neutral-100">
                  <h2 className="text-xl font-semibold text-neutral-800">
                    Cart Items ({getItemCount()})
                  </h2>
                  {items.length > 1 && (
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden ${
                        isUpdating[item.id] ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Product Image */}
                          <Link to={`/products/${item.id}`} className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full md:w-32 h-32 object-cover rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <Link 
                                to={`/products/${item.id}`}
                                className="block"
                              >
                                <h3 className="text-lg font-semibold text-neutral-800 hover:text-primary-600 transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-neutral-600 mt-1">{item.category}</p>
                              <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            {/* Price and Quantity Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-neutral-700">Quantity:</span>
                                <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isUpdating[item.id]}
                                    className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                    {isUpdating[item.id] ? '...' : item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={isUpdating[item.id]}
                                    className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Price and Actions */}
                              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary-600">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                  <div className="text-sm text-neutral-500">
                                    {formatPrice(item.price)} each
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isUpdating[item.id]}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
                <div className="pt-4">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div 
                  className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden sticky top-24"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatPrice(shipping)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tax (18% GST)</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                      </div>
                      <div className="border-t border-neutral-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-neutral-800">Total</span>
                          <span className="text-lg font-bold text-primary-600">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Notice */}
                    {subtotal < 50000 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                        <p className="text-yellow-700 text-sm">
                          Add {formatPrice(50000 - subtotal)} more for free shipping!
                        </p>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <button 
                      className="w-full btn-primary text-lg py-4 mb-4"
                      onClick={() => {
                        // Will be updated when checkout is implemented
                        alert('Checkout functionality will be implemented in the next step!')
                      }}
                    >
                      Proceed to Checkout
                    </button>

                    {/* Security Notice */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure checkout</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-3">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-medium text-primary-800 mb-2">💡 Need Help?</h4>
                    <p className="text-sm text-primary-700 mb-3">
                      Have questions about your order or need assistance?
                    </p>
                    <Link 
                      to="/contact" 
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Contact Support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Cart
