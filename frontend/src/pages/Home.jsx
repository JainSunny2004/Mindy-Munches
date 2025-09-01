import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useVideoTestimonials } from "../components/VideoTestimonials";
import Loader from "../components/Loader";

// Import fallback data
import productsData from "../data/products.json";
import testimonialsData from "../data/testimonials.json";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  // Use the custom hook to get video testimonials
  const { testimonials: videoTestimonials, loading: videoLoading } = useVideoTestimonials();

  // scrollRef for testimonial sections
  const scrollRef = useRef(null);
  const videoScrollRef = useRef(null);

  // Hero images that will rotate automatically
  const heroImages = [
    {
      src: "/BANNER_1.png",
      alt: "Traditional Makhana preparation",
    },
    {
      src: "/BANNER_2.png",
      alt: "Organic Sattu ingredients",
    },
    {
      src: "https://images.unsplash.com/photo-1619613521014-d0d263855bbf?w=1200&h=600&fit=crop",
      alt: "Traditional food artisans at work",
    },
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Helper function to check if we're in Netlify environment
        const isNetlify = () => {
          return (
            window.location.hostname.includes("netlify.app") ||
            window.location.hostname.includes("netlify.com") ||
            import.meta.env.VITE_NETLIFY_DEPLOY === "true"
          );
        };

        let productsResponse, testimonialsResponse;
        
        try {
          // First, try to fetch from API
          if (import.meta.env.VITE_API_URL && !isNetlify()) {
            const [apiProductsResponse, apiTestimonialsResponse] = await Promise.all([
              fetch(`${import.meta.env.VITE_API_URL}/products`),
              fetch(`${import.meta.env.VITE_API_URL}/testimonials`),
            ]);

            if (apiProductsResponse.ok && apiTestimonialsResponse.ok) {
              productsResponse = apiProductsResponse;
              testimonialsResponse = apiTestimonialsResponse;
            } else {
              throw new Error("API responses not ok");
            }
          } else {
            throw new Error("API not available or Netlify environment detected");
          }
        } catch (apiError) {
          console.warn("API failed, falling back to public data:", apiError.message);
          
          // Fallback to public data files
          try {
            const [publicProductsResponse, publicTestimonialsResponse] = await Promise.all([
              fetch("/data/products.json"),
              fetch("/data/testimonials.json"),
            ]);

            if (publicProductsResponse.ok && publicTestimonialsResponse.ok) {
              productsResponse = publicProductsResponse;
              testimonialsResponse = publicTestimonialsResponse;
            } else {
              throw new Error("Public data files not found");
            }
          } catch (publicError) {
            console.warn("Public data failed, using imported data:", publicError.message);
            
            // Final fallback to imported JSON data
            const allProducts = Array.isArray(productsData.products) ? productsData.products : [];
            const allTestimonials = Array.isArray(testimonialsData.testimonials) ? testimonialsData.testimonials : [];
            
            setProducts(allProducts.slice(0, 6));
            setBestsellers(allProducts.slice(0, 3));
            setTestimonials(allTestimonials);
            return;
          }
        }

        // Parse the successful response
        const productsData = await productsResponse.json();
        const testimonialsData = await testimonialsResponse.json();

        // Handle different API response formats
        let allProducts = [];
        let allTestimonials = [];

        // Products parsing
        if (productsData.success && productsData.data && productsData.data.products) {
          allProducts = productsData.data.products;
        } else if (productsData.products) {
          allProducts = productsData.products;
        } else if (Array.isArray(productsData)) {
          allProducts = productsData;
        }

        // Testimonials parsing
        if (testimonialsData.success && testimonialsData.testimonials) {
          allTestimonials = testimonialsData.testimonials;
        } else if (testimonialsData.testimonials) {
          allTestimonials = testimonialsData.testimonials;
        } else if (Array.isArray(testimonialsData)) {
          allTestimonials = testimonialsData;
        }

        // Ensure arrays
        allProducts = Array.isArray(allProducts) ? allProducts : [];
        allTestimonials = Array.isArray(allTestimonials) ? allTestimonials : [];

        setProducts(allProducts.slice(0, 6));
        setBestsellers(allProducts.slice(0, 3));
        setTestimonials(allTestimonials);

      } catch (error) {
        console.error("Error loading data:", error);
        
        // Ultimate fallback to imported data
        const allProducts = Array.isArray(productsData.products) ? productsData.products : [];
        const allTestimonials = Array.isArray(testimonialsData.testimonials) ? testimonialsData.testimonials : [];
        
        setProducts(allProducts.slice(0, 6));
        setBestsellers(allProducts.slice(0, 3));
        setTestimonials(allTestimonials);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${heroImages[currentImageIndex].src}')`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Traditional Superfoods
              <br />
              <span className="text-green-400">For Modern Life</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl mb-8 leading-relaxed"
            >
              Our kitchen celebrates traditional wisdom from the heart of India. 
              Every product preserves ancient recipes while supporting rural artisans.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 border border-white/30"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Handpicked fox nuts with ancient processing methods
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Ancient grains roasted to perfection
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Every package tells a story of tradition
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {Array.isArray(products) && products.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium traditional superfoods
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              >
                View All Products
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover why thousands of customers choose these traditional superfoods for their daily nutrition.
              </p>
            </div>

            <div className="overflow-hidden">
              <div ref={scrollRef} className="flex gap-6 pb-6 overflow-x-auto">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id || index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Testimonials */}
      {Array.isArray(videoTestimonials) && videoTestimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Customer Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch real customers share their experiences with our products
              </p>
            </div>

            <div className="overflow-hidden">
              <div ref={videoScrollRef} className="flex gap-6 pb-6 overflow-x-auto">
                {videoTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-64 cursor-pointer"
                    onClick={() => setActiveVideo(testimonial)}
                  >
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 bg-gray-200">
                        <img
                          src={testimonial.thumbnail}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{testimonial.location}</p>
                        <p className="text-xs text-gray-500">{testimonial.duration}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  poster={activeVideo.thumbnail}
                >
                  <source src={activeVideo.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeVideo.name}</h3>
                  <p className="text-gray-600 mb-3">{activeVideo.location}</p>
                  <p className="text-gray-800 italic">"{activeVideo.fullQuote}"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Healthy Journey Today
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to traditional superfoods
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold transition-colors duration-300 shadow-lg"
          >
            Shop All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
