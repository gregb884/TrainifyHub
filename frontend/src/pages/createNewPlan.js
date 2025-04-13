import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CssBaseline,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { getUserRole } from "@/utils/jwtDecode";
import withAuth from "@/components/withAuth";
import Navigation from "@/components/Navigation";
import { createNewPlanForUser, createNewPlanForYourself } from "@/pages/api/api TrainingManager/trainingPlans";
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const CreateNewPlan = () => {
    const { t } = useTranslation('createNewPlan');
    const [openDialog, setOpenDialog] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [planType, setPlanType] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            const role = getUserRole(token);
            setUserRole(role);
            if (role === 'ROLE_TRAINER') {
                setOpenDialog(true);  // Otwórz dialog dla trenera
            } else {
                setPlanType('SELF');  // Domyślnie dla zwykłego użytkownika
            }
        }

        const { planType, email } = router.query;
        if (planType) {
            setPlanType(planType);
            setOpenDialog(false);
        }

        if (email) {
            formik.setFieldValue('traineeEmail', email);  // Przekazanie email do formularza
        }
    }, [router.query]);

    const handleCreatePlanForUser = async (values) => {
        try {
            const data = await createNewPlanForUser(values);
            const planId = extractPlanId(data);

            if (planId) {
                await router.push(`/trainingPlan/${planId}`);
            }
        } catch (error) {
            setError(error.response?.data?.message || t('userNotExist'));
        }
    };

    const handleCreatePlanForYourself = async (values) => {
        try {
            const data = await createNewPlanForYourself(values);
            const planId = extractPlanId(data);
            if (planId) {
                await router.push(`/trainingPlan/${planId}`);
            }
        } catch (error) {
            console.error(t('createPlanError'), error);
        }
    };

    const extractPlanId = (message) => {
        const match = message.match(/id:\s*(\d+)/);
        return match ? match[1] : null;
    };

    const handlePlanTypeSelect = (type) => {
        setPlanType(type);  // Ustaw typ planu
        setOpenDialog(false);  // Zamknij dialog po wyborze
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            traineeEmail: planType === 'TRAINEE' ? '' : undefined,
            template: planType === 'TEMPLATE',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('required')),
            traineeEmail: planType === 'TRAINEE' ? Yup.string().email(t('invalidEmail')).required(t('required')) : Yup.string(),
        }),
        onSubmit: async (values) => {
            if (planType === 'TRAINEE') {
                await handleCreatePlanForUser(values);
            } else if (planType === 'TEMPLATE') {
                values.template = true;  // Dodanie klucza template: true
                await handleCreatePlanForYourself(values);  // Wysłanie planu jako szablon
            } else {
                await handleCreatePlanForYourself(values);
            }
        },
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('createNewPlan')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{
                    maxWidth: '1200px',
                    margin: '30px auto 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>

                    {/* Wyświetlenie dialogu z wyborem typu planu */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>{t('selectPlanType')}</DialogTitle>
                        <DialogContent>
                            <Button
                                onClick={() => handlePlanTypeSelect('SELF')}
                                color="primary"
                                variant="contained"
                                fullWidth
                                sx={{ mb: 2 }}>
                                {t('forYourself')}
                            </Button>
                            <Button
                                onClick={() => handlePlanTypeSelect('TRAINEE')}
                                color="primary"
                                variant="contained"
                                fullWidth
                                sx={{ mb: 2 }}>
                                {t('forTrainee')}
                            </Button>
                            <Button
                                onClick={() => handlePlanTypeSelect('TEMPLATE')}
                                color="primary"
                                variant="contained"
                                fullWidth>
                                {t('template')}
                            </Button>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="secondary">
                                {t('cancel')}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Formularz jest widoczny tylko, jeśli wybrano planType */}
                    {planType && (
                        <Box>
                            <Typography variant="h4" color="inherit" component="h1" gutterBottom>
                                {t(planType === 'SELF' ? 'createPlanForSelf' : planType === 'TEMPLATE' ? 'createTemplate' : 'createPlanForTrainee')}
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <Box mb={3} mt={4}>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label={t('name')}
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                        variant="outlined"
                                    />
                                </Box>

                                {planType === 'TRAINEE' && (
                                    <Box mb={3}>
                                        <TextField
                                            fullWidth
                                            id="traineeEmail"
                                            name="traineeEmail"
                                            label={t('traineeEmail')}
                                            value={formik.values.traineeEmail}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.traineeEmail && Boolean(formik.errors.traineeEmail)}
                                            helperText={formik.touched.traineeEmail && formik.errors.traineeEmail}
                                            variant="outlined"
                                        />
                                    </Box>
                                )}
                                <input type="hidden" name="template" value={formik.values.template} />

                                <Button color="primary" variant="contained" fullWidth type="submit">
                                    {t('createPlan')}
                                </Button>
                            </form>
                        </Box>
                    )}

                    {error && (
                        <Typography variant="body1" color="error" className="mb-4">
                            {error}
                        </Typography>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default withAuth(CreateNewPlan);