const contactService = require('../services/contactService');

const createContact = (req, res) => {
    try {
        const contact = contactService.createContact(req.body, req.user);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getContacts = (req, res) => {
    const contacts = contactService.getContacts();
    res.json(contacts);
};

const updateContact = (req, res) => {
    try {
        const contact = contactService.updateContact(req.params.id, req.body);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContact, getContacts, updateContact };
