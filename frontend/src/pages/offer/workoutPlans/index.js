import React, { useEffect, useState } from 'react';
import {Box, Container, Typography, Grid, CssBaseline, CircularProgress, Button} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../../../components/withAuth';
import i18n from "i18next";
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Index = () => {
    const { t } = useTranslation('workoutPlans');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const currentLanguage = i18n.language;
    const [activePlanId, setActivePlanId] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);

    useEffect(() => {
        // Pobierz token z ciasteczek
        const tokenCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        if (!token) {
            console.error('Brak tokenu uwierzytelniającego.');
            // Możesz przekierować użytkownika na stronę logowania lub wyświetlić komunikat
            // router.push('/login');
            return;
        }

        // Pobieranie danych z API z tokenem
        fetch(`${process.env.NEXT_PUBLIC_API_TRAINING_MANAGER}/api/workoutPlans/getAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Dodajemy token w nagłówku
            },
        })
            .then((response) => {
                if (!response.ok) {
                    // Obsługa błędów HTTP
                    throw new Error(`Błąd HTTP! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setWorkoutPlans(data);
                setTimeout(() => {
                    setLoading(false);
                    setShowContent(true);
                }, 300);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania danych:', error);
            });
    }, []);

    useEffect(() => {
        if (!loading) {
            requestAnimationFrame(() => {
                document.body.style.willChange = 'transform';
                document.body.style.transform = 'translateZ(0)';

                setTimeout(() => {
                    document.body.style.willChange = '';
                    document.body.style.transform = '';
                }, 100);
            });
        }
    }, [loading]);


    // Zaktualizowana funkcja do parsowania opisu
    const parseDescription = (text) => {
        const elements = [];
        let index = 0;

        const regex = /::(.*?)::/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = regex.lastIndex;

            // Dodaj tekst normalny przed pogrubionym, jeśli istnieje
            if (start > lastIndex) {
                const normalText = text.substring(lastIndex, start).trim();
                if (normalText) {
                    elements.push({
                        type: 'normal',
                        text: normalText,
                    });
                }
            }

            // Dodaj tekst pogrubiony
            const boldText = match[1].trim();
            elements.push({
                type: 'bold',
                text: boldText,
            });

            lastIndex = end;
        }

        // Dodaj pozostały tekst normalny po ostatnim pogrubionym fragmencie
        if (lastIndex < text.length) {
            const normalText = text.substring(lastIndex).trim();
            if (normalText) {
                elements.push({
                    type: 'normal',
                    text: normalText,
                });
            }
        }

        // Renderuj elementy z odpowiednim formatowaniem
        return elements.map((item, idx) => {
            if (item.type === 'bold') {
                return (
                    <Typography
                        variant="body2"
                        key={idx}
                        sx={{ fontWeight: 'bold', marginTop: 2 }}
                        color="inherit"
                    >
                        {item.text}
                    </Typography>
                );
            } else {
                return (
                    <Typography
                        variant="body2"
                        key={idx}
                        sx={{ marginBottom: 2 }}
                        color="inherit"
                    >
                        {item.text}
                    </Typography>
                );
            }
        });
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
            }}>
                <Navigation title={t('workoutPlansTitle')} />
                <CssBaseline />
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box key={showContent} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('workoutPlansTitle')} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    mt: 20,
                    mb: 10
                }}
            >


                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>

                        <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                            {t('chooseYourPlan')}
                        </Typography>


                    {selectedGender && (
                        <Box sx={{ mb: 3 }}>

                            <Button variant="contained" color="primary" onClick={() => setSelectedGender(null)} sx={{ mt: 2 }}>
                                ← {t('chooseAgain')}
                            </Button>
                        </Box>
                    )}


                    {selectedGender === null ? (
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={6} sm={6} md={4}>
                                <Box
                                    onClick={() => setSelectedGender('m')}
                                    sx={{
                                        height: '500px',
                                        backgroundImage: `url(/workouts/men.png)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'relative',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            top: 200,
                                            borderRadius: '8px',
                                            left: 0,
                                            width: '100%',
                                            padding: '16px',
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        }}
                                    >
                                        {t('forMen')}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6} md={4}>
                                <Box
                                    onClick={() => setSelectedGender('f')}
                                    sx={{
                                        height: '500px',
                                        backgroundImage: `url(/workouts/women.png)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'relative',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            top: 218,
                                            borderRadius: '8px',
                                            left: 0,
                                            width: '100%',
                                            padding: '16px',
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        }}
                                    >
                                        {t('forWomen')}
                                    </Typography>

                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <Fade in={showContent} timeout={700}>
                        <Grid container spacing={2} justifyContent="center">
                        {workoutPlans
                            .filter((plan) => plan.gender === selectedGender)
                            .map((plan) => (
                            <Grid item xs={10} sm={6} md={4} key={plan.id}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '500px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: activePlanId === plan.planId ? 1 : 0,
                                        },
                                    }}
                                    onClick={() =>
                                        activePlanId === plan.planId
                                            ? setActivePlanId(null)
                                            : setActivePlanId(plan.planId)
                                    }

                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `${plan.imageUrl}`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.0)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />


                                    {activePlanId === plan.planId && (
                                        <Slide
                                            direction="up"
                                            in={activePlanId === plan.planId}
                                            mountOnEnter
                                            unmountOnExit
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    color: 'white',
                                                    zIndex: 1,
                                                    top: 0,
                                                    left: 0,
                                                    fontSize: 12,
                                                    width: '100%',
                                                    padding: '16px',
                                                    textAlign: 'left',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                    boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                    overflowY: 'auto',
                                                    maxHeight: '70%',
                                                }}
                                            >
                                                {currentLanguage === 'pl'
                                                    ? parseDescription(plan.shortDescriptionPl)
                                                    : currentLanguage === 'de'
                                                        ? parseDescription(plan.shortDescriptionDe)
                                                        : parseDescription(plan.shortDescription)}

                                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                    <button
                                                        style={{
                                                            padding: '10px 20px',
                                                            backgroundColor: '#fff',
                                                            color: '#000',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/offer/workoutPlans/${plan.planId}`);
                                                        }}
                                                    >
                                                        {t('seePlan')}
                                                    </button>
                                                </Box>
                                            </Box>
                                        </Slide>
                                    )}

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: '#b4ca3f',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 80,
                                            left: 0,
                                            width: '100%',
                                            padding: '16px',
                                            textAlign: 'left',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        }}
                                    >
                                        <FitnessCenterIcon/> {plan.trainingDaysCount}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            padding: '16px',
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        }}
                                    >
                                        {currentLanguage === 'pl' ? plan.titlePl : currentLanguage === 'de' ? plan.titleDe : plan.title }
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    </Fade>
                    )}


                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(Index);