import express from 'express';

const router = express.Router();

// For stateless JWT, logout is handled on client by deleting token.
// This endpoint is just for demonstration; you can implement token blacklist if needed.
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully.' });
});

export default router;
