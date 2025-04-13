import { serialize } from 'cookie';
import axios from "axios";
import Cookies from "js-cookie";

export default function handler(req, res) {


    const tokenAuth = req.cookies.token;

    try {
        const response =  axios.post(`${process.env.NEXT_PUBLIC_API_NOTIFICATION}/api/user/deleteFCM`, {}, {
            headers: {
                Authorization: `Bearer ${tokenAuth}`,
            },
            withCredentials: true,
        });

    } catch (error) {

    }


    res.setHeader('Set-Cookie', [
        serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('next-auth.callback-url', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('__Secure-next-auth.session-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('__Secure-next-auth.callback-url', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('__Host-next-auth.csrf-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('next-auth.csrf-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        }),
        serialize('next-auth.session-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        })
    ]);





    res.status(200).json({ message: 'Logged out' });
}