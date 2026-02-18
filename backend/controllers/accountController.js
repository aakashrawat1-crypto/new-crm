const accountService = require('../services/accountService');

const createAccount = async (req, res) => {
    try {
        const account = await accountService.createAccount(req.body, req.user);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await accountService.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAccountDetails = async (req, res) => {
    try {
        const details = await accountService.getAccountDetails(req.params.id);
        if (!details) return res.status(404).json({ message: 'Account not found' });
        res.json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAccount, getAccounts, getAccountDetails };
