const contactService = require('../services/contactService');

const createContact = async (req, res) => {
    try {
        const contact = await contactService.createContact(req.body, req.user);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await contactService.getContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const contact = await contactService.updateContact(req.params.id, req.body);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContact, getContacts, updateContact };
