const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await authService.register(name, email, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const socialLogin = async (req, res) => {
    try {
        const { provider } = req.body;
        const result = await authService.socialLogin(provider);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const firebaseLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'idToken is required' });
        const result = await authService.firebaseLogin(idToken);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const verify = async (req, res) => {
    try {
        const result = await authService.verify(req.user);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { register, login, socialLogin, firebaseLogin, verify };
