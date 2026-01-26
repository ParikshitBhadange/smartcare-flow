import mongoose from 'mongoose';

// =============================================================================
// CONSTANTS
// =============================================================================

const DRUG_STATUS = {
  NORMAL: 'normal',
  LOW: 'low',
  OVERSTOCK: 'overstock',
  NEAR_EXPIRY: 'near_expiry',
  EXPIRED: 'expired',
  OUT_OF_STOCK: 'out_of_stock',
};

const STATUS_VALUES = Object.values(DRUG_STATUS);

const NEAR_EXPIRY_THRESHOLD_DAYS = 90;
const LOW_STOCK_MULTIPLIER = 0.5;
const OVERSTOCK_MULTIPLIER = 4;

// =============================================================================
// SCHEMA DEFINITION
// =============================================================================

const drugBatchSchema = new mongoose.Schema(
  {
    // Primary identifiers
    batchId: {
      type: String,
      required: [true, 'Batch ID is required'],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    hospitalId: {
      type: String,
      required: true,
      default: 'h1',
    },

    // Drug information
    drugName: {
      type: String,
      required: [true, 'Drug name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },

    // Quantity and pricing
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'tablets',
      trim: true,
    },
    ratePerUnit: {
      type: Number,
      min: [0, 'Rate cannot be negative'],
      default: 0,
    },
    totalCost: {
      type: Number,
      min: [0, 'Total cost cannot be negative'],
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Reorder level is required'],
      min: [0, 'Reorder level cannot be negative'],
      default: 100,
    },

    // Status and dates
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: DRUG_STATUS.NORMAL,
    },
    expiryDate: {
      type: String,
      required: [true, 'Expiry date is required'],
    },
    lastUpdated: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

// =============================================================================
// INDEXES
// =============================================================================

// Compound unique index - batchId unique per user
drugBatchSchema.index({ batchId: 1, userId: 1 }, { unique: true });

// =============================================================================
// MIDDLEWARE (HOOKS)
// =============================================================================

/**
 * Pre-save hook to auto-calculate status and totalCost
 * Priority: expired > near_expiry > out_of_stock > low > overstock > normal
 */
drugBatchSchema.pre('save', function () {
  // Calculate total cost
  this.totalCost = this.quantity * this.ratePerUnit;

  // Calculate days until expiry
  const now = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

  // Determine status based on priority
  if (expiryDate < now) {
    this.status = DRUG_STATUS.EXPIRED;
  } else if (daysUntilExpiry <= NEAR_EXPIRY_THRESHOLD_DAYS) {
    this.status = DRUG_STATUS.NEAR_EXPIRY;
  } else if (this.quantity === 0) {
    this.status = DRUG_STATUS.OUT_OF_STOCK;
  } else if (this.quantity <= this.reorderLevel * LOW_STOCK_MULTIPLIER) {
    this.status = DRUG_STATUS.LOW;
  } else if (this.quantity >= this.reorderLevel * OVERSTOCK_MULTIPLIER) {
    this.status = DRUG_STATUS.OVERSTOCK;
  } else {
    this.status = DRUG_STATUS.NORMAL;
  }

  // Update timestamp
  this.lastUpdated = new Date().toISOString();
});

// =============================================================================
// MODEL EXPORT
// =============================================================================

const DrugBatch = mongoose.model('DrugBatch', drugBatchSchema);

export default DrugBatch;
export { DRUG_STATUS };
