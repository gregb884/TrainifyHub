import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    CssBaseline,
    CircularProgress,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import withAuth from '../../../../components/withAuth';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRouter } from 'next/router';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import i18n from "i18next";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const apiUrlAI = process.env.NEXT_PUBLIC_API_AI;
const apiUrlTrainingModule = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const Index = () => {
    const { t } = useTranslation('aiTrainingPlan');
    const router = useRouter();
    const { id } = router.query;
    const currentLanguage = i18n.language;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [rendering, setRendering] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [planData, setPlanData] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentExerciseId, setCurrentExerciseId] = useState(null);
    const open = Boolean(anchorEl);
    const [deviceOS, setDeviceOS] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [newStartDate, setNewStartDate] = useState(null);


    const handleStartDateSelection = async (date) => {
        const startDate = dayjs(date).startOf('week').add(1, 'day');
        setNewStartDate(startDate.format('YYYY-MM-DD'));

        setCalendarOpen(false);
    };

    useEffect(() => {
        const updateStartDate = async () => {
            if (!newStartDate) return;

            try {
                const token = getTokenFromCookies();
                const response = await axios.post(
                    `${apiUrlAI}/api/request/updateStartDate?date=${newStartDate}&id=${id}`,null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    console.log("newStartDate updated:", newStartDate);
                    await fetchData();
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while adding Start Date to the plan. Please try again.');
            }
        };

        updateStartDate();
    }, [newStartDate]);


    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            setDeviceOS("android");
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setDeviceOS("ios");
        } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
            setDeviceOS("macos");
        } else {
            setDeviceOS("other");
        }
    }, []);


    const fetchData = async () => {
        if (!id) return;
        try {
            const token = getTokenFromCookies();
            const response = await axios.get(`${apiUrlAI}/api/request/get?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            setRendering(response.data.isRendering);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        let interval = null;
        if (rendering && id) {
            interval = setInterval(async () => {
                try {
                    const token = getTokenFromCookies();
                    const response = await axios.get(`${apiUrlAI}/api/request/isRendering?id=${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setRendering(response.data);

                    if (!response.data) {
                        const dataResponse = await axios.get(`${apiUrlAI}/api/request/get?id=${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setData(dataResponse.data);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Error fetching rendering status:', error);
                }
            }, 10000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [rendering, id]);

    const handleConfirmClick = async () => {
        try {
            const token = getTokenFromCookies();
            setRendering(true);
            const response = await axios.post(`${apiUrlAI}/api/request/confirmCreate?id=${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchData();
            setPlanData(response.data);

        } catch (error) {
            console.error('Error confirming plan creation:', error);
        }
    };

    const handleConfirmAiPlan = async () => {
        try {
            const token = getTokenFromCookies();
            setRendering(true);
            setShowPlanModal(false);

            const response = await axios.post(`${apiUrlAI}/api/aiPlan/createPlanFromAiPlan?requestId=${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                router.push(`/trainingPlan/${response.data}`);
            } else {
                console.error('Unexpected response status:', response.status);
                alert('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error confirming plan creation:', error);
            alert('An error occurred while confirming the plan. Please try again.');
        } finally {
            setRendering(false);
        }
    };

    const handleGoToPlanClick = () => {
        router.push(`/trainingPlan/${data.generatedPlanId}`);
    };

    const handleShowPreliminaryPlanClick = async () => {
        try {
            const token = getTokenFromCookies();
            const response = await axios.get(`${apiUrlAI}/api/aiPlan/get?id=${data.aiPlanId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPlanData(response.data);

            const initialSelectedExercises = {};
            response.data.aiDays.forEach((day) => {
                day.aiExercises.forEach((exercise) => {
                    const selectedExercise = exercise.optionalExerciseList.find((opt) => opt.selected);
                    initialSelectedExercises[exercise.id] = selectedExercise.id;
                });
            });
            setSelectedExercises(initialSelectedExercises);

            setShowPlanModal(true);
        } catch (error) {
            console.error('Error fetching plan data:', error);
        }
    };

    const handleExerciseChange = async (aiExerciseId, optionalExerciseId) => {
        try {
            const token = getTokenFromCookies();

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_AI}/api/optionalExercise/setTrue?aiExerciseId=${aiExerciseId}&optionalExerciseId=${optionalExerciseId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedExercises((prevSelected) => ({
                ...prevSelected,
                [aiExerciseId]: optionalExerciseId,
            }));

            handleExerciseMenuClose();
        } catch (error) {
            console.error('Error changing exercise:', error);
        }
    };

    const handleExerciseMenuOpen = (event, exerciseId) => {
        setAnchorEl(event.currentTarget);
        setCurrentExerciseId(exerciseId);
    };

    const handleExerciseMenuClose = () => {
        setAnchorEl(null);
        setCurrentExerciseId(null);
    };

    const renderSummary = () => {
        if (!data) return null;

        const equipmentList = data.equipment ? data.equipment.split(',') : [];
        const translatedEquipment =
            equipmentList.length > 0 ? equipmentList.map((item) => t(`equipment.${item}`)).join(', ') : t('none');

        const planDescription = data.lastPlanDescription ? JSON.parse(data.lastPlanDescription) : null;
        const planName = planDescription?.planName;

        return (
            <Box
                sx={{
                    textAlign: 'left',
                    color: 'white',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                    maxWidth: '100%',
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('your_goal')}: {t(`goals.${data.goal}`) || t('unknown')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('experience_label')}: {t(`experience.${data.experience}`) || t('unknown')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('session_time')}: {data.sessionTime} min
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('excluded_equipment')}: {translatedEquipment}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('primary_Focus')}: {t(`primaryFocus.${data.primaryFocus}`)}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('preferences')}: {data.preferences || t('none')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '12px', md: '20px' }, color: 'inherit' }}>
                    {t('attached_plan')}: {planName || t('none')}
                </Typography>
            </Box>
        );
    };

    const getHighlightedDates = () => {
        if (!data?.startDate) return [];
        const startDate = dayjs(data.startDate);
        const dates = [];
        for (let i = 0; i < 28; i++) {
            dates.push(startDate.add(i, 'day').toDate());
        }
        return dates;
    };

    const renderExercises = (exercise) => {


        if (!exercise.optionalExerciseList || !selectedExercises[exercise.id]) {
            return null;
        }

        const mainExercise = exercise.optionalExerciseList.find(
            (opt) => opt.id === selectedExercises[exercise.id]
        );

        if (!mainExercise) {
            return null;
        }
        return (
            <ListItem key={exercise.id} sx={{color: 'white', alignItems: 'flex-start'}}>
                <IconButton
                    aria-label="change exercise"
                    onClick={(event) => handleExerciseMenuOpen(event, exercise.id)}
                    sx={{
                        backgroundColor: '#b4ca3f',
                        color: 'black',
                        marginLeft: '-30px',
                        ':hover': {color: 'white', backgroundColor: 'rgb(180,202,63,0.5)'},
                    }}
                >
                    <SwapHorizIcon/>
                </IconButton>
                <video
                    autoPlay
                    playsInline
                    loop
                    muted
                    src={deviceOS === "android" || deviceOS === "other"
                        ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmSd/${mainExercise.imageUrl}.webm`
                        : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${mainExercise.imageUrl}-high-low.mov`
                    }
                    alt={mainExercise.imageUrl}
                    style={{
                        width: '30%',
                        marginRight: '10px',
                        marginLeft: '10px',
                    }}
                />

                <ListItemText
                    primary={
                        <Typography style={{color: 'white', fontSize: '13px', marginBottom: '10px'}}>
                            {currentLanguage === 'pl'
                                ? mainExercise.namePl
                                : currentLanguage === 'de'
                                    ? mainExercise.nameDe
                                    : mainExercise.name}
                        </Typography>
                    }
                    secondary={
                        <Typography style={{fontSize: '12px', color: 'white'}}>
                            {t('repetitions')}: {exercise.repetitions} &nbsp;
                            {t('series')}: {exercise.plannedSeries} &nbsp;
                            {t('rest')}: {exercise.rest} {t('sec')}
                        </Typography>
                    }
                />
            </ListItem>
        );
    };

    const renderMenu = () => {
        if (!currentExerciseId) return null;

        const currentExercise = planData?.aiDays
            .flatMap((day) => day.aiExercises)
            .find((exercise) => exercise.id === currentExerciseId);

        return (
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleExerciseMenuClose}
                PaperProps={{
                    style: {maxHeight: 200, width: '250px', backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white'},
                }}
            >
                {currentExercise.optionalExerciseList.map((optExercise) => (
                    <MenuItem
                        key={optExercise.id}
                        onClick={() => handleExerciseChange(currentExerciseId, optExercise.id)}
                        sx={{
                            color: 'white',
                            fontSize: '12px',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            ':hover': {
                                color: 'white',
                                backgroundColor: 'rgb(180,202,63,0.5)',
                            },
                        }}
                    >
                        {currentLanguage === 'pl'
                            ? optExercise.namePl
                            : currentLanguage === 'de'
                                ? optExercise.nameDe
                                : optExercise.name}
                    </MenuItem>
                ))}
            </Menu>
        );
    };

    const getTokenFromCookies = () => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        return token || '';
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('aiPlansTitle')} />

            <Container
                maxWidth="lg"
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '24px',
                    borderRadius: '16px',
                    mt: 8,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 2,
                            fontSize: { md: '24px', xs: '12px' },
                        }}
                    >
                        {loading ? <CircularProgress /> : renderSummary()}
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        {rendering ? (
                            <>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'white',
                                        marginBottom: '20px',
                                    }}
                                >
                                    {t('plan_is_being_generated')}
                                </Typography>
                                <CircularProgress size={80} sx={{ color: '#b4ca3f' }} />
                            </>
                        ) : data?.startDate === null ? (

                            <Box>
                            <Button variant="contained" color="primary"  onClick={() => setCalendarOpen(true)} >
                                {t('set_start_data')}
                            </Button>

                            </Box>

                        ) : data?.aiPlanId && data?.generatedPlanId !== 0 ? (
                            <Button variant="contained" color="primary" onClick={handleGoToPlanClick}>
                                {t('go_to_training_plan')}
                            </Button>
                        ) : data?.aiPlanId === 0 ? (
                            <Button variant="contained" color="primary" onClick={handleConfirmClick}>
                                {t('confirm_and_create_plan')}
                            </Button>

                        ) : (
                            <Button variant="contained" color="primary" onClick={handleShowPreliminaryPlanClick}>
                                {t('show_preliminary_plan')}
                            </Button>
                        )}
                    </Box>
                </Box>

                {calendarOpen && (
                    <Box sx={{ backgroundColor: 'transparent', padding: 2, borderRadius: 2 }}>
                        <Calendar
                            onClickWeekNumber={(weekNumber, date) => handleStartDateSelection(date)}
                            showFixedNumberOfWeeks
                            selectRange={false}
                            showWeekNumbers
                            tileDisabled={({ activeStartDate, date, view }) => view === 'month'}
                        />

                        <Typography variant={"h6"} sx={{color: 'white'}}>
                            <ArrowUpwardIcon sx={{
                                marginLeft: '4.5%',
                                '@media (max-width: 800px)': {
                                    marginLeft: '2%',
                                }
                            }} />
                            {t('selectWeek')}
                        </Typography>
                    </Box>
                )}
            </Container>



            {!loading && data?.startDate && (
                <Container
                    maxWidth="lg"
                    sx={{
                        mt: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        padding: '16px',
                        borderRadius: '16px',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        {t('plan_range')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Calendar
                            value={new Date(data.startDate)}
                            showDoubleView={true}
                            selectRange={false}
                            activeStartDate={new Date(data.startDate)}
                            tileClassName={({ date, view }) => {
                                if (
                                    view === 'month' &&
                                    getHighlightedDates().some((highlightedDate) => dayjs(highlightedDate).isSame(date, 'day'))
                                ) {
                                    return 'highlight';
                                }
                                return null;
                            }}
                        />
                    </Box>
                </Container>
            )}



            <Dialog
                open={showPlanModal}
                onClose={() => setShowPlanModal(false)}
                PaperProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' },
                }}
            >
                {planData && (
                    <DialogContent>
                        <Typography variant="h6" sx={{ fontSize: '17px', color: 'white' }} gutterBottom>
                            {planData.planName}
                        </Typography>
                        <Typography variant="h5" sx={{ fontSize: '15px', color: 'white' }} gutterBottom>
                            {planData.description}
                        </Typography>

                        <Typography variant="h6" sx={{ color: 'white', marginBottom: '20px' }} gutterBottom>
                            {t(`confirmOrChangeExercise`)}
                        </Typography>

                        {planData.aiDays.map((day) => (
                            <Box key={day.id} sx={{ mt: 4 }}>
                                <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>
                                    {t(`dayNr.${day.dayName}`)}
                                </Typography>

                                <List>
                                    {day.aiExercises.map((exercise) => renderExercises(exercise))}
                                </List>
                            </Box>
                        ))}
                    </DialogContent>
                )}

                <Button variant="contained" color="primary" onClick={handleConfirmAiPlan}>
                    {t('acceptPlan')}
                </Button>
            </Dialog>

            {renderMenu()}

            {data?.startDate && (
                <style jsx global>{`
        .highlight {
            background-color: #b4ca3f !important;
            color: white !important;
        }
        .react-calendar,
        .react-calendar * {
            pointer-events: none;
        }
        .react-calendar {
            margin: 0 auto;
        }
    `}</style>
            )}
        </Box>
    );
};

export default withAuth(Index);