/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useVideoTestimonials } from "../components/VideoTestimonials"; // Import the hook
import Loader from "../components/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  // Use the custom hook to get video testimonials
  const { testimonials: videoTestimonials, loading: videoLoading } =
    useVideoTestimonials();

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
    setCurrentImageIndex(currentImageIndex === 1 ? 0 : currentImageIndex + 1);
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
            const [apiProductsResponse, apiTestimonialsResponse] =
              await Promise.all([
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
            throw new Error(
              "API not available or Netlify environment detected"
            );
          }
        } catch (apiError) {
          console.warn(
            "API failed, falling back to public data:",
            apiError.message
          );

          // Fallback to public data files
          try {
            const [publicProductsResponse, publicTestimonialsResponse] =
              await Promise.all([
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
            console.warn(
              "Public data failed, using imported data:",
              publicError.message
            );

            // Final fallback to imported JSON data
            const allProducts = productsData.products;
            setProducts(allProducts.slice(0, 6));
            setBestsellers(allProducts.slice(0, 3));
            setTestimonials(testimonialsData.testimonials);
            return;
          }
        }

        // Parse the successful response
        const productsData = await productsResponse.json();
        const testimonialsData = await testimonialsResponse.json();

        const allProducts = productsData.products;
        setProducts(allProducts.slice(0, 6));
        setBestsellers(allProducts.slice(0, 3));
        setTestimonials(testimonialsData.testimonials);
      } catch (error) {
        console.error("Error loading data:", error);

        // Ultimate fallback to imported data
        const allProducts = productsData.products;
        setProducts(allProducts.slice(0, 6));
        setBestsellers(allProducts.slice(0, 3));
        setTestimonials(testimonialsData.testimonials);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      {/* HERO BANNER SECTION - Full width coverage with content preservation */}
      <section
        className="relative w-screen  overflow-hidden"
        style={{ height: "110vh" }}
      >
        {/* Background Images - Full width with smart object positioning */}
        <div className="w-screen h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
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
          className="absolute right-2 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
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

        {/* Shop Now Button - Bottom Right Position */}
        <div className="absolute bottom-16 md:bottom-20 right-4 md:right-8 lg:right-12 z-30">
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center"
            >
              {/* Main Button */}
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-primary-500/25 border border-primary-400/20">
                <span className="relative z-10 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                  Shop Now
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
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

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CREATIVE BRAND SECTION - Separate Section with Content */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden overflow-y-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-neutral-800 mb-6 leading-tight break-words">
                We Are{" "}
                <span className="text-primary-500">Traditional Food</span>{" "}
                Artisans
              </h1>
            </motion.div>
          </div>

          {/* Equal columns below header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-stretch content-stretch">
            {/* LEFT column */}
            <div className="h-full">
              <p className="text-base md:text-lg lg:text-xl text-neutral-600 mb-6 leading-relaxed max-w-3xl">
                Our kitchen celebrates traditional wisdom from the heart of
                India. Every product preserves ancient recipes while supporting
                rural artisans.
              </p>

              {/* Certifications: single line, no wrap, no x-scroll */}
              <div className="flex flex-nowrap items-center gap-2 md:gap-3 mb-8 px-0 overflow-x-clip">
                {["100% Natural", "Traditional Methods", "Artisan Made"].map(
                  (cert, index) => (
                    <motion.div
                      key={cert}
                      className="bg-white/80 backdrop-blur-sm px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-sm flex items-center gap-2 flex-none whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-green-500 text-lg leading-none">
                        ✓
                      </span>
                      <span className="text-sm md:text-base font-medium text-neutral-700 leading-none">
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
                    <div className="text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl md:text-3xl">🌾</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Traditional Makhana
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Handpicked fox nuts with ancient processing methods
                      </p>
                    </div>

                    <div className="text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl md:text-3xl">💪</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Heritage Sattu
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Ancient grains roasted to perfection
                      </p>
                    </div>

                    <div className="text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
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
      <section className="py-16 md:py-20 bg-neutral-50 overflow-x-hidden">
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
              {/* Horizontal Scrollable Container */}
              <div
                id="bestseller-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {bestsellers.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-80"
                    style={{ scrollSnapAlign: "start" }}
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
                  container.scrollBy({ left: -320, behavior: "smooth" });
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
                  container.scrollBy({ left: 320, behavior: "smooth" });
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
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn-primary">
              View All Bestsellers
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="our-story"
        className="py-8 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-800 mb-6 leading-tight whitespace-nowrap">
                We Are Preserving a Heritage of{" "}
                <span className="text-primary-500">
                  Traditional Indian SuperFoods
                </span>
              </h1>
            </motion.div>

            <div className="flex justify-center items-center max-h-screen px-4">
              <motion.div
                className="w-full max-w-[70vw] md:max-w-[75vw] lg:max-w-[80vw]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Video Iframe */}
                <div className="relative w-full h-[78vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/tIxV269IutY"
                    title="From The Soil Of India"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 md:py-20 bg-neutral-50 overflow-x-hidden">
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
              {/* Horizontal Scrollable Container */}
              <div
                id="product-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-80"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container = document.getElementById("product-scroll");
                  container.scrollBy({ left: -320, behavior: "smooth" });
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
                  container.scrollBy({ left: 320, behavior: "smooth" });
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
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn-primary">
              Shop All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Combined Testimonials Section - Video (9:16) and Text - INCREASED HEIGHT */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-neutral-800 mb-6 leading-tight break-words">
              Our Customers <span className="text-primary-500">Experience</span>
            </h1>
          </motion.div>

          {/* Video Testimonials - Reel Style (9:16) with Horizontal Scroll */}
          {!videoLoading && videoTestimonials.length > 0 && (
            <div className="relative mb-15">
              {/* Left Arrow for Video Scroll */}
              <button
                onClick={() =>
                  videoScrollRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
                aria-label="Scroll video testimonials left"
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

              {/* Video Testimonials Container */}
              <div
                ref={videoScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-6"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth",
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {videoTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-48 md:w-56 lg:w-60 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
                    style={{ scrollSnapAlign: "start" }}
                    onClick={() => setActiveVideo(testimonial)}
                  >
                    <img
                      src={testimonial.thumbnail}
                      alt={`${testimonial.name} testimonial`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg
                          className="w-5 h-5 text-primary-600 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="text-sm font-semibold truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-white/80 truncate">
                        {testimonial.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">
                            ⭐
                          </span>
                        ))}
                        <span className="text-xs text-white/60 ml-2">
                          {testimonial.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow for Video Scroll */}
              <button
                onClick={() =>
                  videoScrollRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
                aria-label="Scroll video testimonials right"
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
            </div>
          )}

          {/* Text Reviews Badge */}

          {/* Text Testimonials - Square Cards with INCREASED HEIGHT */}
          <div className="relative min-h-[500px]">
            {/* Left Arrow for Text Testimonials */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
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

            {/* Text Testimonials Container - INCREASED PADDING AND HEIGHT */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-72 h-80 md:w-80 md:h-96 lg:w-96 lg:h-96"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between transition-transform duration-300 hover:scale-105">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow for Text Testimonials */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
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
          </div>

          {/* Video Modal */}
          {activeVideo && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {activeVideo.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {activeVideo.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {activeVideo.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={activeVideo.videoSrc}
                    title={`${activeVideo.name} testimonial`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(activeVideo.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-neutral-700 italic">
                    "{activeVideo.fullQuote}"
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Trust Indicators */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-neutral-600">
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">⭐</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    4.9/5
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Average Rating
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">📦</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    500+
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Happy Customers
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">✅</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    98%
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Would Recommend
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
