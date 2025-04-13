import React, { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from "@/components/withAuth";
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    CircularProgress,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Avatar, Snackbar, SnackbarContent, Grid, Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import { Menu , IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import {getUserId, getUserLang} from "@/utils/jwtDecode";
import i18n from "i18next";
import Fade from '@mui/material/Fade';

const mainMuscleOptions = [
    'ABS', 'Biceps', 'Calves', 'Chest', 'Forearms', 'Glutes', 'Hamstrings', 'Quads', 'Shoulders', 'Traps', 'Triceps', 'Wings', 'LowerBack', 'Rhomboids'
];

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const ExerciseAtlas = () => {
    const [exercises, setExercises] = useState([]);
    const [userId, setUserId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newExerciseDialogOpen, setNewExerciseDialogOpen] = useState(false);
    const [exerciseDetailDialogOpen, setExerciseDetailDialogOpen] = useState(false);
    const [editExerciseDialogOpen, setEditExerciseDialogOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [editedExercise, setEditedExercise] = useState({
        name: '', description: '', imageUrl: '', videoUrl: '', mainMuscle: '', isPrivate: false, region: ''
    });
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [newExercise, setNewExercise] = useState({
        name: '', description: '', imageUrl: '', videoUrl: '', mainMuscle: '', isPrivate: false, region: ''
    });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [search, setSearch] = useState('');
    const { t } = useTranslation('exerciseAtlas');
    const currentLanguage = i18n.language;
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
        const fetchExercises = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/exercise/pageOfAll?page=${page}&size=${size}&search=${search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setExercises(response.data.content);
                setCount(response.data.totalElements);
                setUserId(getUserId(token));


                const videoChecks = await Promise.all(
                    response.data.content.map(async (exercise) => {
                        const exists = await checkVideoExistence(exercise);
                        return { [exercise.id]: exists };
                    })
                );

                setVideoExistence(Object.assign({}, ...videoChecks));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exercises:', error);
                setError('Error fetching exercises');
                setLoading(false);
            }
        };

        fetchExercises();
    }, [page, size, search]);

    const fetchExercises = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/exercise/pageOfAll?page=${page}&size=${size}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setExercises(response.data.content);
            setCount(response.data.totalElements);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setError('Error fetching exercises');
            setLoading(false);
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

    const handleNewExerciseChange = (e) => {
        const { name, value } = e.target;
        setNewExercise(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditExercise = (exercise) => {
        setEditedExercise(exercise);
        setEditExerciseDialogOpen(true);
    };

    const handleMenuOpen = (event, rowId) => {
        setAnchorEl(event.currentTarget);
        setMenuRowId(rowId);  // Zapisz ID wiersza, dla którego otwarto menu
    };

    const handleMenuClose = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setAnchorEl(null);
        setMenuRowId(null);
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
        setNewExercise(prevState => ({
            ...prevState,
            isPrivate: checked
        }));
    };

    const confirmDeleteExercise = (exercise) => {
        setExerciseToDelete(exercise);
        setDeleteDialogOpen(true);
    };

    const handleDeleteExercise = async () => {
        if (!exerciseToDelete) return;

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.delete(`${apiUrl}/api/exercise/delete?id=${exerciseToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(response.data);
            fetchExercises();
            setDeleteDialogOpen(false); // Zamknij dialog po usunięciu
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const handleEditedExerciseChange = (e) => {
        const { name, value } = e.target;
        setEditedExercise(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChangeEdit = (e) => {
        const { checked } = e.target;
        setEditedExercise(prevState => ({
            ...prevState,
            isPrivate: checked
        }));
    };

    const handleSaveEditedExercise = async () => {

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.put(`${apiUrl}/api/exercise/edit?id=${editedExercise.id}`, editedExercise, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            fetchExercises();
            setEditExerciseDialogOpen(false);
        } catch (error) {

            let errorMessage = "An unknown error occurred.";
            if (error.response && error.response.data) {
                const { error: errorText, message, status } = error.response.data;
                errorMessage = `Error ${status}: ${message || errorText}`;
            }

            setErrorMessage(errorMessage);  // Przypisz wiadomość do wyświetlenia
            setErrorSnackbarOpen(true);  // Otwórz Dialog z błędem
        }
    };


    const handleAddNewExercise = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${apiUrl}/api/exercise/addNew`, newExercise, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewExercise({
                name: '', description: '', imageUrl: '', videoUrl: '', mainMuscle: '', isPrivate: false
            });

            fetchExercises();
            setNewExerciseDialogOpen(false);
        } catch (error) {
            console.error('Error adding new exercise:', error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const formatDescription = (description) => {
        return description ? description.replace(/\. /g, '.\n') : '';
    };

    const getEmbedUrl = (videoUrl) => {
        if (!videoUrl || typeof videoUrl !== 'string') {
            console.error("Invalid YouTube URL:", videoUrl);
            return null;
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


    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={'Exercise Atlas'} />
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
            <Navigation title={t('exerciseAtlas')} />
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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography sx={{color: 'white '}} variant="h4" component="h1" gutterBottom>
                        {t('exerciseAtlas')}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenNewExerciseDialog} sx={{marginBottom: '20px'}}>
                        {t('addNewExercise')}
                    </Button>
                    <TextField sx={{marginBottom: 2}}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label={t('searchByNameOrMuscle')}
                        value={search}
                        onChange={handleSearchChange}
                    />

                    <Grid container spacing={4}>
                        {exercises.map((exercise) => (
                            <Grid item xs={6} sm={6} md={3} key={exercise.id}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        backgroundColor: 'rgba(125,125,125,0.5)',
                                        border: '1px solid rgba(0,0,0,0.9)',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                    onClick={() => handleOpenExerciseDetailDialog(exercise)}
                                >
                                    {videoExistence[exercise.id] ? (
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
                                                height: '150px',
                                            }}
                                            onError={(e) => {
                                                console.error("Error loading video:", e.target.src);
                                                e.target.style.display = "none"; // Ukrywa wideo, jeśli nie można go załadować
                                            }}
                                        />
                                    ) : (
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={exercise.imageUrl ? exercise.imageUrl : '/defaultExercise.png'}
                                            alt={exercise.name || "Default Image"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/defaultExercise.png';
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                                        <Typography gutterBottom  sx={{color: 'white', fontWeight: '1000',fontSize: '12px'}} component="div">
                                            {currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ position: 'absolute', bottom: 0, right: 0, p: 1 }}>
                                        {exercise.creatorId === userId && (
                                            <Box>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuOpen(e, exercise.id);
                                                    }}
                                                    sx={{ color: 'white' }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>

                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={menuRowId === exercise.id}
                                                    onClose={(e) => handleMenuClose(e)}
                                                >
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditExercise(exercise);
                                                            handleMenuClose();
                                                        }}
                                                    >
                                                        {t('edit')}
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDeleteExercise(exercise);
                                                            handleMenuClose();
                                                        }}
                                                    >
                                                        {t('delete')}
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <TablePagination
                        sx={{
                            position: 'relative',
                            right: 0,
                            width: '100%',
                            display: 'flex',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            justifyContent: 'space-between', // Rozciąga elementy na szerokość
                            alignItems: 'center',
                            '& .MuiTablePagination-toolbar': {
                                flexWrap: 'wrap',
                                gap: 1,
                            },
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                fontSize: { xs: '12px', sm: 'inherit' }, // Zmniejszenie rozmiaru czcionki na małych ekranach
                            },
                            '& .MuiTablePagination-actions': {
                                flex: '0 0 auto', // Zapewnia poprawne rozmieszczenie przycisków
                            },
                        }}
                        rowsPerPageOptions={[8, 12, 16, 24]}
                        component="div"
                        count={count}
                        rowsPerPage={size}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />

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
                                onChange={handleNewExerciseChange}
                                sx={{marginTop: '30px'}}
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label={t('description')}
                                fullWidth
                                variant="outlined"
                                value={currentLanguage === 'pl' ? newExercise.descriptionPl  : currentLanguage === 'de' ? newExercise.descriptionDe : newExercise.description}
                                onChange={handleNewExerciseChange}
                                multiline
                                minRows={1}
                                maxRows={3}
                                sx={{marginTop: '20px','& .MuiOutlinedInput-root': {
                                        borderRadius: '12px', // Zaokrąglenie rogów
                                        minHeight: '100px', // Minimalna wysokość całego pola
                                        alignItems: 'flex-start', // Wyrównanie tekstu do góry
                                        paddingTop: '10px', // Odstęp od góry
                                        paddingBottom: '10px', // Odstęp od dołu
                                    },}}
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
                            {/*    label={t('youtubeUrl')}*/}
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
                                    value={newExercise.mainMuscle}
                                    onChange={handleNewExerciseChange}
                                    label={t('mainMuscle')}
                                >
                                    {mainMuscleOptions.map((muscle) => (
                                        <MenuItem key={muscle} value={muscle}>
                                            {t(`${muscle}`)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newExercise.isPrivate}
                                        onChange={handleCheckboxChange}
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
                                    {videoExistence[selectedExercise.id] ? (
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
                                                height: '150px',
                                            }}
                                            onError={(e) => {
                                                console.error("Error loading video:", e.target.src);
                                                e.target.style.display = "none"; // Ukrywa wideo, jeśli nie można go załadować
                                            }}
                                        />
                                    ) : (
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={selectedExercise.imageUrl ? selectedExercise.imageUrl : '/defaultExercise.png'}
                                            alt={selectedExercise.name || "Default Image"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/defaultExercise.png';
                                            }}
                                        />
                                    )}
                                    <Typography variant="h6" gutterBottom>
                                        {currentLanguage === 'pl' ? selectedExercise.namePl : currentLanguage === 'de' ? selectedExercise.nameDe : selectedExercise.name}
                                    </Typography>
                                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} gutterBottom>
                                        {currentLanguage === 'pl' ? formatDescription(selectedExercise.descriptionPl)  : currentLanguage === 'de' ? formatDescription(selectedExercise.descriptionDe) : formatDescription(selectedExercise.description)}
                                    </Typography>
                                    {(currentLanguage === 'pl' ? selectedExercise.videoUrlPl : currentLanguage === 'de' ? selectedExercise.videoUrlDe : selectedExercise.videoUrl) && (
                                        <Box sx={{ width: '100%', height: '0', paddingBottom: '56.25%', position: 'relative' }}>
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

                    <Dialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                    >
                        <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
                        <DialogContent>
                            <Typography>{t('confirmDeleteMessage')}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                                {t('cancel')}
                            </Button>
                            <Button onClick={handleDeleteExercise} color="secondary">
                                {t('delete')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={editExerciseDialogOpen} onClose={() => setEditExerciseDialogOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>{t('editExercise')}</DialogTitle>
                        <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label={t('exerciseName')}
                                fullWidth
                                variant="outlined"
                                value={currentLanguage === 'pl' ? editedExercise.namePl : currentLanguage === 'de' ? editedExercise.nameDe : editedExercise.name}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    setEditedExercise((prev) => ({
                                        ...prev,
                                        [`${name}${currentLanguage === 'pl' ? 'Pl' : currentLanguage === 'de' ? 'De' : ''}`]: value
                                    }));
                                }}
                                sx={{marginTop: '20px'}}
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label={t('description')}
                                fullWidth
                                variant="outlined"
                                value={currentLanguage === 'pl' ? formatDescription(editedExercise.descriptionPl)  : currentLanguage === 'de' ? formatDescription(editedExercise.descriptionDe) : formatDescription(editedExercise.description)}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    setEditedExercise((prev) => ({
                                        ...prev,
                                        [`${name}${currentLanguage === 'pl' ? 'Pl' : currentLanguage === 'de' ? 'De' : ''}`]: value
                                    }));
                                }}
                                multiline
                                minRows={1}
                                maxRows={3}
                                sx={{marginTop: '20px','& .MuiOutlinedInput-root': {
                                        borderRadius: '12px', // Zaokrąglenie rogów
                                        minHeight: '100px', // Minimalna wysokość całego pola
                                        alignItems: 'flex-start', // Wyrównanie tekstu do góry
                                        paddingTop: '10px', // Odstęp od góry
                                        paddingBottom: '10px', // Odstęp od dołu
                                    },}}
                            />
                            <TextField
                                margin="dense"
                                name="imageUrl"
                                label={t('imageUrl')}
                                fullWidth
                                variant="outlined"
                                value={editedExercise.imageUrl}
                                onChange={handleEditedExerciseChange}
                                sx={{marginTop: '20px'}}
                            />
                            <TextField
                                margin="dense"
                                name="videoUrl"
                                label={t('youtubeUrl')}
                                fullWidth
                                variant="outlined"
                                value={currentLanguage === 'pl' ? formatDescription(editedExercise.videoUrlPl)  : currentLanguage === 'de' ? formatDescription(editedExercise.videoUrlDe) : formatDescription(editedExercise.videoUrl)}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    setEditedExercise((prev) => ({
                                        ...prev,
                                        [`${name}${currentLanguage === 'pl' ? 'Pl' : currentLanguage === 'de' ? 'De' : ''}`]: value
                                    }));
                                }}
                                sx={{marginTop: '20px'}}
                            />
                            <FormControl sx={{marginTop: '20px'}} fullWidth margin="dense">
                                <InputLabel>{t('mainMuscle')}</InputLabel>
                                <Select
                                    name="mainMuscle"
                                    value={editedExercise.mainMuscle}
                                    onChange={handleEditedExerciseChange}
                                    label={t('mainMuscle')}
                                >
                                    {mainMuscleOptions.map((muscle) => (
                                        <MenuItem key={muscle} value={muscle}>
                                            {t(`${muscle}`)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editedExercise.isPrivate}
                                        onChange={handleCheckboxChangeEdit}
                                        name="isPrivate"
                                        color="primary"
                                    />
                                }
                                label={t('privateExercise')}
                            />
                        </DialogContent>
                        <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                            <Button onClick={() => setEditExerciseDialogOpen(false)} color="primary">
                                {t('cancel')}
                            </Button>
                            <Button onClick={handleSaveEditedExercise} color="primary">
                                {t('saveChanges')}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={errorSnackbarOpen}
                        onClose={() => setErrorSnackbarOpen(false)}
                    >
                        <DialogTitle>{t('Error')}</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setErrorSnackbarOpen(false)} color="primary">
                                {t('close')}
                            </Button>
                        </DialogActions>
                    </Dialog>


                </Container>
                </Fade>
            </Box>
        </Box>

    );
};

export default withAuth(ExerciseAtlas);
