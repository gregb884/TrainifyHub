import '../styles/globals.css'
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../components/theme';
import { AuthProvider } from '@/context/authContext';
import '../components/i18n';
import { useRouter } from 'next/router';
import i18n from '../components/i18n';
import { getUserLang } from "@/utils/jwtDecode";
import { useEffect } from "react";
import {SessionProvider} from "next-auth/react";
import WebSocketComponent from "@/components/WebSocketComponent";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const isHomePage = router.pathname === "/pl" || router.pathname === "/" || router.pathname === "/de";

    useEffect(() => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            const userLang = getUserLang(token);
            i18n.changeLanguage(userLang || 'en');
        }
    }, [router.pathname]);

    return (
        <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {isHomePage ? (
                <Component {...pageProps} />
            ) : (
                <AuthProvider>
                    <WebSocketComponent />
                    <Component {...pageProps} />
                </AuthProvider>
            )}

        </ThemeProvider>
        </SessionProvider>
    );
}