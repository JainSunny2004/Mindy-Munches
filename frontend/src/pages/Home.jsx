import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useVideoTestimonials } from "../components/VideoTestimonials";
import Loader from "../components/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for previous
  const [isTransitioning, setIsTransitioning] = useState(false);

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
  ];

  // Auto-rotate images every 5 seconds with direction tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Auto-rotation always goes forward
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Enhanced navigation functions with direction tracking and transition protection
  const goToPrevious = () => {
    if (isTransitioning) return; // Prevent rapid clicks
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentImageIndex(
      currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 800); // Match animation duration
  };

  const goToNext = () => {

    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setCurrentImageIndex(
      currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 800);

  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        let productsResponse, testimonialsResponse;
        
        try {
          // First, try to fetch from API
          if (import.meta.env.VITE_API_URL) {
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
            throw new Error("API not available");
          }
        } catch (apiError) {
          console.warn("API failed, falling back to local data:", apiError.message);
          
          // Fallback to local JSON files in public folder
          try {
            const [localProductsResponse, localTestimonialsResponse] = await Promise.all([
              fetch("/data/products.json"),
              fetch("/data/testimonials.json"),
            ]);

            if (localProductsResponse.ok && localTestimonialsResponse.ok) {
              productsResponse = localProductsResponse;
              testimonialsResponse = localTestimonialsResponse;
            } else {
              throw new Error("Local data files not found");
            }
          } catch (localError) {
            console.warn("Local data failed, using hardcoded fallback:", localError.message);
            
            // Final fallback to hardcoded data
            const fallbackProducts = [
              {
                id: 1,
                name: "Premium Makhana",
                description: "Handpicked fox nuts roasted with traditional methods",
                price: 299,
                category: "superfoods",
                images: [{ url: "/Sweet-makhana.png", alt: "Premium Makhana" }],
                isFeatured: true
              }
            ];
            
            const fallbackTestimonials = [
              {
                id: 1,
                name: "Priya Sharma",
                message: "Amazing products! Highly recommended.",
                rating: 5,
                location: "Mumbai, India"
              }
            ];
            
            setProducts(fallbackProducts.slice(0, 6));
            setBestsellers(fallbackProducts.slice(0, 3));
            setTestimonials(fallbackTestimonials);
            return;
          }
        }

        // Parse the successful response
        const productsData = await productsResponse.json();
        const testimonialsData = await testimonialsResponse.json();

        // Handle different response formats
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
        
        // Ultimate fallback to hardcoded data
        const fallbackProducts = [
          {
            id: 1,
            name: "Premium Makhana",
            description: "Handpicked fox nuts roasted with traditional methods",
            price: 299,
            category: "superfoods",
            images: [{ url: "/Sweet-makhana.png", alt: "Premium Makhana" }],
            isFeatured: true
          }
        ];
        
        const fallbackTestimonials = [
          {
            id: 1,
            name: "Priya Sharma",
            message: "Amazing products! Highly recommended.",
            rating: 5,
            location: "Mumbai, India"
          }
        ];
        
        setProducts(fallbackProducts.slice(0, 6));
        setBestsellers(fallbackProducts.slice(0, 3));
        setTestimonials(fallbackTestimonials);
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

    <div className="min-h-screen overflow-x-hidden max-w-full">
      {/* HERO BANNER SECTION - Absolutely no cropping with smooth circular animations */}
      <section
        className="relative w-screen overflow-hidden"
        style={{
          height: "auto",
          minHeight: "400px",
          width: "100vw",
        }}
      >
        {/* Background Images - Aspect ratio preserved with smooth directional transitions */}
        <div
          className="w-screen relative overflow-hidden"
          style={{
            aspectRatio: "16/9", // Force 1920x1080 aspect ratio
            width: "100%",
            maxWidth: "100vw",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              className="w-full h-full"
              style={{
                objectFit: "contain", // This prevents ALL cropping
                objectPosition: "center",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                backgroundColor: "#f8f9fa", // Optional background color for letterboxing
              }}
              initial={{
                opacity: 0,
                scale: 1.08,
                x: direction > 0 ? 300 : direction < 0 ? -300 : 100, // Directional entry
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                x: direction > 0 ? -300 : direction < 0 ? 300 : -100, // Directional exit
                filter: "blur(4px)",
              }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smooth easing
                opacity: { duration: 0.6 },
                scale: { duration: 1.2, ease: "easeInOut" },
                x: { duration: 0.8, ease: "easeOut" },
                filter: { duration: 0.4 },
              }}
              // Add image preloading for smoother transitions
              loading="eager"
              onLoad={() => {
                // Optional: Add any loading completion logic here
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

        {/* Navigation Arrows - Enhanced with smooth hover animations */}
        <button
          onClick={goToPrevious}

          disabled={isTransitioning}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous image"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-125 group-hover:-translate-x-0.5 transition-all duration-300 ease-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />

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

          disabled={isTransitioning}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next image"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-125 group-hover:translate-x-0.5 transition-all duration-300 ease-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Shop Now Button - Enhanced entrance animation */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 right-3 sm:right-6 md:right-8 lg:right-12 z-30">
          <motion.div
            initial={{ opacity: 0, x: 60, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { duration: 0.6, ease: "backOut" },
            }}
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center"
            >
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl transition-all duration-400 hover:scale-105 shadow-2xl hover:shadow-primary-500/25 border border-primary-400/20">
                <span className="relative z-10 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                  Shop Now
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-400 ease-out"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-400 scale-110"></div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Dots - Smoother interactions with active state animation */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">

          {heroImages.map((_, index) => (
            <motion.button
              key={index}

              onClick={() => {
                if (!isTransitioning) {
                  setDirection(index > currentImageIndex ? 1 : -1);
                  setCurrentImageIndex(index);
                }
              }}
              disabled={isTransitioning}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-400 ease-out disabled:cursor-not-allowed ${
                index === currentImageIndex
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              animate={{
                scale: index === currentImageIndex ? 1.25 : 1,
                opacity: index === currentImageIndex ? 1 : 0.7,
              }}
              whileHover={{ scale: isTransitioning ? 1 : 1.1, opacity: 1 }}
              whileTap={{ scale: isTransitioning ? 1 : 0.9 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            />
          ))}
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


              {/* Certifications: single line, no wrap, no x-scroll */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-3 mb-8 px-2 sm:px-0 overflow-x-visible sm:overflow-x-clip">
                {["100% Natural", "Traditional Methods", "Artisan Made"].map(
                  (cert, index) => (
                    <motion.div
                      key={cert}
                      className="bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg shadow-sm flex items-center gap-1 sm:gap-2 flex-none whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-green-500 text-base sm:text-lg leading-none">
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-neutral-700 leading-none">
                        {cert}
                      </span>
                    </motion.div>
                  )
                )}
              </div>

              {/* Feature cards */}
              <motion.div
                className="relative w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                    <div className="text-center md:text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                        <span className="text-2xl md:text-3xl">🌾</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Traditional Makhana
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Handpicked fox nuts with ancient processing methods
                      </p>
                    </div>

                    <div className="text-center md:text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                        <span className="text-2xl md:text-3xl">💪</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Heritage Sattu
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Ancient grains roasted to perfection
                      </p>
                    </div>

                    <div className="text-center md:text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                        <span className="text-2xl md:text-3xl">❤️</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Made with Love
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Every package tells a story of tradition
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT column */}
            <div className="relative h-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <img
                  src="/Assest19.png"
                  alt="Creative brand mock"
                  className="w-full h-full object-cover md:object-contain rounded-2xl md:rounded-3xl"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section with Horizontal Scroll */}
      <section className="py-16 md:py-20 bg-neutral-50 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-500 mb-4">
              Our Bestsellers
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover why thousands of customers choose these traditional
              superfoods for their daily nutrition.
            </p>
          </motion.div>

          {loading ? (
            <Loader text="Loading bestsellers..." />
          ) : (
            <div className="relative">
              {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
              <div
                id="bestseller-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollPaddingLeft: "1.5rem",
                  scrollPaddingRight: "1.5rem",
                }}
              >
                {bestsellers.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 snap-start"
                    style={{
                      width: "calc(25% - 18px)", // 25% width minus gap (24px total gap / 4 * 3)
                      minWidth: "280px", // Minimum width for mobile
                    }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      showBestsellerBadge={true}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
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

{/* All Products Section */}
<section className="py-16 px-2 md:py-20 bg-neutral-50 overflow-hidden">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-500 mb-4">
        Traditional Superfoods
      </h2>
    </motion.div>

    {loading ? (
      <Loader text="Loading products..." />
    ) : (
      <div className="relative">
        {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
        <div
          id="product-scroll"
          className="flex gap-6 pc-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollPaddingLeft: "1.5rem",
            scrollPaddingRight: "1.5rem",
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 snap-start"
              style={{
                width: "calc(25% - 18px)",
                minWidth: "280px",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>

{/* Customer Reviews Section */}
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
              {/* Render testimonial card here */}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}

                  >
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container = document.getElementById("product-scroll");
                  const cardWidth = container.scrollWidth / products.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container = document.getElementById("product-scroll");
                  const cardWidth = container.scrollWidth / products.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
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
          )}

          {/* Text Reviews Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <span className="text-2xl mr-3">📝</span>
              <span className="text-lg font-semibold text-neutral-700">
                Customer Reviews
              </span>
            </div>
          </div>
          {/* Text Testimonials - Responsive with Hidden Mobile Arrows */}
          <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] mb-5">
            {/* Left Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials left"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Text Testimonials Container - Optimized for Touch Scrolling */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 py-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch", // Enhanced touch scrolling for mobile
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[85vw] h-auto min-h-[280px] sm:w-[70vw] sm:min-h-[320px] md:w-80 md:h-96 lg:w-96 lg:h-96 max-w-sm"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="w-full h-full bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-transform duration-300 hover:scale-105">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials right"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Mobile Touch Indicator - Optional visual cue for swipe */}
            <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-gray-500 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l4-4-4-4m6 8l4-4-4-4"
                />
              </svg>
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
