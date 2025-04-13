import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import { useRouter } from 'next/router';
import Footer from "@/components/Footer";
import Link from "next/link";




export default function Index() {

    const router = useRouter();

    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Terms'} language={'pl'}/>

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
                        Regulamin serwisu
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
                        1. Postanowienia ogólne
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                             1.	Niniejszy regulamin określa zasady korzystania z serwisu TrainifyHub, dostępnego pod adresem www.trainifyhub.com
                        <br/>2.	Operatorem i właścicielem serwisu jest Grzegorz Wyrębski.
                        <br/>3. Kontakt w sprawie funkcjonowania Serwisu: support@trainifyhub.com.
                        <br/>4. Korzystając z Serwisu, Użytkownik akceptuje niniejszy regulamin oraz Politykę Prywatności.
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
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        2. Zakres usług
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{
                        mr: 1,
                        fontSize: '18px',
                        lineHeight: 3,
                        textAlign: 'left',
                        maxWidth: 'lg',
                        color: 'white',
                        mb: 4,
                        fontWeight: '300'
                    }}>
                        <br/> - Tworzenie własnych planów treningowych,
                        <br/> - Zakup dostępu do gotowych planów treningowych przygotowanych przez ekspertów,
                        <br/> - Generowanie planów treningowych za pomocą sztucznej inteligencji (AI),
                        <br/> - Wyszukiwanie trenerów personalnych oraz zlecanie im stworzenia indywidualnego planu,
                        <br/> - Monitorowanie postępów i statystyk treningowych,
                        <br/> - Wspomaganie poprawy wyników sportowych.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Korzystanie z niektórych funkcjonalności może wymagać uiszczenia opłaty zgodnie z cennikiem Serwisu.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        3. Warunki korzystania z Serwisu
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	Korzystanie z Serwisu wymaga posiadania aktywnego konta.
                        <br/>2. Rejestracja w Serwisie jest dostępna dla osób fizycznych oraz trenerów personalnych bez ograniczeń wiekowych.
                        <br/>3. Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z obowiązującym prawem oraz dobrymi obyczajami.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        4. Rejestracja i logowanie
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>	1. Aby korzystać z pełnych funkcjonalności Serwisu, Użytkownik zobowiązany jest do założenia konta, podając:

                        <br/>- Adres e-mail,
                        <br/>- Imię i nazwisko,
                        <br/>- Hasło,
                        <br/>- Rodzaj konta (trener lub użytkownik),
                        <br/>- Język oraz region.
                        <br/>2. Użytkownik jest odpowiedzialny za prawidłowość podanych danych.
                        <br/>3. Serwis zapewnia możliwość edycji i usunięcia konta w dowolnym momencie.
                    </Typography>
                </Box>



                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        5. Odpowiedzialność i ograniczenia
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	TrainifyHub nie ponosi odpowiedzialności za niewłaściwe wykonanie ćwiczeń oraz ewentualne urazy powstałe w wyniku stosowania planów treningowych.
                        <br/>2. Użytkownik korzysta z Serwisu i oferowanych przez niego planów treningowych na własną odpowiedzialność.
                        <br/>3. TrainifyHub nie gwarantuje osiągnięcia zamierzonych wyników sportowych i zdrowotnych.
                        <br/>4. Wszelkie informacje zawarte w Serwisie mają charakter informacyjny i nie zastępują porady profesjonalnego trenera lub specjalisty.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        6. Płatności i zwroty
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Korzystanie z wybranych funkcjonalności Serwisu wymaga wniesienia opłaty jednorazowej lub cyklicznej, w zależności od wybranego pakietu:
                        <br/>- Jednorazowa opłata za generowanie planu treningowego przez AI,
                        <br/>- Subskrypcja miesięczna na gotowe plany treningowe.
                        <br/>2. W przypadku usług cyfrowych generowanych przez AI lub dostępu do gotowych planów treningowych, zwroty nie są możliwe po ich zakupie i wygenerowaniu treści, zgodnie z obowiązującymi przepisami dotyczącymi treści cyfrowych.
                        <br/>3. Płatności realizowane są za pośrednictwem Apple Pay i Google Pay.
                        <br/>4. Szczegóły dotyczące płatności dostępne są w Serwisie w zakładce „Płatności”.

                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        7. Usuwanie konta
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Użytkownik ma prawo do usunięcia swojego konta w dowolnym momencie:
                        <br/>- Samodzielnie poprzez wejście w link  <Link
                        href="https://www.trainifyhub.com/pl/delete-data"
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
                        www.trainifyhub.com/pl/delete-data
                    </Link>
                        <br/>- Poprzez kontakt mailowy: support@trainifyhub.com.
                        <br/>2. Usunięcie konta skutkuje bezpowrotnym usunięciem wszystkich danych Użytkownika z Serwisu.
                        <br/>3. TrainifyHub nie ponosi odpowiedzialności za skutki usunięcia konta przez Użytkownika.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        8. Prawa autorskie i własność intelektualna
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Wszelkie treści udostępniane w Serwisie, w tym plany treningowe, grafiki, teksty oraz materiały szkoleniowe, są własnością TrainifyHub i podlegają ochronie prawnej.
                        <br/>2. Użytkownik nie ma prawa kopiować, rozpowszechniać ani udostępniać treści Serwisu bez uprzedniej zgody TrainifyHub.
                        <br/>3. Wszelkie naruszenia praw autorskich będą skutkować podjęciem odpowiednich kroków prawnych.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        9. Zmiany w regulaminie
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	TrainifyHub zastrzega sobie prawo do wprowadzania zmian w regulaminie w dowolnym momencie.
                        <br/>2. O wszelkich zmianach Użytkownik zostanie poinformowany drogą e-mailową oraz poprzez stosowne powiadomienia w aplikacji.
                        <br/>3. Dalsze korzystanie z Serwisu po zmianie regulaminu oznacza jego akceptację.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Kontakt
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wszelkie pytania dotyczące Regulaminu można kierować na adres :
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