import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Typography,
    Toolbar,
} from '@mui/material';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import Navigation from '@/components/Navigation';
import { fetchTrainingPlans } from "@/pages/api/api TrainingManager/trainingPlans";
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useTranslation } from 'react-i18next';
import { getUserId } from "@/utils/jwtDecode";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTheme} from "@mui/material/styles";
import Link from "next/link";


const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

const DataManagement = () => {
    const { t, i18n } = useTranslation('dataManage');

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const theme = useTheme();


    const handleDeleteAccount = () => {
        router.push(`/delete-account`);
    };

    if (loading) {
        return (
            <Box sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto', }}>
                <CssBaseline />
                <Navigation title={t('dataManage')} />
                <CircularProgress sx={{position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%',color: '#eff0f4'}} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navigation title={t('dataManage')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            mt: { md: 2, xs: 2 },
                            minHeight: '15vh',
                            color: 'white',
                        }}
                    >
                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',  color: 'white',  fontWeight: 'bold'}}>
                                {t('header')}
                            </Typography>
                        </Box>

                    </Box>


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                            ml: 5,
                            justifyContent: 'center',
                            textAlign: 'center',
                            mr: 2,
                            color: 'white',
                        }}
                    >
                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                                {t('text1')}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,lineHeight: 3,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                                {t('text2')}
                                <br /> E-mail: support@trainifyhub.com
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                            ml: 5,
                            justifyContent: 'center',
                            textAlign: 'left',
                            mt: 2,
                            mr: 2,
                            color: 'white',
                        }}
                    >
                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                                {t('text3')}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                                {t('text4')}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                                {t('text5')}
                            </Typography>
                        </Box>

                        <Button
                            sx={{
                                mt: 2,
                                backgroundColor: 'red',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'darkred',
                                    color: 'white'
                                }
                            }}

                            onClick={() => handleDeleteAccount()}
                        >
                            {t('delete')}
                        </Button>



                    </Box>


            </Box>
        </Box>
    );
};

export default withAuth(DataManagement);