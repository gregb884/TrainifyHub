import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import {
    Box,
    Container,
    Typography,
    CssBaseline,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../../../../components/withAuth';
import BodyModel from '@/components/bodyModel';
import { keyframes } from '@emotion/react';
import i18n from "i18next";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditIcon from "@mui/icons-material/Edit";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Fade from '@mui/material/Fade';

dayjs.extend(isoWeek);

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const Index = () => {
    const { t } = useTranslation('workoutId');
    const router = useRouter();
    const { planId } = router.query;
    const [highlightedMuscles, setHighlightedMuscles] = useState([]);
    const [muscles, setMuscles] = useState([]);
    const [workoutPlan, setWorkoutPlan] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [weekDaysSelected, setWeekDaysSelected] = useState([]);
    const [daysError, setDaysError] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const currentLanguage = i18n.language;
    const [access , setAccess] = useState(false);
    const [renew, setRenew] = useState(false);

    const daysOfWeek = [
        t('monday'),
        t('tuesday'),
        t('wednesday'),
        t('thursday'),
        t('friday'),
        t('saturday'),
        t('sunday'),
    ];




    const handleNavigateToStore = async () => {
        await router.push('/store');
    };


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
                setRenew(false);
            }
            else {
                setAccess(false);
                setRenew(false);
            }
        } catch (error) {
            if (error.response && (error.response.status === 400 || error.response.status === 404) && error.response.data === "Access denied") {
                setAccess(false);
            } else if (error.response && (error.response.status === 400 || error.response.status === 404) && error.response.data === "Access check") {
                setAccess(false);
                setRenew(true);
            }

            else {
                console.error('Error fetching Access data:', error);
            }
        }
    };

    useEffect(() => {
        const tokenCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        if (!token) {
            console.error('Missing Auth Token.');
            return;
        }

        if (planId) {
            fetch(`${apiUrl}/api/workoutPlans/getPlan?id=${planId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Dodajemy token w nagłówku
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Błąd HTTP! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setWorkoutPlan(data);
                    setMuscles(data.muscles);
                    setHighlightedMuscles(data.muscles.split(','));
                })
                .catch((error) => {

                });


            checkAccess();
        }
    }, [planId]);

    const glow = keyframes`
  from {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1);
  }
`;





    const parseDescription = (text) => {
        const elements = [];
        let currentIndex = 0;


        const sections = text.split('%%');

        sections.forEach((section, idx) => {
            if (idx % 2 === 0) {

                const paragraphs = section.split('##').map((p) => p.trim()).filter((p) => p);

                paragraphs.forEach((paragraph) => {

                    const boldRegex = /::(.*?)::/g;
                    const normalText = paragraph.replace(boldRegex, '').trim();
                    const boldMatches = paragraph.match(boldRegex);


                    if (boldMatches) {
                        boldMatches.forEach((boldText, index) => {
                            elements.push(
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', marginTop: 2 }}
                                    color="inherit"
                                    key={`bold-${currentIndex}-${index}`}
                                >
                                    {boldText.replace(/::/g, '').trim()}
                                </Typography>
                            );
                        });
                    }


                    if (normalText) {
                        elements.push(
                            <Typography
                                variant="body1"
                                sx={{ marginBottom: 2 }}
                                color="inherit"
                                key={`normal-${currentIndex}`}
                            >
                                {normalText}
                            </Typography>
                        );
                    }

                    currentIndex++;
                });
            } else {

                const days = section.split('##').map((d) => d.trim()).filter((d) => d);


                const dayObjects = [];
                for (let i = 0; i < days.length; i += 2) {
                    const dayName = days[i];
                    const dayDescription = days[i + 1] || '';
                    dayObjects.push({ dayName, dayDescription });
                }


                elements.push(
                    <Grid container spacing={2} sx={{ marginTop: 2 }} key={`days-${currentIndex}`}>
                        {dayObjects.map((day, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', marginBottom: 1 }}
                                        color="inherit"
                                    >
                                        {day.dayName}
                                    </Typography>
                                    <Typography variant="body1" color="inherit">
                                        {day.dayDescription}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                );

                currentIndex++;
            }
        });

        return elements;
    };


    const handleAddPlan = () => {
        setDialogOpen(true);
    };


    const handleWeekSelectForCreate = (weekNumber, date) => {
        setSelectedStartDate(dayjs(date).format('YYYY-MM-DD'));
        setSelectedWeek(weekNumber);
    };


    const handleDayToggle = (dayIndex) => {
        const currentIndex = weekDaysSelected.indexOf(dayIndex);
        const newSelectedDays = [...weekDaysSelected];

        if (currentIndex === -1) {
            newSelectedDays.push(dayIndex);
        } else {
            newSelectedDays.splice(currentIndex, 1);
        }

        setWeekDaysSelected(newSelectedDays);

        if (workoutPlan && newSelectedDays.length === (workoutPlan.trainingDaysCount || 0)) {
            setDaysError(false);
        } else {
            setDaysError(true);
        }
    };


    const handlePlanAssign = async () => {
        if (!workoutPlan) {
            console.error('Training Plan is not available');
            return;
        }

        if (!selectedStartDate) {
            console.error('Start date not selected');
            return;
        }

        if (weekDaysSelected.length !== (workoutPlan.trainingDaysCount || 0)) {
            setDaysError(true);
            return;
        }

        const body = {
            startDate: selectedStartDate,
            weekDay: weekDaysSelected,
        };

        try {
            const tokenCookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            const response = await axios.post(
                `${apiUrl}/api/trainingPlan/assignPlanFromWorkoutPlans`,
                body,
                {
                    params: {
                        planId: workoutPlan.planId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newPlanId = response.data;

            await router.push(`/trainingPlan/${newPlanId}`);
        } catch (error) {
            console.error('Błąd podczas przypisywania planu:', error);
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-25%',
                    left: 0,
                    width: '100%',
                    height: '140%',
                    backgroundImage: `${workoutPlan.imageUrl}`,
                    backgroundRepeat: 'no-repeat',
                    zIndex: -2,
                    '@media (max-width:800px)': {
                        backgroundSize: 'fill',
                        backgroundPosition: 'center top',
                    },
                    '@media (min-width:801px)': {
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    },
                },

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // przezroczysta ciemna warstwa
                    backdropFilter: 'blur(5px)',           // lekki blur
                    zIndex: -1,
                },
            }}
        >
            <CssBaseline />
            <Navigation title={t('workoutPlansTitle')} />

            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: 'white', textAlign: 'center', mt: 10 }}
            >
                {currentLanguage === 'pl' ? workoutPlan.titlePl : currentLanguage === 'de' ? workoutPlan.titleDe : workoutPlan.title }
            </Typography>

            {access === true && (

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
                        onClick={() => {handleAddPlan()}}
                        sx={{
                            minWidth: 'auto',
                            width: '80px',
                            height: '80px',
                            animation: `${glow} 1s infinite alternate`,
                        }}
                    >
                        <PlaylistAddIcon sx={{ fontSize: '48px'}} />
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
                        {t('addPlan')}
                    </Typography>
                </Box>


            )}

            {access === false && renew === false && (

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
                        {t('buyAccess')}
                    </Typography>
                </Box>
            )}

            {access === false && renew === true && (

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
                        <AutorenewIcon sx={{ fontSize: '48px'}} />
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
                        {t('renewAccess')}
                    </Typography>
                </Box>
            )}


            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    mt: { xs: 10,lg: 2},
                }}
            >
                <Fade in={true} timeout={1400}>
                <Container sx={{marginRight: 0}} maxWidth="1200px">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                lg: 'row',
                            },
                            alignItems: 'flex-start',
                        }}
                    >
                        {/* Kolumna z opisem planu */}
                        <Box
                            sx={{
                                marginTop: {
                                    xs: '-100px',
                                    lg: '0',
                                },
                                marginRight: { lg: '200px'},
                                position: 'relative',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: {
                                    xs: '100%',
                                    lg: '80%',
                                },
                                maxHeight: {
                                    lg: '80vh',
                                },
                                overflowY: {
                                    lg: 'auto',
                                },
                            }}
                        >

                            <Box
                                sx={{
                                    position: 'relative',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: 2,
                                    zIndex: 2,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {workoutPlan &&
                                    workoutPlan.description &&
                                    parseDescription(
                                        currentLanguage === 'pl'
                                            ? workoutPlan.descriptionPl
                                            : currentLanguage === 'de'
                                                ? workoutPlan.descriptionDe
                                                : workoutPlan.description
                                    )}
                            </Box>
                        </Box>

                        {/* Kolumna z modelem ciała */}
                        <Box
                            sx={{
                                width: {
                                    xs: '100%',
                                    lg: '30%',
                                },
                                height: {
                                    lg: '700px',
                                },
                                position: {
                                    xs: 'static',
                                    lg: 'sticky',
                                },
                                top: 100,
                                alignSelf: 'flex-start',
                                ml: { lg: 2 },
                                mt: { xs: 4, lg: 0 },
                            }}
                        >

                            <BodyModel highlightedMuscles={highlightedMuscles} />
                        </Box>


                    </Box>
                </Container>
                </Fade>
            </Box>

            {/* Dialog z kalendarzem i wyborem dni treningowych */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        backgroundColor: 'rgb(0,0,0,0.7)',
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white' }}>{t('assignPlan')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex' ,flexDirection: 'column', alignItems: 'center' }}>

                        <Typography variant="h6" sx={{ color: 'white' }}>{t('selectStartDate')}</Typography>
                        <Calendar
                            onClickWeekNumber={(weekNumber, date) =>
                                handleWeekSelectForCreate(weekNumber, date)
                            }
                            showFixedNumberOfWeeks
                            selectRange={false}
                            showWeekNumbers
                            tileDisabled={({ activeStartDate, date, view }) => view === 'month'}
                            tileClassName={({ date }) => {
                                const currentWeek = dayjs(date).isoWeek();
                                return selectedWeek === currentWeek ? 'react-calendar__tile--active' : '';
                            }}
                            view="month"
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '3%',
                                marginLeft: {md: '8%', xs: '7%'},
                                width: '100%',
                            }}
                        >
                            <ArrowUpwardIcon sx={{
                                color: 'white',
                                marginRight: '8px',
                            }} />
                            <Typography variant="h6" sx={{ color: 'white' }}>
                                {t('selectWeek')}
                            </Typography>
                        </Box>


                        {selectedStartDate && (
                            <>
                                <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                                    {t('selectTrainingDays')} ({workoutPlan?.trainingDaysCount || 0})
                                </Typography>
                                <Grid container spacing={2}>
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                                        <Grid item key={dayIndex}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={weekDaysSelected.includes(dayIndex)}
                                                        onChange={() => handleDayToggle(dayIndex)}
                                                        sx={{ color: 'white' }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'white' }}>{t(daysOfWeek[dayIndex])}</Typography>}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                {daysError && (
                                    <Typography color="error">
                                        {t('selectDays')} {workoutPlan?.trainingDaysCount || 0} dni.
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        {t('cancel')}
                    </Button>
                    <Button
                        onClick={handlePlanAssign}
                        color="primary"
                        disabled={
                            weekDaysSelected.length !== (workoutPlan?.trainingDaysCount || 0)
                        }
                    >
                        {t('assign')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar z komunikatem sukcesu */}
            <Snackbar
                open={successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSuccessMessage(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {t('planSuccess')}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default withAuth(Index);