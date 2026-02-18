const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtHelper');

class AuthService {
    async register(name, email, password, role = 'SALES_REP') {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = generateToken(newUser);
        return { user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user);
        return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }

    async socialLogin(provider) {
        // For demo purposes, we log in as the primary admin/account
        const users = userRepository.getAll();
        const user = users[0];

        if (!user) {
            throw new Error('No user available for social login');
        }

        const token = generateToken(user);
        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
            provider
        };
    }

    async firebaseLogin(idToken) {
        // Verify the Firebase ID token using Google's public tokeninfo endpoint
        const https = require('https');

        const tokenData = await new Promise((resolve, reject) => {
            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error_description || parsed.error) {
                            reject(new Error(parsed.error_description || 'Invalid Firebase token'));
                        } else {
                            resolve(parsed);
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse token response'));
                    }
                });
            }).on('error', reject);
        });

        const { email, name, sub: googleId } = tokenData;
        if (!email) throw new Error('No email in Firebase token');

        // Find existing user or create one
        let user = userRepository.findByEmail(email);
        if (!user) {
            user = userRepository.create({
                name: name || email.split('@')[0],
                email,
                password: '', // No password for OAuth users
                role: 'SALES_REP',
                googleId,
            });
        }

        const token = generateToken(user);
        return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }

    async verify(tokenData) {
        if (!tokenData || !tokenData.id) {
            throw new Error('Invalid token');
        }
        const user = userRepository.getById(tokenData.id);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        };
    }
}

module.exports = new AuthService();
