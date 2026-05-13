const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

router.get('/run', async (req, res) => {
  try {
    // Secret key check
    const secret = req.query.secret;
    if (secret !== 'fitzone_seed_2025') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Create admin
    const admin = await User.create({
      name: 'FitZone Admin',
      email: 'admin@fitzone.com',
      password: 'Admin1234',
      role: 'admin'
    });

    // Create customer
    await User.create({
      name: 'Test Customer',
      email: 'customer@fitzone.com',
      password: 'customer123',
      role: 'user'
    });

    // Create products
    await Product.insertMany([
      {
        name: 'PowerFlex Adjustable Dumbbell Set',
        brand: 'PowerFlex',
        category: 'Dumbbells',
        description: 'Professional adjustable dumbbell set.',
        price: 18500,
        discountPrice: 15999,
        weight: { value: 50, unit: 'kg' },
        material: 'Rubber-coated Cast Iron',
        stock: 45,
        isFeatured: true,
        isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600', alt: 'Dumbbell' }]
      },
      {
        name: 'IronKing Olympic Barbell 20kg',
        brand: 'IronKing',
        category: 'Barbells',
        description: 'Olympic standard 20kg barbell.',
        price: 12000,
        weight: { value: 20, unit: 'kg' },
        material: 'Chrome Steel',
        stock: 30,
        isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', alt: 'Barbell' }]
      },
      {
        name: 'CardioMax Pro Treadmill',
        brand: 'CardioMax',
        category: 'Cardio',
        description: 'Commercial-grade treadmill.',
        price: 95000,
        discountPrice: 85000,
        weight: { value: 120, unit: 'kg' },
        material: 'Steel Frame',
        stock: 15,
        isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', alt: 'Treadmill' }]
      },
      {
        name: 'FlexBand Resistance Band Set',
        brand: 'FlexBand',
        category: 'Accessories',
        description: 'Set of 5 premium latex resistance bands.',
        price: 1800,
        discountPrice: 1299,
        weight: { value: 0.5, unit: 'kg' },
        material: 'Natural Latex',
        stock: 120,
        isFeatured: true,
        isTrending: true,
        images: [{ url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600', alt: 'Bands' }]
      },
      {
        name: 'ProBench Adjustable Weight Bench',
        brand: 'ProBench',
        category: 'Benches',
        description: 'Heavy-duty adjustable weight bench.',
        price: 22000,
        discountPrice: 18500,
        weight: { value: 35, unit: 'kg' },
        material: 'Steel & PU Leather',
        stock: 25,
        images: [{ url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600', alt: 'Bench' }]
      },
      {
        name: 'SquatKing Power Rack',
        brand: 'SquatKing',
        category: 'Racks',
        description: 'Heavy-duty power rack.',
        price: 65000,
        discountPrice: 55000,
        weight: { value: 150, unit: 'kg' },
        material: 'Heavy Gauge Steel',
        stock: 12,
        isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=600', alt: 'Rack' }]
      },
      {
        name: 'Home Gym Starter Bundle',
        brand: 'PowerFlex',
        category: 'Bundles',
        description: 'Complete home gym starter pack.',
        price: 35000,
        discountPrice: 26999,
        weight: { value: 55, unit: 'kg' },
        material: 'Mixed',
        stock: 20,
        isFeatured: true,
        isBundle: true,
        images: [{ url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600', alt: 'Bundle' }]
      },
      {
        name: 'AirBike Pro Commercial Fan Bike',
        brand: 'CardioMax',
        category: 'Cardio',
        description: 'Commercial-grade air bike.',
        price: 42000,
        discountPrice: 36000,
        weight: { value: 55, unit: 'kg' },
        material: 'Steel Frame',
        stock: 18,
        isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600', alt: 'Air Bike' }]
      }
    ]);

    res.json({
      success: true,
      message: '✅ Database seeded successfully!',
      credentials: {
        admin: 'admin@fitzone.com / Admin1234',
        customer: 'customer@fitzone.com / customer123'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;