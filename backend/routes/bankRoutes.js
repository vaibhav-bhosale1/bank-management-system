const express = require('express');
const router = express.Router();
const {
    addBankAccount,
    getMyBankAccounts,
    updateBankAccount,
    deleteBankAccount,
    getAllBankAccounts,
} = require('../controllers/bankController');
const { protect } = require('../middleware/authMiddleware');

// Helper middleware for Admin check
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// User Routes
router.route('/').get(protect, getMyBankAccounts).post(protect, addBankAccount);
router.route('/:id').put(protect, updateBankAccount).delete(protect, deleteBankAccount);

// Admin Route
router.route('/all').get(protect, admin, getAllBankAccounts);

module.exports = router;