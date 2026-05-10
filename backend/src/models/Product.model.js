const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Dumbbells', 'Barbells', 'Machines', 'Cardio', 'Accessories', 'Benches', 'Racks', 'Cables', 'Bundles'],
    default: 'Accessories'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  weight: {
    value: { type: Number, default: 0 },
    unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
  },
  material: {
    type: String,
    default: ''
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  tags: [{ type: String, lowercase: true }],
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBundle: { type: Boolean, default: false },
  bundleItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Calculate average rating
productSchema.methods.calcAvgRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

// Virtual for low stock check
productSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isOutOfStock').get(function() {
  return this.stock === 0;
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
