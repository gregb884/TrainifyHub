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

        if (language === 'pl') {
            setShowLanguageSwitcher(true);
        }
        else if (language !== 'de') {
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
                                language !== 'pl' &&  language !== 'de' ? 'Do you prefer English ?' :
                                     language === 'pl' ? 'Dostępna jest polska wersja serwisu' :
                                        'Would you like to switch language?'
                            }
                        </Typography>

                        { language !== 'de' &&  language !== 'pl' && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ml: 1}}
                                onClick={() =>  router.push('/')}
                            >
                                Go to
                            </Button>
                        )}

                        { language === 'pl' && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push('/pl')}
                            >
                                Przejdź
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

                <Header pageName={'Home'} language={'de'} />

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
                            Willkommen bei
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
                        Entdecke die besten Trainingspläne und Trainer, die auf deine Bedürfnisse zugeschnitten sind – alles an einem Ort!
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ml: {xs: 0 , md: -2}}} gap={3}>
                        <ScrollLink
                            to="model"
                            smooth={true}
                            duration={1200}
                            offset={60}
                        >
                            <Button variant="contained" color="primary" size="large">
                                Loslegen
                            </Button>
                        </ScrollLink>
                        <Link href="https://apps.apple.com/us/app/trainifyhub/id6743364032?itscg=30200&itsct=apps_box_link&mttnsubad=6743364032" passHref>
                            <Image src="/appleDe.svg" width={138} height={100} alt="appStore" />
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.trainifyhub.app" passHref>
                            <Image src="/googleDe.png" width={150} height={150} alt="google" />
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
                    <IphoneModel activeScreen={activeScreen} language={'de'} />
                </Box>

                <Box sx={{ height: '300vh', textAlign: 'center', color: 'white' }}>


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
                                Analysiere deine Ergebnisse in Echtzeit
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
                                Finde den perfekten Trainer für dich
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
                                Finde deinen besten Plan
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
                                Generiere deinen Plan mit AI
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
                                Erstelle deine eigenen Trainingspläne
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
                            {'> 800 Übungen mit 3D-Animationen'}
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
                            Personalisierte Tools und Statistiken
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
                            Einfacher Plan-Editor – passe deine Pläne unterwegs an
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
                            Fertige Trainingspläne von Profis
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
                        Bereit für eine neue Trainingsqualität?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} size="large">
                            Jetzt beitreten!
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
                                🏋️‍♂️ Personalisierte Workouts
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Ein Plan, der an deine Ziele und dein Fitnesslevel angepasst ist.
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
                                        backgroundImage: `url(/indexKindPlande.webp)`,
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
                                📊 Erweiterte Analyse
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Verfolge deine Fortschritte und erreiche neue Ziele.
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
                                        backgroundImage: `url(/indexStatisticde.webp)`,
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
                                📱Auf allen Geräten
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Plane und erstelle deine Trainings überall – auf dem Telefon, Tablet oder Computer.
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
                        Bist du ein Personal Trainer? Dann bist du hier genau richtig!
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
                                ️Steigere die Qualität deiner Dienstleistungen
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
                                    Möchtest du den Erwartungen deiner Kunden gerecht werden und die Qualität deiner Dienstleistungen verbessern? Anstatt Trainingspläne in Textform oder Excel-Tabellen zu versenden, schließe dich TrainifyHub an und teile deine Pläne in einer benutzerfreundlicheren Form!
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
                                Wie viel kostet es?
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
                                        🚀 Absolut 0!
                                    </Typography>
                                    Weder Trainer noch Kunde tragen irgendwelche Kosten für die Zusammenarbeit.
                                    Erstelle, weise zu, analysiere – alles kostenlos, ohne versteckte Gebühren.
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
                                Warum lohnt es sich?
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
                                        💪 Einfachheit und Komfort:
                                    </Typography>
                                    Erstelle einen Trainingsplan in einem intuitiven System und weise ihn deinem Kunden mit nur wenigen Klicks zu.
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
                                        🧐 Schluss mit Rätselraten:
                                    </Typography>
                                    Der Kunde muss nicht überlegen, wie eine Übung ausgeführt wird – er sieht 3D-Animationen, die die Technik genau veranschaulichen.
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
                                        📊 Volle Kontrolle und Analyse:
                                    </Typography>
                                    Verfolge die Fortschritte deiner Kunden in Echtzeit – wie oft, mit welchem Gewicht und wann sie das Training absolviert haben.
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
                                        📈 Höheres Engagement:
                                    </Typography>
                                    Der Kunde hat jederzeit Zugriff auf seinen Trainingsplan, sieht seine Statistiken und Erfolge, was ihn zusätzlich motiviert, weiterzumachen.
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
                        Kostenpflichtige Funktionen
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
                                🚀 Intelligente Trainingspläne mit KI
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
                                    Möchtest du deine Ziele schneller und effektiver erreichen? Nutze den fortschrittlichen KI-Algorithmus, der einen personalisierten Plan erstellt, der auf dein Niveau, deine Ziele und deine Vorlieben zugeschnitten ist.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    Korzyści:
                                </Typography>

                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    🎯 Personalisierung <br /> auf höchstem Niveau! Die KI analysiert deine Fortschritte und Vorlieben, um dir den perfekten Plan zu liefern.
                                    <br />
                                    ⏱ Zeitersparnis <br /> – du musst nicht stundenlang nach dem idealen Plan suchen, die KI erledigt es für dich in wenigen Sekunden.
                                    <br />
                                    📈 Ständige Optimierung <br /> – der Plan passt sich deinen Fortschritten an, hilft dir, Stagnation zu vermeiden und bessere Ergebnisse zu erzielen.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    👉 Generiere deinen Plan und trainiere smarter!
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
                                🏋️‍♂️ Professionelle Trainingspläne von Experten
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
                                    Hast du keine Zeit, deinen eigenen Trainingsplan zu erstellen? Nutze fertige Lösungen, die von zertifizierten Trainern und Fitness-Experten entwickelt wurden. Wähle einen Plan, der zu deinem Lebensstil und deinen Zielen passt!

                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 5, color: '#b4ca3f' }}
                                >
                                    Vorteile:
                                </Typography>
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    💪 Zugang zu bewährten Plänen <br /> – erstellt von Profis für verschiedene Leistungsniveaus.
                                    <br />
                                    🔄 Flexibilität <br /> –  wähle einen Plan, der zu deinen Vorlieben passt, ohne von vorne beginnen zu müssen.
                                    <br />
                                    📊 Verfolge deine Fortschritte <br /> – ein integriertes System zur Überwachung deiner Trainingsergebnisse an einem Ort.
                                    <br />
                                </Typography>
                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 10, color: '#b4ca3f' }}
                                >
                                    👉 Wähle einen fertigen Plan und leg noch heute los!
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
                        Bereit für ein neues Trainingserlebnis?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: '#b4ca3f', color: 'black' }} size="large">
                            Jetzt beitreten!
                        </Button>
                    </Link>
                </Box>

                {/* STOPKA */}
                <Footer language={'de'} />
            </Box>
        </>
    );
}