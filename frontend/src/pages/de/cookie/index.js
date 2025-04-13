import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";





export default function Index() {



    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Cookie'} language={'de'}/>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    mt: { md: 2, xs: 12 },
                    minHeight: '30vh',
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Cookie-Richtlinie
                    </Typography>

                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '15px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Gültig ab: 01.01.2025
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
                    mt: 2,
                    mr: 2,
                    color: 'white',
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        1. Was sind Cookies?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Cookies sind kleine Textdateien, die auf Ihrem Gerät (Computer, Tablet, Smartphone) von den von Ihnen besuchten Websites gespeichert werden. Sie werden häufig verwendet, um das ordnungsgemäße Funktionieren von Websites zu gewährleisten und den Website-Betreibern Informationen über die Präferenzen der Benutzer bereitzustellen.
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
                        2. Welche Cookies verwenden wir?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Auf unserer Website verwenden wir nur die minimal notwendige Anzahl an Cookies, die für den Betrieb des Dienstes erforderlich sind. Wir verwenden nur zwei Cookies: eines, das das Authentifizierungstoken nach der Anmeldung des Nutzers speichert, und das andere, um die Sprache des Browsers zu erkennen.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Arten von Cookies, die auf unserer Website verwendet werden:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>- Ziel: Sie gewährleisten das ordnungsgemäße Funktionieren des Dienstes und ermöglichen das Einloggen in das Benutzerkonto.
                        <br/>- Cookie: token, i18next
                        <br/>- Aufbewahrungszeit: Bis zum Ende der Sitzung oder bis zum Ausloggen.
                        <br/>- Gespeicherte Daten: Das Authentifizierungstoken des Benutzers, die in der Browser eingestellt Sprache.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wir verwenden keine analytischen, marketingbezogenen oder Tracking-Cookies.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        3. Wie können Sie Cookies verwalten?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Sie können Cookies auf verschiedene Weise verwalten:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        - Sie können die Einstellungen Ihres Browsers so konfigurieren, dass er bestimmte Arten von Cookies akzeptiert oder ablehnt.
                        <br />- Sie können gespeicherte Cookies in den Einstellungen Ihres Internetbrowsers löschen.
                        <br />- Bitte beachten Sie, dass das Deaktivieren von Cookies die Nutzung einiger Funktionen des Dienstes, wie z. B. die Anmeldung, verhindern kann.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Anleitungen zur Verwaltung von Cookies in den beliebtesten Browsern:
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.google.com/chrome/answer/95647?hl=de"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Google Chrome
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Mozilla Firefox
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.apple.com/de-de/guide/safari/sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Safari
                    </Typography>

                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.microsoft.com/de-de/windows/verwalten-von-cookies-in-microsoft-edge-anzeigen-zulassen-blockieren-löschen-und-verwenden-168dab11-0753-043d-7c16-ede5947fc64d"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '18px',
                            lineHeight: 3,
                            textAlign: 'left',
                            maxWidth: 'lg',
                            color: 'white',
                            mb: 4,
                            fontWeight: '300',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#b4ca3f',
                            }
                        }}
                    >
                        Microsoft Edge
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Geben wir Cookies an Dritte weiter?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Nein. Das von unserer Website gespeicherte Cookie dient ausschließlich der Authentifizierung des Benutzers und wird nicht an Dritte weitergegeben oder zu Werbezwecken verwendet.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Änderungen an der Cookie-Richtlinie
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Wir behalten uns das Recht vor, diese Cookie-Richtlinie bei Bedarf zu aktualisieren. Alle Änderungen werden auf unserer Website veröffentlicht.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Kontakt
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns bitte unter:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        📧 Email: support@trainifyhub.com

                    </Typography>
                </Box>

            </Box>


            <Footer language={'de'}/>



        </Box>


    );

}