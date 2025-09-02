import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SearchFilters = ({ 
  products = [], // ← Default empty array to prevent undefined errors
  onFilteredProducts, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy, 
  showFilters, 
  setShowFilters 
}) => {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // Safely derive categories from products
  const categories = ['All', ...new Set((products || []).map(p => p?.category || '').filter(Boolean))]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' }
  ]

  // Calculate price range based on products with safety checks
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const prices = products.map(p => p?.price || 0).filter(price => price > 0)
      if (prices.length > 0) {
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        setPriceRange([minPrice, maxPrice])
      }
    }
  }, [products])

  // Apply all filters with safety checks
  useEffect(() => {
    if (!Array.isArray(products) || !onFilteredProducts) return

    let filtered = [...products]

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product?.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product?.price || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(product => (product?.rating || 5) >= selectedRating)
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => (product?.stock || 0) > 0)
    }

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter(product => product?.featured || product?.isFeatured)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a?.name || '').localeCompare(b?.name || '')
        case 'name-desc':
          return (b?.name || '').localeCompare(a?.name || '')
        case 'price-low':
          return (a?.price || 0) - (b?.price || 0)
        case 'price-high':
          return (b?.price || 0) - (a?.price || 0)
        case 'rating':
          return (b?.rating || 5) - (a?.rating || 5)
        case 'featured':
          return ((b?.featured || b?.isFeatured) ? 1 : 0) - ((a?.featured || a?.isFeatured) ? 1 : 0)
        case 'newest':
          return (b?.id || 0) - (a?.id || 0)
        default:
          return 0
      }
    })

    onFilteredProducts(filtered)
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    selectedRating,
    inStockOnly,
    featuredOnly,
    sortBy,
    onFilteredProducts
  ])

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString('en-IN')}`
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSortBy('name')
    setPriceRange([0, 50000])
    setSelectedRating(0)
    setInStockOnly(false)
    setFeaturedOnly(false)
  }

  const hasActiveFilters = searchTerm || 
    selectedCategory !== 'All' || 
    sortBy !== 'name' || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 50000 || 
    selectedRating > 0 || 
    inStockOnly || 
    featuredOnly

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <button
          onClick={() => setShowFilters?.(!showFilters)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {(showFilters || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory || 'All'}
                onChange={(e) => setSelectedCategory?.(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy || 'name'}
                onChange={(e) => setSortBy?.(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={1}>1+ Stars</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Filters (Desktop) */}
      {hasActiveFilters && (
        <div className="hidden lg:flex justify-end mt-4">
          <button
            onClick={clearAllFilters}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
