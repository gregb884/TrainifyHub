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
    Tooltip, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Fade from '@mui/material/Fade';

const apiUrl = process.env.NEXT_PUBLIC_API_PROFILE;

const MyProfileUser = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [imageUrl, setImageUrl] = useState('/avatar-default-icon.png');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const fileInputRef = useRef(null);
    const { t } = useTranslation('myProfileUser');
    const [offerMessageOpen, setOfferMessageOpen] = useState(false);
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (router.isReady && router.query['1'] !== undefined) {
            setOfferMessageOpen(true);
        }
    }, [router.isReady, router.query]);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/profile/user/getMyProfile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
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
            await axios.post(`${apiUrl}/api/profile/user/editMyProfile`, profile, {
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
            const response = await axios.post(`${apiUrl}/api/profile/user/uploadImage`, formData, {
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
            const response = await axios.post(`${apiUrl}/api/profile/user/uploadImage`, formData, {
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

    const handleOfferMessageClose = () => {
        setOfferMessageOpen(false);
    };

    const handleDeleteAccount = () => {
        router.push(`/delete-data-app`);
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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box sx={{
                        p: 2,
                        flex: '1 1 100px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Box sx={{p: 2, flex: '1 0 ', backgroundColor: 'transparent'}}>
                            <Box flex={1}>
                                <Typography sx={{color: 'white '}} variant="h4" gutterBottom>
                                    {profile.firstName} {profile.lastName}
                                </Typography>
                            </Box>

                        </Box>

                        {isUploading ? (
                            <Box
                                sx={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: '10%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)', // 🔹 Tło dla ładowania
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
                                    opacity: isImageLoaded ? 1 : 0, // 🔥 Animacja fade-in
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
                            // Zamiast `.click()` na input, wywołaj bridge do Swift
                            if (window.webkit && window.webkit.messageHandlers.fileBridge) {
                                window.webkit.messageHandlers.fileBridge.postMessage("openPicker");
                            } else {
                                // fallback dla przeglądarki / android
                                fileInputRef.current.click();
                            }
                        }}
                                sx={{ marginTop: '16px',width: '180px' }}>
                            {t('uploadNewPhoto')}
                        </Button>

                        <Button variant="contained"  onClick={() => handleDeleteAccount()} sx={{ mt: 2 , backgroundColor: 'yellow',width: '180px' }}>
                            {t('dataManage')}
                        </Button>

                        {editMode ? (
                            <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 }}>
                                {t('save')}
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 2 , width: '180px' }}>
                                {t('editMode')}
                            </Button>
                        )}


                    </Box>

                    <Box sx={{ p: 2, backgroundColor: 'transparent' }}>
                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(500px, 1fr))" gap={2}>
                            <TextField sx={{maxWidth: {md:'auto', xs:'300px'}}}
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

                            <TextField sx={{maxWidth: {md:'auto', xs:'300px'}}}
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
                        </Box>

                        <Typography variant="h4" color="inherit" sx={{ marginTop: 5 , mb: 3 }} gutterBottom>
                            {t('personalFitnessInfo')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>{t('fitnessLevel')}</InputLabel>
                                <Select
                                    label={t('fitnessLevel')}
                                    name="fitnessLevel"
                                    value={profile.fitnessLevel}
                                    onChange={handleInputChange}
                                    inputProps={{
                                        readOnly: !editMode,
                                    }}
                                >
                                    <MenuItem value="Beginner">{t('beginner')}</MenuItem>
                                    <MenuItem value="Intermediate">{t('intermediate')}</MenuItem>
                                    <MenuItem value="Advanced">{t('advanced')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>{t('fitnessGoal')}</InputLabel>
                                <Select
                                    label={t('fitnessGoal')}
                                    name="fitnessGoal"
                                    value={profile.fitnessGoal}
                                    onChange={handleInputChange}
                                    inputProps={{
                                        readOnly: !editMode,
                                    }}
                                >
                                    <MenuItem value="Weight Loss">{t('weightLoss')}</MenuItem>
                                    <MenuItem value="Muscle Building">{t('muscleBuilding')}</MenuItem>
                                    <MenuItem value="Fitness Improvement">{t('fitnessImprovement')}</MenuItem>
                                    <MenuItem value="Rehabilitation">{t('rehabilitation')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>{t('trainingPreferences')}</InputLabel>
                                <Select
                                    label={t('trainingPreferences')}
                                    name="trainingPreferences"
                                    value={profile.trainingPreferences}
                                    onChange={handleInputChange}
                                    inputProps={{
                                        readOnly: !editMode,
                                    }}
                                >
                                    <MenuItem value="Strength Training">{t('strengthTraining')}</MenuItem>
                                    <MenuItem value="Cardio">{t('cardio')}</MenuItem>
                                    <MenuItem value="Yoga">{t('yoga')}</MenuItem>
                                    <MenuItem value="Pilates">{t('pilates')}</MenuItem>
                                    <MenuItem value="Crossfit">{t('crossfit')}</MenuItem>
                                    <MenuItem value="Other">{t('other')}</MenuItem>
                                </Select>
                            </FormControl>

                            <Tooltip title={t('trainingFrequencyTooltip')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('trainingFrequency')}
                                    name="trainingFrequency"
                                    value={profile.trainingFrequency}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                />
                            </Tooltip>

                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>{t('trainingLocation')}</InputLabel>
                                <Select
                                    label={t('trainingLocation')}
                                    name="trainingLocation"
                                    value={profile.trainingLocation}
                                    onChange={handleInputChange}
                                    inputProps={{
                                        readOnly: !editMode,
                                    }}
                                >
                                    <MenuItem value="Gym">{t('gym')}</MenuItem>
                                    <MenuItem value="Home">{t('home')}</MenuItem>
                                    <MenuItem value="Outdoors">{t('outdoors')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Typography color="inherit" variant="h4" sx={{ marginTop: 5 , mb: 3}} gutterBottom>
                            {t('healthInformation')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                            <Tooltip title={t('inCm')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('height')}
                                    name="height"
                                    value={profile.height}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                />
                            </Tooltip>

                            <Tooltip title={t('inKg')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('weight')}
                                    name="weight"
                                    value={profile.weight}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                />
                            </Tooltip>

                            <Tooltip title={t('medicalHistoryTooltip')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('medicalHistory')}
                                    name="medicalHistory"
                                    value={profile.medicalHistory}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                    multiline
                                />
                            </Tooltip>
                        </Box>

                        <Typography color="inherit" variant="h4" sx={{ marginTop: 5 , mb: 3 }} gutterBottom>
                            {t('contactInfo')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('phoneNumber')}
                                name="phoneNumber"
                                value={profile.phoneNumber}
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
                        </Box>

                        <Typography color="inherit" variant="h4" sx={{ marginTop: 5, mb: 3 }} gutterBottom>
                            {t('purchasePreferences')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>{t('planType')}</InputLabel>
                                <Select
                                    label={t('planType')}
                                    name="planType"
                                    value={profile.planType}
                                    onChange={handleInputChange}
                                    inputProps={{
                                        readOnly: !editMode,
                                    }}
                                >
                                    <MenuItem value="Individual">{t('individual')}</MenuItem>
                                    <MenuItem value="Group">{t('group')}</MenuItem>
                                </Select>
                            </FormControl>

                            <Tooltip title={t('trainerPreferencesTooltip')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('trainerPreferences')}
                                    name="trainerPreferences"
                                    value={profile.trainerPreferences}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                    multiline
                                />
                            </Tooltip>
                        </Box>

                        <Typography color="inherit" variant="h4" sx={{ marginTop: 5 , mb: 3 }} gutterBottom>
                            {t('logistics')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
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

                            <Tooltip title={t('availabilityTooltip')}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label={t('availability')}
                                    name="availability"
                                    value={profile.availability}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    onClick={handleInputClick}
                                    onChange={handleInputChange}
                                    multiline
                                />
                            </Tooltip>
                        </Box>

                        <Typography color="inherit" variant="h4" sx={{ marginTop: 5 , mb: 3}} gutterBottom>
                            {t('metrics')}
                        </Typography>

                        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('bmi')}
                                name="bmi"
                                value={profile.bmi?.toFixed(2)}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                onChange={handleInputChange}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label={t('bodyFatPercentage')}
                                name="bodyFatPercentage"
                                value={profile.bodyFatPercentage}
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
                                label={t('targetWeight')}
                                name="targetWeight"
                                value={profile.targetWeight}
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
                                label={t('targetBodyFatPercentage')}
                                name="targetBodyFatPercentage"
                                value={profile.targetBodyFatPercentage}
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
                                label={t('chestCircumference')}
                                name="chestCircumference"
                                value={profile.chestCircumference}
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
                                label={t('waistCircumference')}
                                name="waistCircumference"
                                value={profile.waistCircumference}
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
                                label={t('hipCircumference')}
                                name="hipCircumference"
                                value={profile.hipCircumference}
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
                                label={t('armCircumference')}
                                name="armCircumference"
                                value={profile.armCircumference}
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
                                label={t('thighCircumference')}
                                name="thighCircumference"
                                value={profile.thighCircumference}
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
                                label={t('calfCircumference')}
                                name="calfCircumference"
                                value={profile.calfCircumference}
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
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '200px', width: '100%' }}>
                    {t('snackbarInfo')}
                </Alert>
            </Snackbar>

            <Snackbar
                open={offerMessageOpen}
                autoHideDuration={12000}
                onClose={handleOfferMessageClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleOfferMessageClose} severity="info" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '200px', width: '100%' }}>
                    {t('afterCompletingProfileCheckOffer')}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default withAuth(MyProfileUser);
