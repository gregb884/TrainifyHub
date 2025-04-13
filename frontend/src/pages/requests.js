import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/router';
import withAuth from "@/components/withAuth";
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    CircularProgress,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Collapse,
    TextField,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Grid,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import Navigation from "@/components/Navigation";
import { getUserRole } from "@/utils/jwtDecode";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import isoWeek from "dayjs/plugin/isoWeek";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from '@mui/icons-material/Message';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Fade from '@mui/material/Fade';


const apiUrl = process.env.NEXT_PUBLIC_API_PROFILE;
const apiTrainingModuleUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const Requests = () => {
    const { t } = useTranslation('requests');
    const [requests, setRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [unacceptedRequests, setUnacceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAccepted, setShowAccepted] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(15);
    const [search, setSearch] = useState('');
    const [totalElements, setTotalElements] = useState(0);
    const [userRole, setUserRole] = useState('');
    const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [showTemplateList, setShowTemplateList] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [weekDaysSelected, setWeekDaysSelected] = useState([]);
    const [daysError, setDaysError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [requestToRemove, setRequestToRemove] = useState(null);
    const chatRef = useRef();
    const router = useRouter();
    const theme = useTheme();

    dayjs.extend(isoWeek);

    // To send message to Custom Users
    // useEffect(() => {
    //     handleSendMessage('h25jmsnvxn@privaterelay.appleid.com');
    // }, []);

    const fetchRequests = async (page, size, search) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/request/getMyRequest?page=${page}&size=${size}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const accepted = response.data.content.filter(request => request.accepted);
            const unaccepted = response.data.content.filter(request => !request.accepted);
            setRequests(response.data.content);
            setAcceptedRequests(accepted);
            setUnacceptedRequests(unaccepted);
            setTotalElements(response.data.totalElements);
            setUserRole(getUserRole(token));
            setLoading(false);
        } catch (error) {
            console.error(t('fetchError'), error);
            setError(t('fetchError'));
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiTrainingModuleUrl}/api/trainingPlan/myTemplate`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTemplates(response.data);
        } catch (error) {
            console.error(t('fetchError'), error);
            return [];
        }
    };

    useEffect(() => {
        fetchRequests(page, size, search);
    }, [page, size, search]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setShowAccepted(true);
    };

    const handleDelete = async (requestId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.delete(`${apiUrl}/api/request/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { requestId }
            });
            fetchRequests(page, size, search);
           setConfirmDialogOpen(false);
        } catch (error) {
            console.error(t('deleteError'), error);
        }
    };

    const handleAccept = async (requestId, username) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${apiUrl}/api/request/accept`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { requestId }
            });
            const acceptedRequest = unacceptedRequests.find(req => req.id === requestId);

            if (acceptedRequest) {
                setAcceptedRequests([acceptedRequest, ...acceptedRequests]);
                setUnacceptedRequests(unacceptedRequests.filter(req => req.id !== requestId));
            }

            setShowAccepted(true);


        } catch (error) {
            console.error(t('acceptError'), error);
        }
    };

    const handleAcceptNewPlanCreate = async (requestId, username) => {

            router.push({
                pathname: '/createNewPlan',
                query: { planType: 'TRAINEE', email: username }
            });

    };

    const handleShowProfile = (user) => {
        setSelectedUser(user);
        setUserProfileDialogOpen(true);
    };

    const handleCloseProfileDialog = () => {
        setUserProfileDialogOpen(false);
        setSelectedUser(null);
    };

    const handleAssignPlanClick = (event, request) => {
        if (request) {
            setAnchorEl(event.currentTarget);
            setSelectedRequest(request);
        } else {
            console.error("Request is not available");
        }
    };

    const handleSendMessage = (username) => {
        if (chatRef.current) {
            chatRef.current.handleExternalOpen(username);
        } else {
            console.error('chatRef.current is undefined');
        }
    };


    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleShowTemplates = async () => {
        await fetchTemplates();
        setShowTemplateList(true);
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setShowTemplateList(false);
        setDialogOpen(true);
    };

    const handleWeekSelectForCreate = (weekNumber,date) => {
        setSelectedStartDate(dayjs(date).format('YYYY-MM-DD'));
        setSelectedWeek(weekNumber);
    };

    const handleDayToggle = (dayIndex) => {
        const currentIndex = weekDaysSelected.indexOf(dayIndex);
        const newSelectedDays = [...weekDaysSelected];

        if (currentIndex === -1) {
            newSelectedDays.push(dayIndex);
        } else {
            newSelectedDays.splice(currentIndex, 1);
        }

        setWeekDaysSelected(newSelectedDays);

        if (selectedTemplate && newSelectedDays.length === selectedTemplate.trainingDays) {
            setDaysError(false);
        } else {
            setDaysError(true);
        }
    };

    const handlePlanAssign = async () => {
        if (!selectedRequest || !selectedRequest.user) {
            console.error("Selected request or user is not available");
            return;
        }

        if (!selectedTemplate || !selectedTemplate.trainingDays) {
            console.error("Selected template is not available");
            return;
        }

        if (weekDaysSelected.length !== selectedTemplate.trainingDays) {
            setDaysError(true);
            return;
        }

        const body = {
            startDate: selectedStartDate,
            weekDay: weekDaysSelected,
        };

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post(`${apiTrainingModuleUrl}/api/trainingPlan/assignPlan`, body, {
                params: {
                    planId: selectedTemplate.id,
                    userEmail: selectedRequest.user.username,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newPlanId = response.data.match(/id: (\d+)/)[1];

            await router.push(`/trainingPlan/${newPlanId}`);


        } catch (error) {
            console.error("Error assigning plan:", error);
        }
    };


    const handleToggleRequest = (requestId) => {
        setRequestToRemove(requestId);
        setConfirmDialogOpen(true)
    };

    const daysOfWeek = [
        t('monday'),
        t('tuesday'),
        t('wednesday'),
        t('thursday'),
        t('friday'),
        t('saturday'),
        t('sunday'),
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('title')} chatRef={chatRef} />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
                <Toolbar />
                <Fade in={true} timeout={1400}>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {userRole === "ROLE_TRAINER" && (
                    <Typography color="inherit" variant="h4" component="h1" gutterBottom>
                        {t('requestsTitle')}
                    </Typography>

                        )}
                        {userRole === "ROLE_USER" && (
                            <Typography color="inherit" variant="h4" component="h1" gutterBottom>
                                {t('requestsTitleUser')}
                            </Typography>
                                )}


                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label={t('search')}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <TableContainer sx={{backgroundColor: 'rgb(255,255,255,0.7)'}} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('requestId')}</TableCell>
                                    {userRole === "ROLE_TRAINER" && (
                                        <TableCell>{t('user')}</TableCell>
                                    )}
                                    {userRole === "ROLE_USER" && (
                                        <TableCell>{t('trainer')}</TableCell>
                                    )}
                                    <TableCell>{t('action')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {unacceptedRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.id}</TableCell>
                                        {userRole === "ROLE_TRAINER" && (
                                            <TableCell>{`${request.user.firstName} ${request.user.lastName} (${request.user.username})`}</TableCell>
                                        )}
                                        {userRole === "ROLE_USER" && (
                                            <TableCell>{`${request.trainerFirstName} ${request.trainerLastName}`}</TableCell>

                                        )}

                                        <TableCell>
                                            <Grid container spacing={1}>
                                                {userRole === "ROLE_TRAINER" && (
                                                    <>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                ml: 2,
                                                                gap: 0.5,
                                                                mt: 4,
                                                                marginTop: 3,
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleAccept(request.id, request.user.username)}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    width: '60px',
                                                                    height: '40px',
                                                                }}
                                                            >
                                                                <CheckIcon/>

                                                            </Button>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontSize: { xs: '10px', sm: '12px' },
                                                                    color:'black',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {t('accept')}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                ml: 2,
                                                                gap: 0.5,
                                                                mt: 4,
                                                                marginTop: 3,
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleShowProfile(request.user)}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    width: '60px',
                                                                    height: '40px',
                                                                }}
                                                            >
                                                                <PersonSearchIcon/>

                                                            </Button>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontSize: { xs: '10px', sm: '12px' },
                                                                    color:'black',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {t('showProfile')}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                ml: 2,
                                                                gap: 0.5,
                                                                mt: 4,
                                                                marginTop: 3,
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleSendMessage(request.user.username)}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    width: '60px',
                                                                    height: '40px',
                                                                }}
                                                            >
                                                                <MessageIcon/>

                                                            </Button>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontSize: { xs: '10px', sm: '12px' },
                                                                    color:'black',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {t('sendMessage')}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                ml: 2,
                                                                gap: 0.5,
                                                                mt: 4,
                                                                marginTop: 3,
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => handleToggleRequest(request.id)}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    width: '60px',
                                                                    height: '40px',
                                                                }}
                                                            >
                                                                <DeleteIcon/>

                                                            </Button>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontSize: { xs: '10px', sm: '12px' },
                                                                    color:'black',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {t('delete')}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )}
                                                {userRole === 'ROLE_USER' && (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            ml: 2,
                                                            gap: 0.5,
                                                            mt: 4,
                                                            marginTop: 3,
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => handleToggleRequest(request.id)}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '60px',
                                                                height: '40px',
                                                            }}
                                                        >
                                                            <DeleteIcon/>

                                                        </Button>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontSize: { xs: '10px', sm: '12px' },
                                                                color:'black',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {t('delete')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                                <DialogTitle>{t('confirmDelete')}</DialogTitle>
                                <DialogContent>
                                    <Typography> {t('confirmDeleteWeek')}</Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                                        {t('cancel')}
                                    </Button>
                                    <Button onClick={() => handleDelete(requestToRemove)} color="error">
                                        {t('delete')}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{
                            position: 'relative',
                            right: 0,
                            width: '100%',
                            display: 'flex',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            justifyContent: 'space-between', // Rozciąga elementy na szerokość
                            alignItems: 'center',
                            '& .MuiTablePagination-toolbar': {
                                flexWrap: 'wrap',
                                gap: 1,
                            },
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                fontSize: { xs: '12px', sm: 'inherit' }, // Zmniejszenie rozmiaru czcionki na małych ekranach
                            },
                            '& .MuiTablePagination-actions': {
                                flex: '0 0 auto', // Zapewnia poprawne rozmieszczenie przycisków
                            },
                        }}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={size}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                    <Box mt={4}>
                        <Button variant="contained" color="primary" onClick={() => setShowAccepted(!showAccepted)}>
                            {showAccepted ? t('hideAccepted') : t('showAccepted')}
                        </Button>
                        <Collapse in={showAccepted} timeout="auto" unmountOnExit>
                            <TableContainer component={Paper} sx={{backgroundColor: 'rgb(255,255,255,0.7)', mt: 2}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('requestId')}</TableCell>
                                            {userRole === "ROLE_TRAINER" && (
                                                <TableCell>{t('user')}</TableCell>
                                            )}
                                            {userRole === "ROLE_USER" && (
                                                <TableCell>{t('trainer')}</TableCell>
                                            )}
                                            <TableCell>{t('action')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {acceptedRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.id}</TableCell>
                                                {userRole === "ROLE_TRAINER" && (
                                                    <TableCell>{`${request.user.firstName} ${request.user.lastName} (${request.user.username})`}</TableCell>
                                                )}
                                                {userRole === "ROLE_USER" && (
                                                    <TableCell>{`${request.trainerFirstName} ${request.trainerLastName}`}</TableCell>
                                                )}
                                                <TableCell>
                                                    <Grid container spacing={1}>
                                                        {userRole === "ROLE_TRAINER" && (
                                                            <>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        ml: 2,
                                                                        gap: 0.5,
                                                                        mt: 4,
                                                                        marginTop: 3,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={(event) => handleAssignPlanClick(event, request)}
                                                                        sx={{
                                                                            minWidth: 'auto',
                                                                            width: '60px',
                                                                            height: '40px',
                                                                        }}
                                                                    >
                                                                        <PostAddIcon/>

                                                                    </Button>
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            fontSize: { xs: '10px', sm: '12px' },
                                                                            color:'black',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        {t('assignPlan')}
                                                                    </Typography>
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        ml: 2,
                                                                        gap: 0.5,
                                                                        mt: 4,
                                                                        marginTop: 3,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={() => handleShowProfile(request.user)}
                                                                        sx={{
                                                                            minWidth: 'auto',
                                                                            width: '60px',
                                                                            height: '40px',
                                                                        }}
                                                                    >
                                                                        <PersonSearchIcon/>

                                                                    </Button>
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            fontSize: { xs: '10px', sm: '12px' },
                                                                            color:'black',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        {t('showProfile')}
                                                                    </Typography>
                                                                </Box>

                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        ml: 2,
                                                                        gap: 0.5,
                                                                        mt: 4,
                                                                        marginTop: 3,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={() => handleSendMessage(request.user.username)}
                                                                        sx={{
                                                                            minWidth: 'auto',
                                                                            width: '60px',
                                                                            height: '40px',
                                                                        }}
                                                                    >
                                                                        <MessageIcon/>

                                                                    </Button>
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            fontSize: { xs: '10px', sm: '12px' },
                                                                            color:'black',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        {t('sendMessage')}
                                                                    </Typography>
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        ml: 2,
                                                                        gap: 0.5,
                                                                        mt: 4,
                                                                        marginTop: 3,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        onClick={() => handleToggleRequest(request.id)}
                                                                        sx={{
                                                                            minWidth: 'auto',
                                                                            width: '60px',
                                                                            height: '40px',
                                                                        }}
                                                                    >
                                                                        <DeleteIcon/>

                                                                    </Button>
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            fontSize: { xs: '10px', sm: '12px' },
                                                                            color:'black',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        {t('delete')}
                                                                    </Typography>
                                                                </Box>

                                                                <Grid item xs={12} sm={6}>

                                                                    <Menu
                                                                        anchorEl={anchorEl}
                                                                        open={Boolean(anchorEl)}
                                                                        onClose={handleCloseMenu}
                                                                        anchorOrigin={{
                                                                            vertical: 'bottom',
                                                                            horizontal: 'right',
                                                                        }}
                                                                        transformOrigin={{
                                                                            vertical: 'top',
                                                                            horizontal: 'right',
                                                                        }}
                                                                    >
                                                                        <MenuItem onClick={() => handleAcceptNewPlanCreate(selectedRequest.id, selectedRequest.user.username, false)}>
                                                                            {t('newPlan')}
                                                                        </MenuItem>
                                                                        <MenuItem onClick={handleShowTemplates}>
                                                                            {t('newPlanFromTemplate')}
                                                                        </MenuItem>
                                                                    </Menu>
                                                                </Grid>

                                                            </>
                                                        )}



                                                        {showTemplateList && (
                                                            <Dialog open={showTemplateList} onClose={() => setShowTemplateList(false)} fullWidth maxWidth="sm">
                                                                <DialogTitle sx={{backgroundColor: 'white'}}>{t('selectTemplate')}</DialogTitle>
                                                                <DialogContent sx={{backgroundColor: 'white'}}>
                                                                    <List>
                                                                        {templates.map((template) => (
                                                                            <ListItem
                                                                                button
                                                                                key={template.id}
                                                                                onClick={() => handleTemplateSelect(template)}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={template.name}
                                                                                    secondary={`${t('trainingDays')}: ${template.trainingDays}`}
                                                                                />
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </DialogContent>
                                                                <DialogActions sx={{backgroundColor: 'white'}}>

                                                                    <Button onClick={() => setShowTemplateList(false)} color="primary">
                                                                        {t('close')}
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        )}
                                                        {userRole === 'ROLE_USER' && (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    ml: 2,
                                                                    gap: 0.5,
                                                                    mt: 4,
                                                                    marginTop: 3,
                                                                }}
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleToggleRequest(request.id)}
                                                                    sx={{
                                                                        minWidth: 'auto',
                                                                        width: '60px',
                                                                        height: '40px',
                                                                    }}
                                                                >
                                                                    <DeleteIcon/>

                                                                </Button>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontSize: { xs: '10px', sm: '12px' },
                                                                        color:'black',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {t('delete')}
                                                                </Typography>
                                                            </Box>
                                                            )}
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                                            <DialogTitle sx={{backgroundColor: 'white'}}>{t('assignPlan')}</DialogTitle>
                                            <DialogContent sx={{backgroundColor: 'white'}}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Typography variant="h6">{t('selectStartDate')}</Typography>
                                                    <Calendar
                                                        onClickWeekNumber={(weekNumber, date) => handleWeekSelectForCreate(weekNumber, date)}
                                                        showFixedNumberOfWeeks
                                                        selectRange={false}
                                                        showWeekNumbers
                                                        tileDisabled={({ activeStartDate, date, view }) => view === 'month'}
                                                        tileClassName={({ date }) => {
                                                            const currentWeek = dayjs(date).isoWeek(); // Używamy isoWeek lub weekOfYear
                                                            return selectedWeek === currentWeek ? 'react-calendar__tile--active' : '';
                                                        }}
                                                        view="month"
                                                    />
                                                    {selectedStartDate && (
                                                        <>
                                                            <Typography variant="h6" sx={{ mt: 2 }}>
                                                                {t('selectTrainingDays')} ({selectedTemplate?.trainingDays || 0})
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                                                                    <Grid item key={dayIndex}>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={weekDaysSelected.includes(dayIndex)}
                                                                                    onChange={() => handleDayToggle(dayIndex)}
                                                                                />
                                                                            }
                                                                            label={daysOfWeek[dayIndex]}
                                                                        />
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                            {daysError && (
                                                                <Typography color="error">  {t('mustSelectDays')} {selectedTemplate?.trainingDays || 0} {t('days')}.</Typography>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </DialogContent>
                                            <DialogActions sx={{backgroundColor: 'white'}}>
                                                <Button onClick={() => setDialogOpen(false)} color="primary">
                                                    {t('cancel')}
                                                </Button>
                                                <Button onClick={handlePlanAssign} color="primary" disabled={weekDaysSelected.length !== (selectedTemplate?.trainingDays || 0)}>
                                                    {t('assign')}
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Box>
                </Container>
                </Fade>
                <Snackbar
                    open={successMessage}
                    autoHideDuration={4000}
                    onClose={() => setSuccessMessage(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                        {t('planAssigned')}
                    </Alert>
                </Snackbar>
            </Box>
            {selectedUser && (
                <Dialog open={userProfileDialogOpen} onClose={handleCloseProfileDialog} fullWidth maxWidth="sm">
                    <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>{t('userProfile')}</DialogTitle>
                    <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ width: 100, height: 100 }} src={`${process.env.NEXT_PUBLIC_API_PROFILE}${selectedUser.imageUrl}`} />
                        <Typography variant="h6">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="left">

                            <Typography sx={{marginTop: '10px'}} variant="body1">{t('userName')} : {selectedUser.username}</Typography>
                            <Typography variant="body1">{t('fitnessLevel')}: {t(selectedUser?.fitnessLevel || 'na')}</Typography>
                            <Typography variant="body1">{t('fitnessGoal')}: {t(selectedUser.fitnessGoal || 'na')}</Typography>
                            <Typography variant="body1">{t('trainingPreferences')}: {t(selectedUser.trainingPreferences || 'na')}</Typography>
                            <Typography variant="body1">{t('trainingFrequency')}: {selectedUser.trainingFrequency || t('na')}</Typography>
                            <Typography variant="body1">{t('trainingLocation')}: {t(selectedUser.trainingLocation || 'na')}</Typography>
                            <Typography variant="body1">{t('height')}: {selectedUser.height} cm</Typography>
                            <Typography variant="body1">{t('weight')}: {selectedUser.weight} kg</Typography>
                            <Typography variant="body1">{t('medicalHistory')}: {selectedUser.medicalHistory || t('na')}</Typography>
                            <Typography variant="body1">{t('currentIssues')}: {selectedUser.currentIssues || t('na')}</Typography>
                            <Typography variant="body1">{t('dietaryRestrictions')}: {selectedUser.dietaryRestrictions || t('na')}</Typography>
                            <Typography variant="body1">{t('phoneNumber')}: {selectedUser.phoneNumber || t('na')}</Typography>
                            <Typography variant="body1">{t('email')}: {selectedUser.email || t('na')}</Typography>
                            <Typography variant="body1">{t('planType')}: {t(selectedUser.planType || 'na')}</Typography>
                            <Typography variant="body1">{t('trainerPreferences')}: {selectedUser.trainerPreferences || t('na')}</Typography>
                            <Typography variant="body1">{t('city')}: {selectedUser.city || t('na')}</Typography>
                            <Typography variant="body1">{t('availability')}: {selectedUser.availability || t('na')}</Typography>
                            <Typography variant="body1">{t('targetWeight')}: {selectedUser.targetWeight} kg</Typography>
                            <Typography variant="body1">{t('targetBodyFatPercentage')}: {selectedUser.targetBodyFatPercentage || t('na')}</Typography>
                            <Typography variant="body1">{t('chestCircumference')}: {selectedUser.chestCircumference} cm</Typography>
                            <Typography variant="body1">{t('waistCircumference')}: {selectedUser.waistCircumference} cm</Typography>
                            <Typography variant="body1">{t('hipCircumference')}: {selectedUser.hipCircumference} cm</Typography>
                            <Typography variant="body1">{t('armCircumference')}: {selectedUser.armCircumference} cm</Typography>
                            <Typography variant="body1">{t('thighCircumference')}: {selectedUser.thighCircumference} cm</Typography>
                            <Typography variant="body1">{t('calfCircumference')}: {selectedUser.calfCircumference} cm</Typography>
                            <Typography variant="body1">{t('bmi')}: {selectedUser.bmi?.toFixed(1)}</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                        <Button onClick={handleCloseProfileDialog} color="primary">
                            {t('close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default withAuth(Requests);