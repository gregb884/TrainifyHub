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
    Button, Collapse, Checkbox, DialogTitle, DialogContent, DialogActions, Dialog
} from '@mui/material';
import { useRouter } from 'next/router';
import {getUserId, getUserInfo} from "@/utils/jwtDecode";
import withAuth from "@/components/withAuth";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import Navigation from "@/components/Navigation";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useTranslation } from 'react-i18next';
import DeleteIcon from "@mui/icons-material/Delete";

dayjs.extend(WeekOfYear);

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const TrainingPlan = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const [userId, setUserId] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [newWeekId, setNewWeekId] = useState(null);
    const [duplicateWeekId, setDuplicateWeekId] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [weekToRemove, setWeekToRemove] = useState(null);
    const { t } = useTranslation('trainingPlan');

    useEffect(() => {
        if (id) {
            fetchPlan();
        }

        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            setUserId(getUserId(token));
        }
    }, [id]);

    const handleCreateNewWeek = async () => {
        if (plan.template === true) {

            const firstDate = dayjs('2024-01-01');
            let newWeekStartDate;

            if (plan.weeks.length === 0) {
                newWeekStartDate = firstDate;
            } else {
                const lastWeekEndDate = dayjs(plan.weeks[plan.weeks.length - 1].endDate);
                newWeekStartDate = lastWeekEndDate.add(1, 'day');
            }

            const newWeekEndDate = newWeekStartDate.add(6, 'days');

            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

                const response = await axios.post(
                    `${apiUrl}/api/week/create?planId=${id}`,
                    {
                        startDate: newWeekStartDate.format('YYYY-MM-DD'),
                        endDate: newWeekEndDate.format('YYYY-MM-DD')
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setNewWeekId(response.data);

                await fetchPlan();
            } catch (error) {
                console.error('Error creating new week for template:', error);
            }
        } else {
            setCalendarOpen(true);
        }
    };

    const handleDuplicateNewWeek = (weekId) => {
        setDuplicateWeekId(weekId);
        setCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setCalendarOpen(false);
        setDuplicateWeekId(null);
    };

    const handleGoToWeek = (weekId) => {
        router.push(`${id}/week/${weekId}`);
    };

    const fetchPlan = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/trainingPlan/viewTrainingPlan?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPlan(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching training plan:', error);
            setError('Error fetching training plan');
            setLoading(false);
        }
    };

    const handleDeleteWeek = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(`${apiUrl}/api/week/delete?id=${weekToRemove}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConfirmDialogOpen(false);
            await fetchPlan();
        } catch (error) {
            console.error('Error removing Week:', error);
        }
    };

    const handleToggleWeek = (weekId) => {

        setWeekToRemove(weekId);
        setConfirmDialogOpen(true)

    };

    const handleWeekSelectForCreate = async (startDate) => {
        const start = dayjs(startDate).startOf('week').add(1, 'day');
        const end = start.add(6, 'days');
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

            if (duplicateWeekId) {
                await axios.post(
                    `${apiUrl}/api/week/duplicate-week?weekId=${duplicateWeekId}`,
                    {startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD')},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDuplicateWeekId(null);
            } else {
                const response = await axios.post(
                    `${apiUrl}/api/week/create?planId=${id}`,
                    {startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD')},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setNewWeekId(response.data);
            }

            const planResponse = await axios.get(`${apiUrl}/api/trainingPlan/viewTrainingPlan?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPlan(planResponse.data);
            setCalendarOpen(false);
        } catch (error) {
            console.error('Error creating or duplicating week:', error);
        }
    };

    const getAssignedUser = () => {
        if (plan && plan.users) {
            const assignedUser = plan.users.find(user => user.id !== userId);
            return assignedUser ? assignedUser.username : null;
        }
        return null;
    };



    const assignedUser = getAssignedUser();

    if (loading) {
        return (
            <Box>
                <Navigation title={t('trainingPlan')} />
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <CircularProgress sx={{position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%',color: '#eff0f4'}} />
            </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Navigation title={t('trainingPlan')} />
                <Typography variant="h6" color="error">
                    {t("errorFetchingPlan")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('trainingPlan')} />
            <Box
                component="main"
                sx={{

                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" color="inherit" component="h1" gutterBottom>
                        {plan ? plan.name : 'Training Plan'}
                        {assignedUser && ` ${t('for')} ${assignedUser}`}
                    </Typography>
                    {plan?.weeks?.length > 0 ? (
                        <Box>
                            <Typography color="inherit"  variant="h6">{t('weeks')}</Typography>
                            <List>
                                {plan.weeks.map((week) => (
                                    <Collapse in={true} key={week.id}>
                                        <ListItem
                                            key={week.id}
                                            sx={{
                                                animation: newWeekId === week.id ? ' ease-in-out, shake 0.5s ease-in-out' : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                borderRadius: '20px',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <Box  sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' }, // Kolumna dla xs, wiersz dla md
                                                alignItems: { md: 'center' }, // Wyśrodkowanie w pionie dla md
                                                justifyContent: { xs: 'space-between', md: 'flex-start' }, // Rozciąganie na xs
                                                gap: { xs: 2, md: 0 }, // Odstępy między elementami
                                                width: '100%',
                                            }}>

                                                {plan.template === false && (

                                                    <ListItemText>

                                                        <Typography sx={{fontSize: '14px',width: '200px'}}>
                                                            {t('weekInfo', {
                                                                week: dayjs(week.startDate).week(),
                                                                startDate: dayjs(week.startDate).format('DD-MM'),
                                                                endDate: dayjs(week.endDate).format('DD-MM')
                                                            })}
                                                        </Typography>

                                                    </ListItemText>


                                                )}
                                                {plan.template === true && (
                                                    <ListItemText
                                                        primary={t('week') + ' ' + `${plan.weeks.indexOf(week) + 1}`}
                                                    />
                                                )}


                                                <Box sx={{ display: 'flex',flexDirection: 'row'}}>

                                                {plan.template === false && (
                                                    <Checkbox
                                                        checked={week.done}

                                                        sx={{
                                                            color: week.done ? 'green' : 'gray',
                                                            '& .MuiSvgIcon-root': { fontSize: 28 },
                                                        }}
                                                    />
                                                )}
                                                {plan.template === false && (
                                                    <Typography sx={{marginTop: '13px'}} variant="body2">
                                                        {week.done ? t('done') : t('notDone')}
                                                    </Typography>
                                                )}
                                                </Box>
                                            </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: {xs: 'column' , md: 'row'}, // Ustawienie w kolumnie
                                                        gap: 2,
                                                        marginLeft: '50px',
                                                    }}
                                                >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleGoToWeek(week.id)}
                                                >
                                                    <ArrowForwardIcon />
                                                </Button>
                                                {userId === plan.creatorId && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleDuplicateNewWeek(week.id)}
                                                    >
                                                        <FileCopyIcon/>
                                                    </Button>
                                                )}
                                                {userId === plan.creatorId && (
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => handleToggleWeek(week.id)}
                                                    >
                                                        <DeleteIcon/>
                                                    </Button>
                                                )}
                                            </Box>
                                        </ListItem>
                                    </Collapse>
                                ))}
                            </List>
                            {userId === plan.creatorId && (
                                <Button variant="contained" color="primary" onClick={handleCreateNewWeek}>
                                    {t('createNewWeek')}
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            {userId === plan.creatorId && (
                                <Box>
                                    <Typography color="inherit" variant={"h4"} sx={{marginTop: '100px',marginBottom: '20px'}}>
                                        {t('addFirstWeek')}
                                    </Typography>
                                    <Button variant="contained" sx={{marginTop:'1%'}} color="primary" onClick={handleCreateNewWeek}>
                                        {t('createFirstWeek')}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {userId !== plan.creatorId && plan?.weeks?.length === 0 && (
                        <Box>
                            <Typography variant={"h6"} sx={{marginTop: '100px'}}>
                                {t('noWeeksAvailable')}
                            </Typography>
                        </Box>
                    )}

                    {calendarOpen && (
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ backgroundColor: 'rgb(255,255,255,0.5)', width: 'fit-content',color: '#c6baba', padding: 2, borderRadius: 2, boxShadow: 3 }}>
                                <Calendar
                                    onClickWeekNumber={(weekNumber, date) => handleWeekSelectForCreate(date)}
                                    showFixedNumberOfWeeks
                                    selectRange={false}
                                    showWeekNumbers
                                    tileDisabled={({ activeStartDate, date, view }) => view === 'month'}
                                    tileClassName="react-calendar__tile"
                                    view="month"
                                />

                                {duplicateWeekId !== null && (

                                    <Typography variant={"h6"} sx={{}}>
                                        <ArrowUpwardIcon sx={{
                                            marginLeft: '4.5%',
                                            '@media (max-width: 800px)': {
                                                marginLeft: '2%',
                                            }
                                        }} />
                                        {t('selectWeekToCopy')}
                                    </Typography>

                                )}

                                {duplicateWeekId === null && (

                                    <Typography variant={"h6"} sx={{}}>
                                        <ArrowUpwardIcon sx={{
                                            marginLeft: '4.5%',
                                            '@media (max-width: 800px)': {
                                                marginLeft: '2%',
                                            }
                                        }} />
                                        {t('selectWeek')}
                                    </Typography>

                                )}

                                <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleCalendarClose}>
                                    {t('close')}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Container>
                <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>{t('confirmDelete')}</DialogTitle>
                    <DialogContent>
                        <Typography> {t('confirmDeleteWeek')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            {t('cancel')}
                        </Button>
                        <Button onClick={() => handleDeleteWeek()} color="error">
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default withAuth(TrainingPlan);
