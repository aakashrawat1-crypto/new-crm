const accountService = require('../services/accountService');

const createAccount = (req, res) => {
    try {
        const account = accountService.createAccount(req.body, req.user);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAccounts = (req, res) => {
    const accounts = accountService.getAllAccounts();
    res.json(accounts);
};

const getAccountDetails = (req, res) => {
    const details = accountService.getAccountDetails(req.params.id);
    if (!details) return res.status(404).json({ message: 'Account not found' });
    res.json(details);
};

module.exports = { createAccount, getAccounts, getAccountDetails };
