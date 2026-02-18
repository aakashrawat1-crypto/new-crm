const { readData, writeData } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');

class BaseRepository {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    getAll() {
        const data = readData();
        if (!data) return [];
        return data[this.collectionName] || [];
    }

    getById(id) {
        const items = this.getAll();
        return items.find(item => item.id === id);
    }

    create(item) {
        const data = readData();
        const newItem = { id: uuidv4(), createdAt: new Date(), ...item };
        if (!data[this.collectionName]) {
            data[this.collectionName] = [];
        }
        data[this.collectionName].push(newItem);
        writeData(data);
        return newItem;
    }

    update(id, updates) {
        const data = readData();
        const items = data[this.collectionName] || [];
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        items[index] = { ...items[index], ...updates, updatedAt: new Date() };
        data[this.collectionName] = items;
        writeData(data);
        return items[index];
    }

    delete(id) {
        const data = readData();
        const items = data[this.collectionName] || [];
        const filtered = items.filter(item => item.id !== id);

        if (filtered.length === items.length) return false;

        data[this.collectionName] = filtered;
        writeData(data);
        return true;
    }

    // Helper for finding one item by custom predicate
    findOne(predicate) {
        const items = this.getAll();
        return items.find(predicate);
    }

    // Helper for finding multiple items
    find(predicate) {
        const items = this.getAll();
        return items.filter(predicate);
    }
}

module.exports = BaseRepository;
