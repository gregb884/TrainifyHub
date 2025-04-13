// src/pages/api/register.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/auth/register`, req.body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res.status(200).json({ message: 'Registration successful' });
        } catch (error) {
            res.status(error.response?.status || 500).json({ message: error.response?.data || 'An unexpected error occurred' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}