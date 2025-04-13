import React, {useEffect} from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import ContactCard from "@/components/contactCard";
import Footer from "@/components/Footer";





export default function Index() {


    return(

        <Box component="main" sx={{display: 'flex',minHeight: '100vh', flexDirection: 'column' }}>

            <Header pageName={'Contact'} language={'de'}/>

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
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '30px',mt: 10,  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Kontaktieren Sie uns
                    </Typography>

                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ ml: 5,mr: 5,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Haben Sie Fragen zur TrainifyHub-App? Benötigen Sie Hilfe oder möchten Sie uns Ihre Vorschläge mitteilen? Wir sind hier, um Ihnen zu helfen!
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 2,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Sie können uns kontaktieren über:
                        <br/>📧 E-mail: support@trainifyhub.com
                    </Typography>
                </Box>

                <ContactCard language={'de'}/>

                <Box sx={{minHeight: '5vh'}}>

                </Box>

            </Box>


            <Footer language={'de'}/>



        </Box>


    );

}