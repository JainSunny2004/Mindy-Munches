import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Component } from 'react';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";

import AdminDashboard from "./pages/AdminDashboard";
import AdminInvite from "./pages/AdminInvite";
import ProductManagement from "./components/admin/ProductManagement"; // Import your product management page

import ProtectedRoute from "./components/ProtectedRoute";
import BottomBar from "./components/BottomBar";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Page animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />

        <main className="flex-grow">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<Auth />} />

                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  {/* Nested admin routes */}
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  {/* Add other admin routes like stock, orders, etc. */}
                </Route>

                <Route path="/admin/invite" element={<AdminInvite />} />
                {/* Add any other routes or fallback routes */}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <BottomBar />
      </div>
    </ErrorBoundary>
  );
}

export default App;
