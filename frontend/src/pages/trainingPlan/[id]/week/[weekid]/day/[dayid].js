import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    ListItemAvatar,
    Avatar,
    IconButton,
    Collapse,
    Checkbox,
    FormControlLabel,
    InputLabel,
    Select,
    FormControl,
    MenuItem, CardMedia
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/router';
import withAuth from "@/components/withAuth";
import { Delete as DeleteIcon, ExpandLess, ExpandMore } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import {getUserId, getUserLang} from "@/utils/jwtDecode";
import BodyModel from '@/components/bodyModel';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import i18n from "i18next";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const DayDetails = () => {
    const { t, i18n } = useTranslation('dayDetails');
    const [day, setDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: '',
        namePl: '',
        nameDe: '',
        description: '',
        descriptionPl: '',
        descriptionDe: '',
        imageUrl: '',
        videoUrl: '',
        videoUrlPl: '',
        videoUrlDe: '',
        mainMuscle: '',
        isPrivate: '',
        region: ''
    });
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [exerciseResults, setExerciseResults] = useState([]);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [expandedExercisePlan, setExpandedExercisePlan] = useState(null);
    const [newExerciseDialogOpen, setNewExerciseDialogOpen] = useState(false);
    const router = useRouter();
    const { id,weekid,dayid } = router.query;
    const [userId, setUserId] = useState(null);
    const [exerciseDetailDialogOpen, setExerciseDetailDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const currentLanguage = i18n.language;
    const [isEditing, setIsEditing] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [videoExistence, setVideoExistence] = useState({});
    const [deviceOS, setDeviceOS] = useState("");

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


    const checkVideoExistence = async (exercise) => {
        const videoUrl = `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${exercise.imageUrl}-high-low.mov`;

        try {
            const response = await fetch(videoUrl, { method: 'HEAD' });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking video existence:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchVideoExistenceForAll = async () => {
            let results = {};

            if (day?.exercisePlans?.length > 0) {
                const exercisePlanResults = await Promise.all(
                    day.exercisePlans.map(async (exercisePlan) => {
                        const exists = await checkVideoExistence(exercisePlan.exercise);
                        return { [exercisePlan.id]: exists };
                    })
                );
                results = { ...results, ...Object.assign({}, ...exercisePlanResults) };
            }

            if (exerciseResults?.length > 0) {
                const exerciseResultChecks = await Promise.all(
                    exerciseResults.map(async (exercise) => {
                        const exists = await checkVideoExistence(exercise);
                        return { [`result-${exercise.id}`]: exists };
                    })
                );
                results = { ...results, ...Object.assign({}, ...exerciseResultChecks) };
            }

            setVideoExistence(results);
        };

        fetchVideoExistenceForAll();
    }, [day, exerciseResults]);


    const checkNewExerciseVideo = async () => {
        if (newExercise.imageUrl) {
            const videoUrl = `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${newExercise.imageUrl}-high-low.mov`;
            try {
                const response = await fetch(videoUrl, { method: 'HEAD' });
                return response.ok;
            } catch (error) {
                console.error("Error checking new exercise video existence:", error);
                return false;
            }
        }
        return false;
    };


    const [newExerciseVideoExists, setNewExerciseVideoExists] = useState(false);

    useEffect(() => {
        const fetchNewExerciseVideo = async () => {
            const exists = await checkNewExerciseVideo();
            setNewExerciseVideoExists(exists);
        };

        if (newExercise.imageUrl) {
            fetchNewExerciseVideo();
        }
    }, [newExercise.imageUrl]);


    const checkSelectedExerciseVideo = async () => {
        if (selectedExercise?.imageUrl) {
            const videoUrl = `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${selectedExercise.imageUrl}-high-low.mov`;
            try {
                const response = await fetch(videoUrl, { method: 'HEAD' });
                return response.ok;
            } catch (error) {
                console.error("Error checking selected exercise video existence:", error);
                return false;
            }
        }
        return false;
    };

    const [selectedExerciseVideoExists, setSelectedExerciseVideoExists] = useState(false);

    useEffect(() => {
        const fetchSelectedExerciseVideo = async () => {
            const exists = await checkSelectedExerciseVideo();
            setSelectedExerciseVideoExists(exists);
        };

        if (selectedExercise?.imageUrl) {
            fetchSelectedExerciseVideo();
        }
    }, [selectedExercise?.imageUrl]);


    const mainMuscleOptions = [
        'ABS', 'Biceps', 'Calves', 'Chest', 'Forearms', 'Glutes', 'Hamstrings',
        'Quads', 'Shoulders', 'Traps', 'Triceps', 'Wings', 'LowerBack', 'Rhomboids'
    ];
    const muscleDisplayMap = {
        ABS: 'Brzuch',
        Biceps: 'Bicepsy',
        Calves: 'Łydki',
        Chest: 'Klatka piersiowa',
        Forearms: 'Przedramiona',
        Glutes: 'Pośladki',
        Hamstrings: 'Dwugłowe uda',
        Quads: 'Czworogłowe uda',
        Shoulders: 'Barki',
        Traps: 'Kaptury',
        Triceps: 'Tricepsy',
        Wings: 'Skrzydła',
        LowerBack: 'Dolne plecy',
        Rhomboids: 'Rombowate'
    };

    // Mapa do wysyłania do backendu
    const muscleBackendMap = {
        Brzuch: 'ABS',
        Bicepsy: 'Biceps',
        Łydki: 'Calves',
        'Klatka piersiowa': 'Chest',
        Przedramiona: 'Forearms',
        Pośladki: 'Glutes',
        'Dwugłowe uda': 'Hamstrings',
        'Czworogłowe uda': 'Quads',
        Barki: 'Shoulders',
        Kaptury: 'Traps',
        Tricepsy: 'Triceps',
        Skrzydła: 'Wings',
        'Dolne plecy': 'LowerBack',
        Rombowate: 'Rhomboids'
    };

    const [highlightedMuscles, setHighlightedMuscles] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {
        const fetchDay = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/day/get?id=${dayid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDay(response.data);
                setLoading(false);
                setUserId(getUserId(token));
            } catch (error) {
                console.error(t('fetchError'), error);
                setError(t('fetchError'));
                setLoading(false);
            }
        };
        if (dayid) {
            fetchDay();
        }
    }, [dayid, t]);

    const handleOpenDialog = async () => {
        setDialogOpen(true);
        setExerciseSearch('');
        setExerciseResults([]);
        setNewExercise({
            name: '',
            plannedRepetitions: '',
            plannedWeight: '',
            plannedSeries: '',
            tempo: '',
            additionalInfo: '',
            exerciseId: null,
            imageUrl: '',
            isPrivate: false,
        });
        setSize(10);
        setPage(0);
        setHasMore(false);
        await handleSearchExercises(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExercise(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleExerciseSearchChange = (e) => {
        setExerciseSearch(e.target.value);
    };

    const handleSearchExercises = useCallback(async (reset = false) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/exercise/pageOfAll?page=0&size=${reset ? 10 : size}&search=${exerciseSearch}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (reset) {
                setExerciseResults(response.data.content);
                setSize(10);
                setPage(1);
            } else {
                setExerciseResults(prevResults => [...prevResults, ...response.data.content]);
            }

            setHasMore(response.data.content.length === size);
        } catch (error) {
            console.error(t('searchError'), error);
        }
    }, [exerciseSearch, size, t]);

    const handleLoadMore = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/exercise/pageOfAll?page=${page}&size=10&search=${exerciseSearch}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExerciseResults(prevResults => [...prevResults, ...response.data.content]);
            setHasMore(response.data.content.length === 10);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error(t('loadMoreError'), error);
        }
    };

    const handleSelectExercise = (exercise) => {
        setNewExercise(prevState => ({
            ...prevState,
            name: exercise.name,
            namePl: exercise.namePl,
            nameDe: exercise.nameDe,
            exerciseId: exercise.id,
            imageUrl: exercise.imageUrl,
        }));
        setExerciseResults([]);
    };

    const handleAddExercise = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(
                `${apiUrl}/api/exercisePlan/create?dayId=${dayid}&exerciseId=${newExercise.exerciseId}`,
                {
                    plannedRepetitions: newExercise.plannedRepetitions,
                    plannedWeight: newExercise.plannedWeight,
                    plannedSeries: newExercise.plannedSeries,
                    tempo: newExercise.tempo,
                    additionalInfo: newExercise.additionalInfo,
                    exerciseOrder: day.exercisePlans.length + 1,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setDay((prevDay) => ({
                ...prevDay,
                exercisePlans: prevDay.exercisePlans.map((ep) => ({
                    ...ep,
                    exercise: ep.exercise || { name: t('noName'), imageUrl: '' },
                })),
            }));

            setDialogOpen(false);
            await fetchDay();
            await fetchMuscleTable();
        } catch (error) {
            console.error(t('addExerciseError'), error);
        }
    };

    const fetchMuscleTable = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/exercise/mainMuscle?dayId=${dayid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setHighlightedMuscles(response.data);
            setLoading(false);

        } catch (error) {
            setError(t('muscleFetchError'));
            setLoading(false);
        }
    };

    const fetchDay = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/day/get?id=${dayid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDay(response.data);
            setLoading(false);
        } catch (error) {
            console.error(t('fetchError'), error);
            setError(t('fetchError'));
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (dayid) {
                await fetchDay();
                await fetchMuscleTable();
            }
        };

        fetchData();
    }, [dayid]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearchExercises(true);
        }, 300); // delay in ms

        return () => clearTimeout(delayDebounceFn);
    }, [exerciseSearch, handleSearchExercises]);

    const handleToggleSeries = (exercisePlanId) => {
        setExpandedExercisePlan(expandedExercisePlan === exercisePlanId ? null : exercisePlanId);
    };

    const handleDeleteExercise = async (exercisePlanId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(
                `${apiUrl}/api/exercisePlan/delete?id=${exercisePlanId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setDay(prevDay => ({
                ...prevDay,
                exercisePlans: prevDay.exercisePlans.filter(ep => ep.id !== exercisePlanId)
            }));

            await fetchMuscleTable();

        } catch (error) {
            console.error(t('deleteExerciseError'), error);
        }
    };

    const handleNewExerciseChange = (e) => {
        const { name, value } = e.target;
        setNewExercise(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    const handleAddNewExercise = async () => {
        try {

            console.log(newExercise);
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const payload = {
                ...newExercise,
                isPrivate: !!newExercise.isPrivate,
            };
            await axios.post(`${apiUrl}/api/exercise/addNew`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewExercise({
                name: '',
                namePl: '',
                nameDe: '',
                description: '',
                descriptionPl: '',
                descriptionDe: '',
                imageUrl: '',
                videoUrl: '',
                videoUrlPl: '',
                videoUrlDe: '',
                mainMuscle: '',
                isPrivate: false,
                region: ''
            });
            setNewExerciseDialogOpen(false);
            handleSearchExercises(true);
        } catch (error) {
            console.error(t('addNewExerciseError'), error);
        }
    };

    const handleOpenNewExerciseDialog = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        setNewExercise(prevState => ({
            ...prevState,
            region: getUserLang(token)
        }));
        setNewExerciseDialogOpen(true);
    };

    const handleCloseNewExerciseDialog = () => {
        setNewExerciseDialogOpen(false);
    };

    const handleOpenExerciseDetailDialog = (exercise) => {
        setSelectedExercise(exercise);
        setExerciseDetailDialogOpen(true);
    };

    const handleCloseExerciseDetailDialog = () => {
        setExerciseDetailDialogOpen(false);
        setSelectedExercise(null);
    };

    const formatDescription = (description) => {
        return description ? description.replace(/\. /g, '.\n') : '';
    };

    const getEmbedUrl = (videoUrl) => {
        if (!videoUrl || typeof videoUrl !== 'string') {
            console.error("Invalid YouTube URL:", videoUrl);
            return null; // Zwracamy `null`, aby oznaczyć brak poprawnego URL
        }

        const videoId = videoUrl.split('v=')[1]; // Pobierz część po 'v='
        if (!videoId) {
            console.error("Unable to extract video ID from URL:", videoUrl);
            return null;
        }

        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
        }

        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleMuscleChange = (e) => {
        const selectedMuscle = e.target.value;

        // Sprawdzenie języka - jeśli polski, mapujemy na angielski, w przeciwnym razie używamy bez zmian
        const muscleToSend = i18n.language === 'pl' ? muscleBackendMap[selectedMuscle] : selectedMuscle;

        setNewExercise(prevState => ({
            ...prevState,
            mainMuscle: muscleToSend
        }));
    };

    const handleEditClick = (exercisePlan) => {
        setIsEditing(exercisePlan.id);
        setEditValues({
            plannedRepetitions: exercisePlan.plannedRepetitions,
            plannedWeight: exercisePlan.plannedWeight,
            plannedSeries: exercisePlan.plannedSeries,
        });
    };

    const handleSaveEdit = async (exercisePlanId, editValues) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]; // Pobranie tokenu
            const response = await axios.post(
                `${apiUrl}/api/exercisePlan/edit`,
                {
                    plannedRepetitions: editValues.plannedRepetitions,
                    plannedWeight: editValues.plannedWeight,
                    plannedSeries: editValues.plannedSeries,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        exercisePlanId,
                    },
                }
            );

            fetchDay();

        } catch (error) {
            console.error('Error saving exercise plan:', error);
        }
    };

    const handleSaveClick = async (exercisePlan) => {


        await handleSaveEdit(exercisePlan.id, editValues);
        setIsEditing(null); // Exit editing mode
    };

    const handleEditInputChange = (field, value) => {
        setEditValues({
            ...editValues,
            [field]: value,
        });
    };



    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={t('dayDetails')} />
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%', color: '#eff0f4' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('dayDetails')} />
            <Box
                component="main"
                sx={{

                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container  maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
                    <Box sx={{ width: isSmallScreen ? '100%' : '60%' }}>
                        <Typography color="inherit" variant="h4" component="h1" gutterBottom>
                            {day ? t('dayInfo', { dayName: t(day.name.toLowerCase()) }) : t('dayDetails')}
                        </Typography>
                        {day?.exercisePlans?.length > 0 ? (
                            <List>
                                {day.exercisePlans.map((exercisePlan) => (
                                    <Box
                                        key={exercisePlan.id}
                                        sx={{
                                            backgroundColor: 'rgba(125, 125, 125, 0.4)',
                                            marginBottom: '20px',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                            transition: 'background-color 0.3s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(125, 125, 125, 0.6)',
                                            },
                                        }}
                                    >
                                        <ListItem sx={{'& .MuiTypography-root': { color: 'white' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Box
                                                    sx={{ marginLeft: { md: 'auto', xs: '-20px' }, marginRight: { md: 'auto', xs: '-110px' }, marginTop: { md: 'auto', xs: '-30px' }, transform: { md: 'translate(0px, 0px)', xs: 'translate(50px, 40px) scale(1.3)' } }}
                                                >
                                                    {videoExistence[exercisePlan.id] ? (
                                                        <video
                                                            autoPlay
                                                            playsInline
                                                            loop
                                                            muted
                                                            src={deviceOS === "android" || deviceOS === "other"
                                                                ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmSd/${exercisePlan.exercise?.imageUrl}.webm`
                                                                : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${exercisePlan.exercise?.imageUrl}-high-low.mov`
                                                            }
                                                            alt={exercisePlan.exercise?.name}
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',

                                                            }}
                                                        />
                                                    ) : (

                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                width: { xl: '150px', xs: '150px' },
                                                                height: { xl: '150px', xs: '150px' },
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                overflow: 'hidden',
                                                                transform: { md: 'translate(0px, 0px)', xs: 'translate(0px, 0px) scale(0.4)' },
                                                            }}
                                                            image={exercisePlan.exercise?.imageUrl ? exercisePlan.exercise.imageUrl : '/defaultExercise.png'}
                                                            alt={exercisePlan.exercise?.name || "Default Image"}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/defaultExercise.png';
                                                            }}
                                                        />





                                                    )}
                                                </Box>
                                                {exercisePlan.exercise ? (
                                                    <ListItemText
                                                        primary={
                                                            isEditing === exercisePlan.id ? (
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 1,
                                                                }}>
                                                                    <TextField sx={{mb: '25px',mt: '25px'}}
                                                                               label={t('reps')}
                                                                        value={editValues.plannedRepetitions}
                                                                        onChange={(e) => handleEditInputChange('plannedRepetitions', e.target.value)} // Changed function name
                                                                    />
                                                                    <TextField sx={{marginBottom: '25px'}}
                                                                        label={t('weight')}
                                                                        value={editValues.plannedWeight}
                                                                        onChange={(e) => handleEditInputChange('plannedWeight', e.target.value)} // Changed function name
                                                                    />
                                                                    <TextField sx={{marginBottom: '14px'}}
                                                                        label={t('seriess')}
                                                                        value={editValues.plannedSeries}
                                                                        onChange={(e) => handleEditInputChange('plannedSeries', e.target.value)} // Changed function name
                                                                    />
                                                                    <Button
                                                                        sx={{ mt: 2 }}
                                                                        variant="contained"
                                                                        onClick={() => handleSaveClick(exercisePlan)}
                                                                    >
                                                                        {t('save')}
                                                                    </Button>
                                                                </Box>
                                                            ) : (
                                                                <ListItemText
                                                                    primary={
                                                                        currentLanguage === 'pl' ? (
                                                                            <Box
                                                                                sx={{
                                                                                    lineHeight: 1.5,
                                                                                    display: { xs: 'block', md: 'block' },
                                                                                    alignItems: 'center',
                                                                                    gap: { xs: 1, md: 0 },
                                                                                    transform: 'translate(30px, -40px)',
                                                                                    width: { xs: '300px', md: 'auto' },
                                                                                    whiteSpace: 'normal',
                                                                                    wordBreak: 'break-word',
                                                                                }}
                                                                            >
                                                                                <Typography variant="h6" sx={{ fontSize: { md: '15px', xs: '12px' } }}>
                                                                                    {exercisePlan.exercise.namePl}
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    {`${t('reps')}: ${exercisePlan.plannedRepetitions}`}
                                                                                    {exercisePlan.plannedWeight > 0 && `, ${t('weight')}: ${exercisePlan.plannedWeight}kg`}
                                                                                    {`, ${t('seriess')}: ${exercisePlan.plannedSeries}`}
                                                                                </Typography>
                                                                            </Box>
                                                                        ) : currentLanguage === 'de' ?
                                                                            <Box
                                                                                sx={{
                                                                                    lineHeight: 1.5,
                                                                                    display: { xs: 'block', md: 'block' },
                                                                                    alignItems: 'center',
                                                                                    gap: { xs: 1, md: 0 },
                                                                                    transform: 'translate(0px, -40px)',
                                                                                    width: { xs: '300px', md: 'auto' },
                                                                                    whiteSpace: 'normal',
                                                                                    wordBreak: 'break-word',
                                                                                }}
                                                                            >
                                                                                <Typography variant="h6" sx={{ fontSize: { md: '15px', xs: '12px' } }}>
                                                                                    {exercisePlan.exercise.nameDe}
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    {`${t('reps')}: ${exercisePlan.plannedRepetitions}`}
                                                                                    {exercisePlan.plannedWeight > 0 && `, ${t('weight')}: ${exercisePlan.plannedWeight}kg`}
                                                                                    {`, ${t('seriess')}: ${exercisePlan.plannedSeries}`}
                                                                                </Typography>
                                                                            </Box>

                                                                            :

                                                                            <Box
                                                                                sx={{
                                                                                    lineHeight: 1.5,
                                                                                    display: { xs: 'block', md: 'block' },
                                                                                    alignItems: 'center',
                                                                                    gap: { xs: 1, md: 0 },
                                                                                    transform: 'translate(0px, -40px)',
                                                                                    width: { xs: '300px', md: 'auto' },
                                                                                    whiteSpace: 'normal',
                                                                                    wordBreak: 'break-word',
                                                                                }}
                                                                            >
                                                                                <Typography variant="h6" sx={{ fontSize: { md: '15px', xs: '12px' } }}>
                                                                                    {exercisePlan.exercise.name}
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    {`${t('reps')}: ${exercisePlan.plannedRepetitions}`}
                                                                                    {exercisePlan.plannedWeight > 0 && `, ${t('weight')}: ${exercisePlan.plannedWeight}kg`}
                                                                                    {`, ${t('seriess')}: ${exercisePlan.plannedSeries}`}
                                                                                </Typography>
                                                                            </Box>
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <ListItemText primary={t('exerciseDataNotAvailable')} />
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    sx={{marginRight: '-20px', color: theme.palette.primary.main }}
                                                    onClick={() => handleOpenExerciseDetailDialog(exercisePlan.exercise)}
                                                >
                                                    <InfoIcon />
                                                </Button>
                                                {isEditing === exercisePlan.id || (userId !== day.creatorId && day.creatorId !== 1 && day.creatorId !== 2) ? null : (
                                                    <Button sx={{marginRight: '-20px', color: theme.palette.primary.main }} onClick={() => handleEditClick(exercisePlan)}>
                                                        <EditIcon />
                                                    </Button>
                                                )}
                                                {userId === day.creatorId && (
                                                    <IconButton edge="end" onClick={() => handleDeleteExercise(exercisePlan.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton edge="end" onClick={() => handleToggleSeries(exercisePlan.id)}>
                                                    {expandedExercisePlan === exercisePlan.id ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </Box>
                                        </ListItem>

                                        <Collapse in={expandedExercisePlan === exercisePlan.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ paddingLeft: 4 }}>
                                                {exercisePlan.exerciseSeries?.length > 0 ? (
                                                    <List>
                                                        {exercisePlan.exerciseSeries.map((series, index) => (
                                                            <ListItem key={series.id}>
                                                                <ListItemText
                                                                    primary={`${t('series')} ${index + 1}: ${t('reps')}: ${series.totalRepetitions}, ${t('weight')}: ${series.totalWeight}kg, ${t('backInfo')}: ${series.additionalInfo}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography variant="body2">{t('noSeriesDataAvailable')}</Typography>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <Typography color="inherit" variant="h6">{t('noExercisesAdded')}</Typography>
                        )}

                        {userId === day.creatorId && (
                            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mt: 2 }}>
                                {t('addExercise')}
                            </Button>
                        )}
                        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                            <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>{t('addExercise')}</DialogTitle>
                            <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                {!newExercise.exerciseId ? (
                                    <>
                                        <TextField sx={{marginTop: '20px'}}
                                            autoFocus
                                            margin="normal"
                                            name="exerciseSearch"
                                            label={t('searchExercise')}
                                            fullWidth
                                            variant="outlined"
                                            value={exerciseSearch}
                                            onChange={handleExerciseSearchChange}
                                        />
                                        <List >
                                            {exerciseResults.map((exercise) => (
                                                <ListItem key={exercise.id} button onClick={() => handleSelectExercise(exercise)}>
                                                    <ListItemAvatar>
                                                        <div
                                                            style={{
                                                                width: 150,
                                                                height: 80,
                                                                marginLeft: '-40px',
                                                                marginRight: '10px',
                                                                overflow: 'hidden', // Ukrycie nadmiarowych części wideo
                                                                 // Opcjonalnie: dodanie zaokrąglonych rogów
                                                            }}
                                                        >
                                                            {videoExistence[`result-${exercise.id}`] ? (
                                                                <video
                                                                    autoPlay
                                                                    playsInline
                                                                    loop
                                                                    muted
                                                                    src={deviceOS === "android" || deviceOS === "other"
                                                                        ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmSd/${exercise.imageUrl}.webm`
                                                                        : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${exercise.imageUrl}-high-low.mov`
                                                                    }
                                                                    alt={exercise.name}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'fill'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <CardMedia
                                                                    sx={{
                                                                        width: { xl: '150px', xs: '80px' },
                                                                        height: { xl: '150px', xs: '80px' },
                                                                        objectFit: 'fill',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        transform: { md: 'translate(38px, 0px)', xs: 'translate(38px, 0px)' },
                                                                    }}
                                                                    component="img"
                                                                    image={exercise?.imageUrl ? exercise.imageUrl : '/defaultExercise.png'}
                                                                    alt={exercise?.name || "Default Image"}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/defaultExercise.png';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="h5" sx={{ fontSize: {md: '16px', xs: '11px'} }}>
                                                                {currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name}
                                                            </Typography>
                                                        }
                                                    />
                                                    <Button
                                                        sx={{marginRight: '-40px'}}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleOpenExerciseDetailDialog(exercise);
                                                        }}
                                                        color="primary"
                                                    >
                                                        <InfoIcon />
                                                    </Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                        {hasMore && (
                                            <Button onClick={handleLoadMore} color="primary">
                                                {t('loadMore')}
                                            </Button>
                                        )}
                                        <Button onClick={handleOpenNewExerciseDialog} color="primary">
                                            {t('addNewExercise')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <ListItemAvatar>
                                                <div
                                                    style={{
                                                        width: 150,
                                                        height: 80,
                                                        marginLeft: '-30px',
                                                        marginRight: '10px',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {newExerciseVideoExists ? (
                                                        <video
                                                            autoPlay
                                                            playsInline
                                                            loop
                                                            muted
                                                            src={deviceOS === "android" || deviceOS === "other"
                                                                ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmSd/${newExercise.imageUrl}.webm`
                                                                : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${newExercise.imageUrl}-high-low.mov`
                                                            }
                                                            alt={newExercise.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'fill',
                                                            }}
                                                        />
                                                    ) : (
                                                        <CardMedia
                                                            sx={{
                                                                width: { xl: '150px', xs: '80px' },
                                                                height: { xl: '150px', xs: '80px' },
                                                                objectFit: 'fill',
                                                                borderRadius: '8px',
                                                                overflow: 'hidden',
                                                                transform: { md: 'translate(38px, 0px)', xs: 'translate(38px, 0px)' },
                                                            }}
                                                            component="img"
                                                            image={newExercise?.imageUrl ? newExercise.imageUrl : '/defaultExercise.png'}
                                                            alt={newExercise?.name || "Default Image"}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/defaultExercise.png';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </ListItemAvatar>
                                            <Typography variant="h5" sx={{ fontSize: {md: '20px', xs: '12px'} }}>
                                                {currentLanguage === 'pl' ? newExercise.namePl : currentLanguage === 'de' ? newExercise.nameDe : newExercise.name}
                                            </Typography>
                                            <Button onClick={() => setNewExercise({
                                                name: '',
                                                plannedRepetitions: '',
                                                plannedWeight: '',
                                                plannedSeries: '',
                                                tempo: '',
                                                additionalInfo: '',
                                                exerciseId: null,
                                                imageUrl: '',
                                            })} color="primary" sx={{ml: 2}}>
                                                {t('changeExercise')}
                                            </Button>
                                        </Box>
                                        <TextField sx={{marginBottom: '20px'}}
                                                   margin="dense"
                                                   name="plannedRepetitions"
                                                   label={t('plannedRepetitions')}
                                                   fullWidth
                                                   variant="outlined"
                                                   value={newExercise.plannedRepetitions}
                                                   onChange={handleInputChange}
                                        />
                                        <TextField sx={{marginBottom: '20px'}}
                                                   margin="dense"
                                                   name="plannedWeight"
                                            label={t('plannedWeight')}
                                            fullWidth
                                            variant="outlined"
                                            value={newExercise.plannedWeight}
                                            onChange={handleInputChange}
                                        />
                                        <TextField sx={{marginBottom: '20px'}}
                                            margin="dense"
                                            name="plannedSeries"
                                            label={t('plannedSeries')}
                                            fullWidth
                                            variant="outlined"
                                            value={newExercise.plannedSeries}
                                            onChange={handleInputChange}
                                        />
                                        <TextField sx={{marginBottom: '20px'}}
                                            margin="dense"
                                            name="tempo"
                                            label={t('tempo')}
                                            fullWidth
                                            variant="outlined"
                                            value={newExercise.tempo}
                                            onChange={handleInputChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="additionalInfo"
                                            label={t('additionalInfo')}
                                            fullWidth
                                            variant="outlined"
                                            value={newExercise.additionalInfo}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                )}
                            </DialogContent>
                            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Button onClick={handleCloseDialog} color="primary">
                                    {t('cancel')}
                                </Button>
                                {newExercise.exerciseId && (
                                    <Button onClick={handleAddExercise} color="primary">
                                        {t('addExercise')}
                                    </Button>
                                )}
                            </DialogActions>
                        </Dialog>
                        <Dialog open={newExerciseDialogOpen} onClose={handleCloseNewExerciseDialog} fullWidth maxWidth="sm">
                            <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>{t('addNewExercise')}</DialogTitle>
                            <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="name"
                                    label={t('exerciseName')}
                                    fullWidth
                                    variant="outlined"
                                    value={currentLanguage === 'pl' ? newExercise.namePl : currentLanguage === 'de' ? newExercise.nameDe : newExercise.name}
                                    sx={{marginTop: '25px'}}
                                    onChange={handleNewExerciseChange}
                                />
                                <TextField
                                    margin="dense"
                                    name="description"
                                    label={t('description')}
                                    fullWidth
                                    variant="outlined"
                                    value={currentLanguage === 'pl' ? newExercise.descriptionPl  : currentLanguage === 'de' ? newExercise.descriptionDe : newExercise.description}
                                    onChange={handleNewExerciseChange}
                                    sx={{marginTop: '20px'}}
                                />
                                <TextField
                                    margin="dense"
                                    name="imageUrl"
                                    label={t('imageUrl')}
                                    fullWidth
                                    variant="outlined"
                                    value={newExercise.imageUrl}
                                    onChange={handleNewExerciseChange}
                                    sx={{marginTop: '20px'}}
                                />
                                {/*<TextField*/}
                                {/*    margin="dense"*/}
                                {/*    name="videoUrl"*/}
                                {/*    label={t('videoUrl')}*/}
                                {/*    fullWidth*/}
                                {/*    variant="outlined"*/}
                                {/*    value={currentLanguage === 'pl' ? newExercise.videoUrlPl : currentLanguage === 'de' ? newExercise.videoUrlDe : newExercise.videoUrl}*/}
                                {/*    onChange={handleNewExerciseChange}*/}
                                {/*    sx={{marginTop: '20px'}}*/}
                                {/*/>*/}
                                <FormControl sx={{marginTop: '20px'}} fullWidth margin="dense">
                                    <InputLabel>{t('mainMuscle')}</InputLabel>
                                    <Select
                                        name="mainMuscle"
                                        value={
                                            i18n.language === 'pl'
                                                ? Object.keys(muscleBackendMap).find(key => muscleBackendMap[key] === newExercise.mainMuscle) || ''
                                                : newExercise.mainMuscle || ''
                                        }
                                        onChange={handleMuscleChange}
                                        label={t('mainMuscle')}
                                    >
                                        {i18n.language === 'pl'
                                            ? Object.keys(muscleBackendMap).map(muscle => (
                                                <MenuItem key={muscle} value={muscle}>
                                                    {muscle}
                                                </MenuItem>
                                            ))
                                            : mainMuscleOptions.map(muscle => (
                                                <MenuItem key={muscle} value={muscle}>
                                                    {muscle}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={Boolean(newExercise.isPrivate)} // Konwertuj na boolean
                                            onChange={(e) =>
                                                setNewExercise((prevState) => ({
                                                    ...prevState,
                                                    isPrivate: e.target.checked, // Przypisz wartość logiczną
                                                }))
                                            }
                                            name="isPrivate"
                                            color="primary"
                                        />
                                    }
                                    label={t('privateExercise')}
                                />
                            </DialogContent>
                            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Button onClick={handleCloseNewExerciseDialog} color="primary">
                                    {t('cancel')}
                                </Button>
                                <Button onClick={handleAddNewExercise} color="primary">
                                    {t('addExercise')}
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {selectedExercise && (
                            <Dialog open={exerciseDetailDialogOpen} onClose={handleCloseExerciseDetailDialog} fullWidth maxWidth="lg">
                                <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>{currentLanguage === 'pl' ? selectedExercise.namePl : currentLanguage === 'de' ? selectedExercise.nameDe : selectedExercise.name}</DialogTitle>
                                <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        {selectedExerciseVideoExists ? (
                                            <video
                                                autoPlay
                                                playsInline
                                                loop
                                                muted
                                                src={deviceOS === "android" || deviceOS === "other"
                                                    ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmSd/${selectedExercise.imageUrl}.webm`
                                                    : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movSd/${selectedExercise.imageUrl}-high-low.mov`
                                                }
                                                alt={selectedExercise.name}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    marginBottom: '20px'
                                                }}
                                            />
                                        ) : (
                                            <CardMedia
                                                sx={{
                                                    width: { xl: '300px', xs: '150px' },
                                                    height: { xl: '300px', xs: '150px' },
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    marginBottom: '20px'
                                                }}
                                                component="img"
                                                image={selectedExercise.imageUrl ? selectedExercise.imageUrl : '/defaultExercise.png'}
                                                alt={selectedExercise?.name || "Default Image"}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/defaultExercise.png';
                                                }}
                                            />
                                        )}

                                        <Typography variant="body1" style={{whiteSpace: 'pre-line'}} gutterBottom>
                                            {currentLanguage === 'pl' ? formatDescription(selectedExercise.descriptionPl) : currentLanguage === 'de' ? formatDescription(selectedExercise.descriptionDe) : formatDescription(selectedExercise.description)}
                                        </Typography>
                                        {(currentLanguage === 'pl' ? selectedExercise.videoUrlPl : currentLanguage === 'de' ? selectedExercise.videoUrlDe : selectedExercise.videoUrl) && (
                                            <Box sx={{
                                                width: '100%',
                                                height: '0',
                                                paddingBottom: '56.25%',
                                                position: 'relative'
                                            }}>
                                                <iframe
                                                    src={getEmbedUrl(currentLanguage === 'pl' ? selectedExercise.videoUrlPl : currentLanguage === 'de' ? selectedExercise.videoUrlDe : selectedExercise.videoUrl)}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title="Exercise Video"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </DialogContent>
                                <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                    <Button onClick={handleCloseExerciseDetailDialog} color="primary">
                                        {t('close')}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </Box>
                    <Box sx={{
                        width: isSmallScreen ? '100%' : '40%',
                        height: isSmallScreen ? '600px' : '858px',
                        mt: isSmallScreen ? 4 : 0
                    }}>
                        <BodyModel highlightedMuscles={highlightedMuscles} />
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(DayDetails);