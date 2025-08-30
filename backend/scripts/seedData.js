const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('../models/Product');
const User = require('../models/User');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: "Organic Honey",
    description: "Pure, raw organic honey sourced from local beekeepers. Rich in antioxidants and natural enzymes.",
    price: 450,
    originalPrice: 500,
    category: "Food & Beverages",
    stock: 25,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    features: ["100% Pure", "Raw & Unprocessed", "Rich in Antioxidants", "Local Sourced"]
  },
  {
    name: "Handmade Soap Bar",
    description: "Natural handmade soap with essential oils. Gentle on skin and environmentally friendly.",
    price: 120,
    originalPrice: 150,
    category: "Personal Care",
    stock: 50,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
    features: ["Natural Ingredients", "Essential Oils", "Cruelty Free", "Biodegradable"]
  },
  {
    name: "Organic Green Tea",
    description: "Premium organic green tea leaves with delicate flavor and health benefits.",
    price: 350,
    category: "Food & Beverages",
    stock: 30,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    features: ["Organic Certified", "Antioxidant Rich", "Premium Quality", "Sustainable Farming"]
  },
  {
    name: "Bamboo Toothbrush",
    description: "Eco-friendly bamboo toothbrush with soft bristles. Biodegradable and sustainable.",
    price: 80,
    originalPrice: 100,
    category: "Personal Care",
    stock: 100,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    features: ["Bamboo Handle", "Soft Bristles", "Biodegradable", "Plastic Free"]
  },
  {
    name: "Herbal Face Mask",
    description: "Natural clay face mask with herbs for deep cleansing and rejuvenation.",
    price: 280,
    category: "Personal Care",
    stock: 20,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
    features: ["Natural Clay", "Herbal Extracts", "Deep Cleansing", "All Skin Types"]
  },
  {
    name: "Organic Coconut Oil",
    description: "Cold-pressed virgin coconut oil for cooking and skincare. Multi-purpose natural oil.",
    price: 320,
    originalPrice: 380,
    category: "Food & Beverages",
    stock: 40,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    features: ["Cold Pressed", "Virgin Quality", "Multi Purpose", "Organic Certified"]
  }
];

const seedData = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Existing data cleared');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ecostore.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    console.log('Data seeding completed successfully!');
    console.log('\nAdmin Login:');
    console.log('Email: admin@ecostore.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
