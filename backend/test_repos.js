try {
    console.log('Testing repos...');
    require('./repositories/userRepository');
    console.log('user ok');
    require('./repositories/leadRepository');
    console.log('lead ok');
    require('./repositories/accountRepository');
    console.log('account ok');
    require('./repositories/contactRepository');
    console.log('contact ok');
    require('./repositories/opportunityRepository');
    console.log('opportunity ok');
    require('./repositories/productRepository');
    console.log('product ok');
    console.log('All repos OK');
} catch (e) {
    console.error('Repo fail:', e.message);
    console.error(e.stack);
}
