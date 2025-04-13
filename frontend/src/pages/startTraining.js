import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Typography,
    Toolbar,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton, useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import Navigation from '@/components/Navigation';
import { fetchTrainingPlans } from "@/pages/api/api TrainingManager/trainingPlans";
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useTranslation } from 'react-i18next';
import { getUserId } from "@/utils/jwtDecode";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTheme} from "@mui/material/styles";
import Fade from '@mui/material/Fade';


const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const StartTraining = () => {
    const { t, i18n } = useTranslation('startTraining');
    const [plans, setPlans] = useState([]);
    const [suggestedDay, setSuggestedDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [showOtherTrainings, setShowOtherTrainings] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (i18n.language === 'pl') {
            dayjs.locale('pl');
        } else {
            dayjs.locale('en');
        }
    }, [i18n.language]);

    useEffect(() => {
        const fetchPlansAndUser = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const id = getUserId(token);
                setUserId(id);

                const fetchedPlans = await fetchTrainingPlans();

                const userPlans = fetchedPlans.filter(plan =>
                    plan.users.some(user => user.id === id)
                );

                setPlans(userPlans);
                suggestTrainingDay(userPlans);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching plans or user:', error);
                setLoading(false);
            }
        };

        fetchPlansAndUser();
    }, []);

    const suggestTrainingDay = (userPlans) => {
        const today = dayjs().startOf('day');
        let closestDay = null;

        userPlans.forEach(plan => {
            if (!plan.template) {
                plan.weeks.forEach(week => {
                    week.days.forEach(day => {
                        const plannedDate = dayjs(day.plannedDate).startOf('day');
                        const dayIsUntrained = day.exercisePlans.every(ep =>
                            ep.exerciseSeries.every(series => series.totalRepetitions === 0 && series.totalWeight === 0)
                        );
                        if (dayIsUntrained && (plannedDate.isSame(today) || (plannedDate.isAfter(today) && (!closestDay || plannedDate.isBefore(closestDay.plannedDate))))) {
                            closestDay = { ...day, planName: plan.name };
                        }
                    });
                });
            }
        });

        if (closestDay) {
            setSuggestedDay(closestDay);
        }
    };

    const handleStartTraining = () => {
        if (suggestedDay) {
            router.push(`/trainingSession?dayId=${suggestedDay.id}`);
        }
    };

    const handleTogglePlan = (planId) => {
        setExpandedPlanId(expandedPlanId === planId ? null : planId);
    };

    const handleSelectTrainingDay = (dayId) => {
        router.push(`/trainingSession?dayId=${dayId}`);
    };

    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={t('weekDetails')} />
                <CircularProgress sx={{position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%',color: '#eff0f4'}} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('startTraining')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Fade in={true} timeout={1400}>
                <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)',color: 'black' ,padding: '20px',textAlign: 'center' }}>
                    {suggestedDay ? (
                        <>
                            <Typography color="inherit" component="h1" variant="h5" sx={{  mb: 4 }}>
                                {t('suggestedTraining')}
                            </Typography>
                            <Typography color="inherit" component="h2" variant="h6" sx={{  mb: 2 }}>
                                {suggestedDay.planName}
                            </Typography>
                            <Typography color="inherit" component="h2" variant="h6" sx={{  mb: 4 }}>
                                {dayjs(suggestedDay.plannedDate).format('dddd, D MMMM ')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleStartTraining}
                                    fullWidth
                                    sx={{ maxWidth: '300px' }}
                                >
                                    {t('startTraining')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setShowOtherTrainings(!showOtherTrainings)}
                                    fullWidth
                                    sx={{ maxWidth: '300px',color: 'black' }}
                                >
                                    {showOtherTrainings ? t('hideOtherTrainings') : t('selectAnotherTraining')}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography color="inherit" component="h1" variant="h5" >
                            {t('noTrainingToday')}
                        </Typography>
                    )}
                    <Collapse in={showOtherTrainings} timeout="auto" unmountOnExit>
                        <List>
                            {plans
                                .filter(plan => !plan.template)
                                .map((plan) => (
                                    <Box key={plan.id} sx={{ marginBottom: 2 }}>
                                        <ListItem button onClick={() => handleTogglePlan(plan.id)}>
                                            <ListItemText primary={plan.name} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" onClick={() => handleTogglePlan(plan.id)}>
                                                    {expandedPlanId === plan.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Collapse in={expandedPlanId === plan.id} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {plan.weeks.map((week) =>
                                                    week.days.map((day) => {
                                                        const dayIsUntrained = day.exercisePlans.every(ep =>
                                                            ep.exerciseSeries.every(series => series.totalRepetitions === 0 && series.totalWeight === 0)
                                                        );
                                                        if (dayIsUntrained) {
                                                            return (
                                                                <ListItem
                                                                    button
                                                                    key={day.id}
                                                                    onClick={() => handleSelectTrainingDay(day.id)}
                                                                    sx={{ pl: 4 }}
                                                                >
                                                                    <ListItemText
                                                                        primary={`${dayjs(day.plannedDate).format('dddd, D MMMM')} `}
                                                                    />
                                                                </ListItem>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                )}
                                            </List>
                                        </Collapse>
                                    </Box>
                                ))}
                        </List>
                    </Collapse>
                </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default withAuth(StartTraining);