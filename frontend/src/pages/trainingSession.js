import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Toolbar,
    Grid,
    IconButton,
    Divider, useMediaQuery, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import i18n from "i18next";
import '../app/globals.css';
import CustomPicker from "@/components/customPicker";
import Fade from '@mui/material/Fade';



const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;
const imageUrl = process.env.NEXT_PUBLIC_API_PROFILE;
const statisticUrl = process.env.NEXT_PUBLIC_API_STATISTIC;

const TrainingSession = () => {
    const { t } = useTranslation('trainingSession');
    const router = useRouter();
    const { dayId } = router.query;
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [day, setDay] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);
    const [editingSeriesIndex, setEditingSeriesIndex] = useState(null);
    const [completedExercises, setCompletedExercises] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentLanguage = i18n.language;
    const [selectedRepetitions, setSelectedRepetitions] = useState(10); // Wartość wybrana w pickerze
    const [selectedWeight, setSelectedWeight] = useState(20);
    const [openDialog, setOpenDialog] = useState(false);
    const [seriesToEdit, setSeriesToEdit] = useState(null);
    const [dialogAction, setDialogAction] = useState(null);
    const [oneRepMax, setOneRepMax] = useState(null);
    const [showOneRepMax, setShowOneRepMax] = useState(false);
    const [videoExistenceMap, setVideoExistenceMap] = useState({});
    const [deviceOS, setDeviceOS] = useState("");
    const [contentReady, setContentReady] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

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

    useEffect(() => {
        if (!loading && day) {
            setContentReady(true);

            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [loading, day]);



    useEffect(() => {
        const fetchDayData = async () => {
            if (!dayId) {
                console.error(t('dayIdError'));
                setLoading(false);
                return;
            }

            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/day/get?id=${dayId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setDay(response.data);
                    fetchOneRepMax(response.data.exercisePlans[0]?.exercise?.id);
                } else {
                    console.error(t('fetchDayError'), response.status);
                }
            } catch (error) {
                console.error(t('fetchDayError'), error);
            } finally {
                setLoading(false);
            }
        };

        fetchDayData();
    }, [dayId, t]);

    const fetchOneRepMax = async (exerciseId) => {
        if (!exerciseId) return;

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${statisticUrl}/api/stats/get1Rm?exerciseId=${exerciseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setOneRepMax(response.data);
            } else {
                setOneRepMax(null);
            }
        } catch (error) {
            console.error("Error fetching 1RM:", error);
        }
    };

    const handleIconClick = () => {
        if (!oneRepMax) {
            fetchOneRepMax(currentExercise?.exercise?.id);
        }
        setShowOneRepMax(!showOneRepMax);
    };


    const currentExercise = day?.exercisePlans?.[currentExerciseIndex];

    useEffect(() => {
        if (currentExercise) {
            const initialData = currentExercise.exerciseSeries.map(series => ({
                totalRepetitions: series.totalRepetitions || 0,
                totalWeight: series.totalWeight || 0,
                additionalInfo: series.additionalInfo || '',
            }));
            setExerciseData(initialData);
            setEditingSeriesIndex(0); // Start editing the first series

            setSelectedRepetitions(currentExercise.plannedRepetitions || 10);
            setSelectedWeight(currentExercise.plannedWeight || 20);
            fetchOneRepMax(currentExercise.exercise?.id);
        }
    }, [currentExercise]);

    const handleSaveSeries = async () => {
        if (!currentExercise) return;

        try {
            setLoading(true);
            const series = currentExercise.exerciseSeries[editingSeriesIndex];

            const updatedSeriesData = {
                totalRepetitions: selectedRepetitions,
                totalWeight: selectedWeight,
                additionalInfo: exerciseData[editingSeriesIndex]?.additionalInfo || '',
            };

            await axios.post(`${apiUrl}/api/exerciseSeries/edit?id=${series.id}`, updatedSeriesData, {
                headers: {
                    Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]}`,
                },
            });

            const updatedExerciseData = [...exerciseData];
            updatedExerciseData[editingSeriesIndex] = updatedSeriesData;
            setExerciseData(updatedExerciseData);

            if (editingSeriesIndex < currentExercise.exerciseSeries.length - 1) {
                setEditingSeriesIndex(editingSeriesIndex + 1); // Przejdź do następnej serii
            } else {
                setCompletedExercises([...completedExercises, { ...currentExercise, series: exerciseData }]);

                if (currentExerciseIndex < day.exercisePlans.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1);
                    setEditingSeriesIndex(0);
                    setExerciseData([]);
                } else {
                    setCurrentExerciseIndex(-1);
                }
            }

            await fetchOneRepMax(currentExercise.exercise?.id);
        } catch (error) {
            console.error(t('updateSeriesError'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleFinishSession = async () => {

        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        await axios.post(`${apiUrl}/api/day/done?id=${dayId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        router.push('/trainingPlans');


    }

    const handleBackToPreviousExercise = async () => {
        if (currentExerciseIndex > 0) {
            const previousExerciseIndex = currentExerciseIndex - 1;


            setCurrentExerciseIndex(previousExerciseIndex);

            try {
                setLoading(true);
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/day/get?id=${dayId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const updatedDay = response.data;
                    setDay(updatedDay);
                    const previousExercise = updatedDay.exercisePlans[previousExerciseIndex];

                    const updatedSeriesData = previousExercise.exerciseSeries.map(series => ({
                        totalRepetitions: series.totalRepetitions || 0,
                        totalWeight: series.totalWeight || 0,
                        additionalInfo: series.additionalInfo || '',
                    }));

                    setExerciseData(updatedSeriesData);
                    setEditingSeriesIndex(previousExercise.exerciseSeries.length - 1); // Ustaw edytowaną serię na ostatnią
                } else {
                    console.error('Failed to fetch updated data for previous exercise:', response.status);
                }
            } catch (error) {
                console.error('Error fetching previous exercise data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const [videoExists, setVideoExists] = useState(false);

    useEffect(() => {
        const checkVideoExists = async () => {
            if (currentExercise && currentExercise.exercise) {
                const videoUrl = `${imageUrl}/uploads/movHd/${currentExercise.exercise.imageUrl}-high.mov`;

                try {
                    const response = await fetch(videoUrl, { method: 'HEAD' });

                    console.log(response);
                    if (response.ok) {
                        setVideoExists(true);
                    } else {
                        setVideoExists(false);
                    }
                } catch (error) {
                    console.error("Error checking video existence:", error);
                    setVideoExists(false);
                }
            }
        };

        checkVideoExists();
    }, [currentExercise]);


    const handleSeriesClick = (index) => {
        if (index > editingSeriesIndex) {

            setDialogAction('next');
        } else if (index < editingSeriesIndex) {

            setDialogAction('previous');
            setSeriesToEdit(index);
        }
        setOpenDialog(true);
    };


    const handleConfirmNextSeries = async () => {
        if (!currentExercise) return;

        try {
            setLoading(true);
            const series = currentExercise.exerciseSeries[editingSeriesIndex];

            const updatedSeriesData = {
                totalRepetitions: selectedRepetitions,
                totalWeight: selectedWeight,
                additionalInfo: exerciseData[editingSeriesIndex]?.additionalInfo || '',
            };

            await axios.post(`${apiUrl}/api/exerciseSeries/edit?id=${series.id}`, updatedSeriesData, {
                headers: {
                    Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]}`,
                },
            });

            const updatedExerciseData = [...exerciseData];
            updatedExerciseData[editingSeriesIndex] = updatedSeriesData;
            setExerciseData(updatedExerciseData);

            setEditingSeriesIndex(editingSeriesIndex + 1);
            setOpenDialog(false);
        } catch (error) {
            console.error(t('updateSeriesError'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPreviousSeries = () => {
        setEditingSeriesIndex(seriesToEdit);
        setOpenDialog(false);
    };


    const checkVideoExistence = async (exercise) => {
        if (!exercise || !exercise.imageUrl) return false;
        const videoUrl = `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movHd/${exercise.imageUrl}-high.mov`;

        try {
            const response = await fetch(videoUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error("Error checking video existence:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchVideoExistenceForExercises = async () => {
            let videoMap = {};

            if (currentExercise) {
                videoMap[currentExercise.exercise.id] = await checkVideoExistence(currentExercise.exercise);
            }

            for (const exercise of completedExercises) {
                if (exercise.exercise) {
                    videoMap[exercise.exercise.id] = await checkVideoExistence(exercise.exercise);
                }
            }

            setVideoExistenceMap(videoMap);
        };

        fetchVideoExistenceForExercises();
    }, [currentExercise, completedExercises]);




    if ((currentExerciseIndex === -1 && completedExercises.length === 0)) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    {t('noExercises')}
                </Typography>
            </Box>
        );
    }

    if (!contentReady || !contentVisible) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
                }}
            >
                <Navigation
                    smallText={true}
                    title={
                        currentExercise
                            ? currentLanguage === 'pl'
                                ? currentExercise.exercise.namePl
                                : currentLanguage === 'de'
                                    ? currentExercise.exercise.nameDe
                                    : currentExercise.exercise.name
                            : t('trainingFinished')
                    }
                />
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation
                smallText={true}
                title={
                    currentExercise
                        ? currentLanguage === 'pl'
                            ? currentExercise.exercise.namePl
                            : currentLanguage === 'de'
                                ? currentExercise.exercise.nameDe
                                : currentExercise.exercise.name
                        : t('trainingFinished')
                }
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    opacity: contentVisible ? 1 : 0,
                    transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
            >
                <Toolbar />
                <Container component="main" maxWidth="sm" sx={{ mt: 1, mb: 0 }}>
                    {currentExerciseIndex !== -1 ? (
                        currentExercise ? (
                            <>

                            <Fade in={true} timeout={1400}>
                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '16 / 9',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: 'transparent',
                                    mb: 2
                                }}
                            >
                                {videoExistenceMap[currentExercise?.exercise?.id] ? (
                                    <video autoPlay loop muted playsInline
                                           style={{ width: '100%', marginBottom: '10px', borderRadius: '8px' }}>
                                        <source
                                            src={deviceOS === "android" || deviceOS === "other"
                                                ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmHd/${currentExercise.exercise.imageUrl}.webm`
                                                : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movHd/${currentExercise.exercise.imageUrl}-high.mov`
                                            }
                                            type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={currentExercise.exercise.imageUrl || '/defaultExercise.png'} // Sprawdzenie, czy URL istnieje
                                        alt="Exercise GIF"
                                        style={{width: '100%', marginBottom: '10px', borderRadius: '8px'}}
                                        onError={(e) => {
                                            e.target.onerror = null; // Zapobiega nieskończonej pętli
                                            e.target.src = '/defaultExercise.png'; // Ustawia standardowy obrazek
                                        }}
                                    />
                                )}
                            </Box>
                            </Fade>
                                {currentExercise.plannedWeight === 0 && (
                                    <Typography variant="body1" align="center" sx={{color: 'white', mb: 1}}>
                                        {t('plannedDetailsNoWeight', {
                                            reps: currentExercise.plannedRepetitions,
                                            weight: currentExercise.plannedWeight
                                        })}
                                    </Typography>
                                )}
                                {currentExercise.plannedWeight !== 0 && (
                                    <Typography variant="body1" align="center" sx={{color: 'white', mb: 0}}>
                                        {t('plannedDetails', {
                                            reps: currentExercise.plannedRepetitions,
                                            weight: currentExercise.plannedWeight
                                        })}

                                    </Typography>
                                )}

                                <Typography variant="h6" align="center" sx={{color: 'white', mb: 2}}>
                                    {t('series')} {editingSeriesIndex + 1}
                                </Typography>
                                <Grid container spacing={2} justifyContent="center">
                                    {exerciseData.map((series, index) => (
                                        <Grid item key={index}>
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    display: 'flex',
                                                    backgroundColor: theme.palette.primary.main,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 1,
                                                    cursor: 'pointer',
                                                    border: index === editingSeriesIndex ? '5px solid white' : '2px solid transparent',
                                                }}
                                                onClick={() => handleSeriesClick(index)}
                                            >
                                                <Typography sx={{textAlign: 'center'}}>
                                                    {series.totalRepetitions}x<br/>{series.totalWeight} kg
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Dialog
                                    open={openDialog}
                                    onClose={() => setOpenDialog(false)}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#1e1e1e',
                                            color: '#fff',
                                            borderRadius: '20px'
                                        }
                                    }}
                                >
                                    <DialogTitle id="alert-dialog-title" sx={{ color: '#ffffff' }}>
                                        {dialogAction === 'next' ? t('confirmNextSeriesTitle') : t('confirmPreviousSeriesTitle')}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description" sx={{ color: '#fff' }}>
                                            {dialogAction === 'next'
                                                ? t('confirmNextSeries')
                                                : t('confirmPreviousSeries')}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDialog(false)} sx={{ color: '#ffcc00' }}>
                                            {t('cancel')}  {/* Przycisk anulowania */}
                                        </Button>
                                        {dialogAction === 'next' ? (
                                            <Button onClick={handleConfirmNextSeries} sx={{ color: '#00cc66' }} autoFocus>
                                                {t('confirmNext')}  {/* Potwierdzenie dla następnej serii */}
                                            </Button>
                                        ) : (
                                            <Button onClick={handleConfirmPreviousSeries} sx={{ color: '#00cc66' }} autoFocus>
                                                {t('confirmPrevious')}  {/* Potwierdzenie dla cofnięcia się */}
                                            </Button>
                                        )}
                                    </DialogActions>
                                </Dialog>
                                {editingSeriesIndex !== null && (
                                    <Grid container spacing={0}  justifyContent="center" alignItems="center">

                                        <Grid item sx={{marginLeft: '-72px'}}>
                                            <Box display="flex" flexDirection="column" alignItems="center" onClick={handleIconClick} sx={{marginRight: '-15px', cursor: 'pointer', textAlign: 'center' }}>
                                                <Box component="img" src="/1RMImageNoBack.png" alt="OneRepMax logo" sx={{ width: '58px', height: 'auto',marginRight: '10px' }} />
                                                {showOneRepMax && oneRepMax !== null && (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#000',
                                                            position: 'absolute',
                                                            borderRadius: '8px',
                                                            padding: '4px 8px',
                                                            color: '#fff',
                                                            fontSize: '0.875rem',
                                                            maxWidth: '150px',
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'normal',
                                                        }}
                                                    >
                                                        {t('oneRepMax')} {oneRepMax.toFixed(1)} kg
                                                    </Box>
                                                )}

                                                {showOneRepMax && oneRepMax === null && (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#000',
                                                            position: 'absolute',
                                                            borderRadius: '8px',
                                                            padding: '4px 8px',
                                                            color: '#fff',
                                                            fontSize: '0.875rem',
                                                            maxWidth: '150px',
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'normal',
                                                        }}
                                                    >
                                                        {t('missingOneRepMax')}
                                                    </Box>
                                                )}

                                            </Box>
                                        </Grid>

                                        <Grid sx={{ marginTop: '-10px' }}>
                                            <CustomPicker
                                                initialRepetitions={currentExercise?.plannedRepetitions - 1 || 10}
                                                initialWeight={currentExercise?.plannedWeight - 1 || 20}
                                                onRepetitionsChange={setSelectedRepetitions}
                                                onWeightChange={setSelectedWeight}
                                            />
                                        </Grid>

                                        <Grid sx={{marginTop: '-20px', width: '100%'}}>
                                            {currentExerciseIndex < day.exercisePlans.length - 1 && (
                                                <Typography sx={{fontSize: '12px',textAlign: 'center', color: 'white', ml: 2 }}>
                                                    {t('nextExercise')}:{' '}
                                                    {currentLanguage === 'pl'
                                                        ? day.exercisePlans[currentExerciseIndex + 1].exercise.namePl
                                                        : currentLanguage === 'de'
                                                            ? day.exercisePlans[currentExerciseIndex + 1].exercise.nameDe
                                                            : day.exercisePlans[currentExerciseIndex + 1].exercise.name}
                                                </Typography>
                                            )}

                                            {currentExerciseIndex === day.exercisePlans.length - 1 && (
                                            <Typography sx={{fontSize: '12px',textAlign: 'center', marginTop: '-20px', color: 'white', ml: 2 }}>
                                                {t('lastExercise')}
                                            </Typography>
                                                )}


                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={handleSaveSeries}
                                                sx={{ mt: 2 }}
                                            >
                                                {editingSeriesIndex < currentExercise.exerciseSeries.length - 1 ? t('saveAndNextSeries') : t('saveAndNextExercise')}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                )}
                                {currentExerciseIndex > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<ArrowBackIcon/>}
                                        fullWidth
                                        onClick={handleBackToPreviousExercise}
                                        sx={{mt: 2}}
                                    >
                                        {t('backToPreviousExercise')}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Box
                                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                                <Typography variant="h6" color="error">
                                    {t('noExercises')}
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <Box>
                            <Typography component="h1" variant="h5" align="center" sx={{color: 'white', mb: 4 }}>
                                {t('trainingFinished')}
                            </Typography>
                            <Divider sx={{ mb: 4 }} />
                            {completedExercises.map((exercise, exerciseIndex) => (
                                <Grid container key={exerciseIndex} spacing={4} alignItems="center" sx={{ mb: 4 }}>
                                    <Grid item xs={4} sx={{ pr: 2, marginTop: {md: '10px', xs: '25px'} }}>
                                        <Typography align="center" sx={{fontSize: '12px',position: 'relative',transform: {md: 'translate(0px, -25px)', xs: 'translate(0px, -10px)'},color: 'white'}}>{exercise.exercise.namePl}</Typography>
                                        {videoExistenceMap[exercise.exercise.id] ? (
                                            <video autoPlay loop muted playsInline
                                                   style={{ width: '100%', borderRadius: '8px' }}>
                                                <source
                                                    src={`${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${exercise.exercise.imageUrl}-high-low.mov`}
                                                    type="video/mp4" />
                                            </video>
                                        ) : (

                                            <img
                                                src={exercise.exercise.imageUrl || '/defaultExercise.png'}
                                                alt="Exercise GIF"
                                                style={{width: '100%', marginBottom: '10px', borderRadius: '8px'}}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/defaultExercise.png';
                                                }}
                                            />

                                    )}
                                </Grid>
                                <Grid item xs={8}>
                            <Grid container spacing={2} justifyContent="flex-start">
                                {exercise.series.map((series, seriesIndex) => (
                                                <Grid item key={seriesIndex}>
                                                    <Box
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: 1,
                                                            backgroundColor: theme.palette.primary.main,
                                                            marginTop: {md: '10px', xs: '25px'}
                                                        }}
                                                    >
                                                        <Typography sx={{ color: 'black', textAlign: 'center' }}>
                                                            {series.totalRepetitions}x<br />{series.totalWeight} kg
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleFinishSession}
                                sx={{ mt: 4 }}
                            >
                                {t('backToTrainingPlan')}
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(TrainingSession);