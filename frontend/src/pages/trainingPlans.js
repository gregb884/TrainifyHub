import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Box,
    CssBaseline,
    Toolbar,
    Container,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    Button, Collapse, ListItemSecondaryAction,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import { fetchTrainingPlans } from "@/pages/api/api TrainingManager/trainingPlans";
import Navigation from "@/components/Navigation";
import {getUserId, getUserRole} from "@/utils/jwtDecode";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import dayjs from "dayjs";
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import Fade from '@mui/material/Fade';

dayjs.extend(WeekOfYear);
dayjs.extend(localeData);
dayjs.extend(weekday);

const TrainingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openPlanId, setOpenPlanId] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [detailedView, setDetailedView] = useState(false);
    const [openExercisePlanId, setOpenExercisePlanId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [planChecked, setPlanChecked] = useState(false);
    const [planIdToCheck, setPlanIdToCheck] = useState(0);
    const [planToRemove, setPlanToRemove] = useState(null);
    const { t, i18n } = useTranslation(['trainingPlans', 'planDetails', 'weekTable']);
    const router = useRouter();
    const theme = useTheme();
    const [access , setAccess] = useState(false);


    const checkAccess = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/readyPlansAccessCheck`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data === "Access") {
                setAccess(true);
            } else {
                setAccess(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.status === 404 && error.response.data === "Access denied") {
                setAccess(false);
            } else {
                console.error('Error fetching Access data:', error);
            }
        }
    };



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
            setUserRole(getUserRole(token));
            checkAccess();
        }

        getPlans();
    }, []);

    const handleTogglePlan = (planId) => {
        setOpenPlanId(openPlanId === planId ? null : planId);
    };

    const handleToggleExercisePlan = (exercisePlanId) => {
        setOpenExercisePlanId(openExercisePlanId === exercisePlanId ? null : exercisePlanId);
    };

    const handleSelectWeek = (week, plan) => {
        setSelectedWeek({ ...week, planName: plan.name, userName: plan.users[0]?.username });
    };

    const handleGoToPlan = (planId) => {
        router.push(`/trainingPlan/${planId}`);
    };

    const handleTogglePlanToRemove = (planId) => {
        setPlanToRemove(planId);
        setConfirmDialogOpen(true);
    };

    const handlePlanToUpdateChecked = (planId) => {

        setPlanIdToCheck(planId)
        setPlanChecked(true)
    }



    const handleDeletePlan = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(`${process.env.NEXT_PUBLIC_API_TRAINING_MANAGER}/api/trainingPlan/delete?id=${planToRemove}`, {
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

    const handleConfirmPlan = async () => {


        try {

            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${process.env.NEXT_PUBLIC_API_TRAINING_MANAGER}/api/trainingPlan/checked?id=${planIdToCheck}`, null,{

                headers: {

                    Authorization: `Bearer ${token}`,
                },
            });

            setPlans((prevPlans) =>
                prevPlans.map((plan) =>
                    plan.id === planIdToCheck ? { ...plan, checked: true } : plan
                )
            );

            setPlanChecked(false);


        } catch (error) {
            console.error('Error set Plan to checked:', error);
        }



    }

    const myselfCreatedPlans = plans.filter(plan => !plan.template && plan.users.length === 1 && plan.users[0].id === plan.creatorId);
    const trainingPlansForClient = plans.filter(plan => plan.creatorId === userId && plan.users.some(user => user.id !== plan.creatorId));
    const myTemplates = plans.filter(plan => plan.template && plan.users.length === 1 && plan.users[0].id === plan.creatorId);
    const PlansFromTrainer = plans.filter(plan => plan.creatorId !== userId && plan.creatorId !== 1 && plan.creatorId !== 2);
    const PlansFromWorkoutPlans = plans.filter(plan => plan.creatorId === 1);
    const PlansAi = plans.filter(plan => plan.creatorId === 2);

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

    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const renderExpandableSection = (plans, title, sectionKey, isForClients = false) => (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: 'rgb(255,255,255,0.5)',
                transition: 'height 0.3s ease',
            }}
        >
            <ListItem
                button
                onClick={() => toggleSection(sectionKey)}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 0, // Usuń domyślny padding
                }}
            >
                <Typography variant="h6" sx={{flexGrow: 1}} gutterBottom>
                    {title}
                </Typography>
                <Box
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'black',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.5,
                        fontSize: '1rem',
                        display: 'inline-block',

                    }}
                >
                    {plans.length}
                </Box>
                <IconButton edge="end">
                    {expandedSections[sectionKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </ListItem>
            <Collapse in={expandedSections[sectionKey]} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                    {renderPlans(plans, title, isForClients)}
                </Box>
            </Collapse>
        </Paper>
    );

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

    const renderPlans = (plans, title, isForClients = false) => (
        <Box sx={{ position: 'relative' }}>
            <List>
                {plans.map((plan) => (
                    <Box key={plan.id} sx={{ marginBottom: 2 }}>
                        <ListItem button onClick={() => handleTogglePlan(plan.id)} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ListItemText sx={{maxWidth: '400px'}} primary={isForClients ? plan.users[0]?.username : plan.name} secondary={isForClients ? plan.name : null} />
                            <Box>
                                {isForClients && (
                                    <IconButton onClick={() => handlePlanToUpdateChecked(plan.id)}>
                                        <CheckCircleOutlineIcon sx={{ color: plan.checked ? 'green' : 'yellow' }} />
                                    </IconButton>
                                )}
                                <IconButton onClick={() => handleGoToPlan(plan.id)} color="primary">
                                    <OpenInNewIcon />
                                </IconButton>
                                {(userId === plan.creatorId || plan.creatorId === 1 || plan.creatorId === 2) && (
                                    <IconButton edge="end" color="error" onClick={() => handleTogglePlanToRemove(plan.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </ListItem>
                        <Collapse in={openPlanId === plan.id} timeout="auto" unmountOnExit>
                            <Box sx={{ pl: 4 }}>
                                {plan.weeks.map((week) => (
                                    <ListItem key={week.id} button onClick={() => handleSelectWeek(week, plan)}>
                                        <ListItemText primary={`${t('week')}: ${dayjs(week.startDate).week()}`} />
                                        <Checkbox checked={selectedWeek?.id === week.id} color="primary" />
                                    </ListItem>
                                ))}
                            </Box>
                        </Collapse>
                    </Box>
                ))}
            </List>
        </Box>
    );

    const renderWeekDetails = (week) => (
        <Dialog  open={Boolean(week)} onClose={() => setSelectedWeek(null)} maxWidth="lg" fullWidth>
            <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.3)'}}>
                {t('selectedWeek', { week: week.endDate, user: week.userName })}
            </DialogTitle>
            <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.3)'}}>
                <TableContainer sx={{backgroundColor: 'rgb(0,0,0,0)'}} component={Paper}>
                    <Table  >
                        <TableHead>
                            <TableRow>
                                {days.map((day) => (
                                    <TableCell  key={day} align="center" sx={{ fontWeight: 'bold', backgroundColor: 'rgb(0,0,0,0.5)' }}>
                                        {day}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            <TableRow>
                                {days.map((day) => {
                                    const dayExercisePlans = week.days.filter(d => getDayName(d.plannedDate) === day);
                                    return (
                                        <TableCell sx={{backgroundColor: 'rgb(0,0,0,0.3)'}} key={day} align="center">
                                            {dayExercisePlans.flatMap((dayPlan) => (
                                                dayPlan.exercisePlans.map((exercisePlan) => {
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
                                                                backgroundColor: 'rgb(255,255,255,0.5)',
                                                                '&:hover': {
                                                                    backgroundColor: theme.palette.secondary.main,
                                                                },
                                                            }}
                                                            onClick={() => handleToggleExercisePlan(exercisePlan.id)}
                                                        >
                                                            <Typography variant="body1" sx={{ fontSize: '13px', fontWeight: 'bold', color: 'black' }}>
                                                                {i18n.language === 'pl' ? exercise.namePl : i18n.language === 'de' ? exercise.nameDe : exercise.name}
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
            </DialogContent>
            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.3)'}}>
                <Button onClick={() => setSelectedWeek(null)} color="primary">
                    {t('close')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ display: 'flex', }}>
            <CssBaseline />
            <Navigation title={t('title')} />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
                <Toolbar />



                <Fade in={true} timeout={1400}>
                <Container  maxWidth="xl" sx={{ mt: 10, mb: 1 , height: '100%', marginLeft: {md: "12%"} , flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                    {userRole === 'ROLE_USER' && (

                        <Grid container sx={{ gap: 1 }} alignItems="flex-start">
                            <Grid item xs={12} md={5} lg={5} >
                                {renderExpandableSection(myselfCreatedPlans, t('myselfCreatedPlans'), 'myselfCreatedPlans')}
                            </Grid>
                            <Grid item xs={12} md={5} lg={5} >
                                {renderExpandableSection(PlansFromTrainer, t('plansFromTrainer'), 'PlansFromTrainer')}
                            </Grid>
                            {access === true && (

                                <Grid item xs={12} md={5} lg={5} >
                                    {renderExpandableSection(PlansFromWorkoutPlans, t('plansWorkoutPlans'), 'PlansFromWorkoutPlans')}
                                </Grid>

                            )}

                            {access === false && (

                                <Grid item xs={12} md={5} lg={5} >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            backgroundColor: 'rgb(255,255,255,0.5)',
                                            transition: 'height 0.3s ease',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >

                                        <Typography variant="h6" sx={{flexGrow: 1}} gutterBottom>
                                            {t('plansWorkoutPlans')}
                                        </Typography>

                                        <Box
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                color: 'black',
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 0.5,
                                                mr: 3.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                height: '40px',
                                            }}
                                        >
                                            <Button
                                                fullWidth
                                                sx={{
                                                    minWidth: 0,
                                                    padding: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'black',
                                                }}
                                            >
                                                <LockIcon sx={{ fontSize: '20px' }} />
                                            </Button>
                                        </Box>

                                    </Paper>
                                </Grid>

                            )}



                            <Grid item xs={12} md={5} lg={5} >
                                {renderExpandableSection(PlansAi, t('plansAi'), 'PlansAi')}
                            </Grid>


                        </Grid>

                    )}

                    {userRole === 'ROLE_TRAINER' && (
                    <Grid container sx={{ gap: 1 }} alignItems="flex-start">
                        <Grid item xs={12} md={5} lg={5} >
                            {renderExpandableSection(myselfCreatedPlans, t('myselfCreatedPlans'), 'myselfCreatedPlans')}
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} >
                            {renderExpandableSection(trainingPlansForClient, t('trainingPlansForClient'), 'trainingPlansForClient', true)}
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} >
                            {renderExpandableSection(myTemplates, t('myTemplates'), 'myTemplates')}
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} >
                            {renderExpandableSection(PlansAi, t('plansAi'), 'PlansAi')}
                        </Grid>
                    </Grid>
                        )}
                </Container>
                </Fade>

                {selectedWeek && renderWeekDetails(selectedWeek)}

                <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('confirmDeleteMessage')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleDeletePlan} color="error">
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={planChecked} onClose={() => setPlanChecked(false)}>
                    <DialogTitle>{t('confirmPlanIsChecked')}</DialogTitle>

                    <DialogActions>
                        <Button onClick={() => setPlanChecked(false)} color="primary">
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleConfirmPlan} color="success">
                            {t('confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
};

export default withAuth(TrainingPlans);