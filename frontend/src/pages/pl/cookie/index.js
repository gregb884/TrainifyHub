import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";





export default function Index() {



    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Cookie'} language={'pl'}/>

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
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Polityka plików cookies
                    </Typography>

                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '15px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Obowiązuje od: 1.01.2025
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
                       1. Czym są pliki cookies?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Pliki cookies to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, tablecie, smartfonie) przez strony internetowe, które odwiedzasz. Cookies są szeroko stosowane w celu zapewnienia sprawnego działania witryn internetowych oraz umożliwiają ich właścicielom uzyskanie informacji o preferencjach użytkownika.
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
                       2. Jakie pliki cookies wykorzystujemy?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Na naszej stronie używamy minimalnej liczby plików cookies, które są niezbędne do funkcjonowania serwisu. Korzystamy wyłącznie z dwóch plików cookie, jeden który przechowuje token autoryzacyjny po zalogowaniu użytkownika,  drugi do sprawdzenia języka przeglądarki.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Rodzaje plików cookies stosowanych na naszej stronie:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                       - Cel: Zapewniają poprawne funkcjonowanie serwisu, umożliwiają logowanie do konta użytkownika.
                        <br />- Plik cookie: token , i18next
                        <br />- Czas przechowywania: Do zakończenia sesji lub do momentu wylogowania.
                        <br />- Dane przechowywane: Token autoryzacyjny użytkownika , język ustawiony w przeglądarce.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Nie stosujemy plików cookies analitycznych, marketingowych ani śledzących.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        3. W jaki sposób możesz zarządzać plikami cookies?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Możesz zarządzać plikami cookies na kilka sposobów:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        - Możesz skonfigurować ustawienia przeglądarki w taki sposób, aby akceptowała lub odrzucała określone rodzaje plików cookies.
                        <br />- Możesz usunąć zapisane pliki cookies w ustawieniach swojej przeglądarki internetowej.
                        <br />- Pamiętaj, że wyłączenie cookies może uniemożliwić korzystanie z niektórych funkcji serwisu, takich jak logowanie.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Instrukcje zarządzania plikami cookies w najpopularniejszych przeglądarkach:
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.google.com/chrome/answer/95647?hl=pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Google Chrome
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.mozilla.org/pl/kb/ciasteczka"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Mozilla Firefox
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Safari
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.microsoft.com/pl-pl/microsoft-edge/usuwanie-plik%C3%B3w-cookie-w-przegl%C4%85darce-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            mb: 4,
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Microsoft Edge
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Czy udostępniamy pliki cookies podmiotom trzecim?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Nie. Plik cookie przechowywany przez naszą stronę służy wyłącznie do uwierzytelnienia użytkownika i nie jest udostępniany podmiotom trzecim ani wykorzystywany w celach reklamowych.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Zmiany w polityce cookies
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Zastrzegamy sobie prawo do aktualizacji niniejszej polityki cookies, jeśli zajdzie taka potrzeba. Wszelkie zmiany zostaną opublikowane na naszej stronie.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Kontakt
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        W przypadku pytań dotyczących naszej polityki cookies, prosimy o kontakt pod adresem:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        📧 Email: support@trainifyhub.com

                    </Typography>
                </Box>

            </Box>


            <Footer language={'pl'}/>



        </Box>


    );

}