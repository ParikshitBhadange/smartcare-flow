import mongoose from 'mongoose';

const drugBatchSchema = new mongoose.Schema({
  drugName: {
    type: String,
    required: true,
  },
  batchId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    default: 'tablets',
  },
  ratePerUnit: {
    type: Number,
    required: true,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['normal', 'low', 'overstock', 'near_expiry', 'expired', 'out_of_stock'],
    default: 'normal',
  },
  hospitalId: {
    type: String,
    required: true,
    default: 'h1',
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
  },
  reorderLevel: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: String,
    default: () => new Date().toISOString(),
  },
}, { timestamps: true });

// Compound unique index - batchId unique per user
drugBatchSchema.index({ batchId: 1, userId: 1 }, { unique: true });

// Auto-calculate status and totalCost based on quantity, reorder level, and expiry date
drugBatchSchema.pre('save', function() {
  // Calculate total cost
  this.totalCost = this.quantity * this.ratePerUnit;
  
  const now = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  // Determine status based on priority: expired > near_expiry > out_of_stock > low > overstock > normal
  if (expiryDate < now) {
    this.status = 'expired';
  } else if (daysUntilExpiry <= 90) {
    this.status = 'near_expiry';
  } else if (this.quantity === 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity <= this.reorderLevel * 0.5) {
    this.status = 'low';
  } else if (this.quantity >= this.reorderLevel * 4) {
    this.status = 'overstock';
  } else {
    this.status = 'normal';
  }
  
  this.lastUpdated = new Date().toISOString();
});

const DrugBatch = mongoose.model('DrugBatch', drugBatchSchema);

export default DrugBatch;
