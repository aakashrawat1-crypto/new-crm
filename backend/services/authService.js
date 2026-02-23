const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtHelper');

class AuthService {
    async register(name, email, password, roleName = 'SALES_REP') {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const roleRepository = require('../repositories/roleRepository');
        let roleObj = await roleRepository.getRoleByName(roleName);
        if (!roleObj) {
            roleObj = await roleRepository.createRole({ name: roleName });
        }

        const newUser = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role_id: roleObj.id
        });

        newUser.role = roleObj.name;
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

        const roleRepository = require('../repositories/roleRepository');
        const roleObj = await roleRepository.getRoleById(user.role_id);
        const roleName = roleObj ? roleObj.name : 'SALES_REP';
        user.role = roleName;

        const token = generateToken(user);
        return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }

    async socialLogin(provider) {
        // For demo purposes, we log in as the primary admin/account
        const users = await userRepository.getAll();
        const user = users[0];

        if (!user) {
            throw new Error('No user available for social login');
        }

        const roleRepository = require('../repositories/roleRepository');
        const roleObj = await roleRepository.getRoleById(user.role_id);
        const roleName = roleObj ? roleObj.name : 'SALES_REP';
        user.role = roleName;

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
        let user = await userRepository.findByEmail(email);
        if (!user) {
            const roleRepository = require('../repositories/roleRepository');
            let roleObj = await roleRepository.getRoleByName('SALES_REP');
            if (!roleObj) {
                roleObj = await roleRepository.createRole({ name: 'SALES_REP' });
            }

            user = await userRepository.create({
                name: name || email.split('@')[0],
                email,
                password: '', // No password for OAuth users
                role_id: roleObj.id
                // googleId,
            });
            user.role = roleObj.name;
        } else {
            const roleRepository = require('../repositories/roleRepository');
            const roleObj = await roleRepository.getRoleById(user.role_id);
            user.role = roleObj ? roleObj.name : 'SALES_REP';
        }

        const token = generateToken(user);
        return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }

    async verify(tokenData) {
        if (!tokenData || !tokenData.id) {
            throw new Error('Invalid token');
        }
        const user = await userRepository.getById(tokenData.id);
        if (!user) {
            throw new Error('User not found');
        }
        const roleRepository = require('../repositories/roleRepository');
        const roleObj = await roleRepository.getRoleById(user.role_id);
        const roleName = roleObj ? roleObj.name : 'SALES_REP';
        return {
            user: { id: user.id, name: user.name, email: user.email, role: roleName }
        };
    }
}

module.exports = new AuthService();
