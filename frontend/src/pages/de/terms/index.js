import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import { useRouter } from 'next/router';
import Footer from "@/components/Footer";
import Link from "next/link";




export default function Index() {

    const router = useRouter();

    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Terms'} language={'de'}/>

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
                        Nutzungsbedingungen des Dienstes
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
                        1. Allgemeine Bestimmungen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        1.	Diese Nutzungsbedingungen legen die Regeln für die Nutzung des TrainifyHub-Dienstes fest, der unter der Adresse www.trainifyhub.com verfügbar ist.
                        <br/>2.	Betreiber und Eigentümer des Dienstes ist Grzegorz Wyrębski.
                        <br/>3. Kontakt bezüglich der Funktionsweise des Dienstes: support@trainifyhub.com
                        <br/>4. Durch die Nutzung des Dienstes akzeptiert der Nutzer diese Nutzungsbedingungen sowie die Datenschutzrichtlinie.
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
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        2. Leistungsumfang
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
                        <br/>- Erstellung individueller Trainingspläne
                        <br/>- Erwerb von Zugang zu vorgefertigten Trainingsplänen von Experten
                        <br/>- Generierung von Trainingsplänen mittels künstlicher Intelligenz (KI)
                        <br/>- Suche nach Personal Trainern und Beauftragung individueller Trainingspläne
                        <br/>- Überwachung von Fortschritten und Trainingsstatistiken
                        <br/>- Unterstützung bei der Verbesserung sportlicher Leistungen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Die Nutzung bestimmter Funktionen kann eine Gebühr gemäß der aktuellen Preisliste des Dienstes erfordern.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        3. Nutzungsbedingungen des Dienstes
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	Die Nutzung des Dienstes erfordert ein aktives Konto.
                        <br/>2. Die Registrierung ist für natürliche Personen sowie Personal Trainer ohne Altersbeschränkung verfügbar.
                        <br/>3. Der Nutzer verpflichtet sich, den Dienst im Einklang mit geltendem Recht und guten Sitten zu nutzen.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        4. Registrierung und Anmeldung
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>	1.	Um alle Funktionen des Dienstes nutzen zu können, muss der Nutzer ein Konto erstellen und folgende Daten angeben:

                        <br/>- E-Mail-Adresse
                        <br/>- Vor- und Nachname
                        <br/>- Passwort
                        <br/>- Kontotyp (Trainer oder Nutzer)
                        <br/>- Sprache und Region
                        <br/>2. Der Nutzer ist für die Richtigkeit der angegebenen Daten verantwortlich.
                        <br/>3. Der Dienst ermöglicht es, das Konto jederzeit zu bearbeiten oder zu löschen.
                    </Typography>
                </Box>



                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        5. Haftung und Einschränkungen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	TrainifyHub übernimmt keine Verantwortung für falsche Übungsausführung oder Verletzungen, die durch die Nutzung der Trainingspläne entstehen können.
                        <br/>2. Die Nutzung des Dienstes und der angebotenen Trainingspläne erfolgt auf eigene Verantwortung des Nutzers.
                        <br/>3. TrainifyHub garantiert nicht den gewünschten sportlichen oder gesundheitlichen Erfolg.
                        <br/>4. Alle im Dienst bereitgestellten Informationen dienen nur Informationszwecken und ersetzen keine Beratung durch einen professionellen Trainer oder Spezialisten.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        6. Zahlungen und Rückerstattungen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Die Nutzung bestimmter Funktionen des Dienstes erfordert eine einmalige oder regelmäßige Zahlung, abhängig vom gewählten Paket:
                        <br/>- Einmalige Gebühr für die Generierung eines Trainingsplans durch KI
                        <br/>- Monatliches Abonnement für vorgefertigte Trainingspläne
                        <br/>2. Bei digitalen Dienstleistungen wie KI-generierten Trainingsplänen oder dem Zugang zu vorgefertigten Trainingsprogrammen sind Rückerstattungen nach dem Kauf und der Generierung der Inhalte nicht möglich, gemäß den geltenden Vorschriften für digitale Inhalte.
                        <br/>3. Zahlungen erfolgen über Apple Pay und Google Pay.
                        <br/>4. Details zu den Zahlungen sind im Bereich „Zahlungen“ des Dienstes verfügbar.

                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        7. Kontolöschung
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Der Nutzer hat das Recht, sein Konto jederzeit zu löschen:
                        <br/>- Selbstständig durch den Zugriff auf den Link <Link
                        href="https://www.trainifyhub.com/de/delete-data"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: "30px",
                            color: "white",
                            mb: 4,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        www.trainifyhub.com/de/delete-data</Link>
                        <br/>- Durch Kontaktaufnahme per E-Mail: support@trainifyhub.com
                        <br/>2. Das Löschen des Kontos führt zur endgültigen und unwiderruflichen Löschung aller Nutzerdaten aus dem Dienst.
                        <br/>3. TrainifyHub übernimmt keine Verantwortung für die Folgen der Kontolöschung durch den Nutzer.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        8. Urheberrechte und geistiges Eigentum
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	TrainifyHub behält sich das Recht vor, die Nutzungsbedingungen jederzeit zu ändern.
                        <br/>2. Nutzer werden über Änderungen per E-Mail sowie durch entsprechende Mitteilungen in der App informiert.
                        <br/>3. Die weitere Nutzung des Dienstes nach Änderungen der Nutzungsbedingungen bedeutet deren Annahme.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        9. Änderungen der Nutzungsbedingungen
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	TrainifyHub behält sich das Recht vor, die Nutzungsbedingungen jederzeit zu ändern.
                        <br/>2. Nutzer werden über Änderungen per E-Mail sowie durch entsprechende Mitteilungen in der App informiert.
                        <br/>3. Die weitere Nutzung des Dienstes nach Änderungen der Nutzungsbedingungen bedeutet deren Annahme.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Kontakt
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Für alle Fragen zu den Nutzungsbedingungen kontaktieren Sie uns unter:
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