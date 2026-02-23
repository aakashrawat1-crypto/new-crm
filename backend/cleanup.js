const fs = require('fs');
const path = require('path');

const dirs = ['repositories', 'services', 'controllers', 'routes'];

dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            if (file.endsWith('.repository.js') ||
                file.endsWith('.service.js') ||
                file.endsWith('.controller.js') ||
                file.endsWith('.routes.js')) {
                const filePath = path.join(fullPath, file);
                try {
                    fs.unlinkSync(filePath);
                    console.log('Deleted: ' + filePath);
                } catch (err) {
                    console.error('Failed to delete ' + filePath + ': ' + err.message);
                }
            }
        });
    }
});
console.log('Cleanup complete.');
