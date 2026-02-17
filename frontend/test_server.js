const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Connectivity Test Successful</h1><p>If you see this, the port 3000 is reachable. The issue is definitively within the Vite/React configuration.</p>');
}).listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
});
