const contactRepository = require('../repositories/contactRepository');

class ContactService {
    async createContact(data, user) {
        return await contactRepository.create({
            ...data,
            ownerId: user.id
        });
    }

    async getContacts() {
        return await contactRepository.getAll();
    }

    async updateContact(id, data) {
        return await contactRepository.update(id, data);
    }
}

module.exports = new ContactService();
