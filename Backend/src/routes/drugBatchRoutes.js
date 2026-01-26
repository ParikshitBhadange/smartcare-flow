// =============================================================================
// IMPORTS
// =============================================================================

import express from 'express';
import {
  getDashboardStats,
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
} from '../controllers/drugBatchController.js';

// =============================================================================
// ROUTER INITIALIZATION
// =============================================================================

const router = express.Router();

// =============================================================================
// STATISTICS ROUTES (must be before /:id to avoid conflicts)
// =============================================================================

router.get('/stats/dashboard', getDashboardStats);

// =============================================================================
// CRUD ROUTES
// =============================================================================

// GET all drug batches for a user
router.get('/', getAllBatches);

// GET single drug batch by ID
router.get('/:id', getBatchById);

// POST create new drug batch
router.post('/', createBatch);

// PUT update existing drug batch
router.put('/:id', updateBatch);

// DELETE drug batch
router.delete('/:id', deleteBatch);

// =============================================================================
// EXPORT
// =============================================================================

export default router;
