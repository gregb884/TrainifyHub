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

            <Header pageName={'Terms'} language={'en'}/>

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
                        Terms of Service
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
                        1. General Provisions
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        1.	These Terms of Service define the rules for using the TrainifyHub platform, available at www.trainifyhub.com.
                        <br/>2.	The operator and owner of the platform is Grzegorz Wyrębski.
                        <br/>3. For inquiries about the platform’s operation, please contact us at support@trainifyhub.com.
                        <br/>4. By using the platform, the user agrees to these Terms of Service and the Privacy Policy.
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
                        2. Scope of Services
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
                        <br/> - Creating custom workout plans.
                        <br/> - Purchasing access to ready-made workout plans prepared by experts.
                        <br/> - Generating workout plans using artificial intelligence (AI).
                        <br/> - Finding personal trainers and requesting customized workout plans.
                        <br/> - Monitoring training progress and statistics.
                        <br/> - Supporting performance improvement in sports.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '500' }}>
                        Some functionalities may require payment according to the platform’s pricing policy.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        3. Terms of Use
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	An active account is required to use the platform.
                        <br/>2. Registration is available to both individuals and personal trainers with no age restrictions.
                        <br/>3. The user agrees to use the platform in compliance with applicable laws and ethical standards.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        4. Registration and Login
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>	1. To access the full functionality of the platform, users must create an account, providing:

                        <br/>- Email address
                        <br/>- Full name
                        <br/>- password
                        <br/>- Account type (trainer or user)
                        <br/>- Preferred language and region
                        <br/>2. Users are responsible for the accuracy of their provided data.
                        <br/>3. Users can edit or delete their accounts at any time.
                    </Typography>
                </Box>



                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        5. Responsibilities and Limitations
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        <br/>1.	TrainifyHub is not responsible for improper exercise execution or injuries resulting from workout plans.
                        <br/>2. Users access and use the provided workout plans at their own risk.
                        <br/>3. TrainifyHub does not guarantee specific fitness or health results.
                        <br/>4. All content in the platform is for informational purposes only and does not replace professional training or medical advice.
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        6. Payments and Refunds
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Some services require a one-time or recurring payment, including:
                        <br/>- One-time fee for AI-generated workout plans.
                        <br/>- Monthly subscription for access to expert-designed workout plans.
                        <br/>2. Refunds are not possible for digital services such as AI-generated workout plans or pre-made training plans, in accordance with applicable laws on digital content.
                        <br/>3. Payments are processed via Apple Pay and Google Pay.
                        <br/>4. Detailed payment information is available under the “Payments” section on the platform.

                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        7. Account Deletion
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	Users can delete their accounts at any time:
                        <br/>- Independently by accessing the link <Link
                            href="https://www.trainifyhub.com/delete-data"
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
                            www.trainifyhub.com/delete-data</Link>
                        <br/>- By contacting us at: support@trainifyhub.com.
                        <br/>2. Deleting an account permanently removes all user data from the platform.
                        <br/>3. TrainifyHub is not responsible for any consequences of account deletion by the user.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        8. Copyright and Intellectual Property
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	All content within the platform, including workout plans, graphics, texts, and training materials, belongs to TrainifyHub and is legally protected.
                        <br/>2. Users may not copy, distribute, or share content without prior permission from TrainifyHub.
                        <br/>3. Any violations of intellectual property rights may result in legal action.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 0, fontWeight: 'bold' }}>
                        9. Changes to the Terms of Service
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        <br/>1.	TrainifyHub reserves the right to modify these Terms of Service at any time.
                        <br/>2. Users will be informed of any changes via email and in-app notifications.
                        <br/>3. Continued use of the platform after changes implies acceptance of the new terms.

                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '24px',  color: 'white', mb: 4, fontWeight: 'bold' }}>
                        10. Contact
                    </Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>
                        For any questions regarding the Terms of Service, please contact us at:
                    </Typography>
                </Box>


                <Box sx={{display: 'flex'}}>
                    <Typography variant="h2" component="h1" sx={{ mr: 1,fontSize: '18px',lineHeight: 3,textAlign: 'left',maxWidth: 'lg',  color: 'white', mb: 4, fontWeight: '300' }}>

                        📧 Email: support@trainifyhub.com

                    </Typography>
                </Box>

            </Box>


            <Footer language={'pl'}/>



        </Box>


    );

}