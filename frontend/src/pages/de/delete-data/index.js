import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Index() {

    const router = useRouter();

    return(
        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Privacy'} language={'de'}/>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    mt: { md: 2, xs: 12 },
                    minHeight: '40vh',
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Löschung von Daten oder Konto
                    </Typography>
                </Box>

            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    ml: 5,
                    justifyContent: 'center',
                    textAlign: 'center',
                    mt: 2,
                    mr: 2,
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        1. Löschung ausgewählter Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,lineHeight: 3,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Falls du deine Daten oder bestimmte Informationen/Workouts/Pläne/Statistiken löschen möchtest, sende eine E-Mail, in der du die zu löschenden Daten sowie die bei der Kontoerstellung verwendete E-Mail-Adresse angibst.
                        <br /> E-mail: support@trainifyhub.com
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    ml: 5,
                    justifyContent: 'center',
                    textAlign: 'left',
                    mt: 2,
                    mr: 2,
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        2. Löschung des Kontos und aller Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Falls du dein Konto vollständig löschen möchtest, gehe auf den unten stehenden Link und bestätige die Löschung deines Kontos.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Achtung! Gelöschte Daten können nicht wiederhergestellt werden.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <Link
                            href="https://www.trainifyhub.com/delete-account"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                fontSize: "30px",
                                color: "white",
                                mb: 4,
                                fontWeight: "bold",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            www.trainifyhub.com/delete-account
                        </Link>
                    </Typography>
                </Box>


            </Box>



            <Footer language={'de'}/>
        </Box>
    );
}