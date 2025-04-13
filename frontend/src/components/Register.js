import {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {TextField, Button, Box, Typography, Paper, MenuItem, IconButton, Menu} from '@mui/material';
import {useTranslation} from "react-i18next";
import * as React from "react";
import {router} from "next/client";
import LanguageIcon from "@mui/icons-material/Language";
import Cookies from "js-cookie";

export default function Register() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { t, i18n } = useTranslation('register');
    const [anchorEl, setAnchorEl] = useState(null);

    const [lang, setLang] = useState('');

    const normalizeLang = (language) => {
        return language.split('-')[0].toLowerCase(); // Usuwa sufiks, np. 'pl-PL' -> 'pl'
    };

    useEffect(() => {
        const initialLang = normalizeLang(i18n.language || 'en');
        setLang(initialLang);
    }, [i18n.language]);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        Cookies.set('language', language, { expires: 365 });
    };


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            role: '',
            lang: lang,
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t('invalidEmail')).required(t('required')),
            password: Yup.string().required(t('required')),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], t('PasswordsMustMatch'))
                .required(t('required')),
            role: Yup.string()
                .required(t('required')),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/register', {
                    username: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    lang: values.lang,
                    role: values.role === 'Trainer' ? 'TRAINER' : 'USER',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setSuccess(true);
                setError('');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
                setError(errorMessage);
                setSuccess(false);
            }
        },
    });

    useEffect(() => {
        formik.setFieldValue('lang', lang);
    }, [lang]);

    const handleLogin = async () => {
        await router.push('/login');
    };

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >

            {success === false && (

                <Typography
                    variant="h4"
                    sx={{ fontFamily: 'Russo One', color: 'white', fontSize: '60px', mb: 5 , mt:2}}
                >
                    Trainify
                    <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                    ub
                </Typography>

            )}

            {success ? (

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                    }}
                >

                    <Typography
                        variant="h4"
                        sx={{ fontFamily: 'Russo One', color: 'white', fontSize: '60px', mb: 5 }}
                    >
                        Trainify
                        <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                        ub
                    </Typography>

                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 400,backgroundColor: 'rgb(255,255,255,0.1)' }}>
                    <Typography variant="h5"  color="primary" gutterBottom>
                        {t('registrationSuccessful')}
                    </Typography>
                    <Typography sx={{color: 'white'}}>
                        {t('registerMessageSuccessful')}
                    </Typography>
                    <Button onClick={() => handleLogin()} color="primary" sx={{mt: 4}} variant="contained" fullWidth type="submit">
                        {t('logIn')}
                    </Button>
                </Paper>
                </Box>
            ) : (
                <>

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
                                {t('register')}
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
                            <Box mt={2} mb={3}>
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
                                    InputLabelProps={{
                                        style: {  },
                                    }}
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
                                    InputLabelProps={{
                                        style: {  },
                                    }}
                                />
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label={t('confirmPassword')}
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {  },
                                    }}
                                />
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label={t('firstName')}
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { },
                                    }}
                                />
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label={t('lastName')}
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {  },
                                    }}
                                />
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="role"
                                    name="role"
                                    label={t('role')}
                                    select
                                    value={formik.values.role}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.role && Boolean(formik.errors.role)}
                                    helperText={formik.touched.role && formik.errors.role}
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {  },
                                    }}

                                >
                                    <MenuItem value="">
                                        <em>
                                            {t('selectRole')}
                                        </em>
                                    </MenuItem>
                                    <MenuItem value="Trainer">{t('trainer')}</MenuItem>
                                    <MenuItem value ="User">{t('user')}</MenuItem>
                                </TextField>
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="lang"
                                    name="lang"
                                    label={t('region')}
                                    select
                                    value={formik.values.lang}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {  },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>
                                            {t('selectRegion')}
                                        </em>
                                    </MenuItem>

                                    <MenuItem value="en">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src="/gb.svg" alt="English" width="20" />
                                            {t('english')}
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="pl">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src="/pl.svg" alt="Polski" width="20" />
                                            {t('polish')}
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="de">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src="/de.svg" alt="Deutsch" width="20" />
                                            {t('germany')}
                                        </Box>
                                    </MenuItem>
                                </TextField>
                            </Box>
                            {error && (
                                <Typography sx={{mb:4, color: 'yellow'}} variant="body2" className="mb-4">
                                    {t(error)}
                                </Typography>
                            )}
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                {t('registerEnd')}
                            </Button>
                        </form>
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
                                    onClick={() => router.push('/login')}
                                >
                                    {t('signIn')}
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>
                </>
            )}
        </Box>
    );
}