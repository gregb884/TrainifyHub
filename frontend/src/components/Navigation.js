import React, { useEffect, useState, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    IconButton,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import {
    AccountCircle as AccountCircleIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    ListAlt as ListAltIcon,
    ViewList as ViewListIcon,
    Menu as MenuIcon,
    People as PeopleIcon,
    PlayArrow as PlayArrowIcon,
    LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import InsightsIcon from '@mui/icons-material/Insights';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';


import LogoutButton from './LogoutButton';
import Head from 'next/head';
import axios from "axios";
import WebSocketComponent from "@/components/WebSocketComponent";
import {getUserLang, getUserRole} from "@/utils/jwtDecode";
import Chat from './Chat';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";


const drawerWidth = 240;

const Navigation = ({ title, chatRef, smallText = false }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [userRole, setUserRole] = useState(null);
    const [jwtToken, setJwtToken] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const { t } = useTranslation('navigation');
    const [smallDescription, setSmallDescription] = useState(null);


    useEffect(() => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));

        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            setUserRole(getUserRole(token));
            setJwtToken(token);
        }

        setSmallDescription(smallText ?? false);

    }, [smallText]);



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDashboard = async () => {
        await router.push('/dashboard');
    };

    const handleRequest = async () => {
        await router.push('/requests');
    };

    const handleNewPlan = async () => {
        await router.push('/createNewPlan');
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            await router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleAtlas = async () => {
        await router.push('/exerciseAtlas');
    };

    const handleTrainingPlans = async () => {
        await router.push('/trainingPlans');
    };


    const handleStartTraining = async () =>{

        await router.push('/startTraining');
    }

    const handleMyProfileTrainer = async () => {
        await router.push('/my-profileTrainer');
    };

    const handleMyProfileUser = async () => {
        await router.push('/my-profileUser');
    };

    const handleTrainerList = async () => {
        await router.push('/trainerList');
    };

    const handleOffer = async () => {
        await router.push('/offer');
    };

    const handleStatistic = async () => {
        await router.push('/statistic');
    };
    const handleStore = async () => {
        await router.push('/store');
    };

    const handleGoBack = () => {
        router.back();
    };




    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem button onClick={handleNewPlan}>
                    <ListItemIcon>
                        <DashboardIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('createNewPlan')} /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleDashboard}>
                    <ListItemIcon>
                        <DashboardIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('dashboard')}  /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleStatistic}>
                    <ListItemIcon>
                        <InsightsIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('statistic')}  /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleOffer}>
                    <ListItemIcon>
                        <DashboardIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('offer')}  /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleStore}>
                    <ListItemIcon>
                        <LocalGroceryStoreIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('store')}  /> {/* Tłumaczenie */}
                </ListItem>
                {userRole === 'ROLE_TRAINER' && (
                    <ListItem button onClick={handleRequest}>
                        <ListItemIcon>
                            <AccountCircleIcon  />
                        </ListItemIcon>
                        <ListItemText primary={t('requestFromUsers')}  /> {/* Tłumaczenie */}
                    </ListItem>
                )}
                {userRole === 'ROLE_USER' && (
                    <ListItem button onClick={handleRequest}>
                        <ListItemIcon>
                            <AccountCircleIcon  />
                        </ListItemIcon>
                        <ListItemText primary={t('myRequest')}  /> {/* Tłumaczenie */}
                    </ListItem>
                )}
                <ListItem button onClick={handleTrainingPlans}>
                    <ListItemIcon>
                        <ViewListIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('trainingPlans')}  /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleStartTraining}>
                    <ListItemIcon>
                        <PlayArrowIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('startTraining')}  /> {/* Tłumaczenie */}
                </ListItem>
                {userRole === 'ROLE_TRAINER' && (
                    <ListItem button onClick={handleMyProfileTrainer}>
                        <ListItemIcon>
                            <AccountCircleIcon  />
                        </ListItemIcon>
                        <ListItemText primary={t('myTrainerProfile')}  /> {/* Tłumaczenie */}
                    </ListItem>
                )}
                {userRole === 'ROLE_USER' && (
                    <ListItem button onClick={handleMyProfileUser}>
                        <ListItemIcon>
                            <AccountCircleIcon  />
                        </ListItemIcon>
                        <ListItemText primary={t('myProfile')}  /> {/* Tłumaczenie */}
                    </ListItem>
                )}
                {userRole === 'ROLE_USER' && (
                    <ListItem button onClick={handleTrainerList}>
                        <ListItemIcon>
                            <PeopleIcon  />
                        </ListItemIcon>
                        <ListItemText primary={t('findTrainer')}  /> {/* Tłumaczenie */}
                    </ListItem>
                )}
                <ListItem button onClick={handleAtlas}>
                    <ListItemIcon>
                        <ListAltIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('exerciseAtlas')}  /> {/* Tłumaczenie */}
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToAppIcon  />
                    </ListItemIcon>
                    <ListItemText primary={t('logOut')}  /> {/* Tłumaczenie */}
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,

                }}
            >
                <Toolbar sx={{}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    {smallDescription === false && (

                        <Typography variant="h6" noWrap sx={{ flexGrow: 1  }}>
                            {title}
                        </Typography>
                    )}

                    {smallDescription === true && (

                        <Typography variant="h7" sx={{ fontSize: '12px', flexGrow: 1  }}>
                            {title}
                        </Typography>
                    )}

                    <Chat ref={chatRef} jwtToken={jwtToken} />
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Lepsza wydajność na urządzeniach mobilnych
                    }}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(180, 202, 63, 1)',
                            marginTop: { xs: '55px', md: '64px' },
                            maxHeight: 'calc(100vh - 55px)',
                            overflowY: 'auto',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <IconButton
                onClick={handleGoBack}
                sx={{
                    position: 'fixed',
                    zIndex: '1200',
                    bottom: 20,
                    left: 16,
                    width: 32,
                    height: 32,
                    fontSize: 32,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                }}
            >
                <ArrowBackIcon />
            </IconButton>
        </>
    );
};

export default Navigation;
