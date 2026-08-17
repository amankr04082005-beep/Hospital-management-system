const Medicine = require('../models/Medicine');

// POST /api/medicines  (Pharmacist/Admin only) — manually add a new medicine to inventory
async function addMedicine(req, res, next) {
  try {
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only pharmacists can add medicines.' });
    }

    const {
      brandName,
      genericName,
      composition,
      manufacturer,
      form,
      category,
      isPenicillinBased,
      contraindications,
      ageRestriction,
      dosageByAge,
      stockQuantity,
      lowStockThreshold,
      expiryDate,
    } = req.body;

    if (!brandName || !genericName || !composition) {
      return res.status(400).json({
        success: false,
        message: 'brandName, genericName, and composition are required.',
      });
    }

    const medicine = new Medicine({
      brandName,
      genericName,
      composition,
      manufacturer,
      form,
      category,
      isPenicillinBased,
      contraindications,
      ageRestriction,
      dosageByAge,
      stockQuantity: stockQuantity || 0,
      lowStockThreshold: lowStockThreshold || 10,
      expiryDate,
      lastRestockedAt: stockQuantity > 0 ? new Date() : null,
    });

    await medicine.save();
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
}

// GET /api/medicines/search?q=Dolo  — Module 6: Search by brand/generic/composition
async function search(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const results = await Medicine.find({
      $or: [
        { brandName: new RegExp(q, 'i') },
        { genericName: new RegExp(q, 'i') },
        { composition: new RegExp(q, 'i') },
      ],
    }).limit(20);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}

// GET /api/medicines/:id/alternatives — same composition, different brand
async function getAlternatives(req, res, next) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found.' });

    const alternatives = await Medicine.find({
      composition: medicine.composition,
      _id: { $ne: medicine._id },
    });

    res.json({ success: true, data: alternatives });
  } catch (error) {
    next(error);
  }
}

// GET /api/medicines/inventory
async function getInventory(req, res, next) {
  try {
    const medicines = await Medicine.find().sort({ stockQuantity: 1, brandName: 1 });
    res.json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/medicines/:id/stock  (Pharmacist only)
async function updateStock(req, res, next) {
  try {
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only pharmacists can update inventory.' });
    }

    const { adjustment, expiryDate } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found.' });

    if (typeof adjustment === 'number') {
      medicine.stockQuantity = Math.max(0, medicine.stockQuantity + adjustment);
      if (adjustment > 0) medicine.lastRestockedAt = new Date();
    }
    if (expiryDate) medicine.expiryDate = expiryDate;

    await medicine.save();
    res.json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
}

module.exports = { addMedicine, search, getAlternatives, getInventory, updateStock };