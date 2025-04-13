'use client';

import * as React from 'react';

import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Grid,
    Paper,
    Modal, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import withAuth from '../components/withAuth';
import {useRouter} from "next/router";
import {getUserLang, getUserRole} from "@/utils/jwtDecode";
import axios from "axios";
import {useEffect, useState} from "react";
import {fetchSumMyPlans, fetchSumPlans} from "./api/api TrainingManager/trainingPlans"
import {fetchSumUsers} from "@/pages/api/api TrainingManager/userInfo";
import Navigation from '../components/Navigation';
import { useTranslation } from 'react-i18next';
import Cookies from "js-cookie";
import dayjs from "dayjs";
import 'dayjs/locale/pl';
import 'dayjs/locale/de';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DrawIcon from '@mui/icons-material/Draw';
import CloseIcon from '@mui/icons-material/Close';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Fade from '@mui/material/Fade';

const drawerWidth = 240;

function DashboardContent() {
    const router = useRouter();
    const { t, i18n } = useTranslation('dashboard');
    const apiProfileRequest = process.env.NEXT_PUBLIC_API_PROFILE;
    const apiTrainingManager = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [digitalGoods, setDigitalGoods] = useState('');

    const [userRole, setUserRole] = useState(null);

    const sendMessageToIOS = () => {
        if (window.webkit && window.webkit.messageHandlers.iosBridge) {
            window.webkit.messageHandlers.iosBridge.postMessage("Hello from React!");
            console.log("✅ Wiadomość wysłana do iOS!");
        } else {
            console.log("❌ iOS bridge not found");
        }
    };


    useEffect(() => {

        sendMessageToIOS();
        if ('getDigitalGoodsService' in window) {

            setDigitalGoods('✅Dostępny serwis');
            console.log("✅ Digital Goods API dostępne!");
        } else {

            setDigitalGoods('❌ Nie dostępny serwis');
            console.log("❌ Digital Goods API NIE jest dostępne!");
        }
    }, []);

    const bannerItems = [
        {
            image: '/preMadePlans.webp',
            titleKey: 'readyTrainingPlans',
            link: '/offer/workoutPlans',
        },
        {
            image: '/aiPlans.png',
            titleKey: 'createAiPlan',
            link: '/aiTrainingPlan',
        },
        {
            image: '/trainerWay.png',
            titleKey: 'findTrainer',
            link: '/trainerList',
        },
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + bannerItems.length) % bannerItems.length);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
        }, 5000);

        return () => clearInterval(interval); // Czyść interval przy odmontowaniu
    }, []);



    const currentItem = bannerItems[currentIndex];

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {

            fetchFCM(token)

        } else {
            console.log("⚠️ Missing Token FCM");
        }
    }, []);

    const fetchFCM = async (tokenFcm) => {

        const tokenAuth = Cookies.get('token');
        if (!tokenAuth) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_NOTIFICATION}/api/user/addFCM?fcmToken=${tokenFcm}`, {}, {
                headers: {
                    Authorization: `Bearer ${tokenAuth}`,
                },
                withCredentials: true,
            });

        } catch (error) {

        }


    };


    useEffect(() => {
        if (i18n.language === 'pl') {
            dayjs.locale('pl');
        } else if (i18n.language === 'de') {
            dayjs.locale('de');
        } else {

            dayjs.locale('en');
        }
    }, [i18n.language]);



    const [sumPlans, setSumPlans] = useState(0);

    useEffect(() => {
        const getSumPlans = async () => {
            try {
                const sumPlans = await fetchSumPlans();
                setSumPlans(sumPlans);
            } catch (error) {
                console.error('Failed to fetch sum plans:', error);
            }
        };

        getSumPlans();
    }, []);

    const [isLoadingRole, setIsLoadingRole] = useState(true);

    useEffect(() => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            setUserRole(getUserRole(token));
        }
        setIsLoadingRole(false);
    }, []);


    const [sumUsers, setSumUsers] = useState(0);

    useEffect(() => {
        const getSumUsers = async () => {
            try {
                const sumUsers = await fetchSumUsers();
                setSumUsers(sumUsers)
            } catch (error) {
                console.error('Failed to fetch sum plans:', error);
            }
        };

        getSumUsers();
    }, []);


    const [myNearestTraining, setMyNearestTraining] = useState('');
    const [trainingDate, setTrainingDate] = useState('');


    useEffect(() => {
        const getNearestTraining = async () => {
            try {
                const nearestTraining = await fetchNearestTraining();
                setTrainingDate(nearestTraining.startDate);
                setMyNearestTraining(nearestTraining.name);
            } catch (error) {
                console.error('Error fetching nearest training:', error);
            }
        };

        getNearestTraining();
    }, []);

    const fetchNearestTraining = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_TRAINING_MANAGER}/api/trainingPlan/getNextTraining`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {

        }


    };



    const [sumMyPlans, setSumMyPlans] = useState(0);

    useEffect(() => {
        const getSumMyPlans = async () => {
            try {
                const sumMyPlans = await fetchSumMyPlans();
                setSumMyPlans(sumMyPlans)
            } catch (error) {
                console.error('Failed to fetch sum plans:', error);
            }
        };

        getSumMyPlans();
    }, []);

    const [sumRequest, setSumRequest] = useState(0);

    const fetchSumRequest = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${apiProfileRequest}/api/request/countRequest`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching sum plans:', error);
            throw error;
        }


    };

    const [sumNotDoneRequest, setSumNotDoneRequest] = useState(0);

    const fetchSumNotDoneRequest = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AI}/api/request/countRequestWithoutPlanQuantity`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching sum plans:', error);
            throw error;
        }


    };

    useEffect(() => {
        const getSumNotDoneRequest = async () => {

            try {
                const sumNotDoneRequest = await fetchSumNotDoneRequest();
                setSumNotDoneRequest(sumNotDoneRequest);
            } catch (error) {
                console.error('Error fetching sumNotDoneRequest:', error);
            }
        };
        getSumNotDoneRequest();
    }, []);

    const [sumRequestAiToAssign, setSumRequestAiToAssign] = useState(0);

    const fetchRequestAiToAssign = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AI}/api/request/countRequestAiToAssign`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching sum plans:', error);
            throw error;
        }


    };

    useEffect(() => {
        const getSumRequestAiToAssign = async () => {

            try {
                const sumRequestAiToAssign = await fetchRequestAiToAssign();
                setSumRequestAiToAssign(sumRequestAiToAssign);
            } catch (error) {
                console.error('Error fetching sumNotDoneRequest:', error);
            }
        };
        getSumRequestAiToAssign();
    }, []);

    useEffect(() => {
        if (userRole === 'ROLE_TRAINER') {
            const getSumRequest = async () => {
                try {
                    const sumRequest = await fetchSumRequest();
                    setSumRequest(sumRequest);
                } catch (error) {
                    console.error('Failed to fetch sum request:', error);
                }
            };

            getSumRequest();
        }
    }, [userRole]);


    const [sumSchema, setSumSchema] = useState(0);

    const fetchSumSchema = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${apiTrainingManager}/api/trainingPlan/sumSchema`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching sum plans:', error);
            throw error;
        }


    };


    useEffect(() => {
        if (userRole === 'ROLE_TRAINER') {
            const getSumSchema = async () => {
                try {
                    const sumSchema = await fetchSumSchema();
                    setSumSchema(sumSchema);
                } catch (error) {
                    console.error('Failed to fetch sum request:', error);
                }
            };

            getSumSchema();
        }
    }, [userRole]);


    const [sumToCheck , setSumToCheck] = useState(0);

    const fetchSumToCheck = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${apiTrainingManager}/api/trainingPlan/sumPlanToCheck`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching sum plans:', error);
            throw error;
        }


    };


    useEffect(() => {
        if (userRole === 'ROLE_TRAINER') {
            const getSumToCheck = async () => {
                try {
                    const sumCheck = await fetchSumToCheck();
                    setSumToCheck(sumCheck);
                } catch (error) {
                    console.error('Failed to fetch sum request:', error);
                }
            };

            getSumToCheck();
        }
    }, [userRole]);


    const [openModal, setOpenModal] = useState(false);
    const [plansList, setPlansList] = useState([]);

    const fetchPlansToAssign = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AI}/api/request/requestAiToAssignList`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setPlansList(response.data);

        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const [plansListNotDone, setPlansListNotDone] = useState([]);
    const [activeList, setActiveList] = useState([]);

    const fetchPlansNotDoneRequest = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AI}/api/request/requestWithoutPlanList`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setPlansListNotDone(response.data);

        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const [highLights, setHighLights] = useState([]);

    useEffect(() => {
        const getSumNotDoneRequest = async () => {

            try {
                const sumNotDoneRequest = await fetchSumNotDoneRequest();
                setSumNotDoneRequest(sumNotDoneRequest);
            } catch (error) {
                console.error('Error fetching sumNotDoneRequest:', error);
            }
        };
        getSumNotDoneRequest();
    }, []);

    useEffect(() => {
        const getHighLights = async () => {

            try {
                await fetchHighLights();
            } catch (error) {
                console.error('Error fetching HighLights:', error);
            }
        };
        getHighLights();
    }, []);

    const fetchHighLights = async () => {

        try {

            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_STATISTIC}/api/user/getHighlights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHighLights(response.data);

        } catch (error) {
            console.error("Error fetching highlights:", error);
        }

    }

    useEffect(() => {
        if (!isLoadingRole) {
            const getLoginCount = async () => {
                try {
                    const login = Number(await fetchLoginCount());
                    if (login === 1 && userRole === 'ROLE_USER') {
                        setShowLoginCountDialogUser(true);
                    }
                    if (login === 1 && userRole === 'ROLE_TRAINER') {
                        setShowLoginCountDialogTrainer(true);
                    }
                } catch (error) {
                    console.error('Error fetching login count:', error);
                }
            };
            getLoginCount();
        }
    }, [isLoadingRole, userRole]);

    const [loginCount, setLoginCount] = useState([]);
    const [showLoginCountDialogUser, setShowLoginCountDialogUser] = useState(false);
    const [showLoginCountDialogTrainer, setShowLoginCountDialogTrainer] = useState(false);

    const fetchLoginCount = async () => {

        try {

            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/loginCount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


           setLoginCount(response.data);

           return response.data;

        } catch (error) {
            console.error("Error fetching login Count:", error);
        }

    }

    const closeTips = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/loginPlus`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (userRole === 'ROLE_USER') {

                setShowLoginCountDialogUser(false);
            }

            if (userRole === 'ROLE_TRAINER') {

                setShowLoginCountDialogTrainer(false);
            }

        } catch (error) {

            console.error('Error Post login Login Count:', error);

        }


    };

    const handleOpenModal = async (listType) => {
        if (listType === 'plansNotDone') {
            await fetchPlansNotDoneRequest();
            if (plansListNotDone.length === 1) {
                handlePlanClick(plansListNotDone[0].id);
                return;
            }
            setActiveList(plansListNotDone);
        } else if (listType === 'plansToAssign') {
            await fetchPlansToAssign();
            if (plansList.length === 1) {
                handlePlanClick(plansList[0].id);
                return;
            }
            setActiveList(plansList);
        }
        setOpenModal(true);
    };

    useEffect(() => {
        fetchPlansToAssign();
        fetchPlansNotDoneRequest();
    }, []);

    const handleCloseModal = () => {
        setOpenModal(false);
        setActiveList([]);
    };

    const handlePlanClick = async (id) => {

        await router.push(`/aiTrainingPlan/newAiPlan/${id}`);
    };

    const handleGoToTrainingPlans = async () => {

        await router.push('/trainingPlans');

    };

    const handleGoToOfferPlans = async () => {

        await closeTips();
        await router.push('/offer');
    }

    const handleGoToMyProfileUser = async () => {

        await closeTips();
        await router.push('/my-profileUser?1');

    }

    const handleGoToMyProfileTrainer = async () => {

        await closeTips();
        await router.push('/my-profileTrainer');

    }

    const handleGoToStartTraining = async () => {

        await router.push('/startTraining');
    };

    const handleOpenRequest = async () => {

        await router.push('/requests');
    };



    const cardStyle = (imageUrl) => ({
        position: 'relative',
        height: '100px',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&:hover': {
            transform: 'scale(1.05)',
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transition: 'opacity 0.3s',
            opacity: 1,
        },
        '&:hover::before': {
            opacity: 0,
        },
    });

    const cardTextStyle = {
        position: 'relative',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
        zIndex: 1,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('Dashboard')} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />

                {userRole === 'ROLE_USER' && (
                <Box
                    sx={{
                        position: 'relative',
                        minWidth: '200px',
                        height: '150px',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        mt: 1,
                        mb: 1,


                    }}
                >

                    {bannerItems.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center bottom',
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: index === currentIndex ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                                zIndex: index === currentIndex ? 1 : 0,
                            }}
                        ></Box>
                    ))}

                    {/* Nagłówek i przycisk */}
                    <Box
                        sx={{
                            position: 'absolute',
                            minWidth: '100%',
                            height: '100%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            padding: '20px',
                            borderRadius: '8px',
                            zIndex: 2,
                        }}
                        onClick={() => router.push(currentItem.link)}
                    >
                        <Typography variant="h4" sx={{marginTop: 4,color: 'white'}} gutterBottom>
                            {t(currentItem.titleKey)}
                        </Typography>
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                handlePrev();
                            }}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '10px',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                zIndex: 10,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                            }}
                        >
                            <ArrowBackIosIcon sx={{marginLeft: '6px'}} />
                        </IconButton>
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation(); // Zatrzymuje propagację kliknięcia
                                handleNext();
                            }}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                zIndex: 10,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                )}
                <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                    <Fade in={true} timeout={1400}>
                    <Grid container spacing={2}>

                        {sumNotDoneRequest > 0 && (
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        borderRadius: '20px',
                                        borderWidth: 'thin',
                                        border: 'solid rgb(255,255,255,0.6)',
                                        backgroundColor: 'rgba(126,110,0,0.9)',
                                        justifyItems: 'center',
                                        alignItems: 'center'

                                    }}
                                    onClick={() => handleOpenModal('plansNotDone')}
                                >
                                    <Typography sx={{color: 'white'}}
                                                variant="h8">{t('numberOfNotDoneAiRequest')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumNotDoneRequest}</Typography>
                                    <Typography
                                        sx={{
                                            color: '#0e0e0e',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}





                        {sumRequestAiToAssign > 0 && (

                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        borderRadius: '20px',
                                        borderWidth: 'thin',
                                        border: 'solid rgb(255,255,255,0.6)',
                                        backgroundColor: 'rgba(102,147,64,0.9)',
                                        justifyItems: 'center',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => handleOpenModal('plansToAssign')}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">
                                        {t('numberOfAiRequestToAssign')}
                                    </Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">
                                        {sumRequestAiToAssign}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#0e0e0e',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>

                        )}

                        {userRole === "ROLE_TRAINER" && sumRequest > 0 && (
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        borderRadius: '20px',
                                        borderWidth: 'thin',
                                        border: 'solid rgb(255,255,255,0.6)',
                                        backgroundColor: 'rgba(102,147,64,0.9)',
                                        justifyItems: 'center',
                                        alignItems: 'center'

                                    }}
                                    onClick={() => handleOpenRequest()}
                                >
                                    <Typography sx={{color: 'white'}}
                                                variant="h8">{t('numberOfNotAcceptedRequest')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumRequest}</Typography>
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}

                        {userRole === "ROLE_TRAINER" && sumToCheck !== 0 && (
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        borderRadius: '20px',
                                        borderWidth: 'thin',
                                        border: 'solid rgb(255,255,255,0.6)',
                                        backgroundColor: 'rgba(102,147,64,0.9)',
                                        justifyItems: 'center',
                                        alignItems: 'center'
                                    }}

                                    onClick={() => handleGoToTrainingPlans()}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">{t('sumToCheck')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumToCheck}</Typography>
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}

                        {trainingDate !== '' && (
                            <Grid item xs={6} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: {xs: 'auto', md: 140},
                                        backgroundColor: 'rgb(0,0,0,0.5)',
                                        borderRadius: '20px',
                                        border: 'solid rgb(255,255,255,0.5)',
                                        borderWidth: 'thin',
                                    }}
                                    onClick={() => handleGoToStartTraining()}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">{t('myNearestTraining')}</Typography>
                                    <Typography sx={{color: 'white', mt: 1}}
                                                variant="h8">{dayjs(trainingDate).format('dddd, D MMMM ')}</Typography>
                                    <Typography sx={{color: 'white', fontSize: '12px', mt: 1, mb: 1}}
                                                variant="h4">{myNearestTraining}</Typography>

                                </Paper>
                            </Grid>
                        )}

                        {userRole === "ROLE_TRAINER" && (
                            <Grid item xs={6} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        backgroundColor: 'rgb(0,0,0,0.5)',
                                        borderRadius: '20px',
                                        border: 'solid rgb(255,255,255,0.5)',
                                        borderWidth: 'thin',
                                    }}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">{t('numberOfTrainees')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumUsers}</Typography>

                                </Paper>
                            </Grid>
                        )}

                        {/* Sum of Training Plans */}
                        {userRole === "ROLE_TRAINER" && (
                            <Grid item xs={6} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        backgroundColor: 'rgb(0,0,0,0.5)',
                                        borderRadius: '20px',
                                        border: 'solid rgb(255,255,255,0.5)',
                                        borderWidth: 'thin',
                                    }}

                                    onClick={() => handleGoToTrainingPlans()}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">{t('sumTrainingPlans')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumPlans}</Typography>
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}

                        {/* Number of Trainees */}


                        {/* My Plans */}
                        <Grid item xs={6} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 140,
                                    backgroundColor: 'rgb(0,0,0,0.5)',
                                    borderRadius: '20px',
                                    border: 'solid rgb(255,255,255,0.5)',
                                    borderWidth: 'thin',
                                }}
                                onClick={() => handleGoToTrainingPlans()}
                            >
                                <Typography sx={{color: 'white'}} variant="h8">{t('myTrainingPlans')}</Typography>
                                <Typography sx={{color: 'white'}} variant="h4">{sumMyPlans}</Typography>
                                <Typography
                                    sx={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        textDecoration: '',
                                        '&:hover': {
                                            color: '#e5f1fd',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                >
                                    {t('goTo')}
                                </Typography>
                            </Paper>
                        </Grid>



                        {userRole === "ROLE_TRAINER" && (
                            <Grid item xs={6} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 140,
                                        backgroundColor: 'rgb(0,0,0,0.5)',
                                        borderRadius: '20px',
                                        border: 'solid rgb(255,255,255,0.5)',
                                        borderWidth: 'thin',
                                    }}

                                    onClick={() => handleGoToTrainingPlans()}
                                >
                                    <Typography sx={{color: 'white'}} variant="h8">{t('sumSchema')}</Typography>
                                    <Typography sx={{color: 'white'}} variant="h4">{sumSchema}</Typography>
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            cursor: 'pointer',
                                            textDecoration: '',
                                            '&:hover': {
                                                color: '#e5f1fd',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    >
                                        {t('goTo')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}


                        <Grid container spacing={2} justifyContent="center">
                            {(highLights.progress || highLights.exerciseNew || highLights.regress || highLights.rmProgress) && (
                                <Typography variant="h4" gutterBottom
                                            sx={{
                                                fontSize: '24px',
                                                color: 'white',
                                                marginTop: {xs: '80px', md: '100px'},
                                                marginBottom: {xs: '20px', md: '50px'}
                                            }}>
                                    {t('YourHighLights')}
                                </Typography>

                            )}
                        </Grid>


                        <Grid container spacing={2} justifyContent="center">
                            {highLights.progress && (
                                <Grid item xs={10} sm={3} md={3}>
                                    <Box sx={cardStyle('/stonks.png')}>
                                        <Typography sx={cardTextStyle}>
                                            {t('progress')} <br/>
                                            {highLights.progress}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {highLights.exerciseNew && (
                                <Grid item xs={10} sm={3} md={3}>
                                    <Box sx={cardStyle('/newExercise.png')}>
                                        <Typography sx={cardTextStyle}>
                                            {t('newExercise')} <br/>
                                            {highLights.exerciseNew}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {highLights.regress && (
                                <Grid item xs={10} sm={3} md={3}>
                                    <Box sx={cardStyle('/regres.png')}>
                                        <Typography sx={cardTextStyle}>
                                            {t('regress')} <br/>
                                            {highLights.regress}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {highLights.rmProgress && (
                                <Grid item xs={10} sm={3} md={3}>
                                    <Box sx={cardStyle('/1rm.png')}>
                                        <Typography sx={cardTextStyle}>
                                            {t('progress1Rm')} <br/>
                                            {highLights.rmProgress}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        <Dialog
                            sx={{backgroundColor: 'rgb(0,0,0,0.7)'}}
                            open={showLoginCountDialogUser}
                            onClose={() => closeTips()}
                            aria-labelledby="welcome-dialog-title"
                            aria-describedby="welcome-dialog-description"
                        >
                            <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)', color: 'white'}}
                                         id="welcome-dialog-title">{t('welcome')}
                                <Typography
                                    variant="h4"
                                    sx={{fontFamily: 'Russo One', color: 'white', fontSize: '30px', mb: 1}}
                                >
                                    Trainify
                                    <Box component="span" sx={{color: '#b4ca3f'}}>H</Box>
                                    ub
                                </Typography>
                            </DialogTitle>
                            <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Typography gutterBottom>
                                    {t('intro')}
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon
                                                sx={{color: '#b4ca3f'}}/> {/* Niestandardowy kolor ikony */}
                                        </ListItemIcon>
                                        <ListItemText primary={t('features.createPlans')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('features.accessPreMade')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('features.aiPlans')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('features.findTrainer')}/>
                                    </ListItem>
                                </List>
                                <Typography sx={{mt: 2}}>
                                    {t('profileEncouragement')}
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        ml: 3,
                                        gap: 1,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleGoToMyProfileUser()
                                        }
                                        sx={{
                                            minWidth: 'auto',
                                            width: '40px',
                                            height: '40px',
                                        }}
                                    >
                                        <DrawIcon/>
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: {xs: '10px', sm: '12px'},
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {t('ctaCompleteProfile')}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        ml: 3,
                                        gap: 1,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => handleGoToOfferPlans()}
                                        sx={{
                                            minWidth: 'auto',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'yellow'
                                        }}
                                    >
                                        <FitnessCenterIcon/>
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: {xs: '10px', sm: '12px'},
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {t('toOffer')}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        ml: 3,
                                        mr: 3,
                                        gap: 1,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => closeTips()}
                                        sx={{
                                            minWidth: 'auto',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'rgb(156,41,41)'
                                        }}
                                    >
                                        <CloseIcon/>
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: {xs: '10px', sm: '12px'},
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {t('ctaMaybeLater')}
                                    </Typography>
                                </Box>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            sx={{backgroundColor: 'rgb(0,0,0,0.7)'}}
                            open={showLoginCountDialogTrainer}
                            onClose={() => closeTips()}
                            aria-labelledby="welcome-dialog-title"
                            aria-describedby="welcome-dialog-description"
                        >
                            <DialogTitle sx={{backgroundColor: 'rgb(0,0,0,0.5)', color: 'white'}}
                                         id="welcome-dialog-title">{t('welcome')}
                                <Typography
                                    variant="h4"
                                    sx={{fontFamily: 'Russo One', color: 'white', fontSize: '30px', mb: 1}}
                                >
                                    Trainify
                                    <Box component="span" sx={{color: '#b4ca3f'}}>H</Box>
                                    ub
                                </Typography>
                            </DialogTitle>
                            <DialogContent sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Typography gutterBottom>
                                    {t('trainerIntro')}
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon
                                                sx={{color: '#b4ca3f'}}/> {/* Niestandardowy kolor ikony */}
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.createAssignPlans')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.trackProgress')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.communicate')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.addExercises')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.setPayments')}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckCircleIcon sx={{color: '#b4ca3f'}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('trainerFeatures.publicProfile')}/>
                                    </ListItem>
                                </List>
                                <Typography sx={{mt: 2}}>
                                    {t('trainerEncouragement')}
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{backgroundColor: 'rgb(0,0,0,0.5)'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        ml: 3,
                                        gap: 1,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleGoToMyProfileTrainer()
                                        }
                                        sx={{
                                            minWidth: 'auto',
                                            width: '40px',
                                            height: '40px',
                                        }}
                                    >
                                        <DrawIcon/>
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: {xs: '10px', sm: '12px'},
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {t('ctaCompleteProfile')}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        ml: 3,
                                        mr: 3,
                                        gap: 1,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => closeTips()}
                                        sx={{
                                            minWidth: 'auto',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'rgb(156,41,41)'
                                        }}
                                    >
                                        <CloseIcon/>
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: {xs: '10px', sm: '12px'},
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {t('ctaMaybeLater')}
                                    </Typography>
                                </Box>
                            </DialogActions>
                        </Dialog>

                    </Grid>
                    </Fade>
                </Container>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'rgb(0,0,0,0.9)',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >
                        <Typography sx={{color: 'white',}} id="modal-title" variant="h6" component="h2">
                            {t('selectPlan')}
                        </Typography>
                        <List>
                            {activeList.map((plan, index) => (
                                <ListItem
                                    key={plan.id}
                                    button

                                    onClick={() => handlePlanClick(plan.id)}
                                >
                                    <ListItemText primaryTypographyProps={{
                                        style: {
                                            color: 'white',
                                        },
                                    }} primary={`${t('Plan')} ${index + 1}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleCloseModal}
                            fullWidth
                        >
                            {t('close')}
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}




export default withAuth(DashboardContent);