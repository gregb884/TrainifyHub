import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    Toolbar,
    List, ListItem, ListItemText,
    CircularProgress,
    Button, Checkbox, DialogTitle, DialogContent, DialogActions, Dialog
} from '@mui/material';
import { useRouter } from 'next/router';
import { getUserId } from "@/utils/jwtDecode";
import withAuth from "@/components/withAuth";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from "@/components/Navigation";
import { useTranslation } from 'react-i18next';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from "@mui/icons-material/Delete";

dayjs.extend(isoWeek);

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const TrainingPlanWeek = () => {
    const [week, setWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id,weekid } = router.query;
    const [userId, setUserId] = useState(null);
    const [checkedDays, setCheckedDays] = useState([]);
    const [dayToRemove, setDayToRemove] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const { t } = useTranslation('trainingPlanWeek');
    const [planForUser, setPlanForUser] = useState(null);

    useEffect(() => {
        const fetchWeek = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get(`${apiUrl}/api/week/view?id=${weekid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWeek(response.data);
                await handleGetUserInPlan();
                setLoading(false);
            } catch (error) {
                console.error('Error fetching week details:', error);
                setError('Error fetching week details');
                setLoading(false);
            }
        };

        if (weekid) {
            fetchWeek();
        }

        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            setUserId(getUserId(token));
        }
    }, [weekid]);

    const handleToggleDay = (dayName) => {
        const existingDay = week.days.find(d => d.name === dayName);

        if (existingDay) {
            setDayToRemove(existingDay);
            setConfirmDialogOpen(true);
        } else {
            if (checkedDays.includes(dayName)) {
                setCheckedDays(checkedDays.filter(day => day !== dayName));
            } else {
                setCheckedDays([...checkedDays, dayName]);
            }
        }
    };

    const handleRemoveDay = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(`${apiUrl}/api/day/delete?id=${dayToRemove.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const response = await axios.get(`${apiUrl}/api/week/view?id=${weekid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWeek(response.data);
            setCheckedDays(checkedDays.filter(day => day !== dayToRemove.name));
            setDayToRemove(null);
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error('Error removing day:', error);
        }
    };

    const handleGetUserInPlan = async () => {

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

            const response = await axios.get(`${apiUrl}/api/trainingPlan/userInTrainingPlan?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPlanForUser(response.data);

        }catch(error) {

            console.error('No user in plan', error);
        }



        };


    const handleNavigateToDay = (dayId) => {
        router.push(`/trainingPlan/${id}/week/${weekid}/day/${dayId}`);
    };

    const handleStartTraining = (dayId) => {

        router.push(`/trainingSession?dayId=${dayId}`);
    };

    const handleCreateDays = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const startDate = dayjs(week.startDate); // startDate to początek tygodnia (pierwszy dzień tygodnia)

            for (const dayName of checkedDays) {
                // Znajdujemy offset dla dnia tygodnia na podstawie jego pozycji w tygodniu
                const dayOffset = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(dayName);

                // Dodajemy offset do startDate, aby uzyskać prawidłową datę dla każdego dnia tygodnia
                const dayDate = startDate.startOf('isoWeek').add(dayOffset, 'day').format('YYYY-MM-DD');

                const newDay = {
                    name: dayName,
                    plannedDate: dayDate,
                };

                await axios.post(`${apiUrl}/api/day/create?weekId=${weekid}`, newDay, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            const response = await axios.get(`${apiUrl}/api/week/view?id=${weekid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWeek(response.data);
            setCheckedDays([]);
        } catch (error) {
            console.error('Error creating days:', error);
        }
    };


    const isSpecialTemplate = (startDate) => {
        return dayjs(startDate).isBefore(dayjs('2024-06-01'));
    };

    const getWeekNumberFromStartOfYear = (startDate) => {
        const firstDate = dayjs('2024-01-01');
        return dayjs(startDate).diff(firstDate, 'week') + 1;
    };

    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={t('weekDetails')} />
                <CircularProgress sx={{position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%',color: '#eff0f4'}} />
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
            <Navigation title={t('weekDetails')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4  }}>
                    <Typography color="inherit" variant="h4" sx={{fontSize: {xs: '20px', xl: '40px'}}} component="h1" gutterBottom>
                        {week ? (
                            isSpecialTemplate(week.startDate) ? (
                                t('week') + ' ' + getWeekNumberFromStartOfYear(week.startDate)
                            ) : (
                                t('weekInfo', { startDate: dayjs(week.startDate).format('DD-MM-YYYY'), endDate: dayjs(week.endDate).format('DD-MM-YYYY') })
                            )
                        ) : (
                            t('weekDetails')
                        )}
                    </Typography>
                    {userId === week.creatorId && (
                        <Typography color="inherit" variant="h4" sx={{ marginTop: '40px',fontSize: {xs: '20px', xl: '30px'} }}>{t('selectTrainingDays')}</Typography>
                    )}
                    {userId !== week.creatorId && (
                        <Typography color="inherit" variant="h4" sx={{ marginTop: '40px',fontSize: {xs: '20px', xl: '30px'} }}>{t('selectedTrainingDays')}</Typography>
                    )}

                    <List sx={{marginLeft: '-30px'}}>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((dayKey) => {
                            const existingDay = week.days.find(d => d.name.toLowerCase() === dayKey);
                            const isChecked = checkedDays.includes(dayKey);

                            return (
                                <ListItem  key={dayKey} sx={{ '& .MuiListItemText-primary': { color: 'white !important' ,marginLeft: '-5px',fontWeight: 'bold', width: '140px' ,fontSize: {xs: '15px', xl: '24px'} } }}>
                                    <Checkbox
                                        checked={isChecked || !!existingDay}
                                        onChange={() => handleToggleDay(dayKey)}
                                        disabled={!!existingDay}

                                    />
                                    <ListItemText
                                        primary={t(dayKey)} // Pobiera tłumaczenie na podstawie dayKey (np. "monday", "tuesday" itd.)
                                        sx={{ color: existingDay ? '#fff' : '#aaa' }}
                                    />

                                    {userId === planForUser && existingDay && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                ml: 2,
                                                gap: 0.5,
                                                mt: 4
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleStartTraining(existingDay.id)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                {existingDay.doneDate === null ? <PlayArrowIcon /> : <EditNoteIcon />}
                                            </Button>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: '10px', sm: '12px' },
                                                    color:'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {existingDay.doneDate === null ? t('startTraining') : t('trainingDone')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {existingDay && userId === week.creatorId && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                ml: { xs: 1, md: 4 },
                                                gap: 0.5,
                                                mt: 4
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleNavigateToDay(existingDay.id)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: '10px', sm: '12px' },
                                                    textAlign: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                {t('addEditExercise')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {existingDay && userId === week.creatorId && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                ml: { xs: 1, md: 4 },
                                                gap: 0.5,
                                                mt: 4
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleToggleDay(dayKey)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: '10px', sm: '12px' },
                                                    textAlign: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                {t('deleteDay')}
                                            </Typography>
                                        </Box>
                                    )}



                                    { (week.creatorId === 1 || week.creatorId === 2) && existingDay && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                ml: { xs: 1, md: 4 },
                                                gap: 0.5,
                                                mt: 4
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleNavigateToDay(existingDay.id)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: '10px', sm: '12px' },
                                                    textAlign: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                {t('addWeight')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {(userId !== week.creatorId && week.creatorId !== 1 && week.creatorId !== 2) && existingDay && (

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                ml: { xs: 1, md: 4 },
                                                gap: 0.5,
                                                mt: 4
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleNavigateToDay(existingDay.id)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: '10px', sm: '12px' },
                                                    textAlign: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                {t('goToDayDetails')}
                                            </Typography>
                                        </Box>

                                    )}

                                </ListItem>
                            );
                        })}
                    </List>

                    {userId === week.creatorId && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateDays}
                            sx={{ mt: 2 }}
                            disabled={checkedDays.length === 0}
                        >
                            {t('createDay')}
                        </Button>
                    )}
                </Container>
                <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>{t('confirmDelete')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('confirmDeleteDay', { dayName: t(dayToRemove?.name) })}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleRemoveDay} color="error">
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default withAuth(TrainingPlanWeek);