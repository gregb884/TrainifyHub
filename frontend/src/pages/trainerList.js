import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import withAuth from "@/components/withAuth";
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    CircularProgress,
    Toolbar,
    Grid,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Pagination
} from '@mui/material';
import Navigation from "@/components/Navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import Fade from '@mui/material/Fade';

const apiUrl = process.env.NEXT_PUBLIC_API_PROFILE;

const TrainersList = () => {
    const [trainers, setTrainers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const [trainerDetailDialogOpen, setTrainerDetailDialogOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [userRequests, setUserRequests] = useState([]);
    const chatRef = useRef();
    const { t } = useTranslation('trainerList');
    const defaultImageUrl = '/trainerPhoto.png';
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/profile/trainer/trainerPublicList?page=${page}&size=${size}&search=${search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTrainers(response.data.content);
                setCount(response.data.totalElements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trainers:', error);
                setError('Error fetching trainers');
                setLoading(false);
            }
        };

        const fetchUserRequests = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/request/getMyRequest?page=0&size=1000&search=`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserRequests(response.data.content);
            } catch (error) {
                console.error('Error fetching user requests:', error);
            }
        };

        fetchTrainers();
        fetchUserRequests();
    }, [page, size, search]);

    const fetchTrainerDetails = async (id) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/profile/trainer/trainerProfileView?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedTrainer(response.data);
            setTrainerDetailDialogOpen(true);
        } catch (error) {
            console.error('Error fetching trainer details:', error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleCloseTrainerDetailDialog = () => {
        setTrainerDetailDialogOpen(false);
        setSelectedTrainer(null);
    };

    const handleRequestPlan = async (trainerId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(`${apiUrl}/api/request/new?trainerId=${trainerId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const updatedRequests = [...userRequests, { trainerId }];
                setUserRequests(updatedRequests);
            }
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error(t('errorSendingRequest'));
        }
    };

    const handleSendMessage = (trainerUsername) => {
        if (chatRef.current) {
            chatRef.current.handleExternalOpen(trainerUsername);
        } else {
            console.error('chatRef.current is undefined');
        }
    };


    const hasRequestBeenSent = (trainerId) => {
        if (!userRequests) return false;
        return userRequests.some(request => request.trainerId === trainerId);
    };

    if (loading) {
        return (
            <Box sx={{ backgroundImage: 'radial-gradient(circle at center, rgba(30,136,229,0.5) 0%, rgba(14,27,41,1) 100%)',
                backgroundColor: '#162337',
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={t('trainersList')} chatRef={chatRef} />
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', color: '#eff0f4' }} />
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
            <Navigation title={t('trainersList')} chatRef={chatRef} />
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
                    <Typography sx={{ color: 'white' }} variant="h4" component="h1" gutterBottom>
                        {t('trainersList')}
                    </Typography>
                    <TextField
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'white',
                            },
                        }}
                        variant="outlined"
                        margin="normal"
                        label={t('searchPlaceholder')}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Grid sx={{marginTop: '20px'}} container spacing={3} justifyContent="center">
                        {trainers.map((trainer) => (
                            <Grid item xs={12} sm={6} md={4} key={trainer.id}>
                                    <Box

                                        onClick={() => fetchTrainerDetails(trainer.id)}

                                        sx={{
                                            position: 'relative',
                                            height: '400px',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05)' },
                                        }}
                                    >
                                        <img
                                            src={trainer.imageUrl ? `${process.env.NEXT_PUBLIC_API_PROFILE}${trainer.imageUrl}` : defaultImageUrl}
                                            onError={() => setImageError(true)}
                                            alt={`${trainer.firstName} ${trainer.lastName}`}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                            }}
                                        />
                                    <Box sx={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0, p: 2,
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white',
                                    }}>
                                        <Typography sx={{color: 'white'}} variant="h6">{trainer.firstName} {trainer.lastName}</Typography>
                                        <Typography sx={{color: 'white'}} variant="body2">{trainer.city}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            {hasRequestBeenSent(trainer.id) ? (
                                                <Button
                                                    variant="contained"
                                                    disabled
                                                    sx={{
                                                        flex: 1,
                                                        "&.Mui-disabled": { color: "white" },
                                                    }}
                                                    onClick={(event) => event.stopPropagation()} // Zatrzymanie propagacji zdarzenia
                                                >
                                                    {t('requestSent')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // Zatrzymanie propagacji zdarzenia
                                                        handleRequestPlan(trainer.id);
                                                    }}
                                                    sx={{ flex: 1 }}
                                                >
                                                    {t('requestPlan')}
                                                </Button>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(event) => {
                                                    event.stopPropagation(); // Zatrzymanie propagacji zdarzenia
                                                    handleSendMessage(trainer.username);
                                                }}
                                                sx={{ flex: 1 }}
                                            >
                                                {t('sendMessage')}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={Math.ceil(count / size)}
                            page={page + 1}
                            onChange={(e, newPage) => setPage(newPage - 1)}
                            color="primary"
                        />
                    </Box>
                    {selectedTrainer && (
                        <Dialog open={trainerDetailDialogOpen} onClose={handleCloseTrainerDetailDialog} fullWidth maxWidth="sm">
                            <DialogContent sx={{ backgroundColor: 'rgb(0,0,0,0.5)' }}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        sx={{ width: 200, height: 200 }}
                                        alt={selectedTrainer.firstName}
                                        src={`${process.env.NEXT_PUBLIC_API_PROFILE}${selectedTrainer.imageUrl}`}
                                    />
                                    <Typography sx={{ marginTop: '10px' }} variant="h6" gutterBottom>
                                        {`${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="left">
                                    {selectedTrainer.phone && (
                                        <Typography variant="body1" gutterBottom>
                                            {`${t('phone')}: ${selectedTrainer.phone}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.description && (
                                        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} gutterBottom>
                                            {`${t('description')}: ${selectedTrainer.description}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.city && (
                                        <Typography variant="body1">
                                            {`${t('city')}: ${selectedTrainer.city}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.club && (
                                        <Typography variant="body1">
                                            {`${t('club')}: ${selectedTrainer.club}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.trainingExperience && (
                                        <Typography variant="body1">
                                            {`${t('experience')}: ${selectedTrainer.trainingExperience}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.specialization && (
                                        <Typography variant="body1">
                                            {`${t('specialization')}: ${selectedTrainer.specialization}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.instagram && (
                                        <Typography variant="body1">
                                            {`${t('instagram')}: ${selectedTrainer.instagram}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.priceFrom !== null && selectedTrainer.priceTo !== null && (
                                        <Typography variant="body1">
                                            {t('priceRange', { from: selectedTrainer.priceFrom, to: selectedTrainer.priceTo })}
                                        </Typography>
                                    )}
                                    {selectedTrainer.trainingPlanPriceIncludes && (
                                        <Typography variant="body1">
                                            {`${t('trainingPlanIncludes')}: ${selectedTrainer.trainingPlanPriceIncludes}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.whatDoesTheCooperationLookLike && (
                                        <Typography variant="body1">
                                            {`${t('cooperationDetails')}: ${selectedTrainer.whatDoesTheCooperationLookLike}`}
                                        </Typography>
                                    )}
                                    {selectedTrainer.history && (
                                        <Typography variant="body1">
                                            {`${t('history')}: ${selectedTrainer.history}`}
                                        </Typography>
                                    )}
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Button onClick={handleCloseTrainerDetailDialog} color="primary">
                                    {t('close')}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default withAuth(TrainersList);