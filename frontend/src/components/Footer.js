import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';

const Footer = ({ language }) => {


    const router = useRouter();

    const [privacy, setPrivacy] = useState('');
    const [cookie, setCookie] = useState('');
    const [terms, setTerms] = useState('');
    const [contact , setContact] = useState('');
    const [allRights, setAllRights] = useState('');


    useEffect(() => {

        if (language === 'pl') {
            setPrivacy('Polityka Prywatności');
            setCookie('Wykorzystanie plików cookie');
            setTerms('Regulamin');
            setContact('Kontakt');
            setAllRights('Wszelkie prawa zastrzeżone.')
        }

        if (language === 'en') {
            setPrivacy('Privacy Policy');
            setCookie('Cookie Usage');
            setTerms('Terms of Service');
            setContact('Contact');
            setAllRights('All rights reserved.')
        }

        if (language === 'de') {
            setPrivacy('Datenschutzbestimmungen');
            setCookie('Verwendung von Cookies');
            setTerms('Nutzungsbedingungen');
            setContact('Kontakt');
            setAllRights('Alle Rechte vorbehalten.')
        }

    }, [language]);




    return (
        <>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    mt: 'auto',
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    boxShadow: 2,
                }}
            >
                <Typography variant="body2" sx={{ color: 'black' }}>
                    © 2025 TrainifyHub. {allRights}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 4,
                        mt: 1,
                        flexWrap: 'wrap'
                    }}
                >
                    <Box sx={{cursor: 'pointer'}} onClick={() => {
                        const path = language === 'pl' ? '/pl/privacy' : language === 'de' ? '/de/privacy' : '/privacy';
                        router.push(path);
                    }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            {privacy}
                        </Typography>
                    </Box>

                    <Box sx={{cursor: 'pointer'}} onClick={() => {
                        const path = language === 'pl' ? '/pl/cookie' : language === 'de' ? '/de/cookie' : '/cookie';
                        router.push(path);
                    }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            {cookie}
                        </Typography>
                    </Box>

                    <Box sx={{cursor: 'pointer'}} onClick={() => {
                        const path = language === 'pl' ? '/pl/terms' : language === 'de' ? '/de/terms' : '/terms';
                        router.push(path);
                    }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            {terms}
                        </Typography>
                    </Box>
                    <Box sx={{cursor: 'pointer'}} onClick={() => {
                        const path = language === 'pl' ? '/pl/faq' : language === 'de' ? '/de/faq' : '/faq';
                        router.push(path);
                    }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            FAQ
                        </Typography>
                    </Box>
                    <Box sx={{cursor: 'pointer'}} onClick={() => {
                        const path = language === 'pl' ? '/pl/contact' : language === 'de' ? '/de/contact' : '/contact';
                        router.push(path);
                    }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            {contact}
                        </Typography>
                    </Box>
                </Box>


            </Box>
        </>
    );
};

export default Footer;