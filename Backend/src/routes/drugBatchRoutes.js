import express from 'express';
import DrugBatch from '../models/DrugBatch.js';

const router = express.Router();

// Get all drug batches for a specific user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const batches = await DrugBatch.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching drug batches:', error);
    res.status(500).json({ message: 'Error fetching drug batches', error: error.message });
  }
});

// Get single drug batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await DrugBatch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Drug batch not found' });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error('Error fetching drug batch:', error);
    res.status(500).json({ message: 'Error fetching drug batch', error: error.message });
  }
});

// Create new drug batch
router.post('/', async (req, res) => {
  try {
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

    // Validation
    if (!drugName || !batchId || !quantity || !expiryDate || !manufacturer || !category || !reorderLevel || !userId || ratePerUnit === undefined) {
      return res.status(400).json({ message: 'All required fields must be provided (including userId and ratePerUnit)' });
    }

    // Check if batchId already exists for this user
    const existingBatch = await DrugBatch.findOne({ batchId, userId });
    if (existingBatch) {
      return res.status(400).json({ message: 'Batch ID already exists for this user' });
    }

    const newBatch = new DrugBatch({
      drugName,
      batchId,
      quantity: Number(quantity),
      unit: unit || 'tablets',
      ratePerUnit: Number(ratePerUnit),
      expiryDate,
      manufacturer,
      category,
      reorderLevel: Number(reorderLevel),
      hospitalId: hospitalId || 'h1',
      userId,
    });

    const savedBatch = await newBatch.save();
    res.status(201).json(savedBatch);
  } catch (error) {
    console.error('Error creating drug batch:', error);
    res.status(500).json({ message: 'Error creating drug batch', error: error.message });
  }
});

// Update drug batch
router.put('/:id', async (req, res) => {
  try {
    const batch = await DrugBatch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({ message: 'Drug batch not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'userId') {
        batch[key] = req.body[key];
      }
    });
    
    // Save will trigger the pre-save hook to recalculate status and totalCost
    const updatedBatch = await batch.save();
    res.status(200).json(updatedBatch);
  } catch (error) {
    console.error('Error updating drug batch:', error);
    res.status(500).json({ message: 'Error updating drug batch', error: error.message });
  }
});

// Delete drug batch
router.delete('/:id', async (req, res) => {
  try {
    const deletedBatch = await DrugBatch.findByIdAndDelete(req.params.id);
    
    if (!deletedBatch) {
      return res.status(404).json({ message: 'Drug batch not found' });
    }
    
    res.status(200).json({ message: 'Drug batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting drug batch:', error);
    res.status(500).json({ message: 'Error deleting drug batch', error: error.message });
  }
});

// Get dashboard stats for a user
router.get('/stats/dashboard', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const batches = await DrugBatch.find(query);
    
    const stats = {
      totalSKUs: batches.length,
      totalStockValue: batches.reduce((sum, b) => sum + (b.totalCost || 0), 0),
      imminentExpiryBatches: batches.filter(b => b.status === 'near_expiry' || b.status === 'expired').length,
      activeShortageItems: batches.filter(b => b.status === 'low' || b.status === 'out_of_stock').length,
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

export default router;
