import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).json({ message: 'Invalid credentials', isMatch });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        response.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server error' });
    }
}

export const registerUser = async (request, response) => {
    try {
        const { name, email, password, isAdmin } = request.body;
        const user = await User.findOne({ email });
        if (user) {
            return response.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let adminStatus = false;
        if (isAdmin) {
            const existingAdmin = await User.findOne({ isAdmin: true });
            if (!existingAdmin) {
                adminStatus = true;
            }
        }
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            isAdmin: adminStatus
        });
        await newUser.save();
        response.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server error' });
    }
}