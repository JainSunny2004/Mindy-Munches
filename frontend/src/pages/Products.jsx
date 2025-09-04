import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import SearchFilters from '../components/SearchFilters'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        let response
        try {
          // First, try to fetch from API
          if (import.meta.env.VITE_API_URL) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
              headers: {
                'Accept': 'application/json'
              },
              cache: 'no-store'
            })

            if (!response.ok) {
              throw new Error(`API failed with status ${response.status}`)
            }
          } else {
            throw new Error('API not available')
          }
        } catch (apiError) {
          console.warn('API failed, falling back to local data:', apiError.message)
          
          // Fallback to local JSON file in public folder
          try {
            response = await fetch('/data/products.json', {
              headers: {
                'Accept': 'application/json'
              }
            })

            if (!response.ok) {
              throw new Error('Local data file not found')
            }
          } catch (localError) {
            console.warn('Local data failed, using hardcoded fallback:', localError.message)
            
            // Final fallback to hardcoded data
            const fallbackProducts = [
              {
                id: 1,
                name: "Premium Makhana",
                description: "Handpicked fox nuts roasted with traditional methods",
                price: 299,
                category: "superfoods",
                images: [{ url: "/Sweet-makhana.png", alt: "Premium Makhana" }],
                isFeatured: true,
                stock: 50
              },
              {
                id: 2,
                name: "Organic Sattu",
                description: "Traditional roasted gram flour packed with protein",
                price: 199,
                category: "grains",
                images: [{ url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", alt: "Organic Sattu" }],
                isFeatured: true,
                stock: 30
              }
            ]

            setProducts(fallbackProducts)
            setFilteredProducts(fallbackProducts)
            return
          }
        }

        // Parse the successful response
        const data = await response.json()
        let productsArray = []

        // Handle different API response formats
        if (data.success && data.data && data.data.products) {
          productsArray = data.data.products
        } else if (data.products) {
          productsArray = data.products
        } else if (Array.isArray(data)) {
          productsArray = data
        } else {
          console.warn('Unexpected API response format:', data)
          productsArray = []
        }

        // Ensure productsArray is actually an array
        if (!Array.isArray(productsArray)) {
          console.error('Products data is not an array:', productsArray)
          productsArray = []
        }

        setProducts(productsArray)
        setFilteredProducts(productsArray)

      } catch (error) {
        console.error('Error loading products:', error)
        setError('Failed to load products. Please try refreshing the page.')
        
        // Ultimate fallback to hardcoded data
        const fallbackProducts = [
          {
            id: 1,
            name: "Premium Makhana",
            description: "Handpicked fox nuts roasted with traditional methods",
            price: 299,
            category: "superfoods",
            images: [{ url: "/Sweet-makhana.png", alt: "Premium Makhana" }],
            isFeatured: true,
            stock: 50
          }
        ]

        setProducts(fallbackProducts)
        setFilteredProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Handle filtered products from SearchFilters
  const handleFilteredProducts = (filtered) => {
    setFilteredProducts(Array.isArray(filtered) ? filtered : [])
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our range of traditional superfoods, carefully crafted for modern lifestyles. 
              From protein-rich Makhana to versatile Sattu - find the perfect healthy snack.
            </p>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {Array.isArray(filteredProducts) ? filteredProducts.length : 0} of {Array.isArray(products) ? products.length : 0} products
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <SearchFilters
          products={products}
          onFilteredProducts={handleFilteredProducts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
          <EmptyState 
            title="No products found"
            description="Try adjusting your search terms or filters"
            actionText="Clear Filters"
            onAction={() => {
              setSearchTerm('')
              setSelectedCategory('All')
              setSortBy('name')
            }}
          />
        ) : (
          <>
            {/* Featured Products Section */}
            {Array.isArray(filteredProducts) && filteredProducts.some(p => p.featured || p.isFeatured) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProducts
                    .filter(product => product.featured || product.isFeatured)
                    .slice(0, 3)
                    .map((product) => (
                      <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ProductCard product={product} featured />
                      </motion.div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* All Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(filteredProducts) && filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Category Highlights */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Explore our carefully curated selection of traditional superfoods
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Makhana</h3>
                  <p className="text-gray-600 mb-4">
                    Protein-rich fox nuts, perfect for guilt-free snacking. Low glycemic index and completely additive-free.
                  </p>
                  <Link 
                    to="/products?category=makhana" 
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    View Makhana Products →
                  </Link>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Sattu</h3>
                  <p className="text-gray-600 mb-4">
                    Plant protein powerhouse packed with fiber and minerals. Versatile ingredient for modern kitchens.
                  </p>
                  <Link 
                    to="/products?category=sattu" 
                    className="text-orange-600 font-medium hover:text-orange-700"
                  >
                    View Sattu Products →
                  </Link>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">
                  Not sure which products are right? Our team can help find the perfect healthy snacks for your lifestyle.
                </p>
              </div>

            </motion.div>
          )}
        </div>
      </section>

      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Not sure which products are right? Our team can help find the perfect healthy snacks for your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-white text-primary-600 font-medium px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                Contact Us
              </Link>
              <Link to="/recipes" className="border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                View Recipes
              </Link>

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Products
