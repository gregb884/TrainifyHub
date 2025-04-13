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
    TextField,
    Button,
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox, useMediaQuery
} from '@mui/material';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Fade from '@mui/material/Fade';

const apiUrl = process.env.NEXT_PUBLIC_API_PROFILE;

const MyProfileTrainer = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [imageUrl, setImageUrl] = useState('/avatar-default-icon.png');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const fileInputRef = useRef(null);
    const { t } = useTranslation('myProfileTrainer');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isUploading, setIsUploading] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/profile/trainer/getMyProfile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Error fetching profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${apiUrl}/api/profile/trainer/editMyProfile`, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setEditMode(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Error saving profile');
        }
    };

    window.receiveSelectedImageBase64 = function(base64, fileExtension) {

        // 1. Zamień base64 na tablicę bajtów
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);


        let mimeType = "image/jpeg";
        if (fileExtension === "heic") {
            mimeType = "image/heic";
        } else if (fileExtension === "png") {
            mimeType = "image/png";
        }


        const fileName = "photosamplefromios." + fileExtension;


        const file = new File([byteArray], fileName, { type: mimeType });


        handleImageUploadFromSwift(file);
    };

    async function handleImageUploadFromSwift(file) {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setIsImageLoaded(false);

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(`${apiUrl}/api/profile/trainer/uploadImage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setProfile((prevProfile) => ({
                ...prevProfile,
                imageUrl: response.data.imageUrl,
            }));

            setImageUrl(response.data.imageUrl);

            setTimeout(() => {
                setIsUploading(false);
                setIsImageLoaded(true);
            }, 300);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(error.message);
            setIsUploading(false);
        }
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setIsImageLoaded(false);

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(`${apiUrl}/api/profile/trainer/uploadImage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setProfile((prevProfile) => ({
                ...prevProfile,
                imageUrl: response.data.imageUrl,
            }));

            setImageUrl(response.data.imageUrl);

            setTimeout(() => {
                setIsUploading(false);
                setIsImageLoaded(true);
            }, 300);
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
        }
    };

    const handleInputClick = () => {
        if (!editMode) {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDeleteAccount = () => {
        router.push(`/delete-data-app`);
    };

    const handleCheckboxChange = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${apiUrl}/api/profile/trainer/isPublic`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setProfile((prevProfile) => ({
                ...prevProfile,
                isPublic: !prevProfile.isPublic,
            }));
        } catch (error) {
            console.error('Error updating public status:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
                <CssBaseline />
                <Navigation title={'My Profile'} />
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%', color: theme.palette.primary.main }} />
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
            <Navigation title={t('myProfile')} />
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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4,display: { xs: 'none', lg: 'flex' }, gap: 2 }}>
                    <Box sx={{
                        p: 2,
                        flex: '0 0 400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Box
                            component="img"
                            src={profile.imageUrl ? `${process.env.NEXT_PUBLIC_API_PROFILE}${profile.imageUrl}` : '/avatar-default-icon.png'}
                            alt={profile ? profile.username : 'Default Avatar'}
                            value={profile.imageUrl}
                            sx={{
                                width: 400,
                                height: 400,
                                borderRadius: '10%',
                            }}
                        />
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <Button variant="contained" color="primary" onClick={() => fileInputRef.current.click()}
                                sx={{ marginTop: '16px' }}>
                            {t('uploadPhoto')}
                        </Button>
                    </Box>

                    <Box sx={{ p: 2, flex: '1 0 400px', backgroundColor: 'transparent' }}>
                        <Box flex={1}>
                            <Typography sx={{color: 'white', mb: 3}} variant="h4" gutterBottom>
                                {profile.firstName} {profile.lastName}
                            </Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('description')}
                                name="description"
                                value={profile.description}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                                rows={5}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: 'auto',
                                    },
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={profile.isPublic}
                                        onChange={handleCheckboxChange}
                                        color="primary"
                                    />
                                }
                                label={t('publicProfile')}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        color: 'white', // Zmiana koloru czcionki
                                    },
                                }}
                            />
                        </Box>
                        {editMode ? (
                            <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 ,width: '180px', mr: 2}}>
                                {t('save')}
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 2,width: '200px', mr: 2 }}>
                                {t('editMode')}
                            </Button>
                        )}

                        <Button variant="contained"  onClick={() => handleDeleteAccount()} sx={{ mt: 2 , backgroundColor: 'yellow',width: '200px' }}>
                            {t('dataManage')}
                        </Button>
                    </Box>
                </Container>
                </Fade>

                <Fade in={true} timeout={1400}>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box sx={{ p: 2, backgroundColor: 'transparent' }}>
                        <Box  sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr', // Na małych ekranach: 1 kolumna na całą szerokość
                                sm: 'repeat(auto-fill, minmax(300px, 1fr))', // Na średnich i większych ekranach
                            },
                            gap: 2,
                        }}>
                                <Box sx={{
                                    p: 2,
                                    flex: '0 0 400px',
                                    display: {md: 'none', xs: 'flex'},
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {isUploading ? (
                                        <Box
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                borderRadius: '10%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <CircularProgress size={40} />
                                        </Box>
                                    ) : (
                                        <Box
                                            component="img"
                                            src={profile && profile.imageUrl ? `${process.env.NEXT_PUBLIC_API_PROFILE}${profile.imageUrl}` : '/avatar-default-icon.png'}
                                            alt={profile ? profile.username : t('defaultAvatar')}
                                            value={profile.imageUrl}
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                borderRadius: '10%',
                                                opacity: isImageLoaded ? 1 : 0,
                                                transition: 'opacity 0.5s ease-in-out',
                                            }}
                                            onLoad={() => setIsImageLoaded(true)}
                                        />
                                    )}
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                    <Button variant="contained" color="primary" onClick={() => {
                                        if (window.webkit && window.webkit.messageHandlers.fileBridge) {
                                            window.webkit.messageHandlers.fileBridge.postMessage("openPicker");
                                        } else {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                            sx={{ marginTop: '16px' }}>
                                        {t('uploadPhoto')}
                                    </Button>
                                </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    display: {xs: 'flex', md: 'none'},
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    gap: 2,
                                }}
                            >
                                    <Box flex={1}>
                                        <Typography sx={{color: 'white', mb: 3}} variant="h4" gutterBottom>
                                            {profile.firstName} {profile.lastName}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label={t('description')}
                                            name="description"
                                            value={profile.description}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: !editMode,
                                            }}
                                            onClick={handleInputClick}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: 'auto',
                                                },
                                            }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={profile.isPublic}
                                                    onChange={handleCheckboxChange}
                                                    color="primary"
                                                />
                                            }
                                            label={t('publicProfile')}
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    color: 'white', // Zmiana koloru czcionki
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                    {editMode ? (
                                        <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 , mr:2 , width: '200px' }}>
                                            {t('save')}
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 2 , mr: 2,width: '200px' }}>
                                            {t('editMode')}
                                        </Button>
                                    )}

                                        <Button variant="contained"  onClick={() => handleDeleteAccount()} sx={{ mt: 2 , backgroundColor: 'yellow',width: '200px' }}>
                                            {t('dataManage')}
                                        </Button>
                                    </Box>
                                </Box>
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('username')}
                                name="username"
                                value={profile.username}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('firstName')}
                                name="firstName"
                                value={profile.firstName}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('lastName')}
                                name="lastName"
                                value={profile.lastName}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('professionalExperience')}
                                name="professionalExperience"
                                value={profile.professionalExperience}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('trainingExperience')}
                                name="trainingExperience"
                                value={profile.trainingExperience}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('trainingPlanPriceIncludes')}
                                name="trainingPlanPriceIncludes"
                                value={profile.trainingPlanPriceIncludes}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('city')}
                                name="city"
                                value={profile.city}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('club')}
                                name="club"
                                value={profile.club}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('email')}
                                name="email"
                                value={profile.email}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('phone')}
                                name="phone"
                                value={profile.phone}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('instagram')}
                                name="instagram"
                                value={profile.instagram}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('priceFrom')}
                                name="priceFrom"
                                value={profile.priceFrom}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('priceTo')}
                                name="priceTo"
                                value={profile.priceTo}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('whatDoesTheCooperationLookLike')}
                                name="whatDoesTheCooperationLookLike"
                                value={profile.whatDoesTheCooperationLookLike}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('specialization')}
                                name="specialization"
                                value={profile.specialization}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('history')}
                                name="history"
                                value={profile.history}
                                variant="outlined"
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                multiline
                            />
                        </Box>
                        {editMode ? (
                            <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 }}>
                                {t('save')}
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                                {t('editMode')}
                            </Button>
                        )}
                    </Box>
                </Container>
                </Fade>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="info"
                        variant="filled"
                        sx={{
                            color: 'white',
                            backgroundColor: theme.palette.secondary.main,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '50px', // Przesunięcie w dół o 50px
                            width: '100%'
                        }}
                    >
                        {t('enableEditModeInfo')}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default withAuth(MyProfileTrainer);
