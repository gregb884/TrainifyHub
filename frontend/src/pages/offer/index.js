import React, {useEffect, useState} from 'react';
import {Box, Container, Typography, Grid, CssBaseline, CircularProgress} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import {fetchTrainingPlans} from "@/pages/api/api TrainingManager/trainingPlans";
import {getUserId, getUserRole} from "@/utils/jwtDecode";
import Fade from '@mui/material/Fade';

const Index = () => {
    const { t } = useTranslation('offer');
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);


    useEffect(() => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            const role = getUserRole(token);
            setUserRole(role);

            setTimeout(() => {
                setLoading(false);
                setShowContent(true);
            }, 300);
        } else {
            setLoading(false);
        }
    }, []);


    const navigateToTrainingPlans = () => router.push('/offer/workoutPlans');
    const navigateToAiPlan = () => router.push('/aiTrainingPlan');
    const navigateToSearchTrainer = () => router.push('/trainerList');
    const navigateToMakeOwn = () => router.push('/createNewPlan');

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
            }}>
                <Navigation title={t('offerTitle')} />
                <CssBaseline />
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('offerTitle')} />

            <Box component="main" sx={{ marginTop: '50px',flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container
                    maxWidth="lg"
                    sx={{
                        textAlign: 'center',
                        padding: { xs: '16px', sm: '24px', md: '32px' },
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                        {t('chooseYourPlan')}
                    </Typography>

                    <Fade in={true} timeout={700}>
                    <Grid container spacing={2} justifyContent="center">
                        {/* Karty w jednym rzędzie */}

                        {userRole === "ROLE_USER" && (
                            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        maxWidth: '280px',
                                        width: '100%',
                                        height: { xs: '300px', sm: '400px', md: '500px' },
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}
                                    onClick={navigateToTrainingPlans}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/preMadePlans.png)`,
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />
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
                                            padding: { xs: '8px', md: '16px' },
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: { xs: '16px', md: '16px', lg: '20px' },
                                        }}
                                    >
                                        {t('trainingPlans')}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}


                        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    position: 'relative', // <- TO WRACA TUTAJ
                                    maxWidth: '280px',
                                    width: '100%',
                                    height: { xs: '300px', sm: '400px', md: '500px' },
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 0,
                                    },
                                }}
                                onClick={navigateToAiPlan}
                            >
                                {/* background image */}
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundImage: `url(/aiPlans.png)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                {/* overlay */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />
                                {/* text */}
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
                                        padding: { xs: '8px', md: '16px' },
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        fontSize: { xs: '16px', md: '16px', lg: '20px' },
                                    }}
                                >
                                    {t('aiTrainingPlan')}
                                </Typography>
                            </Box>
                        </Grid>

                        {userRole === "ROLE_USER" && (
                            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        maxWidth: '280px',
                                        width: '100%',
                                        height: { xs: '300px', sm: '400px', md: '500px' },
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}
                                    onClick={navigateToSearchTrainer}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/trainerWay.png)`,
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />
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
                                            padding: { xs: '8px', md: '16px' },
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: { xs: '16px', md: '16px', lg: '20px' },
                                        }}
                                    >
                                        {t('searchTrainer')}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    maxWidth: '280px',
                                    width: '100%',
                                    height: { xs: '300px', sm: '400px', md: '500px' },
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 0,
                                    },
                                }}
                                onClick={navigateToMakeOwn}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundImage: `url(/selfPlan.png)`,
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
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />
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
                                        padding: { xs: '8px', md: '16px' },
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        fontSize: { xs: '16px', md: '16px', lg: '20px' },
                                    }}
                                >
                                    {userRole === 'ROLE_USER' ? t('makeOwn') : t('makeOwnTrainer')}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    </Fade>
                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(Index);