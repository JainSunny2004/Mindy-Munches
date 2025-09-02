import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'superfoods',
    stock: '',
    sku: '',
    images: [{ url: '', alt: '', isPrimary: true }],
    isFeatured: false,
  })

  // Get auth token helper
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  // Check if user is admin
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'admin'
  }

  useEffect(() => {
    // Check admin access on mount
    if (!isAdmin()) {
      alert('Admin access required')
      return
    }
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL
      const token = getAuthToken()
      const response = await fetch(`${apiUrl}/products`, {
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.data?.products || data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString('en-IN')}`
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getAuthToken()
    if (!token) {
      alert('Please login as admin to manage products')
      return
    }
    const apiUrl = import.meta.env.VITE_API_URL
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category: formData.category.toLowerCase(),
    }
    try {
      let response
      if (editingProduct) {
        // Update existing product
        response = await fetch(`${apiUrl}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        })
      } else {
        // Add new product
        response = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        })
      }
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${editingProduct ? 'update' : 'add'} product`)
      }
      const result = await response.json()
      const savedProduct = result.data?.product || result.product

      setProducts((prev) =>
        editingProduct ? prev.map((p) => (p._id === savedProduct._id ? savedProduct : p)) : [...prev, savedProduct]
      )
      resetForm()
      alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`)
    } catch (error) {
      console.error('Error:', error)
      alert(error.message || 'Error saving product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || 'superfoods',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      images: product.images || [{ url: '', alt: '', isPrimary: true }],
      isFeatured: product.isFeatured || false,
    })
    setShowAddModal(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const token = getAuthToken()
    if (!token) {
      alert('Please login as admin')
      return
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete product')
      }
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert(error.message || 'Error deleting product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'superfoods',
      stock: '',
      sku: '',
      images: [{ url: '', alt: '', isPrimary: true }],
      isFeatured: false,
    })
    setEditingProduct(null)
    setShowAddModal(false)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAdmin()) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Admin privileges required</h1>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        className="mb-4 p-2 border rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">SKU</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={product.images[0]?.url || '/placeholder.png'}
                    alt={product.images[0]?.alt || product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder.png'
                    }}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.sku}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPrice(product.price)}</td>
                <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal can be implemented here if needed */}
    </div>
  )
}

export default ProductManagement
