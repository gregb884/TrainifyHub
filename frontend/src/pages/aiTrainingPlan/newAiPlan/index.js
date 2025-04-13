import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CssBaseline,
    FormHelperText,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField,
} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import withAuth from '../../../components/withAuth';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import axios from 'axios';
import {useRouter} from "next/router";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const apiUrlAI = process.env.NEXT_PUBLIC_API_AI;
const apiUrlTrainingModule = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const Index = () => {
    const { t } = useTranslation('aiTrainingPlan');
    const [formValues, setFormValues] = useState({
        goal: '',
        experience: '',
        sessionDuration: '',
        equipment: [],
        limitations: '',
        days: [],
        lastPlanId: '',
        primaryFocus: '',
        previousOk: false,
        startDate: null,
    });

    const [calendarOpen, setCalendarOpen] = useState(false);
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [coins, setCoins] = useState(0);
    const router = useRouter();


    const checkCoins = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/checkAiCoins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCoins(response.data);
            } else {
                setCoins(0); // W przypadku błędnej odpowiedzi ustaw 0
            }
        } catch (error) {
            setCoins(0);
        }
    };

    useEffect(() => {
        checkCoins();
    }, []);

    useEffect(() => {
        const fetchTrainingPlans = async () => {

            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrlTrainingModule}/api/trainingPlan/simpleViewAllTrainingPlans`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTrainingPlans(response.data);
            } catch (error) {
                console.error('Error fetching training plans:', error);
            }
        };

        fetchTrainingPlans();
    }, []);


    const handlePreviousOkChange = (event) => {
        const { checked } = event.target;
        setFormValues((prev) => ({ ...prev, previousOk: checked }));
    };

// Obsługa zmiany w polu lastPlanId
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormValues((prev) => ({ ...prev, [field]: value }));

        // Resetowanie previousOk, jeśli użytkownik zmieni plan
        if (field === 'lastPlanId' && !value) {
            setFormValues((prev) => ({ ...prev, previousOk: false }));
        }
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormValues((prev) => {
            const updatedValues = checked
                ? [...prev.equipment, value]
                : prev.equipment.filter((item) => item !== value);
            return { ...prev, equipment: updatedValues };
        });
    };

    const handleDayCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormValues((prev) => {
            const updatedDays = checked
                ? [...prev.days, value]
                : prev.days.filter((day) => day !== value);
            return { ...prev, days: updatedDays };
        });
    };

    const handleStartDateSelection = (date) => {
        const startDate = dayjs(date).startOf('week').add(1, 'day'); // Ustawienie daty na poniedziałek
        setFormValues((prev) => ({ ...prev, startDate: startDate.format('YYYY-MM-DD') }));
        setCalendarOpen(false); // Zamknięcie kalendarza
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!formValues.startDate) {
            alert(t('form.missingStartDate') || 'Please select a start date.');
            return;
        }


        try {
            // Przygotowanie JSON
            const payload = {
                goal: formValues.goal,
                experience: formValues.experience,
                days: formValues.days.join(','), // Łączenie dni w string
                sessionTime: formValues.sessionDuration,
                equipment: formValues.equipment.join(','), // Łączenie sprzętu w string
                preferences: formValues.limitations,
                lastPlanId: formValues.lastPlanId || null, // Jeśli brak planu, ustaw null
                previousOk: formValues.previousOk,
                startDate: formValues.startDate,
                primaryFocus: formValues.primaryFocus,
            };

            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(`${apiUrlAI}/api/request/new`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            await router.push(`/aiTrainingPlan/newAiPlan/${response.data}`);

        } catch (error) {
            alert('Error creating plan. Please try again.');
        }
    };



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('aiPlansTitle')} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 10,
                }}
            >

                {coins > 0 ? (

                    <Container maxWidth="sm" sx={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '24px', borderRadius: '16px' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '25px', color: 'white', mb: 4 }}>
                            {t('mainTitleForm')}
                        </Typography>

                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                            onSubmit={handleSubmit}
                        >
                            {/* Cel */}
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'white' }}>{t('form.goal')}</InputLabel>
                                <Select
                                    value={formValues.goal}
                                    onChange={handleInputChange('goal')}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    }}
                                >
                                    <MenuItem value="muscle_gain">{t('goals.muscle_gain')}</MenuItem>
                                    <MenuItem value="fat_loss">{t('goals.fat_loss')}</MenuItem>
                                    <MenuItem value="endurance">{t('goals.endurance')}</MenuItem>
                                    <MenuItem value="general_fitness">{t('goals.general_fitness')}</MenuItem>
                                </Select>
                            </FormControl>


                            {/* Doświadczenie */}
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'white' }}>{t('form.experience')}</InputLabel>
                                <Select
                                    value={formValues.experience}
                                    onChange={handleInputChange('experience')}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    }}
                                >
                                    <MenuItem value="beginner">{t('experience.beginner')}</MenuItem>
                                    <MenuItem value="intermediate">{t('experience.intermediate')}</MenuItem>
                                    <MenuItem value="advanced">{t('experience.advanced')}</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Wybór dni tygodnia */}
                            <FormGroup>
                                <FormHelperText sx={{ color: 'white' }}>{t('form.daysOfWeek')}</FormHelperText>
                                {['0', '1', '2', '3', '4', '5', '6'].map((day, index) => (
                                    <FormControlLabel
                                        key={day}
                                        control={
                                            <Checkbox
                                                value={day}
                                                onChange={handleDayCheckboxChange}
                                                sx={{
                                                    color: 'white',
                                                    '&.Mui-checked': {
                                                        color: '#b4ca3f',
                                                    },
                                                }}
                                            />
                                        }
                                        label={t(`days.${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index]}`)}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                ))}
                            </FormGroup>

                            {/* Kalendarz wyboru daty startowej */}
                            <Box>
                                <Button
                                    variant="outlined"
                                    sx={{ ':hover': { color: 'white' }, color: 'black', backgroundColor: '#b4ca3f', borderColor: 'white', mb: 2 }}
                                    onClick={() => setCalendarOpen(true)}
                                >
                                    {formValues.startDate
                                        ? `${t('form.startDate')}: ${formValues.startDate}`
                                        : t('form.selectStartDate')}
                                </Button>
                                {calendarOpen && (
                                    <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 2, borderRadius: 2 }}>
                                        <Calendar
                                            onClickWeekNumber={(weekNumber, date) => handleStartDateSelection(date)}
                                            showFixedNumberOfWeeks
                                            selectRange={false}
                                            showWeekNumbers
                                            tileDisabled={({ activeStartDate, date, view }) => view === 'month'}
                                        />

                                        <Typography variant={"h6"} sx={{color: 'white'}}>
                                            <ArrowUpwardIcon sx={{
                                                marginLeft: '-56.5%',
                                                '@media (max-width: 800px)': {
                                                    marginLeft: '-38%',
                                                }
                                            }} />
                                            {t('selectWeek')}
                                        </Typography>

                                    </Box>
                                )}
                            </Box>

                            {/* Czas trwania sesji */}
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'white' }}>{t('form.sessionDuration')}</InputLabel>
                                <Select
                                    value={formValues.sessionDuration}
                                    onChange={handleInputChange('sessionDuration')}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    }}
                                >
                                    <MenuItem value="30">{t('sessionDuration.30')}</MenuItem>
                                    <MenuItem value="60">{t('sessionDuration.60')}</MenuItem>
                                    <MenuItem value="90">{t('sessionDuration.90')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'white' }}>{t('form.primaryFocus')}</InputLabel>
                                <Select
                                    value={formValues.primaryFocus}
                                    onChange={handleInputChange('primaryFocus')}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    }}
                                >
                                    <MenuItem value="chest">{t('primaryFocus.chest')}</MenuItem>
                                    <MenuItem value="legs">{t('primaryFocus.legs')}</MenuItem>
                                    <MenuItem value="glutes">{t('primaryFocus.glutes')}</MenuItem>
                                    <MenuItem value="arms">{t('primaryFocus.arms')}</MenuItem>
                                    <MenuItem value="shoulders">{t('primaryFocus.shoulders')}</MenuItem>
                                    <MenuItem value="fullBodyWorkout">{t('primaryFocus.fullBody')}</MenuItem>
                                    <MenuItem value="ABS">{t('primaryFocus.ABS')}</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Sprzęt */}
                            <FormGroup>
                                <FormHelperText sx={{ color: 'white', mb: 1 }}>{t('form.equipment')}</FormHelperText>
                                {['dumbbells', 'barbell', 'bodyweight', 'machines'].map((equipment) => (
                                    <FormControlLabel
                                        key={equipment}
                                        control={
                                            <Checkbox
                                                value={equipment}
                                                onChange={handleCheckboxChange}
                                                sx={{
                                                    color: 'white',
                                                    '&.Mui-checked': {
                                                        color: '#b4ca3f',
                                                    },
                                                }}
                                            />
                                        }
                                        label={t(`equipment.${equipment}`)}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                ))}
                            </FormGroup>

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'white' }}>{t('form.selectPlan')}</InputLabel>
                                <Select
                                    value={formValues.lastPlanId}
                                    onChange={handleInputChange('lastPlanId')}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    }}
                                >
                                    <MenuItem value="">{t('form.none')}</MenuItem>
                                    {trainingPlans.map((plan) => (
                                        <MenuItem key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Checkbox pojawia się tylko, gdy użytkownik wybierze plan */}
                            {formValues.lastPlanId && (
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formValues.previousOk}
                                                onChange={handlePreviousOkChange}
                                                sx={{
                                                    color: 'white',
                                                    '&.Mui-checked': {
                                                        color: '#b4ca3f',
                                                    },
                                                }}
                                            />
                                        }
                                        label={t('form.previousOk')}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                </FormGroup>
                            )}

                            {/* Ograniczenia */}
                            <TextField
                                label={t('form.limitations')}
                                variant="outlined"
                                multiline
                                rows={3}
                                value={formValues.limitations}
                                onChange={handleInputChange('limitations')}
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{
                                    style: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                    },
                                }}
                            />

                            {/* Przycisk */}
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#b4ca3f',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    fontSize: '18px',
                                    '&:hover': {
                                        backgroundColor: '#00cc00',
                                    },
                                }}
                            >
                                {t('start')}
                            </Button>
                        </Box>
                    </Container>

                ) : (

                    <p>{t('notEnoughCoins')}</p>

                )}


            </Box>
        </Box>
    );
};

export default withAuth(Index);