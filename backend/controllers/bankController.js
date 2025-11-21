const BankAccount = require('../models/BankAccount');
const User = require('../models/User'); // Import User model for search

// Validation Helper
const validateBankDetails = (ifsc, accountNum) => {
    // Basic IFSC Regex (4 letters, 0, 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/; 
    // Account Number (Usually 9-18 digits)
    const accountRegex = /^[0-9]{9,18}$/;

    if (!ifscRegex.test(ifsc)) return 'Invalid IFSC Code format (e.g., SBIN0123456)';
    if (!accountRegex.test(accountNum)) return 'Invalid Account Number (must be 9-18 digits)';
    return null;
};

// @desc    Add new bank account
// @route   POST /api/bank
// @access  Private
const addBankAccount = async (req, res) => {
    const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;

    // 1. Basic Empty Check 
    if (!ifscCode || !branchName || !bankName || !accountNumber || !accountHolderName) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // 2. Strict Validation 
    const validationError = validateBankDetails(ifscCode, accountNumber);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const bankAccount = await BankAccount.create({
        user: req.user.id,
        ifscCode,
        branchName,
        bankName,
        accountNumber,
        accountHolderName,
    });

    res.status(201).json(bankAccount);
};

// @desc    Get logged in user's bank accounts
// @route   GET /api/bank
// @access  Private
const getMyBankAccounts = async (req, res) => {
    const accounts = await BankAccount.find({ user: req.user.id });
    res.status(200).json(accounts);
};

// @desc    Update bank account
// @route   PUT /api/bank/:id
// @access  Private
const updateBankAccount = async (req, res) => {
    const account = await BankAccount.findById(req.params.id);

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    if (account.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Optional: Add validation here too if they edit critical fields
    if(req.body.ifscCode || req.body.accountNumber) {
         const ifsc = req.body.ifscCode || account.ifscCode;
         const accNum = req.body.accountNumber || account.accountNumber;
         const validationError = validateBankDetails(ifsc, accNum);
         if (validationError) return res.status(400).json({ message: validationError });
    }

    const updatedAccount = await BankAccount.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedAccount);
};

// @desc    Delete bank account
// @route   DELETE /api/bank/:id
// @access  Private
const deleteBankAccount = async (req, res) => {
    const account = await BankAccount.findById(req.params.id);

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    if (account.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await account.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Get all accounts (Admin) - Search by User, Bank, IFSC 
// @route   GET /api/bank/all
// @access  Private (Admin)
const getAllBankAccounts = async (req, res) => {
    const keyword = req.query.keyword || '';

    // 1. Find Users matching the keyword (to filter by username)
    // We get the IDs of all users whose username matches the search
    const matchingUsers = await User.find({
        username: { $regex: keyword, $options: 'i' }
    }).select('_id');

    const userIds = matchingUsers.map(u => u._id);

    // 2. Construct the Query
    // We search for bank accounts where:
    // A) The Bank Name, IFSC, or Account Holder Name matches the keyword
    // OR
    // B) The 'user' field matches one of the IDs we found in step 1
    const query = {
        $or: [
            { bankName: { $regex: keyword, $options: 'i' } },
            { ifscCode: { $regex: keyword, $options: 'i' } },
            { accountHolderName: { $regex: keyword, $options: 'i' } },
            { user: { $in: userIds } } // <--- This enables searching by Username
        ]
    };

    const accounts = await BankAccount.find(keyword ? query : {}).populate('user', 'username email');
    res.status(200).json(accounts);
};

module.exports = {
    addBankAccount,
    getMyBankAccounts,
    updateBankAccount,
    deleteBankAccount,
    getAllBankAccounts,
};