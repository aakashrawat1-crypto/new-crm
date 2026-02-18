const http = require('http');

http.get('http://localhost:5001/', (res) => {
    console.log('Status Code:', res.statusCode);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
});
