const upsertService = require('../services/upsertService');

const upsertData = async (req, res) => {
    try {
        const result = await upsertService.upsertHierarchy(req.body, req.user);
        res.status(200).json({
            message: 'Data upserted successfully',
            data: result
        });
    } catch (error) {
        console.error('Upsert controller error:', error);
        res.status(500).json({
            message: 'Failed to upsert data',
            error: error.message
        });
    }
};

module.exports = {
    upsertData
};
