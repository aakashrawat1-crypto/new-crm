const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 5002;

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const accountRoutes = require('./routes/accountRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const upsertRoutes = require('./routes/upsertRoutes');
const dashboardController = require('./controllers/dashboardController');
const { authenticate } = require('./middleware/authMiddleware');

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/external/upsert', upsertRoutes);
app.get('/api/dashboard', authenticate, dashboardController.getDashboardStats);

app.get('/', (req, res) => {
    res.send('Smart CRM Backend is running');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[ERROR] Port ${PORT} is already in use.`);
        console.error(`[TIP] Run 'node utils/kill_port.js' to clear the port, or use 'npm start'.\n`);
        process.exit(1);
    } else {
        throw err;
    }
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });

    // Force close after 5 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 5000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
