const mongoose = require('mongoose');

const bankAccountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // This links the account to the User model
    },
    ifscCode: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    accountHolderName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;