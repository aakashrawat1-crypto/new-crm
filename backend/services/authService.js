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
}

module.exports = new AuthService();
