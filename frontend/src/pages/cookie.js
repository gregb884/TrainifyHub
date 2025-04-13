import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import '@/app/indexCss.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";





export default function Index() {



    return(

        <Box component="main" sx={{display: 'flex', flexDirection: 'column' }}>

            <Header pageName={'Cookie'} language={'en'}/>

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
                        Cookie Policy
                    </Typography>

                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '15px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        Effective from: 01.01.2025
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
                        1. What are cookies?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        Cookies are small text files stored on your device (computer, tablet, smartphone) by websites you visit. Cookies are widely used to ensure the smooth operation of websites and allow their owners to obtain information about user preferences.
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
                        2. What cookies do we use?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        On our website, we use the minimum number of cookies necessary for the service to function. We use only two cookies: one that stores the authentication token after the user logs in, and the other to detect the browser’s language.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Types of cookies used on our website:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        - Purpose: They ensure the proper functioning of the service and enable user account login.
                        <br/>- Cookie: token, i18next
                        <br/>- Retention period: Until the end of the session or until the user logs out.
                        <br/>- Stored data: User’s authentication token, browser’s set language.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        We do not use analytical, marketing, or tracking cookies.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        3.	How can you manage cookies?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        You can manage cookies in several ways:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        - You can configure your browser settings to accept or reject specific types of cookies.
                        <br />- You can delete stored cookies in your browser settings.
                        <br />- Keep in mind that disabling cookies may prevent you from using certain website features, such as logging in.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Instructions for managing cookies in the most popular browsers:
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                        variant="h2"
                        component="a"
                        href="https://support.google.com/chrome/answer/95647?hl=en"
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
                        href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
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
                        href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
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
                        href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
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
                        4.	Do we share cookies with third parties?
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        No. The cookie stored by our website is solely used for user authentication and is not shared with third parties or used for advertising purposes.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        5.	Changes to the Cookie Policy
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        We reserve the right to update this cookie policy if necessary. Any changes will be published on our website.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        6. Contact
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        If you have any questions regarding our cookie policy, please contact us at:
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        📧 Email: support@trainifyhub.com

                    </Typography>
                </Box>

            </Box>


            <Footer language={'en'}/>



        </Box>


    );

}