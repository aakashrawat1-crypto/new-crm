try {
    console.log('Testing requires...');
    require('./routes/authRoutes');
    console.log('auth ok');
    require('./routes/leadRoutes');
    console.log('lead ok');
    require('./routes/accountRoutes');
    console.log('account ok');
    require('./routes/opportunityRoutes');
    console.log('opportunity ok');
    require('./routes/contactRoutes');
    console.log('contact ok');
    require('./routes/productRoutes');
    console.log('product ok');
    require('./controllers/dashboardController');
    console.log('dashboard ok');
    console.log('All requires successful');
} catch (e) {
    console.error('FAILED REQUIRE:', e.message);
    console.error(e.stack);
}
