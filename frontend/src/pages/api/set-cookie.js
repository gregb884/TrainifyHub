import { serialize } from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'missing tokena' });
    }

    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    }));

    res.status(200).json({ message: 'Login successful' });
}