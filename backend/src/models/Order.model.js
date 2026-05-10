const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    zip: { type: String, required: true },
    country: { type: String, default: 'Bangladesh' }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'bKash', 'Nagad', 'Card'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  itemsTotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  notes: { type: String, default: '' },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FZ-${String(count + 1).padStart(6, '0')}`;
  }
  // Track status history
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
