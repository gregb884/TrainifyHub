import {useEffect, useState} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {getSession , useSession} from "next-auth/react";
import {Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography} from "@mui/material";
import * as React from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/authContext";
import Cookies from 'js-cookie';

export default function CompleteProfile() {
    const router = useRouter();
    const { t, i18n } = useTranslation('completeProfile');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { data: session, status } = useSession();
    const { setUser } = useAuth();
    const [externalToken, setExternalToken] = useState(null);
    const [externalEmail, setExternalEmail] = useState(null);



    useEffect(() => {
        const checkAccess = async () => {
            if (!router.isReady) return;

            const { token, email } = router.query;

            if (token) {
                setExternalToken(token);
                setExternalEmail(email);
                return;
            }

            const session = await getSession();
            if (!session) {
                router.push("/login");
            }
        };

        checkAccess();
    }, [router.isReady]);

    const [lang, setLang] = useState('');

    const normalizeLang = (language) => {
        return language.split('-')[0].toLowerCase();
    };

    useEffect(() => {
        const initialLang = normalizeLang(i18n.language || 'en');
        setLang(initialLang);
        formik.setFieldValue("lang", initialLang);
    }, [i18n.language]);





    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            lang: lang,
        },
        validationSchema: Yup.object({
            role: Yup.string()
                .required(t('required')),
        }),
        onSubmit: async (values) => {
            try {

                const session = await getSession();
                const idToken = externalToken || session?.idToken;
                const email = externalEmail ?? session?.user?.email ?? "";

                if (!idToken) {
                    console.error("❌ Brak tokena");
                    return;
                }



                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/auth/complete-profile`, {
                    email: email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    lang: values.lang,
                    role: values.role === 'Trainer' ? 'TRAINER' : 'USER',
                }, {

                    headers: { Authorization: `${idToken}` },
                    withCredentials: true,

                });

                if (response.status === 200) {
                    await axios.post('/api/set-cookie', { token: response.data }, { withCredentials: true });
                    setUser(response.data);
                    router.push('/dashboard');
                }

                setError('');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
                setError(errorMessage);
            }
        },
    });

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


            <Typography
                variant="h4"
                sx={{ fontFamily: 'Russo One', color: 'white', fontSize: '60px', mb: 5 , mt:2}}
            >
                Trainify
                <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                ub
            </Typography>

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

                        <Typography variant="h4" component="h1" sx={{ fontSize: '18px', color: 'white', mr: 1 }}>
                            {t('completeProfile')}
                        </Typography>

                    </Box>
                    <form onSubmit={formik.handleSubmit}>

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
                </Paper>
            </>

        </Box>
    );
}