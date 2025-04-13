import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import { useRouter } from 'next/router';
import Footer from "@/components/Footer";




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
                      FAQ
                    </Typography>

                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Masz pytania dotyczące TrainifyHub? Sprawdź najczęściej zadawane pytania i znajdź odpowiedzi!
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
                        1. Co to jest TrainifyHub?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        TrainifyHub to innowacyjna aplikacja treningowa, która pozwala użytkownikom tworzyć własne plany treningowe, korzystać z gotowych programów przygotowanych przez ekspertów, generować plany za pomocą AI oraz współpracować z trenerami personalnymi. Aplikacja zbiera statystyki i pomaga śledzić postępy.
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
                        2. Czy korzystanie z TrainifyHub jest darmowe?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{
                        mr: 1,

                        fontSize: '18px',
                        lineHeight: 2,
                        textAlign: 'left',
                        maxWidth: 'lg',
                        color: 'white',
                        mb: 4,
                        fontWeight: '300'
                    }}>
                        Tak! Możesz korzystać z podstawowych funkcji aplikacji całkowicie za darmo. Płatne są jedynie dodatkowe funkcje, takie jak generowanie planów przez AI oraz dostęp do gotowych planów treningowych.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        3. Jak mogę utworzyć konto?
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
                        <br/>Aby utworzyć konto, wystarczy podać:
                        <br/>✅ Adres e-mail
                        <br/>✅ Imię i nazwisko
                        <br/>✅ Hasło
                        <br/>✅ Wybrać typ konta (użytkownik lub trener)
                        <br/>✅ Określić język i region

                        <br/>Rejestracja zajmuje mniej niż minutę!
                        <br/>Możesz zalogować się również przez konto Google lub Apple
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Jak działa generowanie planu przez AI?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Nasza sztuczna inteligencja analizuje Twoje cele, poziom zaawansowania i preferencje treningowe, aby stworzyć spersonalizowany plan dostosowany do Twoich potrzeb. Wystarczy podać kilka informacji, a AI wygeneruje dla Ciebie optymalny trening w kilka sekund!
                    </Typography>
                </Box>



                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Jak mogę współpracować z trenerem personalnym?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Możesz wyszukać trenera w aplikacji i zlecić mu przygotowanie indywidualnego planu treningowego. Trener stworzy dla Ciebie plan, który będzie dostępny w Twoim profilu.
                        <br/> -Nie ingerujemy w sposób płatności sam uzgadniasz z trenerem jak zapłacisz za plan treningowy
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Jak aplikacja śledzi moje postępy?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        TrainifyHub zbiera dane z Twoich treningów – zapisuje ilość serii, powtórzeń, użyte obciążenie i czas trwania ćwiczeń. Możesz w każdej chwili przeglądać swoje statystyki, analizować wyniki i optymalizować swój trening.

                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        7. Czy mogę usunąć swoje konto i dane?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Tak, w każdej chwili możesz usunąć swoje konto wraz ze wszystkimi danymi – opcja dostępna jest w ustawieniach aplikacji lub możesz skontaktować się z nami przez e-mail: support@trainifyhub.com.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        9. Jakie metody płatności są dostępne?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Obecnie obsługujemy płatności za pośrednictwem Apple Pay i Google Play. Dzięki temu możesz bezpiecznie i wygodnie wykupić dostęp do płatnych funkcji.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        9. Czy moje dane są bezpieczne?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Tak! Wszystkie dane są szyfrowane i przechowywane zgodnie z najwyższymi standardami bezpieczeństwa. Tylko Ty masz do nich dostęp, a my nigdy nie udostępniamy ich osobom trzecim.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Jak mogę skontaktować się z pomocą techniczną?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Jeśli masz jakiekolwiek pytania lub problemy, możesz skontaktować się z nami poprzez:
                        <br/>📧 E-mail: support@trainifyhub.com
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Nie znalazłeś odpowiedzi na swoje pytanie? Skontaktuj się z nami – chętnie pomożemy! 🚀
                    </Typography>
                </Box>

            </Box>


            <Footer language={'pl'}/>



        </Box>


    );

}