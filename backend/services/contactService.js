const contactRepository = require('../repositories/contactRepository');

class ContactService {
    createContact(data, user) {
        return contactRepository.create({
            ...data,
            ownerId: user.id
        });
    }

    getContacts() {
        return contactRepository.getAll();
    }

    updateContact(id, data) {
        return contactRepository.update(id, data);
    }
}

module.exports = new ContactService();
