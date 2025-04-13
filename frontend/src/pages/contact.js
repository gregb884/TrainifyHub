import React from 'react';
import { Box, Typography } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import ContactCard from "@/components/contactCard";
import Footer from "@/components/Footer";

export default function Index() {
    return (
        <Box component="main" sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <Header pageName={'Contact'} language={'en'} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    mt: { md: 2, xs: 12 },
                    minHeight: '30vh',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1, fontSize: '30px', mt: 10, color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Contact Us
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h2" component="h1" sx={{ ml: 5, mr: 5, fontSize: '18px', textAlign: 'left', maxWidth: 'lg', color: 'white', mb: 4, fontWeight: '300' }}>
                        Do you have any questions about the TrainifyHub app? Need assistance or want to share your suggestions? We&apos;re here to help!
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1, fontSize: '18px', lineHeight: 2, textAlign: 'left', maxWidth: 'lg', color: 'white', mb: 4, fontWeight: '500' }}>
                        You can reach us via:
                        <br />📧 E-mail: support@trainifyhub.com
                    </Typography>
                </Box>

                <ContactCard language={'en'} />

                <Box sx={{ minHeight: '5vh' }} />
            </Box>

            <Footer language={'en'} />
        </Box>
    );
}