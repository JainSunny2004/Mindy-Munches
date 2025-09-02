import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Import admin sub-components
import AdminOverview from '../components/admin/AdminOverview';
import ProductManagement from '../components/admin/ProductManagement'; // Confirm this path
import StockManagement from '../components/admin/StockManagement';
import OrderManagement from '../components/admin/OrderManagement';
import Analytics from '../components/admin/Analytics';
import AdminManagement from '../components/admin/AdminManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.split('/admin/')[1] || 'overview';
    setActiveTab(path);
  }, [location]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/overview' },
    { id: 'products', label: 'Products', icon: '📦', path: '/admin/products' },
    { id: 'stock', label: 'Stock', icon: '📋', path: '/admin/stock' },
    { id: 'orders', label: 'Orders', icon: '🛒', path: '/admin/orders' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { id: 'admins', label: 'Admins', icon: '👥', path: '/admin/admins' },
  ];

  // Sidebar and layout omitted for brevity

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      {/* Sidebar code rendering menuItems */}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        {/* Header components */}

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto focus:outline-none">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="admins" element={<AdminManagement />} />
            {/* Add more nested admin routes here */}
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
