const BankAccount = require('../models/BankAccount');

// @desc    Add new bank account
// @route   POST /api/bank
// @access  Private
const addBankAccount = async (req, res) => {
    const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;

    if (!ifscCode || !branchName || !bankName || !accountNumber || !accountHolderName) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const bankAccount = await BankAccount.create({
        user: req.user.id, // Linked to logged in user
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

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Ensure logged in user matches the account user
    if (account.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
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

// @desc    Get all accounts (Admin) - Search & Filter
// @route   GET /api/bank/all
// @access  Private (Admin Only logic handled in route)
const getAllBankAccounts = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            $or: [
                { bankName: { $regex: req.query.keyword, $options: 'i' } },
                { ifscCode: { $regex: req.query.keyword, $options: 'i' } },
                { accountHolderName: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    // Populate user name to display in admin panel
    const accounts = await BankAccount.find({ ...keyword }).populate('user', 'username email');
    res.status(200).json(accounts);
};

module.exports = {
    addBankAccount,
    getMyBankAccounts,
    updateBankAccount,
    deleteBankAccount,
    getAllBankAccounts,
};