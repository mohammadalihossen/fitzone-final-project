require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

const products = [
  {
    name: 'PowerFlex Adjustable Dumbbell Set 5-50kg',
    brand: 'PowerFlex',
    category: 'Dumbbells',
    description: 'Professional adjustable dumbbell set with quick-change weight system. Perfect for home gyms and commercial use. Made with premium rubber-coated cast iron.',
    price: 18500,
    discountPrice: 15999,
    weight: { value: 50, unit: 'kg' },
    material: 'Rubber-coated Cast Iron',
    stock: 45,
    isFeatured: true,
    isTrending: true,
    tags: ['dumbbell', 'adjustable', 'home gym'],
    images: [
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600', alt: 'Adjustable Dumbbell Set' }
    ]
  },
  {
    name: 'IronKing Olympic Barbell 20kg',
    brand: 'IronKing',
    category: 'Barbells',
    description: 'Olympic standard 20kg barbell with aggressive knurling for superior grip. 28mm shaft diameter, dual-marked for powerlifting and Olympic lifting.',
    price: 12000,
    weight: { value: 20, unit: 'kg' },
    material: 'Chrome Steel',
    stock: 30,
    isFeatured: true,
    tags: ['barbell', 'olympic', 'powerlifting'],
    images: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', alt: 'Olympic Barbell' }
    ]
  },
  {
    name: 'TitanForce Smith Machine with Cable Crossover',
    brand: 'TitanForce',
    category: 'Machines',
    description: 'All-in-one Smith machine with integrated cable crossover system. 3D Smith machine with counter-balanced bar, dual weight stacks of 100kg each.',
    price: 185000,
    discountPrice: 165000,
    weight: { value: 300, unit: 'kg' },
    material: 'Heavy Gauge Steel',
    stock: 8,
    isFeatured: true,
    lowStockThreshold: 5,
    tags: ['smith machine', 'cable crossover', 'commercial'],
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'Smith Machine' }
    ]
  },
  {
    name: 'CardioMax Pro Treadmill 3.5HP',
    brand: 'CardioMax',
    category: 'Cardio',
    description: 'Commercial-grade treadmill with 3.5HP DC motor, 20km/h max speed, 15% incline. 10-inch touchscreen with built-in workout programs and heart rate monitoring.',
    price: 95000,
    discountPrice: 85000,
    weight: { value: 120, unit: 'kg' },
    material: 'Steel Frame',
    stock: 15,
    isTrending: true,
    tags: ['treadmill', 'cardio', 'commercial'],
    images: [
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', alt: 'Treadmill' }
    ]
  },
  {
    name: 'FlexBand Resistance Band Set (5-Pack)',
    brand: 'FlexBand',
    category: 'Accessories',
    description: 'Set of 5 premium latex resistance bands ranging from 5kg to 50kg resistance. Perfect for warm-ups, strength training, and rehabilitation.',
    price: 1800,
    discountPrice: 1299,
    weight: { value: 0.5, unit: 'kg' },
    material: 'Natural Latex',
    stock: 120,
    isFeatured: true,
    isTrending: true,
    tags: ['resistance band', 'accessories', 'workout'],
    images: [
      { url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600', alt: 'Resistance Bands' }
    ]
  },
  {
    name: 'ProBench Adjustable Weight Bench',
    brand: 'ProBench',
    category: 'Benches',
    description: 'Heavy-duty adjustable weight bench with 7 back pad positions and 3 seat positions. 350kg weight capacity, commercial-grade upholstery.',
    price: 22000,
    discountPrice: 18500,
    weight: { value: 35, unit: 'kg' },
    material: 'Steel & PU Leather',
    stock: 25,
    tags: ['bench', 'adjustable', 'weight bench'],
    images: [
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600', alt: 'Adjustable Bench' }
    ]
  },
  {
    name: 'SquatKing Power Rack with Pull-up Bar',
    brand: 'SquatKing',
    category: 'Racks',
    description: 'Heavy-duty power rack with adjustable safety bars, pull-up bar, dip handles, and band pegs. 500kg rated capacity. Easy bolt-together assembly.',
    price: 65000,
    discountPrice: 55000,
    weight: { value: 150, unit: 'kg' },
    material: 'Heavy Gauge Steel',
    stock: 12,
    isFeatured: true,
    tags: ['power rack', 'squat rack', 'pull-up'],
    images: [
      { url: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=600', alt: 'Power Rack' }
    ]
  },
  {
    name: 'GripMaster Gym Gloves (Pair)',
    brand: 'GripMaster',
    category: 'Accessories',
    description: 'Premium full-finger gym gloves with wrist support and silicone grip padding. Available in S/M/L/XL sizes.',
    price: 1200,
    discountPrice: 899,
    weight: { value: 0.2, unit: 'kg' },
    material: 'Synthetic Leather & Neoprene',
    stock: 200,
    isTrending: true,
    tags: ['gloves', 'accessories', 'grip'],
    images: [
      { url: 'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600', alt: 'Gym Gloves' }
    ]
  },
  {
    name: 'Home Gym Starter Bundle',
    brand: 'PowerFlex',
    category: 'Bundles',
    description: 'Complete home gym starter pack: Adjustable dumbbells (2x20kg) + Adjustable bench + Resistance band set + Gym gloves. Save 25% vs buying separately!',
    price: 35000,
    discountPrice: 26999,
    weight: { value: 55, unit: 'kg' },
    material: 'Mixed',
    stock: 20,
    isFeatured: true,
    isBundle: true,
    tags: ['bundle', 'home gym', 'starter'],
    images: [
      { url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600', alt: 'Home Gym Bundle' }
    ]
  },
  {
    name: 'CableMax Functional Trainer Dual Stack',
    brand: 'CableMax',
    category: 'Cables',
    description: 'Dual-stack cable machine with 2x75kg weight stacks, 180-degree swivel pulleys, and 20+ cable attachments included.',
    price: 145000,
    discountPrice: 125000,
    weight: { value: 280, unit: 'kg' },
    material: 'Commercial Steel',
    stock: 6,
    isTrending: true,
    lowStockThreshold: 5,
    tags: ['cable machine', 'functional trainer', 'commercial'],
    images: [
      { url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600', alt: 'Cable Machine' }
    ]
  },
  {
    name: 'HexBar Trap Bar 60kg Set',
    brand: 'IronKing',
    category: 'Barbells',
    description: 'Heavy-duty hex trap bar with two handle positions, 60kg total weight including bar and plates. Ideal for deadlifts, shrugs, and carries.',
    price: 15000,
    weight: { value: 60, unit: 'kg' },
    material: 'Zinc Coated Steel',
    stock: 22,
    tags: ['trap bar', 'hex bar', 'deadlift'],
    images: [
      { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600', alt: 'Hex Trap Bar' }
    ]
  },
  {
    name: 'AirBike Pro Commercial Fan Bike',
    brand: 'CardioMax',
    category: 'Cardio',
    description: 'Commercial-grade air bike with unlimited resistance — the harder you push, the harder it gets. Full-body workout, LCD display, and heavy-duty frame.',
    price: 42000,
    discountPrice: 36000,
    weight: { value: 55, unit: 'kg' },
    material: 'Steel Frame',
    stock: 18,
    isFeatured: true,
    tags: ['air bike', 'fan bike', 'cardio'],
    images: [
      { url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600', alt: 'Air Bike' }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'FitZone Admin',
      email: 'admin@fitzone.com',
      password: 'admin123456',
      role: 'admin'
    });
    console.log('👤 Admin created: admin@fitzone.com / admin123456');

    // Create test user
    const testUser = await User.create({
      name: 'Test Customer',
      email: 'customer@fitzone.com',
      password: 'customer123',
      role: 'user'
    });
    console.log('👤 Customer created: customer@fitzone.com / customer123');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 ${createdProducts.length} products created`);

    // Create sample order
    await Order.create({
      user: testUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0].url,
          price: createdProducts[0].discountPrice,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Test Customer',
        phone: '01712345678',
        street: '123 Gulshan Avenue',
        city: 'Dhaka',
        zip: '1212',
        country: 'Bangladesh'
      },
      paymentMethod: 'COD',
      itemsTotal: 15999,
      shippingCost: 0,
      totalPrice: 15999,
      status: 'delivered',
      statusHistory: [
        { status: 'pending' },
        { status: 'confirmed' },
        { status: 'shipped' },
        { status: 'delivered' }
      ]
    });
    console.log('📋 Sample order created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:    admin@fitzone.com / admin123456');
    console.log('Customer: customer@fitzone.com / customer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
