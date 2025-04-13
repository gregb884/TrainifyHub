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

            <Header pageName={'Privacy'} language={'pl'}/>

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
                        Usunięcie danych lub konta
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
                        1. Usunięcię wybranych danych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,lineHeight: 3,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Jeżeli chcesz usunąć swoje dane lub niektóre informacje/treningi/plany/statystyki napisz email w którym opisujesz dane które chcesz usunąc oraz adres e-mail użyty podczas rejestracji konta
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
                        2. Usunięcie konta i wszystkich danych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Jeżeli chcesz usunąć całkowicie konto wejdź w poniższy link a nastepnie potwierdź usunięcie konta .
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                       Uwaga ! usuniętych danych nie można już odzyskać
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



            <Footer language={'pl'}/>
        </Box>
    );
}