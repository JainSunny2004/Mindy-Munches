/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import CartDropdown from "./CartDropdown";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileCartDropdown, setShowMobileCartDropdown] = useState(false);
  const mobileCartRef = useRef(null);

  const cartCount = getItemCount();

  // Check if current user is admin
  const isUserAdmin = isAuthenticated && user?.role === "admin";

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const toggleMobileCartDropdown = () => {
    setShowMobileCartDropdown(!showMobileCartDropdown);
  };

  // Always go Home, then scroll to #our-story
  const handleGoToOurStory = (e) => {
    e.preventDefault();
    // Navigate to home first
    navigate("/", { replace: false });
    // After the route mounts, smoothly scroll to the target
    setTimeout(() => {
      const el = document.getElementById("our-story");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback to hash if element not yet available
        window.location.hash = "#our-story";
      }
    }, 50);
  };

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileCartRef.current &&
        !mobileCartRef.current.contains(event.target)
      ) {
        setShowMobileCartDropdown(false);
      }
    };

    if (showMobileCartDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMobileCartDropdown]);

  return (
    <motion.nav
      className="bg-white shadow-sm sticky top-0 z-50 "
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="ml-3 w-13 h-13 rounded-lg flex items-center justify-center">
              <img src="/Mindy Munchs_Logo-01.png" />
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 ${
                isActive("/") && location.pathname === "/"
                  ? "text-primary-500"
                  : "text-neutral-700"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 ${
                isActive("/products") ? "text-primary-500" : "text-neutral-700"
              }`}
            >
              Products
            </Link>

            {/* Our Story Link -> always go Home, then scroll to #our-story */}
            <button
              onClick={handleGoToOurStory}
              className="text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 text-neutral-700"
              type="button"
            >
              Our Story
            </button>

            {/* Admin Link - Only show if user is authenticated AND admin */}
            <AnimatePresence>
              {isUserAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/admin"
                    className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 flex items-center gap-2 ${
                      isActive("/admin")
                        ? "text-primary-500"
                        : "text-neutral-700"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Admin</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">
                      👑
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button - Moved left of Login */}
            <div
              className="relative"
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
            >
              {isAuthenticated ? (
                <Link
                  to="/cart"
                  className={`relative text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 flex items-center gap-1 ${
                    isActive("/cart") ? "text-primary-500" : "text-neutral-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-10 0V9a2 2 0 012-2h4a2 2 0 012 2v4.1"
                    />
                  </svg>
                  <span className="hidden lg:inline">Cart</span>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    navigate("/auth", {
                      state: {
                        from: "/cart",
                        message: "Please login to view your cart",
                      },
                    })
                  }
                  className="relative text-neutral-700 hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  <span className="text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 text-neutral-700">
                    Cart
                  </span>
                </button>
              )}

              {isAuthenticated && (
                <CartDropdown
                  isOpen={showCartDropdown}
                  onClose={() => setShowCartDropdown(false)}
                />
              )}
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600 hidden lg:inline">
                    Hello, {user?.name}
                  </span>
                  {isUserAdmin && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-base md:text-[17px] font-semibold text-neutral-700 hover:text-primary-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Section */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <div className="relative" ref={mobileCartRef}>
              {isAuthenticated ? (
                <button
                  onClick={toggleMobileCartDropdown}
                  className="relative text-neutral-600 hover:text-primary-500 transition-colors p-1"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-10 0V9a2 2 0 012-2h4a2 2 0 012 2v4.1"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate("/auth", {
                      state: {
                        from: "/cart",
                        message: "Please login to view your cart",
                      },
                    })
                  }
                  className="relative text-neutral-600 hover:text-primary-500 transition-colors p-1"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-10 0V9a2 2 0 012-2h4a2 2 0 012 2v4.1"
                    />
                  </svg>
                </button>
              )}

              {/* Mobile Cart Dropdown */}
              {isAuthenticated && (
                <CartDropdown
                  isOpen={showMobileCartDropdown}
                  onClose={() => setShowMobileCartDropdown(false)}
                  isMobile={true}
                />
              )}
            </div>

            {/* Mobile Auth + Our Story quick link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isUserAdmin && (
                  <Link
                    to="/admin"
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium hover:bg-primary-200 transition-colors flex items-center gap-1"
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
