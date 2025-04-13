import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';





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
                    minHeight: '30vh',
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Polityka Prywatności
                    </Typography>

                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '15px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Ostatnia aktualizacja : 27.01.2025
                    </Typography>


                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ ml: 5,mr: 5,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Dziękujemy za korzystanie z TrainifyHub. Dbamy o Twoją prywatność i dokładamy wszelkich starań, aby Twoje dane były przetwarzane zgodnie z obowiązującymi przepisami prawa. Niniejsza Polityka Prywatności opisuje, jakie dane zbieramy, w jaki sposób je wykorzystujemy oraz jakie masz prawa w związku z ich przetwarzaniem.
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
                        1. Administrator danych osobowych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,lineHeight: 3,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Administratorem Twoich danych osobowych jest:
                        Grzegorz Wyrębski
                        <br />E-mail kontaktowy: support@trainifyhub.com
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
                        2. Jakie dane zbieramy?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Zbieramy dane osobowe wyłącznie na potrzeby funkcjonowania aplikacji TrainifyHub. Dane są podawane przez użytkownika dobrowolnie i obejmują m.in.:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Dane podawane podczas rejestracji i korzystania z aplikacji:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Imię i nazwisko
                        <br/>-Adres e-mail
                        <br/>-Hasło (przechowywane w formie zaszyfrowanej)
                        <br/>-Dane dotyczące wagi, wzrostu i innych cech personalnych (jeśli użytkownik zdecyduje się je podać)
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Pliki cookie:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        TrainifyHub używa dwóch plików cookie , jeden przechowujący token autoryzacyjny, który jest wymagany do utrzymania zalogowanej sesji użytkownika , drugi do określenia języka przeglądarki.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Dane dotyczące wiadomości:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wiadomości wysyłane przez użytkownika za pośrednictwem wbudowanego komunikatora są przechowywane w celu umożliwienia komunikacji z administratorem.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Nie zbieramy żadnych danych analitycznych ani nie śledzimy zachowań użytkowników w celach marketingowych.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        3. Cele przetwarzania danych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '500' }}>
                        Twoje dane osobowe przetwarzane są wyłącznie w celu:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/> -Zapewnienia funkcjonowania aplikacji TrainifyHub i jej funkcji
                        <br/> -Realizacji zamówień i płatności (np. przez Apple Pay i Google Pay)
                        <br/> -Umożliwienia zarządzania kontem użytkownika
                        <br/> -Komunikacji z użytkownikiem (np. za pośrednictwem formularza kontaktowego)
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                    Dane użytkownika nie są wykorzystywane do celów marketingowych ani nie są profilowane.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Czas przechowywania danych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Dane osobowe użytkownika są przechowywane do momentu usunięcia konta przez użytkownika. Po usunięciu konta wszelkie dane zostaną trwale usunięte z naszych systemów.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Udostępnianie danych osobowych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Nie udostępniamy Twoich danych osobowych żadnym podmiotom zewnętrznym.
                        Systemy płatności, takie jak Apple Pay i Google Pay, działają niezależnie i nie mają dostępu do Twoich danych osobowych przechowywanych w aplikacji.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Pliki cookie i technologie śledzące
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        W aplikacji TrainifyHub używamy dwóch plików cookie jeden służy wyłącznie do przechowywania tokenu autoryzacyjnego, który umożliwia utrzymanie sesji użytkownika , drugi do określenia języka przegladarki. Nie stosujemy plików cookie do celów reklamowych ani analitycznych.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        7. Prawa użytkownika
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '500' }}>
                        Masz prawo do:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/> -Dostępu do swoich danych osobowych
                        <br/> -Edytowania swoich danych
                        <br/> -Usunięcia swoich danych (poprzez usunięcie konta)
                        <br/> -Otrzymywania informacji o przetwarzaniu twoich danych osobowych
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Uwaga: Wycofanie zgody na przetwarzanie danych osobowych spowoduje brak możliwości korzystania z aplikacji TrainifyHub.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        8. Środki bezpieczeństwa
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '300' }}>
                        Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych osobowych, takie jak:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/> -Szyfrowanie danych (np. przechowywanie haseł w formie zaszyfrowanej)
                        <br/> -Kontrola dostępu – dostęp do bazy danych ma wyłącznie administrator
                        <br/> -Regularne aktualizacje i zabezpieczenia serwera
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        9. Zmiany w Polityce Prywatności
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Zastrzegamy sobie prawo do zmiany niniejszej Polityki Prywatności. O wszelkich zmianach użytkownicy zostaną poinformowani mailowo, a dalsze korzystanie z aplikacji po zmianach będzie oznaczać ich akceptację.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Kontakt w sprawie prywatności
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        W przypadku pytań lub wątpliwości związanych z przetwarzaniem danych osobowych, skontaktuj się z nami pod adresem
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