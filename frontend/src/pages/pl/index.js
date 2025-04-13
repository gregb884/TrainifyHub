import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';
import IphoneModel from '@/components/IphoneModel';
import '@/app/indexCss.css';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import Footer from "@/components/Footer";
import i18n from "i18next";
import {Link as ScrollLink} from "react-scroll";
import Image from "next/image";

export default function Home() {


    const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
    const language = i18n.language.split('-')[0];


    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollBars, setShowScrollBars] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);

            const isMobile = window.innerWidth <= 768;

            const threshold = isMobile ? 47 : 63;

            if (scrolled > threshold) {
                setShowScrollBars(false);
            } else {
                setShowScrollBars(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {



         if (language === 'de') {
            setShowLanguageSwitcher(true);
        }
        else if (language !== 'pl') {
            setShowLanguageSwitcher(true);
        } else {
            setShowLanguageSwitcher(false);
        }

    }, [i18n.language]);

    const handleCloseSwitcher = () => {

        setShowLanguageSwitcher(false);
    }

    const [activeScreen, setActiveScreen] = useState(0);
    const [two , setTwo] = useState(0);
    const [three, setThree] = useState(0);
    const [four, setFour] = useState(0);
    const [five, setFive] = useState(0);
    const [six, setSix] = useState(0);
    const [seven, setSeven] = useState(0);
    const [eight, setEight] = useState(0);
    const [ten, setTen] = useState(0);

    const router = useRouter();

    const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: ref4, inView: inView4 } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: ref5, inView: inView5 } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: ref6, inView: inView6 } = useInView({ triggerOnce: true, threshold: 0.2 });


    useEffect(() => {
        let scrollPos = window.scrollY;
        let targetScroll = window.scrollY;
        const easeFactor = 0.5;
        let ticking = false;

        const handleScroll = () => {
            targetScroll = window.scrollY;

            if (
                (targetScroll >= 500 && targetScroll <= 1700) ||
                (targetScroll >= 1900 && targetScroll <= 2200)
            ) {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        scrollPos += (targetScroll - scrollPos) * easeFactor;
                        window.scrollTo(0, scrollPos);
                        ticking = false;
                    });
                    ticking = true;
                }
            } else {

                scrollPos = targetScroll;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;


            if (scrollY > 3200) {
                setTwo(0);
                setThree(0);
                setFour(0);
                setFive(0);
                setSix(0);
                setSeven(0);
                setEight(0);
                setTen(0);
            } else {
                if (scrollY > 2800) {
                    setTen(1);
                }
                if (scrollY > 2400) {
                    setEight(1);
                }
                if (scrollY > 1900 && scrollY <= 2200) {
                    setSeven(1);
                }
                if (scrollY > 1600 && scrollY <= 1900) {
                    setSix(1);
                }
                if (scrollY >= 1300 && scrollY <= 1600) {
                    setFive(1);
                }
                if (scrollY >= 1000 && scrollY <= 1300) {
                    setFour(1);
                }
                if (scrollY >= 700 && scrollY <= 1000) {
                    setThree(1);
                }
                if (scrollY >= 400 && scrollY <= 700) {
                    setTwo(1);
                }
                if (scrollY >= 100 && scrollY <= 400) {
                    setActiveScreen(1);
                }
                if (scrollY < 300) {
                    setActiveScreen(3);
                    setTwo(0);
                    setThree(0);
                    setFour(0);
                    setFive(0);
                    setSix(0);
                    setSeven(0);
                    setEight(0);
                    setTen(0);
                }
                if (scrollY >= 1600) {
                    setActiveScreen(2);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/**
             * TUTAJ DODAJEMY META TAGI DLA SEO ZA POMOCĄ next/head
             * - Tytuł i meta description odpowiadające głównym słowom kluczowym.
             * - Gdybyś chciał/a różnicować je między podstronami, robisz to w plikach
             *   pages/[nazwa].js, analogicznie w <Head>
             */}
            <Head>
                <title>TrainifyHub - Najlepsze plany treningowe i trenerzy</title>
                <meta
                    name="description"
                    content="Odkryj najlepsze plany treningowe i trenerów dopasowanych do Twoich potrzeb. Wszystko w jednym miejscu - TrainifyHub!"
                />
                <meta
                    name="keywords"
                    content="trening, fitness, plany treningowe, trener personalny, analiza postępów, siłownia, ćwiczenia, zdrowie"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* Przykładowe meta Open Graph */}
                <meta property="og:title" content="TrainifyHub - Najlepsze plany treningowe i trenerzy" />
                <meta
                    property="og:description"
                    content="Dołącz do TrainifyHub i odkryj najlepsze plany treningowe tworzone przez profesjonalistów. Sprawdź statystyki, generuj plany AI i trenuj mądrzej!"
                />
                <meta property="og:image" content="/images/og_image.jpg" />
                <meta property="og:url" content="https://twoja-domena.pl" />
                <meta property="og:type" content="website" />

                {/* Ewentualnie favicon: */}
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <Box
                component="main"
                sx={{
                    minHeight: '500vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {showLanguageSwitcher && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: {md: '50%', xs: '3%'},
                            transform: {md: 'translateX(-50%)', xs: ''},
                            backgroundColor: '#b4ca3f',
                            color: 'black',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            zIndex: 10000,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <Typography variant="body1" sx={{ mt: 1,fontWeight: 'bold',  fontSize : {xs: '12px', md: '15px'} }}>
                            {
                                language !== 'de' && language !== 'pl' ? 'Do you prefer English ?' :
                                        language === 'de' ? 'Es ist eine deutsche Version verfügbar' :
                                            'Would you like to switch language?'
                            }
                        </Typography>

                        { language !== 'de' && language !== 'pl-PL' && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ml: 1}}
                                onClick={() =>  router.push('/pl')}
                            >
                                Go to
                            </Button>
                        )}

                        {language === 'de' && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push('/de')}
                            >
                                fortfahren
                            </Button>
                        )}

                        <button
                            color="error"
                            onClick={() => handleCloseSwitcher()}
                        >
                            x
                        </button>
                    </Box>

                )}


                <Header pageName={'Home'} language={'pl'} />


                {showScrollBars && (
                    <>

                        <Box sx={{ position: 'fixed', left: 0, top: 58, width: '4px', height: '100vh', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 9998 }} />
                        <Box sx={{ position: 'fixed', left: 0, top: 58, width: '4px', height: `${scrollProgress}%`, backgroundColor: '#b4ca3f', zIndex: 9999, transition: 'height 0.2s ease-out' }} />


                        <Box sx={{ position: 'fixed', right: 0, top: 58, width: '4px', height: '100vh', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 9998 }} />
                        <Box sx={{ position: 'fixed', right: 0, top: 58, width: '4px', height: `${scrollProgress}%`, backgroundColor: '#b4ca3f', zIndex: 9999, transition: 'height 0.2s ease-out' }} />
                    </>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        mt: { md: 5, xs: 12 },
                        minHeight: '40vh',
                        color: 'white',
                    }}
                >
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                mr: 1,
                                fontSize: '30px',
                                color: 'white',
                                mb: 4,
                                fontWeight: 'bold',
                            }}
                        >
                            Witaj w
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Russo One',
                                fontSize: '30px',
                                color: 'white',
                            }}
                        >
                            Trainify
                            <Box component="span" sx={{ color: '#b4ca3f' }}>
                                H
                            </Box>
                            ub
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 4, mr: 2, ml: 2, maxWidth: '600px', color: 'white' }}>
                        Odkryj najlepsze plany treningowe i trenerów dopasowanych do Twoich potrzeb.
                        Wszystko w jednym miejscu!
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ml: {xs: 0 , md: -2}}} gap={3}>
                        <ScrollLink
                            to="model"
                            smooth={true}
                            duration={1200}
                            offset={60}
                        >
                            <Button variant="contained" color="primary" size="large">
                           Rozpocznij
                            </Button>
                        </ScrollLink>
                        <Link href="https://apps.apple.com/us/app/trainifyhub/id6743364032?itscg=30200&itsct=apps_box_link&mttnsubad=6743364032" passHref>
                            <Image src="/applePl.svg" width={138} height={100} alt="appStore" />
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.trainifyhub.app" passHref>
                            <Image src="/googlePl.svg" width={150} height={150} alt="google" />
                        </Link>
                    </Box>
                </Box>

                <Box
                    id={'model'}
                    sx={{
                        position: 'sticky',
                        top: '10%',
                        display: 'flex',
                        justifyContent: 'top',
                        alignItems: 'top',
                        height: '170vh',
                        zIndex: -1,
                    }}
                >
                    <IphoneModel activeScreen={activeScreen} language={'pl'} />
                </Box>


                <Box sx={{ height: '300vh', textAlign: 'center', color: 'white' }}>
                    {/*

          */}

                    {activeScreen === 1 && (
                        <Box
                            sx={{
                                width: { md: '25%', xs: '105%' },
                                position: 'fixed',
                                top: { md: '220px', xs: '80px' },
                                left: { md: '32%', lg: '22%', xs: '50%' },
                                transform: {
                                    md: 'translate(150%, -50%)',
                                    xs: 'translate(-50%, 0%)',
                                },
                                '@media (min-width: 2200px)': {
                                    top: '250px',
                                },
                                '@media (min-width: 1200px) and (max-width: 1500px)': {
                                    left: '30%',
                                },
                                zIndex: { xs: 1, md: -10 },
                                margin: '0 auto',
                                padding: { xs: '20px', md: '0px' },
                                borderRadius: '10px',
                                opacity: activeScreen === 1 ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,0.9)' },
                                '&::before': {
                                    content: '""',
                                    opacity: { md: 1, xs: 0 },
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: 0,
                                    width: '0%',
                                    height: '1px',
                                    backgroundColor: '#b4ca3f',
                                    animation: activeScreen === 1 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2" // Zmieniamy na semantyczny nagłówek h2
                                sx={{
                                    fontSize: { md: '24px', xs: '16px' },
                                    width: '100%',
                                    color: 'white',
                                    opacity: 1,
                                    animation: activeScreen === 1 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                                }}
                            >
                                Analizuj swoje wyniki w czasie rzeczywistym
                            </Typography>
                        </Box>
                    )}

                    {two === 1 && (
                        <Box
                            sx={{
                                width: { md: '25%', xs: '100%' },
                                position: 'fixed',
                                top: { md: '250px', xs: '80px' },
                                '@media (min-width: 2200px)': {
                                    top: '350px',
                                },
                                '@media (min-width: 1200px) and (max-width: 1500px)': {
                                    left: '-30%',
                                },
                                left: { md: '-32%', lg: '-23%', xs: '-20%' },
                                zIndex: { xs: 1, md: -10 },
                                transform: { md: 'translate(150%, -50%)', xs: 'translate(21%,0%)' },
                                margin: '0 auto',
                                padding: { xs: '20px', md: '0px' },
                                borderRadius: '20px',
                                opacity: activeScreen === 1 ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                                '&::before': {
                                    content: '""',
                                    opacity: { md: 1, xs: 0 },
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '20px',
                                    height: '1px',
                                    backgroundColor: '#b4ca3f',
                                    animation: activeScreen === 1 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontSize: { md: '24px', xs: '16px' },
                                    width: '100%',
                                    color: 'white',
                                    opacity: 1,
                                    animation: activeScreen === 1 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                                }}
                            >
                                Znajdź idealnego trenera dla siebie
                            </Typography>
                        </Box>
                    )}

                    {three === 1 && (
                        <Box
                            sx={{
                                width: { md: '25%', xs: '100%' },
                                position: 'fixed',
                                top: { md: '350px', xs: '80px' },
                                '@media (min-width: 2200px)': {
                                    top: '450px',
                                },
                                '@media (min-width: 1200px) and (max-width: 1500px)': {
                                    left: '30%',
                                },
                                left: { md: '32%', lg: '22%', xs: '-20%' },
                                zIndex: { xs: 1, md: -10 },
                                transform: { md: 'translate(150%, -50%)', xs: 'translate(21%,0%)' },
                                margin: '0 auto',
                                padding: { xs: '20px', md: '0px' },
                                borderRadius: '20px',
                                opacity: activeScreen === 1 ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                                '&::before': {
                                    content: '""',
                                    opacity: { md: 1, xs: 0 },
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: 0,
                                    width: '0%',
                                    height: '1px',
                                    backgroundColor: '#b4ca3f',
                                    animation: activeScreen === 1 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontSize: { md: '24px', xs: '16px' },
                                    width: '100%',
                                    color: 'white',
                                    opacity: 1,
                                    animation: activeScreen === 1 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                                }}
                            >
                                Znajdź swój najlepszy Plan
                            </Typography>
                        </Box>
                    )}

                    {four === 1 && (
                        <Box
                            sx={{
                                width: { md: '25%', xs: '100%' },
                                position: 'fixed',
                                top: { md: '450px', xs: '80px' },
                                '@media (min-width: 2200px)': {
                                    top: '550px',
                                },
                                '@media (min-width: 1200px) and (max-width: 1500px)': {
                                    left: '-30%',
                                },
                                left: { md: '-32%', lg: '-22%', xs: '-20%' },
                                zIndex: { xs: 1, md: -10 },
                                transform: { md: 'translate(150%, -50%)', xs: 'translate(21%,0%)' },
                                margin: '0 auto',
                                padding: { xs: '20px', md: '0px' },
                                borderRadius: '20px',
                                opacity: activeScreen === 1 ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                                '&::before': {
                                    content: '""',
                                    opacity: { md: 1, xs: 0 },
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: 0,
                                    width: '0%',
                                    height: '1px',
                                    backgroundColor: '#b4ca3f',
                                    animation: activeScreen === 1 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontSize: { md: '24px', xs: '16px' },
                                    width: '100%',
                                    color: 'white',
                                    opacity: 1,
                                    animation: activeScreen === 1 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                                }}
                            >
                                Generuj plan za pomocą AI
                            </Typography>
                        </Box>
                    )}

                    {five === 1 && (
                        <Box
                            sx={{
                                width: { md: '25%', xs: '100%' },
                                position: 'fixed',
                                top: { md: '550px', xs: '80px' },
                                '@media (min-width: 2200px)': {
                                    top: '650px',
                                },
                                '@media (min-width: 1200px) and (max-width: 1500px)': {
                                    left: '30%',
                                },
                                left: { md: '32%', lg: '22%', xs: '-20%' },
                                zIndex: { xs: 1, md: -10 },
                                transform: { md: 'translate(150%, -50%)', xs: 'translate(21%,0%)' },
                                margin: '0 auto',
                                padding: { xs: '20px', md: '0px' },
                                borderRadius: '20px',
                                opacity: activeScreen === 1 ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                                '&::before': {
                                    content: '""',
                                    opacity: { md: 1, xs: 0 },
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: 0,
                                    width: '0%',
                                    height: '1px',
                                    backgroundColor: '#b4ca3f',
                                    animation: activeScreen === 1 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontSize: { md: '24px', xs: '16px' },
                                    width: '100%',
                                    color: 'white',
                                    opacity: 1,
                                    animation: activeScreen === 1 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                                }}
                            >
                                Twórz własne plany treningowe
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* KOLEJNE SEKCJE - DLA activeScreen === 2 */}
                {activeScreen === 2 && six === 1 && (
                    <Box
                        sx={{
                            width: { md: '25%', xs: '105%' },
                            position: 'fixed',
                            top: { md: '250px', xs: '100px' },
                            left: { md: '32%', lg: '23%', xs: '50%' },
                            transform: {
                                md: 'translate(150%, -50%)',
                                xs: 'translate(-50%, 0%)',
                            },
                            '@media (min-width: 1200px) and (max-width: 1500px)': {
                                left: '30%',
                            },
                            zIndex: { xs: 1, md: -10 },
                            margin: '0 auto',
                            padding: { xs: '20px', md: '0px' },
                            borderRadius: '10px',
                            opacity: activeScreen === 2 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                            '&::before': {
                                content: '""',
                                opacity: { md: 1, xs: 0 },
                                position: 'absolute',
                                bottom: '-10px',
                                left: 0,
                                width: '0%',
                                height: '1px',
                                backgroundColor: '#b4ca3f',
                                animation: activeScreen === 2 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                marginLeft: { xs: '0px', md: '22px' },
                                fontSize: { md: '24px', xs: '16px' },
                                textAlign: { md: 'left', xs: 'center' },
                                width: '100%',
                                color: 'white',
                                opacity: 1,
                                animation: activeScreen === 2 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                            }}
                        >
                            {'> 800 ćwiczeń z animacjami 3D'}
                        </Typography>
                    </Box>
                )}

                {activeScreen === 2 && seven === 1 && (
                    <Box
                        sx={{
                            width: { md: '25%', xs: '100%' },
                            position: 'fixed',
                            top: { md: '350px', xs: '100px' },
                            left: { md: '-32%', lg: '-25%', xs: '50%' },
                            transform: {
                                md: 'translate(150%, -50%)',
                                xs: 'translate(-55%, 0%)',
                            },
                            '@media (min-width: 1200px) and (max-width: 1500px)': {
                                left: '-30%',
                            },
                            zIndex: { xs: 1, md: -10 },
                            margin: '0 auto',
                            padding: { xs: '20px', md: '0px' },
                            borderRadius: '20px',
                            opacity: activeScreen === 2 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                            '&::before': {
                                content: '""',
                                opacity: { md: 1, xs: 0 },
                                position: 'absolute',
                                bottom: '-10px',
                                left: 20,
                                width: '0%',
                                height: '1px',
                                backgroundColor: '#b4ca3f',
                                animation: activeScreen === 2 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                marginLeft: '22px',
                                fontSize: { md: '24px', xs: '16px' },
                                width: '100%',
                                color: 'white',
                                opacity: 1,
                                textAlign: { md: 'left', xs: 'center' },
                                animation: activeScreen === 2 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                            }}
                        >
                            Spersonalizowane narzędzia i statystyki
                        </Typography>
                    </Box>
                )}

                {activeScreen === 2 && eight === 1 && (
                    <Box
                        sx={{
                            width: { md: '25%', xs: '100%' },
                            position: 'fixed',
                            top: { md: '450px', xs: '100px' },
                            left: { md: '32%', lg: '23%', xs: '50%' },
                            transform: {
                                md: 'translate(150%, -50%)',
                                xs: 'translate(-55%, 0%)',
                            },
                            '@media (min-width: 1200px) and (max-width: 1500px)': {
                                left: '30%',
                            },
                            zIndex: { xs: 1, md: -10 },
                            margin: '0 auto',
                            padding: { xs: '20px', md: '0px' },
                            borderRadius: '20px',
                            opacity: activeScreen === 2 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                            '&::before': {
                                content: '""',
                                opacity: { md: 1, xs: 0 },
                                position: 'absolute',
                                bottom: '-10px',
                                left: 0,
                                width: '0%',
                                height: '1px',
                                backgroundColor: '#b4ca3f',
                                animation: activeScreen === 2 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                marginLeft: '25px',
                                fontSize: { md: '24px', xs: '16px' },
                                width: '100%',
                                color: 'white',
                                opacity: 1,
                                textAlign: { md: 'left', xs: 'center' },
                                animation: activeScreen === 2 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                            }}
                        >
                            Prosty edytor planów – modyfikuj w locie
                        </Typography>
                    </Box>
                )}

                {activeScreen === 2 && ten === 1 && (
                    <Box
                        sx={{
                            width: { md: '25%', xs: '100%' },
                            position: 'fixed',
                            top: { md: '550px', xs: '100px' },
                            left: { md: '-32%', lg: '-23%', xs: '50%' },
                            transform: {
                                md: 'translate(150%, -50%)',
                                xs: 'translate(-55%, 0%)',
                            },
                            '@media (min-width: 1200px) and (max-width: 1500px)': {
                                left: '-30%',
                            },
                            zIndex: { xs: 1, md: -10 },
                            margin: '0 auto',
                            padding: { xs: '20px', md: '0px' },
                            borderRadius: '20px',
                            opacity: activeScreen === 2 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            backgroundColor: { md: 'transparent', xs: 'rgb(0,0,0,1)' },
                            '&::before': {
                                content: '""',
                                opacity: { md: 1, xs: 0 },
                                position: 'absolute',
                                bottom: '-10px',
                                left: 0,
                                width: '0%',
                                height: '1px',
                                backgroundColor: '#b4ca3f',
                                animation: activeScreen === 2 ? 'lineGrow 0.8s forwards ease-in-out' : 'none',
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                marginLeft: '25px',
                                fontSize: { md: '24px', xs: '16px' },
                                width: '100%',
                                color: 'white',
                                opacity: 1,
                                textAlign: { md: 'left', xs: 'center' },
                                animation: activeScreen === 2 ? 'fadeIn 0.8s 0.8s forwards ease-in-out' : 'none',
                            }}
                        >
                            Gotowe plany od profesjonalistów
                        </Typography>
                    </Box>
                )}

                {/* SEKCJA DODATKOWA Z CTA */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        backgroundColor: '#b4ca3f',
                        color: 'black',
                        marginTop: 'auto',
                    }}
                >
                    <Typography variant="h3" component="h2" sx={{ fontSize: '26px',mb: 2, color: 'black' }}>
                        Gotowy na nową jakość treningu?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} size="large">
                            Dołącz teraz
                        </Button>
                    </Link>
                </Box>

                {/* SEKCJA MATERIAŁY PROMOCYJNE */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        '@media (max-width: 800px)': {
                            backgroundColor: 'black',
                        },
                        '@media (min-width: 801px)': {
                            backgroundImage:
                                "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/AdobeStock_608156936.webp')",
                            backgroundAttachment: 'fixed',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        },
                        color: 'white',
                        mt: 'auto',
                    }}
                >
                    <Box ref={ref1} sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                        {/* Box 1 */}
                        <Box sx={{ mt: 2, maxWidth: '400px' }}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                🏋️‍♂️ Spersonalizowane treningi
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Plan dopasowany do Twoich celów i poziomu zaawansowania.
                            </Typography>
                            <Box
                                sx={{
                                    opacity: inView1 ? 1 : 0,
                                    transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                                    mt: 2,
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    height: { xs: '300px', sm: '400px', md: '500px' },
                                    width: { xs: '400px', md: 'auto' },
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundImage: `url(/indexKindPlan.webp)`,
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Box 2 */}
                        <Box ref={ref2} sx={{ mt: 2, maxWidth: '400px' }}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                📊 Zaawansowana analiza
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Śledź swoje postępy i osiągaj nowe cele.
                            </Typography>
                            <Box
                                sx={{
                                    opacity: inView2 ? 1 : 0,
                                    transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                                    mt: 4.5,
                                    position: 'relative',
                                    height: { xs: '300px', sm: '400px', md: '500px' },
                                    width: { xs: '400px', md: 'auto' },
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundImage: `url(/indexStatistic.webp)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Box 3 */}
                        <Box sx={{ mt: 2, maxWidth: '400px' }}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                📱Na wszystkich urządzeniach
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Planuj i rozpisuj gdziekolwiek chcesz – na telefonie, tablecie lub komputerze.
                            </Typography>
                            <Box
                                ref={ref3}
                                sx={{
                                    opacity: inView3 ? 1 : 0,
                                    transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                                    mt: 1,
                                    position: 'relative',
                                    height: { xs: '300px', sm: '400px', md: '500px' },
                                    width: { xs: '400px', md: 'auto' },
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundImage: `url(/indexDevice.webp)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* SEKCJA DLA TRENERÓW */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
                        color: 'white',
                        mt: 'auto',
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{ fontWeight: 'bold', fontSize: '28px', color: 'white' }}
                    >
                        Jesteś trenerem personalnym? Świetnie trafiłeś!
                    </Typography>

                    <Box
                        ref={ref4}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: 4,
                            opacity: inView4 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                        }}
                    >
                        {/* Box 1 */}
                        <Box
                            sx={{
                                mt: 2,
                                maxWidth: { xs: '400px', md: '48%' },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                ️ Podnieś jakość twoich usług
                            </Typography>
                            <Box
                                sx={{
                                    mt: 0,
                                    position: 'relative',
                                    height: { xs: '200px', sm: '400px', md: '150px' },
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        color: 'transparent',
                                        mb: 2,
                                        fontSize: '22px',
                                        fontWeight: 'bold',
                                        display: 'block',
                                    }}
                                >
                                    0
                                </Typography>
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    Chcesz wyjść naprzeciw oczekiwaniom swoich klientów i podnieść jakość swoich
                                    usług? Zamiast wysyłać plany treningowe w formie tekstowej lub arkuszy Excel,
                                    dołącz do TrainifyHub i wysyłaj plany w wygodniejszej formie!
                                </Typography>
                            </Box>
                        </Box>

                        {/* Box 2 */}
                        <Box
                            sx={{
                                mt: 2,
                                maxWidth: { xs: '400px', md: '48%' },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                Ile to kosztuje?
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    height: { xs: '150px', sm: '400px', md: '150px' },
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '18px' }}>
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: 'white',
                                            textAlign: 'center',
                                            mb: 2,
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                        }}
                                    >
                                        🚀 Absolutne 0!
                                    </Typography>
                                    Zarówno trener, jak i klient nie ponoszą żadnych kosztów podczas współpracy.
                                    Twórz, przypisuj, analizuj – wszystko za darmo, bez ukrytych opłat.
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: 2,
                                maxWidth: { xs: '400px', md: '98%' },
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                Dlaczego warto?
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    height: { xs: '600px', md: '370px' },
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '18px' }}>
                                    <Typography
                                        component="span"
                                        sx={{
                                            mb: 2,
                                            color: 'white',
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                        }}
                                    >
                                        💪 Łatwość i wygoda:
                                    </Typography>
                                    Stwórz plan treningowy w intuicyjnym systemie i przypisz go do klienta w
                                    zaledwie kilka kliknięć.
                                    <br />
                                    <Typography
                                        component="span"
                                        sx={{
                                            mb: 2,
                                            mt: 2,
                                            color: 'white',
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                        }}
                                    >
                                        🧐 Koniec z domysłami:
                                    </Typography>
                                    Klient nie musi zastanawiać się, jak wykonać ćwiczenie – zobaczy animacje 3D,
                                    które dokładnie pokażą technikę wykonania.
                                    <br />
                                    <Typography
                                        component="span"
                                        sx={{
                                            mb: 2,
                                            mt: 2,
                                            color: 'white',
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                        }}
                                    >
                                        📊 Pełna kontrola i analiza:
                                    </Typography>
                                    Śledź postępy swoich klientów w czasie rzeczywistym – ile razy, z jakim
                                    ciężarem i kiedy wykonywali dany trening.
                                    <br />
                                    <Typography
                                        component="span"
                                        sx={{
                                            mb: 2,
                                            mt: 2,
                                            color: 'white',
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                        }}
                                    >
                                        📈 Lepsze zaangażowanie:
                                    </Typography>
                                    Klient ma stały dostęp do swojego planu, widzi swoje statystyki i osiągnięcia,
                                    co motywuje go do dalszej pracy.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* SEKCJA PŁATNE FUNKCJE */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        height: { md: '900px', sm: '1600px' },
                        backgroundImage: 'linear-gradient(0deg, rgba(52,50,46,1) 0%,rgba(4,9,9,1) 100%)',
                        color: 'white',
                        mt: 'auto',
                    }}
                >
                    <Typography variant="h3" component="h2" sx={{fontWeight: 'bold', fontSize: '28px', color: 'white' }}>
                        Płatne funkcje
                    </Typography>

                    <Box
                        ref={ref5}
                        sx={{
                            opacity: inView5 ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 4,
                            flexWrap: 'wrap',
                            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                        }}
                    >
                        {/* Funkcja 1 - AI */}
                        <Box sx={{ mt: 2, maxWidth: '400px', width: '100%' }}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px',margin: 'auto',  color: '#b4ca3f' }}
                            >
                                🚀 Inteligentne plany treningowe AI
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    height: { xs: 'auto', sm: '400px', md: '500px' },
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 0,
                                    },
                                }}
                            >
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    Chcesz osiągnąć swoje cele szybciej i skuteczniej? Skorzystaj z zaawansowanego
                                    algorytmu sztucznej inteligencji, który stworzy dla Ciebie spersonalizowany plan
                                    dostosowany do Twojego poziomu, celów i preferencji.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    Korzyści:
                                </Typography>

                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    🎯 Personalizacja <br /> na najwyższym poziomie – AI analizuje Twoje postępy i
                                    preferencje, aby dostarczyć Ci idealny plan.
                                    <br />
                                    ⏱ Oszczędność czasu <br /> – nie musisz już godzinami szukać idealnego planu, AI
                                    zrobi to za Ciebie w kilka sekund.
                                    <br />
                                    📈 Stała optymalizacja <br /> – plan dostosowuje się do Twoich postępów,
                                    pomagając Ci unikać stagnacji i osiągać lepsze wyniki.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    👉 Wygeneruj plan i trenuj mądrzej!
                                </Typography>
                            </Box>
                        </Box>

                        {/* Funkcja 2 - Plany od ekspertów */}
                        <Box sx={{ mt: 2, maxWidth: '400px', width: '100%' }}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{ fontWeight: 'bold', fontSize: '28px', color: '#b4ca3f' }}
                            >
                                🏋️‍♂️ Profesjonalne plany treningowe od ekspertów
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    height: { xs: 'auto', sm: '400px', md: '500px' },
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 0,
                                    },
                                }}
                            >
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    Nie masz czasu na układanie planu? Skorzystaj z gotowych rozwiązań przygotowanych
                                    przez certyfikowanych trenerów i ekspertów fitness. Wybierz plan dopasowany do
                                    Twojego stylu życia i celu!
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 5, color: '#b4ca3f' }}
                                >
                                    Korzyści:
                                </Typography>
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    💪 Dostęp do sprawdzonych planów <br /> – stworzonych przez profesjonalistów dla
                                    różnych poziomów zaawansowania.
                                    <br />
                                    🔄 Elastyczność <br /> – wybierz plan pasujący do swoich preferencji bez
                                    konieczności zaczynania od zera.
                                    <br />
                                    📊 Śledź swoje postępy <br /> – zintegrowany system monitorowania Twoich
                                    wyników w jednym miejscu.
                                    <br />
                                </Typography>
                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 10, color: '#b4ca3f' }}
                                >
                                    👉 Wybierz gotowy plan i zacznij działać już dziś!
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* KOŃCOWE CTA */}
                <Box
                    sx={{
                        transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        backgroundColor: 'black',
                        color: 'white',
                        marginTop: 'auto',
                    }}
                >
                    <Typography variant="h3" component="h2" sx={{ fontSize: '26px',mb: 2, color: 'white' }}>
                        Gotowy na nową jakość treningu?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: '#b4ca3f', color: 'black' }} size="large">
                            Dołącz teraz
                        </Button>
                    </Link>
                </Box>

                {/* STOPKA */}
                <Footer language={'pl'} />
            </Box>
        </>
    );
}