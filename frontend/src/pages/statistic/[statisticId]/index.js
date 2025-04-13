import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    CssBaseline,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper, CircularProgress
} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../../../components/withAuth';
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Fade from '@mui/material/Fade';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiUrl = process.env.NEXT_PUBLIC_API_STATISTIC;
const trainingApiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;
const imageUrl = process.env.NEXT_PUBLIC_API_PROFILE;

const Index = () => {
    const { t, i18n } = useTranslation('statistic');
    const router = useRouter();

    const { statisticId } = router.query;
    const currentLanguage = i18n.language;
    const [exerciseData, setExerciseData] = useState([]);
    const [exercise, setExercise] = useState([]);
    const [videoExists, setVideoExists] = useState([]);
    const [trendText, setTrendText] = useState('');
    const [deviceOS, setDeviceOS] = useState("");
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            setDeviceOS("android");
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setDeviceOS("ios");
        } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
            setDeviceOS("macos");
        } else {
            setDeviceOS("other");
        }
    }, []);

    useEffect(() => {
        if (exercise && exerciseData.length > 0) {

            const timeout = setTimeout(() => {
                setLoading(false);
                setShowContent(true);
            }, 350);

            return () => clearTimeout(timeout);
        }
    }, [exercise, exerciseData]);

    useEffect(() => {
        if (statisticId) {
            fetchExercise();
            fetchExerciseData(statisticId);
        }
    }, [statisticId]);

    useEffect(() => {
        checkVideoExists();
    }, [exercise]);

    useEffect(() => {
        analyzeTrend();
    }, [exerciseData]);

    const fetchExercise = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(
                `${trainingApiUrl}/api/exercise/getId?id=${statisticId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setExercise(response.data);
        } catch (error) {
            console.error("Error fetching exercise :", error);
        }
    };

    const fetchExerciseData = async (exerciseId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/stats/getExerciseDetails?exerciseId=${exerciseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExerciseData(response.data);
        } catch (error) {
            console.error("Error fetching exercise details:", error);
        }
    };

    const checkVideoExists = async () => {
        const videoUrl = `${imageUrl}/uploads/movHd/${exercise.imageUrl}-high.mov`;

        try {
            const response = await fetch(videoUrl, { method: 'HEAD' });
            setVideoExists(response.ok);
        } catch (error) {
            console.error("Error checking video existence:", error);
            setVideoExists(false);
        }
    };

    const analyzeTrend = () => {
        const minDataPoints = 10;
        const dataToAnalyze = exerciseData.length >= 20 ? 20 : minDataPoints;

        if (exerciseData.length >= dataToAnalyze) {
            const recentData = exerciseData.slice(-dataToAnalyze).map((data) => data.oneRepMax);
            const firstHalfAvg = recentData.slice(0, dataToAnalyze / 2).reduce((sum, val) => sum + val, 0) / (dataToAnalyze / 2);
            const secondHalfAvg = recentData.slice(dataToAnalyze / 2).reduce((sum, val) => sum + val, 0) / (dataToAnalyze / 2);

            if (secondHalfAvg > firstHalfAvg) {
                setTrendText(t('IncreasingTrendInOneRepMax'));
            } else if (secondHalfAvg < firstHalfAvg) {
                setTrendText(t('DecreasingTrendInOneRepMax'));
            } else {
                setTrendText(t('StableTrendInOneRepMax'));
            }
        } else {
            setTrendText(t('NotEnoughDataToDetermineTrend'));
        }
    };

    const dates = exerciseData.map((item) => new Date(item.addDate).toLocaleDateString());
    const oneRepMaxValues = exerciseData.map((item) => item.oneRepMax);
    const weightValues = exerciseData.map((item) => item.weight);
    const repsValues = exerciseData.map((item) => item.reps);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: `${t('oneRepMax')}`,
                data: oneRepMaxValues,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.1,
            },
            {
                label: `${t('weight')}`,
                data: weightValues,
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
                fill: true,
                tension: 0.1,
            },
            {
                label: `${t('reps')}`,
                data: repsValues,
                borderColor: 'rgba(255,159,64,1)',
                backgroundColor: 'rgba(255,159,64,0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
            }}>
                <Navigation title={t('statistic')} />
                <CssBaseline />
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('statistic')} />

            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: { md: '100px' }, justifyContent: 'center' }}>
                <Fade in={showContent} timeout={700}>
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom
                                sx={{
                                    fontSize: '24px',
                                    color: 'white',
                                    marginTop: { xs: '80px', md: '0px' },
                                    marginBottom: { xs: '20px', md: '50px' }
                                }}>
                        {currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name}
                    </Typography>

                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={6}>
                            {videoExists ? (
                                <Box sx={{
                                    borderRadius: '20px',
                                    background: 'radial-gradient(circle, rgba(2, 3, 4, 0) 20%, rgba(0, 0, 0, 0) 80%)',
                                    overflow: 'hidden',
                                    width: '100%',
                                }}>
                                    <video autoPlay loop muted playsInline
                                           style={{width: '100%', marginBottom: '10px', borderRadius: '8px'}}>
                                        <source
                                            src={deviceOS === "android" || deviceOS === "other"
                                                ? `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/webmHd/${exercise.imageUrl}.webm`
                                                : `${process.env.NEXT_PUBLIC_API_PROFILE}/uploads/movHd/${exercise.imageUrl}-high.mov`
                                            }
                                            type="video/mp4"/>
                                    </video>
                                </Box>
                            ) : (

                                <img
                                    src={exercise.imageUrl}
                                    alt="Exercise GIF"
                                    style={{width: '100%', marginBottom: '10px', borderRadius: '8px'}}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/defaultExercise.png';
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom
                                        sx={{
                                            fontSize: '18px',
                                            textAlign: 'left',
                                            color: 'white',
                                            backgroundColor: 'rgb(0,0,0,0.5)',
                                            padding: '24px',
                                            marginTop: { xs: '10px', md: '0px' },
                                        }}>
                                {trendText}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ backgroundColor: "rgba(0,0,0,0.5)", width: '100%', marginTop: '30px', padding: '20px', borderRadius: '8px' }}>
                        <Line data={chartData} options={options} />
                    </Box>

                    {/* Tabela z danymi wykresu */}
                    <TableContainer component={Paper} sx={{ marginTop: '30px',marginBottom: '40px', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>{t('Date')}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{t('oneRepMax')}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{t('weight')}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{t('reps')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exerciseData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ color: 'white' }}>{new Date(data.addDate).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{data.oneRepMax}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{data.weight}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{data.reps}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default withAuth(Index);