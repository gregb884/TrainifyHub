import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Collapse,
    Typography,
    Box,
    CssBaseline,
    Toolbar,
    Container,
    Button,
    CircularProgress,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import { fetchTrainingPlans } from "@/pages/api/api TrainingManager/trainingPlans";
import Navigation from "@/components/Navigation";
import { getUserId } from "@/utils/jwtDecode";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import dayjs from "dayjs";
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import i18n from "i18next";

dayjs.extend(WeekOfYear);
dayjs.extend(localeData);
dayjs.extend(weekday);

const TrainingPlansOld = () => {
    const [plans, setPlans] = useState([]);
    const [openPlanId, setOpenPlanId] = useState(null);
    const [openWeekId, setOpenWeekId] = useState(null);
    const [openExercisePlanId, setOpenExercisePlanId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [planToRemove, setPlanToRemove] = useState(null);
    const [userId, setUserId] = useState(null);
    const [detailedView, setDetailedView] = useState(false);
    const { t, i18n } = useTranslation(['trainingPlans', 'planDetails', 'weekTable']);
    const theme = useTheme();
    const router = useRouter();
    const currentLanguage = i18n.language;
    const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

    useEffect(() => {
        const getPlans = async () => {
            try {
                const plans = await fetchTrainingPlans();
                setPlans(plans);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching plans:', error);
                setLoading(false);
            }
        };

        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            setUserId(getUserId(token));
        }

        getPlans();
    }, []);

    const findExerciseById = (exerciseId) => {
        for (const plan of plans) {
            for (const week of plan.weeks) {
                for (const day of week.days) {
                    for (const exercisePlan of day.exercisePlans) {
                        if (exercisePlan.exercise?.id === exerciseId) {
                            return exercisePlan.exercise;
                        }
                    }
                }
            }
        }
        return null;
    };

    const handleTogglePlan = (planId) => {
        setOpenPlanId(openPlanId === planId ? null : planId);
    };

    const handleToggleWeek = (weekId) => {
        setOpenWeekId(openWeekId === weekId ? null : weekId);
    };

    const handleToggleExercisePlan = (exercisePlanId) => {
        setOpenExercisePlanId(openExercisePlanId === exercisePlanId ? null : exercisePlanId);
    };

    const handleToggleDetailedView = () => {
        setDetailedView(!detailedView);
    };

    const handleGoToPlan = (planId) => {
        router.push(`/trainingPlan/${planId}`);
    };

    const handleTogglePlanToRemove = (planId) => {
        setPlanToRemove(planId);
        setConfirmDialogOpen(true);
    };

    const handleDeletePlan = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(`${apiUrl}/api/trainingPlan/delete?id=${planToRemove}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setConfirmDialogOpen(false);
            setPlans(plans.filter(plan => plan.id !== planToRemove));
        } catch (error) {
            console.error('Error removing Plan:', error);
        }
    };

    const days = [
        t('monday'),
        t('tuesday'),
        t('wednesday'),
        t('thursday'),
        t('friday'),
        t('saturday'),
        t('sunday')
    ];

    const getDayName = (dateString) => {
        const date = dayjs(dateString);
        const dayIndex = date.day();
        return days[(dayIndex + 6) % 7]; // Przesunięcie, aby poniedziałek był pierwszym dniem.
    };

    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
                <CssBaseline />
                <Navigation title={t('title')} />
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', color: '#eff0f4' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('title')} />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <List>
                        {plans.map((plan) => (
                            <Box key={plan.id} sx={{ marginBottom: 2 }}>
                                <ListItem button onClick={() => handleTogglePlan(plan.id)}>
                                    <ListItemText primary={plan.name} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleTogglePlan(plan.id)}>
                                            {openPlanId === plan.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                        <Button variant="contained" color="primary" onClick={() => handleGoToPlan(plan.id)} sx={{ marginLeft: 2, marginRight: 2 }}>
                                            {t('goToPlan')}
                                        </Button>
                                        {userId === plan.creatorId && (
                                            <Button variant="contained" color="error" onClick={() => handleTogglePlanToRemove(plan.id)}>
                                                {t('deletePlan')}
                                            </Button>
                                        )}
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Collapse in={openPlanId === plan.id} timeout="auto" unmountOnExit>
                                    <List>
                                        {plan.weeks.map((week) => (
                                            <Box key={week.id} sx={{ marginBottom: 2 }}>
                                                <ListItem button onClick={() => handleToggleWeek(week.id)}>
                                                    <ListItemText
                                                        primary={`${t('week')}: ${dayjs(week.startDate).week()} ${t('from')} ${dayjs(week.startDate).format('DD-MM')} ${t('to')} ${dayjs(week.endDate).format('DD-MM')}`}
                                                    />
                                                    <Checkbox
                                                        checked={week.done}
                                                        disabled
                                                        sx={{
                                                            color: week.done ? 'green' : 'red',
                                                            '& .MuiSvgIcon-root': { fontSize: 28 },
                                                        }}
                                                    />
                                                    <Typography variant="body2">
                                                        {week.done ? t('done') : t('notDone')}
                                                    </Typography>
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" onClick={() => handleToggleWeek(week.id)}>
                                                            {openWeekId === week.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                <Collapse in={openWeekId === week.id} timeout="auto" unmountOnExit>
                                                    <TableContainer component={Paper}>
                                                        <Box display="flex" justifyContent="flex-end" p={2} sx={{ backgroundColor: 'transparent' }}>
                                                            <Button variant="contained" color="primary" onClick={handleToggleDetailedView}>
                                                                {detailedView ? t('hideDetail') : t('displayDetails')}
                                                            </Button>
                                                        </Box>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    {days.map((day) => (
                                                                        <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>
                                                                            {day}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    {days.map((day) => {
                                                                        const dayExercisePlans = week.days.filter(d => getDayName(d.plannedDate) === day);
                                                                        return (
                                                                            <TableCell key={day} align="center">
                                                                                {dayExercisePlans.flatMap((dayPlan) => (
                                                                                    dayPlan.exercisePlans.map((exercisePlan) => {
                                                                                        // Znajdź ćwiczenie, jeśli nie ma pełnych danych
                                                                                        const exercise = typeof exercisePlan.exercise === 'object'
                                                                                            ? exercisePlan.exercise
                                                                                            : findExerciseById(exercisePlan.exercise);

                                                                                        return (
                                                                                            <Box
                                                                                                key={exercisePlan.id}
                                                                                                sx={{
                                                                                                    marginBottom: 2,
                                                                                                    padding: 1,
                                                                                                    border: '1px solid #ddd',
                                                                                                    borderRadius: 1,
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'background-color 0.3s',
                                                                                                    '&:hover': {
                                                                                                        backgroundColor: theme.palette.secondary.main,
                                                                                                    },
                                                                                                }}
                                                                                                onClick={() => handleToggleExercisePlan(exercisePlan.id)}
                                                                                            >
                                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                                    {currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name}
                                                                                                </Typography>
                                                                                                {(detailedView || openExercisePlanId === exercisePlan.id) && (
                                                                                                    <>
                                                                                                        <Typography variant="body2">
                                                                                                            {t('series')}: {exercisePlan.plannedSeries}
                                                                                                        </Typography>
                                                                                                        <Typography variant="body2">
                                                                                                            {t('tempo')}: {exercisePlan.tempo}
                                                                                                        </Typography>
                                                                                                        <Typography variant="body2">
                                                                                                            {t('weight')}: {exercisePlan.plannedWeight} kg
                                                                                                        </Typography>
                                                                                                        <Typography variant="body2">
                                                                                                            {t('repetitions')}: {exercisePlan.plannedRepetitions}
                                                                                                        </Typography>
                                                                                                        {exercisePlan.exerciseSeries.map((series, index) => {
                                                                                                            let repColor = 'inherit';
                                                                                                            let repIcon = null;
                                                                                                            let weightColor = 'inherit';
                                                                                                            let weightIcon = null;

                                                                                                            if (series.totalRepetitions !== 0) {
                                                                                                                if (series.totalRepetitions < exercisePlan.plannedRepetitions) {
                                                                                                                    repColor = 'red';
                                                                                                                    repIcon = <ArrowDownwardIcon fontSize="small" sx={{ color: 'red' }} />;
                                                                                                                } else if (series.totalRepetitions > exercisePlan.plannedRepetitions) {
                                                                                                                    repColor = 'green';
                                                                                                                    repIcon = <ArrowUpwardIcon fontSize="small" sx={{ color: 'green' }} />;
                                                                                                                }
                                                                                                            }

                                                                                                            if (series.totalWeight !== 0) {
                                                                                                                if (series.totalWeight < exercisePlan.plannedWeight) {
                                                                                                                    weightColor = 'red';
                                                                                                                    weightIcon = <ArrowDownwardIcon fontSize="small" sx={{ color: 'red' }} />;
                                                                                                                } else if (series.totalWeight > exercisePlan.plannedWeight) {
                                                                                                                    weightColor = 'green';
                                                                                                                    weightIcon = <ArrowUpwardIcon fontSize="small" sx={{ color: 'green' }} />;
                                                                                                                }
                                                                                                            }

                                                                                                            return (
                                                                                                                <Box key={series.id} sx={{ marginTop: 1 }}>
                                                                                                                    <Typography variant="body2" sx={{ color: repColor }}>
                                                                                                                        {t('serie')} {index + 1} - {t('totalRepetitions')}: {series.totalRepetitions} {repIcon}
                                                                                                                    </Typography>
                                                                                                                    <Typography variant="body2" sx={{ color: weightColor }}>
                                                                                                                        {t('totalWeight')}: {series.totalWeight} kg {weightIcon}
                                                                                                                    </Typography>
                                                                                                                </Box>
                                                                                                            );
                                                                                                        })}
                                                                                                    </>
                                                                                                )}
                                                                                            </Box>
                                                                                        );
                                                                                    })
                                                                                ))}
                                                                            </TableCell>
                                                                        );
                                                                    })}
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Collapse>
                                            </Box>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        ))}
                    </List>
                </Container>
                <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('confirmDeleteMessage')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            {t('cancel')}
                        </Button>
                        <Button onClick={() => handleDeletePlan()} color="error">
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default withAuth(TrainingPlansOld);