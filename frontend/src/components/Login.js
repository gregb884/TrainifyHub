
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CssBaseline,
    MenuItem,
    Menu,
    IconButton,
    Snackbar, Alert, Stack, styled, Divider
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import {GoogleIcon, FacebookIcon, SitemarkIcon, AppleIcon} from '/src/components/CustomIcons';
import { signIn } from "next-auth/react";
import { useSession, getSession } from "next-auth/react";
import Fade from '@mui/material/Fade';

export default function Login() {
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser } = useAuth();
    const { t, i18n } = useTranslation('login');
    const [anchorEl, setAnchorEl] = useState(null);
    const [activationStatus, setActivationStatus] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { data: session } = useSession();
    const [notReadyIos, setNotReadyIos] = useState(false);


    const sendMessageToIOS = () => {
        if (window.webkit && window.webkit.messageHandlers.iosBridge) {
            setNotReadyIos(true);
        } else {
            console.log("❌ iOS bridge not found");
        }
    };

    window.receiveGoogleLogin = (token, email) => {
        sendTokenToBackend(token, email);
    };

    window.receiveAppleLogin = (token) => {
        sendTokenToBackendApple(token);
    };

    const openGoogleSignInIos = () => {

        window.webkit?.messageHandlers?.iosBridge?.postMessage("loginWithGoogle");

    }

    const handleAppleSignIn = () => {
        window.webkit?.messageHandlers?.iosBridge?.postMessage("loginWithApple");
    };

    useEffect(() => {
        sendMessageToIOS();
    }, []);

    const sendTokenToBackendApple = async ( externalToken = null ) => {


        const idToken = externalToken || session?.idToken;


        if (idToken) {

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/auth/apple`, {}, {
                    headers: { Authorization: `${idToken}` },
                });


                if (response.data === 'newUser') {
                    if (externalToken) {
                        await router.push(`/complete-profile?token=${externalToken}}`);
                    } else {
                        await router.push(`/complete-profile`);
                    }

                }

                if (response.data.startsWith('token:'))
                {

                    const token = response.data.replace('token:', '').trim();
                    await axios.post('/api/set-cookie', { token: token }, { withCredentials: true });
                    setUser(token);
                    router.push('/dashboard');
                }

                else {

                    console.log("Error", response.data);
                }
            } catch (error) {
                console.error("Error from backend:", error);
                alert(error.message);
            }
        }
    };

    const sendTokenToBackend = async ( externalToken = null, externalEmail = null ) => {

        const session = await getSession();

        const idToken = externalToken || session?.idToken;
        const email = externalEmail || session?.user?.email;


        if (idToken && email) {

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/auth/google`, {}, {
                    headers: { Authorization: `${idToken}` },
                });


                if (response.data === 'newUser') {
                    if (externalToken && externalEmail) {
                        await router.push(`/complete-profile?token=${externalToken}&email=${externalEmail}`);
                    } else {
                        await router.push(`/complete-profile`);
                    }
                }

                if (response.data.startsWith('token:'))
                {

                    const token = response.data.replace('token:', '').trim();
                    await axios.post('/api/set-cookie', { token: token }, { withCredentials: true });
                    setUser(token);
                    router.push('/dashboard');
                }

                else {

                    console.log("Error", response.data);
                }
            } catch (error) {
                console.error("Error from backend:", error);
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        if (session?.accessToken) {
            sendTokenToBackend();
        }
    }, [session]);


    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        Cookies.set('language', language, { expires: 365 });
    };

    useEffect(() => {
        const token = router.query.token;
        if (token) {
            activateAccount(token);
        }
    }, [router.query.token]);


    const activateAccount = async (token) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/activate?token=${token}`);
            if (response.data === 'Activated') {
                setActivationStatus('success');
            } else {
                setActivationStatus('error');
            }
        } catch (error) {
            setActivationStatus('error');
        } finally {
            setShowSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t('invalidEmail')).required(t('required')),
            password: Yup.string().required(t('required')),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(
                    '/api/login',
                    {
                        username: values.email,
                        password: values.password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );
                setUser(response.data);
                router.push('/dashboard');
            } catch (error) {
                setError(error.response?.data?.message || t('loginError'));
            }
        },
    });

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const SignInContainer = styled(Stack)(({ theme }) => ({
        height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
        minHeight: '100%',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
        },
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            ...theme.applyStyles('dark', {
                backgroundImage:
                    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            }),
        },
    }));


    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '95vh',
                p: 2,
            }}
        >

            <Fade in={true} timeout={1400}>
            <Typography
                variant="h4"
                sx={{ fontFamily: 'Russo One', color: 'white', fontSize: '60px', mb: 5 }}
            >
                Trainify
                <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                ub
            </Typography>
            </Fade>

            <CssBaseline />




            <Fade in={true} timeout={1400}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 400,backgroundColor: 'rgb(255,255,255,0.1)' }}>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'left',
                        width: '100%',
                        mb: 5,
                    }}
                >

                    <Typography variant="h4" component="h1" sx={{ color: 'white', mr: 1 }}>
                        {t('logIn')}
                    </Typography>


                    <IconButton onClick={openMenu}>
                        <LanguageIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                        <MenuItem onClick={() => handleLanguageChange('en')}>
                            <img src="/gb.svg" alt="English" width="20" style={{ marginRight: '10px' }} />
                            English
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange('pl')}>
                            <img src="/pl.svg" alt="Polski" width="20" style={{ marginRight: '10px' }} />
                            Polski
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange('de')}>
                            <img src="/de.svg" alt="Deutsch" width="20" style={{ marginRight: '10px' }} />
                            Deutsch
                        </MenuItem>
                    </Menu>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label={t('email')}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label={t('password')}
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                        />
                    </Box>
                    {error && (
                        <Typography variant="body2"  sx={{ mb: 2, color: "yellow" }}>
                            {t(error)}
                        </Typography>
                    )}
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        {t('logIn')}
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{color: 'white'}}>
                        <Box
                            component="span"
                            sx={{
                                color: 'white',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                            onClick={() => router.push('/register')}
                        >
                            {t('forgotPassword')} ?{' '}
                        </Box>
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        borderColor: 'black',
                        borderWidth: '3px',
                        opacity: 1,
                        marginY: 3,
                        color: 'white',
                        textAlign: 'center',
                        '&::before, &::after': {
                            borderWidth: '1px', // Grubość kreski po obu stronach tekstu
                        },
                    }}
                >
                    {t('or')}
                </Divider>

                {notReadyIos === false &&

                    <Button
                        startIcon={<GoogleIcon />}
                        sx={{backgroundColor: 'rgb(255,255,255,0.2)', color: 'white', mb: 2}}
                        variant="contained"
                        fullWidth
                        onClick={() => signIn("google")}
                    >
                        {t('signWithGoogle')}
                    </Button>

                }

                {notReadyIos === true &&

                    <Button
                        startIcon={<GoogleIcon />}
                        sx={{backgroundColor: 'rgb(255,255,255,0.2)', color: 'white', mb: 2}}
                        variant="contained"
                        fullWidth
                        onClick={openGoogleSignInIos}
                    >
                        {t('signWithGoogle')}
                    </Button>

                }

                {notReadyIos === true &&

                <Button
                    startIcon={<AppleIcon
                    sx={{
                        width: 26,
                        height: 26,
                        color: 'white',
                        marginLeft: '-14px'
                    }}

                />}
                    sx={{backgroundColor: 'rgb(255,255,255,0.2)',color: 'white'}}
                    variant="contained"
                    fullWidth
                    onClick={handleAppleSignIn}
                >
                    {t('signWithApple')}
                </Button>

                }

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{color: 'white'}}>
                        {t('noAccount')} ?{' '}
                        <Box
                            component="span"
                            sx={{
                                color: 'primary.main',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                            onClick={() => router.push('/register')}
                        >
                            {t('signUp')}
                        </Box>
                    </Typography>
                </Box>
            </Paper>
            </Fade>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={activationStatus === 'success' ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {activationStatus === 'success'
                        ? t('accountActivated')
                        : t('activationFailed')}
                </Alert>
            </Snackbar>
        </Box>
    );
}