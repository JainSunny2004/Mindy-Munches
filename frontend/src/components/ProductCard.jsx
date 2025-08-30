import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const ProductCard = ({
  product,
  index = 0,
  viewMode = "grid",
  showBestsellerBadge = false,
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // State for size selection
  const [selectedSize, setSelectedSize] = useState("500gm");

  // Map prices for sizes - assuming product.price is base price for 500gm
  const priceMap = {
    "500gm": product.price,
    "1kg": product.price * 2,
  };

  const formatPrice = (price) => {
    return `$${(price / 100).toLocaleString("en-US")}`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: `/products/${product.id}`,
          message: "Please login to add products to your cart",
        },
      });
      return;
    }

    // Add product with selected size info
    addItem({ ...product, size: selectedSize, price: priceMap[selectedSize] });

    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
    notification.textContent = `${product.name} (${selectedSize}) added to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const bestsellerRanks = {
    1: { rank: 1, badge: "Best Seller", sales: "2k+ Reviews" },
    2: { rank: 2, badge: "Top Choice", sales: "1.5k+ Reviews" },
    3: { rank: 3, badge: "Trending", sales: "1k+ Reviews" },
  };

  const bestseller = bestsellerRanks[product.id];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Best Seller Badge */}
        {bestseller && showBestsellerBadge && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <span>Best Seller</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
          <svg
            className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name and Price on Same Line */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800 text-base leading-tight group-hover:text-primary-600 transition-colors truncate flex-1 mr-2">
            {product.name}
          </h3>
          <span className="font-semibold text-gray-800 text-base leading-tight whitespace-nowrap">
            {formatPrice(priceMap[selectedSize])}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-sm">
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">4.91</span>
         
        </div>

        {/* Size Selector */}
        <div className="mb-4">
          <select
            value={selectedSize}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedSize(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="500gm">500gm</option>
            <option value="1kg">1000gm</option>
          </select>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(e);
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
