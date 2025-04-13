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
import Image from "next/image";
import { Link as ScrollLink } from 'react-scroll';

export default function Home() {

    const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);


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

    const language = i18n.language.split('-')[0];

    useEffect(() => {
        if (language === 'pl') {
            setShowLanguageSwitcher(true);
        }
        else if (language === 'de') {
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
            <Head>
                <title>TrainifyHub - The Best Training Plans and Coaches</title>
                <meta
                    name="description"
                    content="Discover the best training plans and coaches tailored to your needs. Everything in one place - TrainifyHub!"
                />
                <meta
                    name="keywords"
                    content="training, fitness, workout plans, personal trainer, progress analysis, gym, exercises, health"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:title" content="TrainifyHub - The Best Training Plans and Coaches" />
                <meta
                    property="og:description"
                    content="Join TrainifyHub and discover the best training plans created by professionals. Track your stats, generate AI-powered plans, and train smarter!"
                />
                <meta property="og:image" content="/images/og_image.jpg" />
                <meta property="og:url" content="https://trainifyhub.com" />
                <meta property="og:type" content="website" />
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
                                language === 'en' ? 'Do you prefer a different language?' :
                                    language === 'pl' ? 'Dostępna jest polska wersja serwisu' :
                                        language === 'de' ? 'Es ist eine deutsche Version verfügbar' :
                                            'Would you like to switch language?'
                            }
                        </Typography>

                        {language === 'pl' && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ml: 1}}
                                onClick={() =>  router.push('/pl')}
                            >
                                Przejdź
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


                <Header pageName={'Home'} language={'en'} />


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
                            Welcome to
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
                        Discover the best workout plans and trainers tailored to your needs. Everything in one place!
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ml: {xs: 0 , md: -2}}} gap={3}>
                        <ScrollLink
                            to="model"
                            smooth={true}
                            duration={1200}
                            offset={60}
                        >
                            <Button variant="contained" color="primary" size="large">
                                Get Started
                            </Button>
                        </ScrollLink>
                        <Link href="https://apps.apple.com/us/app/trainifyhub/id6743364032?itscg=30200&itsct=apps_box_link&mttnsubad=6743364032" passHref>
                            <Image src="/appStoreEn.svg" width={138} height={100} alt="appStore" />
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.trainifyhub.app" passHref>
                            <Image src="/googleEn.png" width={150} height={150} alt="google" />
                        </Link>

                    </Box>
                </Box>

                <Box
                    id={'model'}
                    sx={{
                        position: 'sticky',
                        top: '10%',
                        mt: {xs :-15 , md: 5},
                        display: 'flex',
                        justifyContent: 'top',
                        alignItems: 'top',
                        height: '170vh',
                        zIndex: -1,
                    }}
                >
                    <IphoneModel activeScreen={activeScreen} language={'en'} />
                </Box>

                <Box  sx={{ height: '300vh', textAlign: 'center', color: 'white' }}>

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
                                Analyze your results in real-time
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
                                Find the perfect trainer for you
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
                                Find your best plan
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
                                Generate a plan using AI
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
                                Create your own workout plans
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
                            {'> 800 exercises with 3D animations'}
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
                            Personalized tools and statistics
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
                            Simple plan editor – modify on the go
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
                            Ready-made plans from professionals
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
                        Ready for a new training experience?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} size="large">
                            Join now
                        </Button>
                    </Link>
                </Box>


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
                                🏋️‍♂️ Personalized Workouts
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                A plan tailored to your goals and skill level.
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
                                        backgroundImage: `url(/indexKindPlanen.webp)`,
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
                                📊 Advanced Analysis
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Track your progress and achieve new goals.
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
                                        backgroundImage: `url(/indexStatisticen.webp)`,
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
                                📱On All Devices
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                                Plan and organize anywhere – on your phone, tablet, or computer.
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
                        Are you a personal trainer? You’ve come to the right place!
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
                                ️ Enhance the quality of your services
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
                                    Do you want to meet your clients’ expectations and improve your service quality?
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
                                How much does it cost?
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
                                        🚀 Absolutely 0!
                                    </Typography>
                                     Both the trainer and the client incur no costs during cooperation.
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
                                Why is it worth it?
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
                                        💪 Ease and convenience:
                                    </Typography>
                                    Create a workout plan in an intuitive system and assign it to your client in just a few clicks.
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
                                        🧐 No more guesswork:
                                    </Typography>
                                    The client doesn’t have to wonder how to perform an exercise – they will see 3D animations that clearly demonstrate the technique.
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
                                        📊 Full control and analysis:
                                    </Typography>
                                    Track your clients’ progress in real time – how many times, with what weight, and when they performed a given workout.
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
                                        📈 Better engagement:
                                    </Typography>
                                    The client has constant access to their plan, sees their statistics and achievements, which motivates them to keep going.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

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
                        Paid Features:
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
                                🚀 AI-Powered Smart Training Plans
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
                                    Want to reach your goals faster and more efficiently? Use an advanced artificial intelligence algorithm that will create a personalized plan tailored to your level, goals, and preferences.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    Benefits
                                </Typography>

                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    🎯 Top-level personalization <br /> AI analyzes your progress and preferences to deliver the perfect plan for you.
                                    <br />
                                    ⏱ Save time <br /> – no more spending hours searching for the perfect plan, AI will do it for you in seconds.
                                    <br />
                                    📈 Constant optimization <br /> – the plan adapts to your progress, helping you avoid stagnation and achieve better results.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 2, color: '#b4ca3f' }}
                                >
                                    👉 Generate a plan and train smarter!
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
                                🏋️‍♂️ Professional Training Plans from Experts
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
                                    Don’t have time to create a plan? Take advantage of ready-made solutions prepared by certified trainers and fitness experts.
                                </Typography>

                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 5, color: '#b4ca3f' }}
                                >
                                    Benefits:
                                </Typography>
                                <Typography sx={{ color: 'white', textAlign: 'left', fontSize: '20px' }}>
                                    💪 Access to proven plans <br /> – created by professionals for various skill levels.
                                    <br />
                                    🔄 Flexibility <br /> – choose a plan that fits your preferences without having to start from scratch.
                                    <br />
                                    📊 Track your progress <br /> – an integrated system for monitoring your results in one place.
                                    <br />
                                </Typography>
                                <Typography
                                    sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left', mt: 10, color: '#b4ca3f' }}
                                >
                                    👉 Choose a ready-made plan and start today!
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
                        Ready for a new training experience?
                    </Typography>
                    <Link href="/register" passHref>
                        <Button variant="contained" sx={{ backgroundColor: '#b4ca3f', color: 'black' }} size="large">
                            Join now
                        </Button>
                    </Link>
                </Box>

                <Footer language={'en'} />
            </Box>
        </>
    );
}