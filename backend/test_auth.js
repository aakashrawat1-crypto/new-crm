const authService = require('./services/authService');
const userRepository = require('./repositories/userRepository');

async function test() {
    try {
        console.log('Testing Social Login...');
        const result = await authService.socialLogin('google');
        console.log('Social Login Success:', JSON.stringify(result, null, 2));

        console.log('\nTesting Verify Token...');
        const verifyResult = await authService.verify({ id: result.user.id });
        console.log('Verify Success:', JSON.stringify(verifyResult, null, 2));

        console.log('\nTesting Normal Login...');
        // Find a user and try to login
        const user = userRepository.findByEmail('ayush.negi@grazziti.com');
        if (user) {
            console.log('Found user:', user.email);
            // We can't easily test normal login because we don't know the plain password
            // but we can check if finding the user works.
        } else {
            console.log('User not found');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

test();
