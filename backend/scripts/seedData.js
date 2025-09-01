const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindy-munchs');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin Demo',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create demo user
    const userExists = await User.findOne({ email: 'user@demo.com' });
    if (!userExists) {
      const user = new User({
        name: 'User Demo',
        email: 'user@demo.com',
        password: 'demo123',
        role: 'user'
      });
      await user.save();
      console.log('✅ Demo user created');
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log('✅ Products already exist, skipping seed');
      return;
    }

    const sampleProducts = [
      {
        name: 'Organic Quinoa',
        description: 'Premium quality organic quinoa, rich in protein and essential amino acids. Perfect for healthy meals and salads.',
        shortDescription: 'Premium organic quinoa rich in protein',
        price: 299,
        originalPrice: 349,
        category: 'superfoods',
        subcategory: 'grains',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
            alt: 'Organic Quinoa',
            isPrimary: true
          }
        ],
        stock: 50,
        sku: 'QUN001',
        weight: { value: 500, unit: 'g' },
        nutritionalInfo: {
          calories: 368,
          protein: 14.1,
          carbs: 64.2,
          fat: 6.1,
          fiber: 7.0
        },
        tags: ['organic', 'protein-rich', 'gluten-free'],
        isActive: true,
        isFeatured: true,
        isOrganic: true,
        ratings: { average: 4.5, count: 23 }
      },
      {
        name: 'Himalayan Pink Salt',
        description: 'Pure Himalayan pink salt, naturally mined and unprocessed. Rich in minerals and perfect for cooking.',
        shortDescription: 'Pure unprocessed Himalayan pink salt',
        price: 149,
        originalPrice: 199,
        category: 'spices',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500',
            alt: 'Himalayan Pink Salt',
            isPrimary: true
          }
        ],
        stock: 100,
        sku: 'HPS001',
        weight: { value: 1, unit: 'kg' },
        tags: ['natural', 'mineral-rich', 'pure'],
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.7, count: 45 }
      },
      {
        name: 'Cold Pressed Coconut Oil',
        description: 'Virgin coconut oil extracted through cold pressing method. Retains all natural nutrients and flavor.',
        shortDescription: 'Virgin cold pressed coconut oil',
        price: 399,
        originalPrice: 449,
        category: 'oils',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
            alt: 'Coconut Oil',
            isPrimary: true
          }
        ],
        stock: 30,
        sku: 'CCO001',
        weight: { value: 500, unit: 'ml' },
        tags: ['virgin', 'cold-pressed', 'natural'],
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.6, count: 67 }
      },
      {
        name: 'Organic Chia Seeds',
        description: 'Nutrient-dense organic chia seeds packed with omega-3 fatty acids, fiber, and protein.',
        shortDescription: 'Omega-3 rich organic chia seeds',
        price: 249,
        category: 'superfoods',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=500',
            alt: 'Chia Seeds',
            isPrimary: true
          }
        ],
        stock: 75,
        sku: 'CHS001',
        weight: { value: 250, unit: 'g' },
        nutritionalInfo: {
          calories: 486,
          protein: 16.5,
          carbs: 42.1,
          fat: 30.7,
          fiber: 34.4
        },
        tags: ['organic', 'omega-3', 'superfood'],
        isActive: true,
        isOrganic: true,
        ratings: { average: 4.4, count: 34 }
      },
      {
        name: 'Turmeric Powder',
        description: 'Pure turmeric powder with high curcumin content. Known for its anti-inflammatory properties.',
        shortDescription: 'Pure turmeric powder with curcumin',
        price: 89,
        category: 'spices',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500',
            alt: 'Turmeric Powder',
            isPrimary: true
          }
        ],
        stock: 120,
        sku: 'TUR001',
        weight: { value: 100, unit: 'g' },
        tags: ['anti-inflammatory', 'curcumin', 'ayurvedic'],
        isActive: true,
        ratings: { average: 4.8, count: 89 }
      },
      {
        name: 'Mixed Nuts Trail Mix',
        description: 'Healthy mix of almonds, walnuts, cashews, and dried fruits. Perfect for snacking.',
        shortDescription: 'Healthy mixed nuts and dried fruits',
        price: 199,
        category: 'snacks',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500',
            alt: 'Trail Mix',
            isPrimary: true
          }
        ],
        stock: 60,
        sku: 'TMX001',
        weight: { value: 200, unit: 'g' },
        tags: ['healthy-snack', 'protein', 'energy'],
        isActive: true,
        ratings: { average: 4.3, count: 56 }
      },
      {
        name: 'Green Tea',
        description: 'Premium green tea leaves rich in antioxidants. Refreshing and healthy beverage option.',
        shortDescription: 'Antioxidant-rich premium green tea',
        price: 179,
        category: 'beverages',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
            alt: 'Green Tea',
            isPrimary: true
          }
        ],
        stock: 80,
        sku: 'GRT001',
        weight: { value: 100, unit: 'g' },
        tags: ['antioxidant', 'healthy', 'refreshing'],
        isActive: true,
        ratings: { average: 4.5, count: 78 }
      },
      {
        name: 'Organic Brown Rice',
        description: 'Whole grain organic brown rice, rich in fiber and nutrients. A healthy alternative to white rice.',
        shortDescription: 'Fiber-rich organic brown rice',
        price: 159,
        category: 'grains',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
            alt: 'Brown Rice',
            isPrimary: true
          }
        ],
        stock: 90,
        sku: 'BRR001',
        weight: { value: 1, unit: 'kg' },
        tags: ['organic', 'whole-grain', 'fiber-rich'],
        isActive: true,
        isOrganic: true,
        ratings: { average: 4.2, count: 42 }
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products created');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedProducts();
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, seedUsers, seedProducts };