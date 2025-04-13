import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import { useRouter } from 'next/router';
import Footer from "@/components/Footer";




export default function Index() {

    const router = useRouter();

    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Faq'} language={'de'}/>

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
                      FAQ
                    </Typography>

                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Hast du Fragen zu TrainifyHub? Schau dir die häufig gestellten Fragen an und finde die Antworten!
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
                        1. Was ist TrainifyHub?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        TrainifyHub ist eine innovative Trainings-App, die es den Nutzern ermöglicht, eigene Trainingspläne zu erstellen, auf von Experten vorbereitete Programme zuzugreifen, Pläne mit Hilfe von KI zu generieren und mit Personal Trainern zusammenzuarbeiten. Die App sammelt Statistiken und hilft dabei, Fortschritte zu verfolgen.
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
                        2. Ist die Nutzung von TrainifyHub kostenlos?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{
                        mr: 1,

                        fontSize: '18px',
                        lineHeight: 2,
                        textAlign: 'left',
                        maxWidth: 'lg',
                        color: 'white',
                        mb: 4,
                        fontWeight: '300'
                    }}>
                        Ja! Du kannst die grundlegenden Funktionen der App völlig kostenlos nutzen. Kostenpflichtig sind lediglich zusätzliche Funktionen wie die KI-gestützte Planerstellung und der Zugang zu fertigen Trainingsplänen.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        3. Wie kann ich ein Konto erstellen?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{
                        mr: 1,
                        fontSize: '18px',
                        lineHeight: 3,
                        textAlign: 'left',
                        maxWidth: 'lg',
                        color: 'white',
                        mb: 4,
                        fontWeight: '300'
                    }}>
                        <br/>Um ein Konto zu erstellen, musst du lediglich folgende Informationen angeben:
                        <br/>✅ E-Mail-Adresse
                        <br/>✅ Vor- und Nachname
                        <br/>✅ Passwort
                        <br/>✅ Kontotyp auswählen (Nutzer oder Trainer)
                        <br/>✅ Sprache und Region festlegen
                        <br/>Die Registrierung dauert weniger als eine Minute!
                        <br/>Du kannst dich auch mit einem Google- oder Apple-Konto anmelden.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Wie funktioniert die KI-gestützte Planerstellung?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Unsere künstliche Intelligenz analysiert deine Ziele, dein Fitnesslevel und deine Trainingsvorlieben, um einen personalisierten Plan zu erstellen, der auf deine Bedürfnisse zugeschnitten ist. Gib einfach einige grundlegende Informationen an, und die KI generiert innerhalb weniger Sekunden das optimale Training für dich!
                    </Typography>
                </Box>



                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Wie kann ich mit einem Personal Trainer zusammenarbeiten?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Du kannst in der App nach einem Trainer suchen und ihn mit der Erstellung eines individuellen Trainingsplans beauftragen. Der Trainer erstellt einen Plan, der dann in deinem Profil verfügbar ist.
                        <br/> Die Zahlungsmodalitäten werden direkt zwischen dir und dem Trainer vereinbart – TrainifyHub greift nicht in die Zahlungsabwicklung ein.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Wie verfolgt die App meine Fortschritte?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        TrainifyHub erfasst Daten aus deinen Trainingseinheiten – es speichert die Anzahl der Sätze, Wiederholungen, das verwendete Gewicht und die Dauer der Übungen. Du kannst deine Statistiken jederzeit einsehen, deine Ergebnisse analysieren und dein Training optimieren.


                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        7. Kann ich mein Konto und meine Daten löschen?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Ja, du kannst dein Konto jederzeit zusammen mit allen gespeicherten Daten löschen. Diese Option ist in den App-Einstellungen verfügbar oder du kannst uns per E-Mail kontaktieren: support@trainifyhub.com.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        8. Welche Zahlungsmethoden stehen zur Verfügung?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Derzeit unterstützen wir Zahlungen über Apple Pay und Google Play. So kannst du sicher und bequem auf kostenpflichtige Funktionen zugreifen.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        9. Sind meine Daten sicher?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Ja! Alle Daten werden verschlüsselt und nach höchsten Sicherheitsstandards gespeichert. Nur du hast Zugriff auf deine Daten, und wir geben sie niemals an Dritte weiter.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Wie kann ich den technischen Support kontaktieren?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Falls du Fragen oder Probleme hast, kannst du uns über folgende Wege erreichen:
                        <br/>📧 E-mail: support@trainifyhub.com
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        Hast du keine Antwort auf deine Frage gefunden? Kontaktiere uns – wir helfen dir gerne! 🚀
                    </Typography>
                </Box>

            </Box>


            <Footer language={'de'}/>



        </Box>


    );

}