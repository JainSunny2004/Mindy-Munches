import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import productsData from '../../public/data/products.json';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        // Helper function to check if we're in Netlify environment
        const isNetlify = () => {
          return (
            window.location.hostname.includes('netlify.app') ||
            window.location.hostname.includes('netlify.com') ||
            import.meta.env.VITE_NETLIFY_DEPLOY === 'true'
          );
        };

        let response;

        // 1. Try fetching from API
        try {
          if (import.meta.env.VITE_API_URL && !isNetlify()) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
              headers: { 'Accept': 'application/json' },
              cache: 'no-store',
            });
            if (!response.ok) {
              throw new Error(`API failed with status ${response.status}`);
            }
          } else {
            throw new Error('API not available or Netlify environment detected');
          }
        } catch (apiError) {
          console.warn('API failed, falling back to public data:', apiError.message);

          // 2. Fallback to public data file
          try {
            response = await fetch('/data/products.json', {
              headers: { 'Accept': 'application/json' },
            });
            if (!response.ok) {
              throw new Error('Public data files not found');
            }
          } catch (publicError) {
            console.warn('Public data failed, using imported data:', publicError.message);

            // 3. Final fallback to imported JSON data
            const allProducts = Array.isArray(productsData.products)
              ? productsData.products
              : [];
            setProducts(allProducts);
            setFilteredProducts(allProducts);
            return;
          }
        }

        // Parse the successful response
        const data = await response.json();
        const productsArray = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error('Error loading products:', error);

        // Ultimate fallback to imported data
        const allProducts = Array.isArray(productsData.products)
          ? productsData.products
          : [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Defensive fix: Always work with arrays
  const safeFilteredProducts = Array.isArray(filteredProducts)
    ? filteredProducts
    : [];
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <main className="container mx-auto px-4 py-10">
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Discover our range of traditional superfoods, carefully crafted for modern lifestyles.</h1>
        <p className="text-gray-600">From protein-rich Makhana to versatile Sattu - find the perfect healthy snack.</p>
      </section>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-700">
          Showing {safeFilteredProducts.length} of {safeProducts.length} products
        </p>
        <button
          className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition-colors"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6">
          <SearchFilters
            products={safeProducts}
            onFilter={setFilteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      )}

      {loading ? (
        <Loader />
      ) : safeFilteredProducts.length === 0 ? (
        <EmptyState message="No products found." />
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {safeFilteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}

      {/* Example usage of `.some`—safe now */}
      {safeFilteredProducts.some((p) => p.featured) && (
        <section className="bg-yellow-50 mt-10 p-6 rounded-lg text-center">
          <h2 className="font-bold text-xl mb-2">
            Not sure which products are right?
          </h2>
          <p className="text-gray-600">
            Our team can help find the perfect healthy snacks for your lifestyle.
          </p>
        </section>
      )}
    </main>
  );
};

export default Products;
