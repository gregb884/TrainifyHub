import axios from 'axios';
import {serialize} from "cookie";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/auth/login`, req.body);
            const token = response.data;



            res.setHeader('Set-Cookie', serialize('token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            }));

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error setting cookie:', error);
            res.status(error.response?.status || 500).json({ message: error.response?.data || 'Login failed' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}