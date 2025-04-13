import React, { useEffect, useState } from 'react';
import withAuth from "@/components/withAuth";
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    CircularProgress,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { useRouter } from 'next/router';
import axios from "axios";
import Cookies from "js-cookie";


const DeleteAccount = () => {

    const { t } = useTranslation('deleteAccount');
    const currentLanguage = i18n.language;
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            await router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const deleteAccount = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_AUTH}/api/users/deleteAccount`;

        const tokenAuth = Cookies.get('token');
        if (!tokenAuth) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {

            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${tokenAuth}`,
                },
                withCredentials: true,
            });

            if (response.status === 200) {

                handleLogout();

            } else {
                return false;
            }
        } catch (error) {
            console.error("Error Delete Account", error);
            return false;
        }
    };


    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleDashboard = async () => {
        await router.push('/dashboard');
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };





    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('deleteAccount')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Toolbar />

                <Container maxWidth="lg" sx={{ margin: 'auto' }}>
                    <Typography sx={{ color: 'white', textAlign: 'center' }} variant="h4" component="h1" gutterBottom>
                        {t('sure')}
                    </Typography>

                    <Box sx={{textAlign: 'center'}}>

                        <Button onClick={handleDashboard} sx={{ textAlign: 'center' }}>{t('no')}</Button>
                        <Button onClick={handleOpenDialog} sx={{ color: 'red', textAlign: 'center' }}> {t('yes')}</Button>

                    </Box>


                </Container>

                <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle sx={{color: 'white', backgroundColor: 'rgb(0,0,0,0.9)'}}>{t('sure')}</DialogTitle>
                    <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.9)'}}>

                        <Button onClick={handleCloseDialog} sx={{ textAlign: 'center' }}>{t('no')}</Button>
                        <Button onClick={deleteAccount} sx={{ color: 'rgb(227,10,10)', textAlign: 'center' }}> {t('yes')}</Button>

                    </DialogContent>
                </Dialog>

            </Box>

        </Box>

    );
};

export default withAuth(DeleteAccount);
