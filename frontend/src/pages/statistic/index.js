import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    CssBaseline,
    TextField,
    TableContainer,
    Paper,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TablePagination
} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import axios from "axios";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Fade from '@mui/material/Fade';

const apiUrl = process.env.NEXT_PUBLIC_API_STATISTIC;

const Index = () => {
    const { t, i18n } = useTranslation('statistic');
    const router = useRouter();


    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const currentLanguage = i18n.language;
    const [highLights, setHighLights] = useState([]);


    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const fetchExercises = async (page, size) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/stats/getAllExercises?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setExercises(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const fetchHighLights = async () => {

        try {

            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/user/getHighlights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHighLights(response.data);

        } catch (error) {
            console.error("Error fetching highlights:", error);
        }

    }

    const fetchAllExercises = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${apiUrl}/api/stats/getAllExercises?size=${totalElements}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });



            return response.data.content;


        } catch (error) {
            console.error("Error fetching all exercises:", error);
            return [];
        }
    };

    useEffect(() => {
        fetchHighLights();
        if (!isSearching) {
            fetchExercises(page, rowsPerPage);
        }
    }, [page, rowsPerPage, isSearching]);

    const handleSearchChange = async (event) => {
        const query = normalizeString(event.target.value);
        setSearchQuery(query);

        if (query.length > 0) {
            setIsSearching(true);
            const allExercises = await fetchAllExercises();
            const filtered = allExercises.filter((exercise) => {
                const exerciseName = currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name;
                return normalizeString(exerciseName).includes(query);
            });
            setFilteredExercises(filtered);
        } else {
            setIsSearching(false);
            setFilteredExercises([]);
        }
    };

    const displayedExercises = isSearching ? filteredExercises : exercises;

    const handleChangePage = (event, newPage) => {
        console.log("Changing page to:", newPage);
        setPage(newPage);
        fetchExercises(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const navigateToExerciseDetail = (id) => {
        router.push(`/statistic/${id}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <Navigation title={t('statistic')} />

            <Box component="main" sx={{ flexGrow: 1, display: 'flex', marginTop: { md: '100px' }, justifyContent: 'center' }}>


                {totalElements < 1 && (
                    <Fade in={true} timeout={1400}>
                    <Typography sx={{fontSize: 30, mt: 25, textAlign: 'center', color: 'white'}}> {t('noStatistic')} </Typography>
                    </Fade>
                )}


                {totalElements > 0 && (
                    <Fade in={true} timeout={1400}>
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>


                    {(highLights.progress || highLights.exerciseNew || highLights.regress || highLights.rmProgress) && (
                    <Typography variant="h4" gutterBottom
                                sx={{
                                    fontSize: '24px',
                                    color: 'white',
                                    marginTop: { xs: '80px', md: '0px' },
                                    marginBottom: { xs: '20px', md: '50px' }
                                }}>
                        {t('YourHighLights')}
                    </Typography>

                        )}



                    <Grid container spacing={2} justifyContent="center">
                        {highLights.progress && (
                        <Grid item xs={10} sm={3} md={3}>
                            <Box sx={cardStyle('/stonks.png')}>
                                <Typography sx={cardTextStyle}>
                                    {t('progress')} <br />
                                    {highLights.progress}
                                </Typography>
                            </Box>
                        </Grid>
                        )}

                        {highLights.exerciseNew && (
                        <Grid item xs={10} sm={3} md={3}>
                            <Box  sx={cardStyle('/newExercise.png')}>
                                <Typography sx={cardTextStyle}>
                                    {t('newExercise')} <br />
                                    {highLights.exerciseNew}
                                </Typography>
                            </Box>
                        </Grid>
                            )}

                        {highLights.regress && (
                        <Grid item xs={10} sm={3} md={3}>
                            <Box  sx={cardStyle('/regres.png')}>
                                <Typography sx={cardTextStyle}>
                                    {t('regress')} <br />
                                    {highLights.regress}
                                </Typography>
                            </Box>
                        </Grid>
                            )}

                        {highLights.rmProgress && (
                        <Grid item xs={10} sm={3} md={3}>
                            <Box  sx={cardStyle('/1rm.png')}>
                                <Typography sx={cardTextStyle}>
                                    {t('progress1Rm')} <br/>
                                    {highLights.rmProgress}
                                </Typography>
                            </Box>
                        </Grid>
                            )}
                    </Grid>




                    <TextField
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{
                            marginLeft: '15px',
                            marginTop: '40px',
                            maxWidth: {md: '1000px', xs: '300px'},
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'white',
                            },
                        }}
                        label={t('searchPlaceholder')}
                    />




                    <TableContainer sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', marginTop: '30px' }} component={Paper}>
                        <Table>
                            <TableBody>
                                {displayedExercises.map((exercise) => (
                                    <TableRow key={exercise.id} sx={rowStyle}>
                                        <TableCell sx={cellStyle}>
                                            {currentLanguage === 'pl' ? exercise.namePl : currentLanguage === 'de' ? exercise.nameDe : exercise.name}
                                        </TableCell>
                                        <TableCell align="right" sx={cellStyle}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => navigateToExerciseDetail(exercise.id)}
                                                startIcon={<QueryStatsIcon />}
                                                sx={{
                                                    transition: 'transform 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={isSearching ? filteredExercises.length : totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />


                </Container>
                    </Fade>
                    )}

            </Box>

            <Box sx={{mt: 5,color: 'transparent'}}>.</Box>
        </Box>
    );
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Przyciemnienie tła
        transition: 'opacity 0.3s',
        opacity: 1, // Przyciemnienie domyślnie widoczne
    },
    '&:hover::before': {
        opacity: 0, // Znika po najechaniu, odsłaniając pełną jasność tła
    },
});

// Zaktualizowany styl tekstu
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

const rowStyle = {
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    },
};

const cellStyle = {
    color: 'white',
    padding: '35px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

export default withAuth(Index);