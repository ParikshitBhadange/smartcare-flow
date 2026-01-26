// =============================================================================
// IMPORTS
// =============================================================================

import DrugBatch from '../models/DrugBatch.js';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates required fields for drug batch creation
 * @param {Object} body - Request body
 * @returns {string|null} Error message or null if valid
 */
const validateRequiredFields = (body) => {
  const requiredStringFields = [
    'drugName',
    'batchId',
    'expiryDate',
    'manufacturer',
    'category',
    'userId',
  ];

  const requiredNumericFields = ['quantity', 'reorderLevel', 'ratePerUnit'];

  // Check string fields (must exist and not be empty)
  const missingStringFields = requiredStringFields.filter(
    (field) =>
      !body[field] || (typeof body[field] === 'string' && body[field].trim() === '')
  );

  // Check numeric fields (must exist, can be 0)
  const missingNumericFields = requiredNumericFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );

  const allMissingFields = [...missingStringFields, ...missingNumericFields];

  if (allMissingFields.length > 0) {
    return `Missing required fields: ${allMissingFields.join(', ')}`;
  }

  // Validate numeric values
  if (isNaN(Number(body.quantity)) || Number(body.quantity) < 0) {
    return 'Quantity must be a valid non-negative number';
  }

  if (isNaN(Number(body.ratePerUnit)) || Number(body.ratePerUnit) < 0) {
    return 'Rate per unit must be a valid non-negative number';
  }

  if (isNaN(Number(body.reorderLevel)) || Number(body.reorderLevel) < 0) {
    return 'Reorder level must be a valid non-negative number';
  }

  return null;
};

// =============================================================================
// CONTROLLER FUNCTIONS
// =============================================================================

/**
 * Get dashboard statistics for a user
 * GET /api/drug-batches/stats/dashboard
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('📊 Fetching dashboard stats for user:', userId);

    const query = userId ? { userId } : {};
    const batches = await DrugBatch.find(query);

    const stats = {
      totalSKUs: batches.length,
      totalStockValue: batches.reduce((sum, b) => sum + (b.totalCost || 0), 0),
      imminentExpiryBatches: batches.filter(
        (b) => b.status === 'near_expiry' || b.status === 'expired'
      ).length,
      activeShortageItems: batches.filter(
        (b) => b.status === 'low' || b.status === 'out_of_stock'
      ).length,
    };

    console.log('✅ Dashboard stats calculated');
    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};

/**
 * Get all drug batches for a specific user
 * GET /api/drug-batches
 */
export const getAllBatches = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('📋 Fetching drug batches for user:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    const batches = await DrugBatch.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${batches.length} batches`);

    res.status(200).json(batches);
  } catch (error) {
    console.error('❌ Error fetching drug batches:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drug batches',
      error: error.message,
    });
  }
};

/**
 * Get a single drug batch by ID
 * GET /api/drug-batches/:id
 */
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching drug batch:', id);

    const batch = await DrugBatch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Drug batch not found',
      });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error('❌ Error fetching drug batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drug batch',
      error: error.message,
    });
  }
};

/**
 * Create a new drug batch
 * POST /api/drug-batches
 */
export const createBatch = async (req, res) => {
  try {
    console.log('📦 Creating new drug batch:', req.body);

    // Validate required fields
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      console.log('❌ Validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const {
      drugName,
      batchId,
      quantity,
      unit,
      ratePerUnit,
      expiryDate,
      manufacturer,
      category,
      reorderLevel,
      hospitalId,
      userId,
    } = req.body;

    // Check if batchId already exists for this user
    const existingBatch = await DrugBatch.findOne({
      batchId: batchId.trim(),
      userId,
    });

    if (existingBatch) {
      console.log('❌ Batch ID already exists:', batchId);
      return res.status(400).json({
        success: false,
        message: 'Batch ID already exists for this user',
      });
    }

    // Create new batch
    const newBatch = new DrugBatch({
      drugName: drugName.trim(),
      batchId: batchId.trim(),
      quantity: Number(quantity),
      unit: unit || 'tablets',
      ratePerUnit: Number(ratePerUnit),
      expiryDate,
      manufacturer: manufacturer.trim(),
      category: category.trim(),
      reorderLevel: Number(reorderLevel),
      hospitalId: hospitalId || 'h1',
      userId,
    });

    const savedBatch = await newBatch.save();
    console.log('✅ Drug batch created successfully:', savedBatch._id);

    res.status(201).json(savedBatch);
  } catch (error) {
    console.error('❌ Error creating drug batch:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID already exists for this user',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating drug batch',
      error: error.message,
    });
  }
};

/**
 * Update an existing drug batch
 * PUT /api/drug-batches/:id
 */
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Updating drug batch:', id);

    const batch = await DrugBatch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Drug batch not found',
      });
    }

    // Fields that should not be updated directly
    const protectedFields = ['_id', 'userId', 'createdAt'];

    // Update allowed fields
    Object.keys(req.body).forEach((key) => {
      if (!protectedFields.includes(key)) {
        batch[key] = req.body[key];
      }
    });

    // Save triggers pre-save hook to recalculate status and totalCost
    const updatedBatch = await batch.save();
    console.log('✅ Drug batch updated successfully:', id);

    res.status(200).json(updatedBatch);
  } catch (error) {
    console.error('❌ Error updating drug batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating drug batch',
      error: error.message,
    });
  }
};

/**
 * Delete a drug batch
 * DELETE /api/drug-batches/:id
 */
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting drug batch:', id);

    const deletedBatch = await DrugBatch.findByIdAndDelete(id);

    if (!deletedBatch) {
      return res.status(404).json({
        success: false,
        message: 'Drug batch not found',
      });
    }

    console.log('✅ Drug batch deleted successfully:', id);
    res.status(200).json({
      success: true,
      message: 'Drug batch deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('❌ Error deleting drug batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting drug batch',
      error: error.message,
    });
  }
};
