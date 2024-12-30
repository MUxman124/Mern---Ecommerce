import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
    try {
        // req.user.userId is set by the auth middleware
        const user = await User.findById(req.user.userId);
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({errors: true,  message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default adminAuth;
