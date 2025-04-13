import React, {useEffect, useState} from 'react';
import {Box, Container, Typography, Grid, CssBaseline, Button} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import withAuth from '../../components/withAuth';
import i18n from "i18next";
import {useRouter} from "next/router";
import axios from "axios";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {keyframes} from "@emotion/react";




const Index = () => {
    const { t } = useTranslation('aiTrainingPlan');

    const currentLanguage = i18n.language;
    const router = useRouter();
    const [coins, setCoins] = useState(0);

    const glow = keyframes`
  from {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1);
  }
`;


    const checkCoins = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/checkAiCoins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

           setCoins(response.data);

        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.status === 404 && error.response.data === "Access denied") {
                setAccess(0);
            } else {
                console.error('Error fetching Access data:', error);
            }
        }
    };

    useEffect(() => {
        checkCoins();
    }, []);


    const handleNavigateToStore = async () => {
        await router.push('/store');
    };



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('aiPlansTitle')} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    mt: 10,
                }}
            >
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontSize: '25px', color: 'white', mb: 4 }}>
                        {t('mainTitle')}
                    </Typography>

                    {currentLanguage === 'pl' && (
                        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            💡 Dlaczego warto wybrać plan AI
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Pełne dopasowanie do Twoich potrzeb:</strong> Nasz system uwzględnia Twój poziom zaawansowania, cele treningowe, dostępny czas oraz preferencje, aby stworzyć plan, który idealnie pasuje do Ciebie.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Optymalizacja na podstawie danych:</strong> Możesz załączyć swój poprzedni plan treningowy, jeśli taki masz! AI dokładnie go przeanalizuje, uwzględniając Twoje wcześniejsze doświadczenia i osiągnięte efekty, by zapewnić jeszcze lepsze dopasowanie.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Czas trwania i przejrzystość:</strong> Każdy plan jest zaprojektowany na 4 tygodnie – to idealny okres, by zauważyć postępy i uniknąć rutyny w treningu.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🏋️‍♂️ Jak to działa?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>1. Wypełnij formularz:</strong> Odpowiedz na kilka prostych pytań o swoje cele, możliwości i preferencje.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>2. Dodaj swój poprzedni plan (opcjonalnie):</strong> Jeśli masz wcześniejszy plan treningowy, załącz go, a AI wykorzysta te informacje, by lepiej dostosować propozycję do Twoich potrzeb.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>3. Otrzymaj gotowy plan:</strong> W ciągu kilku chwil otrzymasz swój indywidualny 4-tygodniowy program treningowy, gotowy do realizacji.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={10} sm={6} md={10} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',

                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🚀 Rozpocznij już teraz!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Zacznij swoją przygodę z nowoczesnym podejściem do treningu! Nie musisz być ekspertem – sztuczna inteligencja zrobi to za Ciebie. Wystarczy kilka kliknięć, by zyskać plan, który działa na Twoją korzyść.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Wypełnij formularz już teraz i odkryj, jak proste może być dążenie do formy idealnej!
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center', // Wyrównanie poziome
                                                alignItems: 'center', // Wyrównanie pionowe
                                                mt: 4, // Odstęp od tekstu
                                            }}
                                        >

                                            <Typography sx={{color: 'white',fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif'}}>{t('coinsQuantity')} : {coins}</Typography>

                                        </Box>


                                        {coins > 0 ? (

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center', // Wyrównanie poziome
                                                alignItems: 'center', // Wyrównanie pionowe
                                                mt: 4, // Odstęp od tekstu
                                            }}
                                        >

                                            <Box
                                                onClick={() => router.push('/aiTrainingPlan/newAiPlan')}
                                                sx={{
                                                    width: '200px',
                                                    height: '60px',
                                                    backgroundColor: '#b4ca3f',
                                                    color: 'white',
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    animation: `${glow} 1s infinite alternate`,
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s, transform 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#00cc00',
                                                        transform: 'scale(1.05)',
                                                    },
                                                }}
                                            >
                                                {t('start')}
                                            </Box>
                                        </Box>

                                        ) : (

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mt: 2,
                                                    mb: 5
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNavigateToStore}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        width: '80px',
                                                        height: '80px',
                                                        animation: `${glow} 1s infinite alternate`,

                                                    }}
                                                >
                                                    <MonetizationOnIcon sx={{ fontSize: '48px'}} />
                                                </Button>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: 15,
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        mt: 2
                                                    }}
                                                >
                                                    {t('buyAiCoins')}
                                                </Typography>
                                            </Box>

                                        )}
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>
                    )}

                    {/* Angielski */}
                    {currentLanguage === 'en' && (
                        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            💡 Why choose an AI plan?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Full personalization:</strong> Our system considers your experience level, training goals, available time, and preferences to create a plan tailored just for you.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Data-driven optimization:</strong> You can upload your previous training plan if you have one! AI will analyze it to adjust your new plan based on your past experience and results.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Clarity and duration:</strong> Each plan is designed for 4 weeks – the perfect time to see progress and stay motivated without getting stuck in a routine.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🏋️‍♂️ How does it work?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>1. Fill out the form:</strong> Answer a few simple questions about your goals, capabilities, and preferences.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>2. Add your previous plan (optional):</strong> If you have a previous training plan, upload it, and AI will use that information to better tailor the proposal to your needs.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>3. Get your ready-to-go plan:</strong> Within moments, you’ll receive your individualized 4-week training program, ready to implement.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🚀 Get Started Now!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Begin your journey with a modern approach to training! You don’t need to be an expert – artificial intelligence will handle it for you. Just a few clicks and you’ll have a plan that works for your goals.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Fill out the form now and discover how easy it can be to achieve your ideal fitness!
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center', // Wyrównanie poziome
                                                alignItems: 'center', // Wyrównanie pionowe
                                                mt: 4, // Odstęp od tekstu
                                            }}
                                        >

                                            <Typography sx={{color: 'white',fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif'}}>{t('coinsQuantity')} : {coins}</Typography>

                                        </Box>


                                        {coins > 0 ? (

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center', // Wyrównanie poziome
                                                    alignItems: 'center', // Wyrównanie pionowe
                                                    mt: 4, // Odstęp od tekstu
                                                }}
                                            >

                                                <Box
                                                    onClick={() => router.push('/aiTrainingPlan/newAiPlan')}
                                                    sx={{
                                                        width: '200px',
                                                        height: '60px',
                                                        backgroundColor: '#b4ca3f',
                                                        color: 'white',
                                                        fontSize: '20px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        animation: `${glow} 1s infinite alternate`,
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.3s, transform 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: '#00cc00',
                                                            transform: 'scale(1.05)',
                                                        },
                                                    }}
                                                >
                                                    {t('start')}
                                                </Box>
                                            </Box>

                                        ) : (

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mt: 2,
                                                    mb: 5
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNavigateToStore}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        width: '80px',
                                                        height: '80px',
                                                        animation: `${glow} 1s infinite alternate`,

                                                    }}
                                                >
                                                    <MonetizationOnIcon sx={{ fontSize: '48px'}} />
                                                </Button>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: 15,
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        mt: 2
                                                    }}
                                                >
                                                    {t('buyAiCoins')}
                                                </Typography>
                                            </Box>

                                        )}

                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {/* Niemiecki */}
                    {currentLanguage === 'de' && (
                        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            💡 Warum einen KI-Plan wählen?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Vollständige Personalisierung:</strong> Unser System berücksichtigt dein Erfahrungsniveau, deine Trainingsziele, verfügbare Zeit und Vorlieben, um einen Plan zu erstellen, der perfekt auf dich zugeschnitten ist.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Datenbasierte Optimierung:</strong> Du kannst deinen bisherigen Trainingsplan hochladen, falls du einen hast! Die KI wird ihn analysieren, um deinen neuen Plan basierend auf deinen bisherigen Erfahrungen und Ergebnissen anzupassen.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>Klarheit und Dauer:</strong> Jeder Plan ist für 4 Wochen ausgelegt – die perfekte Zeit, um Fortschritte zu sehen und motiviert zu bleiben, ohne in Routine zu verfallen.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🏋️‍♂️ Wie funktioniert es?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>1. Formular ausfüllen:</strong> Beantworte ein paar einfache Fragen zu deinen Zielen, Fähigkeiten und Vorlieben.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>2. Füge deinen vorherigen Plan hinzu (optional):</strong> Wenn du einen vorherigen Trainingsplan hast, lade ihn hoch! Die KI wird diese Informationen nutzen, um den Vorschlag besser an deine Bedürfnisse anzupassen.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            <strong>3. Erhalte deinen fertigen Plan:</strong> Innerhalb weniger Augenblicke erhältst du deinen individuellen 4-Wochen-Trainingsplan, der bereit zur Umsetzung ist.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={10} sm={6} md={5} sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '16px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            height: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            🚀 Starte jetzt!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Beginne deine Reise mit einem modernen Ansatz für das Training! Du musst kein Experte sein – die künstliche Intelligenz übernimmt das für dich. Nur ein paar Klicks und du hast einen Plan, der zu deinen Zielen passt.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Fülle jetzt das Formular aus und entdecke, wie einfach es sein kann, deine ideale Fitness zu erreichen!
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center', // Wyrównanie poziome
                                                alignItems: 'center', // Wyrównanie pionowe
                                                mt: 4, // Odstęp od tekstu
                                            }}
                                        >

                                            <Typography sx={{color: 'white',fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif'}}>{t('coinsQuantity')} : {coins}</Typography>

                                        </Box>


                                        {coins > 0 ? (

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center', // Wyrównanie poziome
                                                    alignItems: 'center', // Wyrównanie pionowe
                                                    mt: 4, // Odstęp od tekstu
                                                }}
                                            >

                                                <Box
                                                    onClick={() => router.push('/aiTrainingPlan/newAiPlan')}
                                                    sx={{
                                                        width: '200px',
                                                        height: '60px',
                                                        backgroundColor: '#b4ca3f',
                                                        color: 'white',
                                                        fontSize: '20px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        animation: `${glow} 1s infinite alternate`,
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.3s, transform 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: '#00cc00',
                                                            transform: 'scale(1.05)',
                                                        },
                                                    }}
                                                >
                                                    {t('start')}
                                                </Box>
                                            </Box>

                                        ) : (

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mt: 2,
                                                    mb: 5
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNavigateToStore}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        width: '80px',
                                                        height: '80px',
                                                        animation: `${glow} 1s infinite alternate`,

                                                    }}
                                                >
                                                    <MonetizationOnIcon sx={{ fontSize: '48px'}} />
                                                </Button>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: 15,
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        mt: 2
                                                    }}
                                                >
                                                    {t('buyAiCoins')}
                                                </Typography>
                                            </Box>

                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(Index);