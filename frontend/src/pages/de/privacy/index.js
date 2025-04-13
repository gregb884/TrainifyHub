import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';





export default function Index() {


    const router = useRouter();

    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Privacy'} language={'de'}/>

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
                        Datenschutzerklärung
                    </Typography>

                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '15px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Letzte Aktualisierung: 27.01.2025
                    </Typography>


                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ ml: 5,mr: 5,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Vielen Dank, dass Sie TrainifyHub nutzen. Wir legen großen Wert auf den Schutz Ihrer Privatsphäre und stellen sicher, dass Ihre Daten gemäß den geltenden gesetzlichen Bestimmungen verarbeitet werden. Diese Datenschutzerklärung beschreibt, welche Daten wir sammeln, wie wir sie verwenden und welche Rechte Sie in Bezug auf deren Verarbeitung haben.
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
                        1. Administrator personenbezogener Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,lineHeight: 3,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Der Administrator Ihrer personenbezogenen Daten ist:
                        Grzegorz Wyrębski
                        <br/>Kontakt-E-Mail: support@trainifyhub.com
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
                        2. Welche Daten erfassen wir?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wir erfassen personenbezogene Daten ausschließlich zur Nutzung der TrainifyHub-Anwendung. Die Daten werden vom Nutzer freiwillig angegeben und umfassen unter anderem:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Daten, die während der Registrierung und Nutzung der Anwendung angegeben werden:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Vor- und Nachname
                        <br/>E-Mail-Adresse
                        <br/>Passwort (in verschlüsselter Form gespeichert)
                        <br/>Angaben zu Gewicht, Größe und anderen persönlichen Merkmalen (falls der Nutzer diese bereitstellt)
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Cookies:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        TrainifyHub verwendet zwei Cookies, eines speichert das Authentifizierungstoken, das erforderlich ist, um die Benutzersitzung aufrechtzuerhalten, und das andere dient zur Bestimmung der Sprache des Browsers.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Nachrichtendaten:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Über den integrierten Messenger gesendete Nachrichten werden gespeichert, um die Kommunikation mit dem Administrator zu ermöglichen.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Wir sammeln keine Analysedaten und verfolgen das Nutzerverhalten nicht zu Marketingzwecken.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        3. Zwecke der Datenverarbeitung
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '500' }}>
                        Ihre personenbezogenen Daten werden ausschließlich für folgende Zwecke verarbeitet:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Sicherstellung der Funktionsweise der TrainifyHub-Anwendung und ihrer Funktionen
                        <br/>Abwicklung von Bestellungen und Zahlungen (z. B. über Apple Pay und Google Pay)
                        <br/>Verwaltung des Benutzerkontos
                        <br/>Kommunikation mit dem Benutzer (z. B. über das Kontaktformular)
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Benutzerdaten werden nicht für Marketingzwecke verwendet oder profiliert.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        4. Speicherdauer der Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Die personenbezogenen Daten des Nutzers werden bis zur Löschung des Kontos gespeichert. Nach der Löschung des Kontos werden alle Daten dauerhaft aus unseren Systemen entfernt.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5. Weitergabe personenbezogener Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wir geben Ihre personenbezogenen Daten nicht an Dritte weiter.
                        Zahlungssysteme wie Apple Pay und Google Pay arbeiten unabhängig und haben keinen Zugriff auf die in der Anwendung gespeicherten personenbezogenen Daten.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Cookies und Tracking-Technologien
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        In der TrainifyHub-App verwenden wir zwei Cookies. Eines dient ausschließlich der Speicherung des Authentifizierungstokens, das die Benutzersitzung aufrechterhält, und das andere zur Bestimmung der Sprache des Browsers. Wir verwenden keine Cookies für Werbe- oder Analysezwecke.
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        7. Rechte des Nutzers
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '500' }}>
                        Sie haben das Recht auf:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        -Zugang zu Ihren personenbezogenen Daten
                        <br/>Bearbeitung Ihrer Daten
                        <br/>Löschung Ihrer Daten (durch Löschen Ihres Kontos)
                        <br/>Informationen über die Verarbeitung Ihrer personenbezogenen Daten
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Hinweis: Der Widerruf der Einwilligung zur Verarbeitung personenbezogener Daten führt dazu, dass Sie die TrainifyHub-Anwendung nicht mehr nutzen können.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        8. Sicherheitsmaßnahmen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 0, fontWeight: '300' }}>
                        Wir setzen geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer personenbezogenen Daten ein, darunter:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        -Datenverschlüsselung (z. B. Speicherung von Passwörtern in verschlüsselter Form)
                        <br/>-Zugriffskontrolle – nur der Administrator hat Zugriff auf die Datenbank
                        <br/>-Regelmäßige Updates und Server-Sicherheitsmaßnahmen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        9. Änderungen an der Datenschutzerklärung
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Wir behalten uns das Recht vor, diese Datenschutzerklärung zu ändern.
                        Alle Änderungen werden den Nutzern per E-Mail mitgeteilt, und die weitere Nutzung der Anwendung nach den Änderungen bedeutet deren Zustimmung.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Kontakt bezüglich Datenschutz
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Bei Fragen oder Bedenken zur Verarbeitung personenbezogener Daten kontaktieren Sie uns unter:
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