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
const dashboardController = require('./controllers/dashboardController');
const { authenticate } = require('./middleware/authMiddleware');

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', productRoutes);
app.get('/api/dashboard', authenticate, dashboardController.getDashboardStats);

app.get('/', (req, res) => {
    res.send('Smart CRM Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
