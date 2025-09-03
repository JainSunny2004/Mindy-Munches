import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null, // ← Added token storage
      isAuthenticated: false,
      isLoading: false,

      login: (userData, token) => { // ← Added token parameter
        // Store token in both localStorage and sessionStorage for backup
        if (token) {
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
        }
        
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false
        })
      },

      logout: () => {
        // Clear tokens from storage
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Clear cart when logging out
        try {
          // Import cart store and clear it
          import('./cartStore').then(({ default: useCartStore }) => {
            useCartStore.getState().clearCartOnLogout()
          })
        } catch (error) {
          console.warn('Could not clear cart on logout:', error)
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },

      // Get token from store or fallback to localStorage
      getToken: () => {
        const { token } = get();
        return token || localStorage.getItem('token') || sessionStorage.getItem('token');
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      isUser: () => {
        const { user } = get()
        return user?.role === 'user'
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Check if user has permission for a specific action
      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false

        // Admin has all permissions
        if (user.role === 'admin') return true

        // Define user permissions
        const userPermissions = ['view_products', 'manage_cart', 'place_orders']
        return userPermissions.includes(permission)
      }
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
)

export default useAuthStore
