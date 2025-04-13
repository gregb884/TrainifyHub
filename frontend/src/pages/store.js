import React, {useEffect, useState} from 'react';
import {Box, Container, Typography, Grid, CssBaseline, Button, CircularProgress} from '@mui/material';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import {sub} from "three/examples/jsm/nodes/math/OperatorNode";
import Cookies from "js-cookie";
import axios from "axios";
import Fade from '@mui/material/Fade';
import { getUserRole } from "@/utils/jwtDecode";


const Index = () => {
    const {t} = useTranslation('store');
    const router = useRouter();

    const navigateToTrainingPlans = () => router.push('/offer/workoutPlans');
    const navigateToAiPlan = () => router.push('/aiTrainingPlan');

    const [products, setProducts] = useState([]);
    const [productPricesIos, setProductPricesIos] = useState([]);
    const [pendingReceipt, setPendingReceipt] = useState(null);
    const [subscription, setSubscription] = useState([]);
    const [androidApp, setAndroidApp] = useState(true);
    const [iosApp, setIosApp] = useState(true);
    const [isAndroidBrowser, setIsAndroidBrowser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unconfirmedPurchase, setUnconfirmedPurchase] = useState(null);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [, forceRender] = useState();
    const [loading, setLoading] = useState(false);
    const [subEndDate, setSubEndDate] = useState(null);
    const [subRefreshIos, setSubRefreshIos] = useState(false);
    const [accessToPlans, setAccessToPlans] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];




    useEffect(() => {
        setUserRole(getUserRole(token));
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
            setIsAndroidBrowser(true);
        }
        sendMessageToIOS();
        getProducts();
        getSubscription();
        checkSubscriptionDate();
        checkAccessToPlans();
    }, []);

    useEffect(() => {
        forceRender({});
    }, [unconfirmedPurchase]);


    window.receiveProductPrices = function (prices) {
        setProductPricesIos(prices);
        setLoading(false);
    };

    window.receivePurchaseSuccess = function (receipt) {
        setPendingReceipt(receipt);
    };

    useEffect(() => {
        if (pendingReceipt) {

            sendPurchaseIOSToBackend(pendingReceipt).then((result) => {
                if (result === "Confirm Payment") {
                    window.webkit?.messageHandlers?.purchaseSuccess?.postMessage("Confirm Payment");
                } else if (result === "Confirm Sub") {
                    window.webkit?.messageHandlers?.purchaseSuccess?.postMessage("Confirm Sub");
                } else {
                    window.webkit?.messageHandlers?.purchaseSuccess?.postMessage("Not confirmed Payment");
                }
            });

            setPendingReceipt(null);
        }
    }, [pendingReceipt]);

    useEffect(() => {
        if (subEndDate) {
            const parsedDate = new Date(subEndDate);

            if (!isNaN(parsedDate)) {
                const now = new Date();
                const diffTime = now - parsedDate;

                if (diffTime >= 0) { // jesteśmy po tej dacie
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays <= 30) {
                        setSubRefreshIos(true);
                    } else {
                        setSubRefreshIos(false);
                    }
                } else {
                    setSubRefreshIos(false);
                }
            } else {
                setSubRefreshIos(false);
            }
        }
    }, [subEndDate]);


    const checkAccessToPlans = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/readyPlansAccessCheck`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data === "Access") {
                setAccessToPlans(true);
            }
            else {
                setAccessToPlans(false);
            }
        } catch (error) {

            setAccessToPlans(false);
        }
    };

    const checkSubscriptionDate = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_AUTH}/api/users/subscriptionEndDate`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {

                setSubEndDate(response.data);

            }
            else {

                setSubEndDate(null);

            }
        } catch (error) {

                console.error('Error fetching Access data:', error);
            setSubEndDate(null);
        }
    };

    async function sendPurchaseIOSToBackend(receipt) {
        try {
            const tokenAuth = Cookies.get('token');
            if (!tokenAuth) {
                throw new Error('Missing token!');
            }

            const response = await axios.post(
                "https://www.trainifyhub.com/api/auth-service/api/purchasesIos/verify-purchase",
                {
                    purchaseToken: receipt,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenAuth}`,
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );


            if (response.data === "Confirm Payment") {
                return "Confirm Payment";
            } else if (response.data === "Confirm Sub") {

                return "Confirm Sub";

            } else {
                console.error(response.data);
                return "false";
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                return false;
            } else if (error.request) {
                alert(t('serverDown'));
                return false;
            } else {
                alert(`❌ Error : ${error.message}`);
            }
            return false;
        }

    }


    const sendMessageToIOS = () => {
        if (window.webkit && window.webkit.messageHandlers.iosBridge) {
            window.webkit.messageHandlers.iosBridge.postMessage("downloadPrice");
            setIosApp(true);
        } else {
            setIosApp(false); ///dac na false
        }
    };

    async function getProducts() {
        try {
            if (!('getDigitalGoodsService' in window)) {
                setAndroidApp(false);
            }

            const service = await window.getDigitalGoodsService('https://play.google.com/billing');
            const productsList = await service.getDetails(['ai_custom_plan']);

            setProducts(productsList);


        } catch (error) {
            setAndroidApp(false);
        }
    }

    async function getSubscription() {
        try {

            const service = await window.getDigitalGoodsService('https://play.google.com/billing');
            const subscriptionList = await service.getDetails(['pre_made_plans']);

            setSubscription(subscriptionList);


        } catch (error) {
            setAndroidApp(false);
        }
    }

    async function buyProductIos(productId){

        if (window.webkit && window.webkit.messageHandlers.iosBridge) {
            window.webkit.messageHandlers.iosBridge.postMessage("buyProduct:"+productId);
        } else {
            console.log("❌ iOS bridge not found");
        }

    }


    async function buyProduct(productId) {
        let paymentResponse = null;
        setIsLoading(true);

        try {
            if (!('getDigitalGoodsService' in window)) {
                throw new Error( t('digitalGoodsNotConnected'));
            }

            const service = await window.getDigitalGoodsService('https://play.google.com/billing');

            const paymentMethods = [{
                supportedMethods: "https://play.google.com/billing",
                data: {sku: productId}
            }];

            const paymentDetails = {
                total: {label: "Total", amount: {currency: "USD", value: "0"}}
            };

            const request = new PaymentRequest(paymentMethods, paymentDetails);
            paymentResponse = await request.show();

            const {purchaseToken} = paymentResponse.details;

            if (!purchaseToken) {
                throw new Error(t('buyFail'));
            }

            const success = await waitForPurchaseConfirmation(productId, purchaseToken);

            if (!success) {
                throw new Error(t("backendAnswerFail"));
            }

            await service.consume(purchaseToken);

            try {
                await paymentResponse.complete('success');
            } catch (err) {
                console.log("err");
            }

            alert(t('buySuccess'));
            setTimeout(() => {
                handleAiPlan();
            }, 10);

        } catch (error) {
            if (error.name !== 'AbortError') {
                alert(`${t('buyFail')}  ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function waitForPurchaseConfirmation(productId, purchaseToken, retries = 10, delay = 30000) {
        for (let i = 0; i < retries; i++) {

            const confirmed = await sendPurchaseToBackend(productId, purchaseToken);

            if (confirmed) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return false;
    }


    async function sendPurchaseToBackend(productId, purchaseToken) {
        try {
            const tokenAuth = Cookies.get('token');
            if (!tokenAuth) {
                throw new Error('Missing token!');
            }

            const response = await axios.post(
                "https://www.trainifyhub.com/api/auth-service/api/purchases/verify",
                {
                    packageName: "com.trainifyhub.app",
                    productId: productId,
                    purchaseToken: purchaseToken,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenAuth}`,
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );


            if (response.data === "Confirm Payment") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error.response) {
                console.error("error.response.data");
            } else if (error.request) {
                alert(t('serverDown'));
            } else {
                alert(`❌ Error : ${error.message}`);
            }
            return false;
        }

    }

    useEffect(() => {
        checkForPendingPurchases();
    }, []);

    async function checkForPendingPurchases() {
        try {
            if (!('getDigitalGoodsService' in window)) {
                return;
            }

            const service = await window.getDigitalGoodsService('https://play.google.com/billing');
            const purchases = await service.listPurchases();

            if (purchases.length > 0) {
                setUnconfirmedPurchase(purchases[0]);
            } else {
                setUnconfirmedPurchase(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function claimPurchase() {
        if (!unconfirmedPurchase || !unconfirmedPurchase.purchaseToken || !unconfirmedPurchase.itemId) {
            alert(t('notFindToClaim'));
            return;
        }

        setIsLoading(true);

        const purchaseToken = unconfirmedPurchase.purchaseToken;
        const productId = unconfirmedPurchase.itemId;

        if(productId === 'ai_custom_plan'){


            try {
                const success = await sendPurchaseToBackend(productId, purchaseToken);

                if (!success) {
                    alert(t('backendAnswerFail'))
                    return;
                }

                const service = await window.getDigitalGoodsService('https://play.google.com/billing');
                await service.consume(purchaseToken);

                setUnconfirmedPurchase(null);
                alert(t('buySuccess'));

            } catch (error) {
                alert(t('claimNotDone'));
            } finally {
                setIsLoading(false);
            }


        }

        if(productId === 'pre_made_plans'){

            try {
                const success = await sendSubscriptionToBackend(productId, purchaseToken,userTimeZone);

                if (!success) {
                    alert(t('backendAnswerFail'))
                    return;
                }

                setUnconfirmedPurchase(null);
                alert(t('claimDoneSub'));

            } catch (error) {
                alert(t('claimNotDone'));
            } finally {
                setIsLoading(false);
            }

        }


    }

    async function waitForSubscriptionConfirmation(subscriptionId, purchaseToken, retries = 10, delay = 30000) {
        for (let i = 0; i < retries; i++) {

            const confirmed = await sendSubscriptionToBackend(subscriptionId, purchaseToken,userTimeZone);

            if (confirmed) {
                return true;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return false;
    }

    async function buySubscription(subscriptionId) {
        let paymentResponse = null;
        setIsLoading(true);

        try {
            if (!('getDigitalGoodsService' in window)) {
                throw new Error(t('digitalGoodsNotConnected'));
            }

            const service = await window.getDigitalGoodsService('https://play.google.com/billing');

            const paymentMethods = [{
                supportedMethods: "https://play.google.com/billing",
                data: { sku: subscriptionId }
            }];

            const paymentDetails = {
                total: { label: "Total", amount: { currency: "USD", value: "0" } }
            };

            const request = new PaymentRequest(paymentMethods, paymentDetails);
            paymentResponse = await request.show();

            const { purchaseToken } = paymentResponse.details;

            if (!purchaseToken) {
                throw new Error(t('buyFail'));
            }

            const success = await waitForSubscriptionConfirmation(subscriptionId, purchaseToken);

            if (!success) {
                throw new Error(t("backendAnswerFail"));
            }

            try {
                await paymentResponse.complete('success');
            } catch (err) {
                console.log("Ignoring complete() error:", err);
            }


            alert(t('subscriptionSuccess'));
            setTimeout(() => {
                handleReadyPlans();
            }, 10);

        } catch (error) {
            if (error.name !== 'AbortError') {
                alert(`${t('subscriptionFail')}  ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function sendSubscriptionToBackend(subscriptionId, purchaseToken) {
        try {
            const tokenAuth = Cookies.get('token');
            if (!tokenAuth) {
                throw new Error('Missing token!');
            }

            const response = await axios.post(
                `https://www.trainifyhub.com/api/auth-service/api/purchases/verify-subscription?zone=${userTimeZone}`,
                {
                    packageName: "com.trainifyhub.app",
                    productId: subscriptionId,
                    purchaseToken: purchaseToken,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenAuth}`,
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );

            if (response.data === "Subscription Active") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
            } else if (error.request) {
                alert(t('serverDown'));
            } else {
                alert(`❌ Error: ${error.message}`);
            }
            return false;
        }
    }


    const handleAiPlan = async () => {
        await router.push('/aiTrainingPlan');
    };

    const handleReadyPlans = async () => {
        await router.push('/offer/workoutPlans');
    };


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <CssBaseline/>
            <Navigation title={t('store')}/>

            <Box component="main"
                 sx={{marginTop: '50px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container
                    maxWidth="lg"
                    sx={{
                        textAlign: 'center',
                        padding: {xs: '16px', sm: '24px', md: '32px'},
                    }}
                >


                    {isLoading && (
                        <Box sx={{textAlign: 'center', mt: 3}}>
                            <CircularProgress color="secondary"/>
                            <Typography variant="body1" sx={{color: 'white', mt: 2}}>
                                {t('waitingForPayment')}
                            </Typography>
                        </Box>
                    )}

                    {unconfirmedPurchase && unconfirmedPurchase.itemId === 'ai_custom_plan' && !isLoading && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{mt: 3, mb: 3}}
                            onClick={claimPurchase}
                        >
                            🎁 {t('claimPurchase')}
                        </Button>
                    )}

                    {unconfirmedPurchase && unconfirmedPurchase.itemId === 'pre_made_plans' && !isLoading && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{mt: 3, mb: 3}}
                            onClick={claimPurchase}
                        >
                            🔄 {t('claimSubscription')}
                        </Button>
                    )}


                    {androidApp === true || iosApp === true ? (
                        <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                            {t('chooseProduct')}
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                            {t('buyInApp')}
                            {isAndroidBrowser && (
                                <>
                                    <br />
                                    <br />
                                    {t('androidBrowser')}
                                </>
                            )}
                        </Typography>
                    )}


                    {(androidApp === true &&

                        <Grid container spacing={2} justifyContent="center">
                            {/* Karty w jednym rzędzie */}
                            {userRole === "ROLE_USER" &&

                            <Grid item xs={6} sm={6} md={3}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: {xs: '300px', sm: '400px', md: '500px'},
                                        width: {xs: '180px', md: 'auto'},
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}
                                    onClick={() => buySubscription('pre_made_plans')}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/preMadePlans.webp)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}
                                    >
                                        {t('trainingPlans')}
                                        <br/>
                                        {subscription.length > 0 ? (
                                            <Typography variant="h6" sx={{color: 'yellow', mt: 2}}>
                                                {subscription[0]?.introductoryPrice?.value && subscription[0]?.introductoryPrice?.value !== "0.000000"
                                                    ? `${parseFloat(subscription[0].introductoryPrice.value).toFixed(2)} ${subscription[0].introductoryPrice.currency}`
                                                    : `${parseFloat(subscription[0].price.value).toFixed(2)} ${subscription[0].price.currency}`}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1" sx={{color: 'yellow', mt: 2}}>
                                                {t('noProductsAvailable')}
                                            </Typography>
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>
                            }


                            <Grid item xs={6} sm={6} md={3}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: {xs: '300px', sm: '400px', md: '500px'},
                                        width: {xs: '180px', md: 'auto'},
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}
                                    onClick={() => buyProduct('ai_custom_plan')}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/aiPlans.png)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}
                                    >
                                        {t('aiTrainingPlan')}
                                        <br/>
                                        {products.length > 0 ? (
                                            <Typography variant="h6" sx={{color: 'yellow', mt: 2}}>
                                                {products[0]?.introductoryPrice?.value && products[0]?.introductoryPrice?.value !== "0.000000"
                                                    ? `${parseFloat(products[0].introductoryPrice.value).toFixed(2)} ${products[0].introductoryPrice.currency}`
                                                    : `${parseFloat(products[0].price.value).toFixed(2)} ${products[0].price.currency}`}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1" sx={{color: 'yellow', mt: 2}}>
                                                {t('noProductsAvailable')}
                                            </Typography>
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>


                        </Grid>

                    )}

                    {(iosApp === true &&
                        <Fade in={true} timeout={1400}>
                        <Grid container spacing={2} justifyContent="center">


                            {userRole === "ROLE_USER" &&

                            <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        maxWidth: '280px',
                                        width: '100%',
                                        height: { xs: '300px', sm: '400px', md: '500px' },
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}

                                    onClick={() => buyProductIos('pre_made_plans')}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/preMadePlans.webp)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />

                                    {subRefreshIos === true && accessToPlans === false &&

                                        <Typography variant="h6" sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 120,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(129,228,102,0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}>
                                            🔄 {t('claimSubscription')}
                                        </Typography>

                                    }

                                    {subRefreshIos === false && accessToPlans === true &&

                                        <Typography variant="h6" sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 120,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(129,228,102,0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}>
                                            🔄 {t('subscriptionActive')}
                                        </Typography>

                                    }



                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}
                                    >
                                        {t('trainingPlans')}
                                        <br/>

                                        {subRefreshIos === false && accessToPlans === false &&

                                            <Typography variant="h6" sx={{color: 'yellow', mt: 2}}>
                                                {productPricesIos.length > 0 ? (
                                                    (() => {
                                                        const aiPlanIos = productPricesIos.find(product => product.id === "pre_made_plans");
                                                        return aiPlanIos ? (
                                                            <p>
                                                                <strong> {aiPlanIos.price} {aiPlanIos.currency}</strong>
                                                            </p>
                                                        ) : (
                                                            <p>{t('productNotFind')}</p>
                                                        );
                                                    })()
                                                ) : (

                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "47px"
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </div>
                                                )}
                                            </Typography>

                                        }


                                    </Typography>
                                </Box>
                            </Grid>
                            }


                            <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        maxWidth: '280px',
                                        width: '100%',
                                        height: { xs: '300px', sm: '400px', md: '500px' },
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 0,
                                        },
                                    }}
                                    onClick={() => buyProductIos('ai_custom_plan')}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url(/aiPlans.png)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            opacity: 1,
                                            transition: 'opacity 0.3s',
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            padding: {xs: '8px', md: '16px'},
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.5)',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fontSize: {xs: '16px', md: '16px', lg: '20px'},
                                        }}
                                    >
                                        {t('aiTrainingPlan')}
                                        <br/>

                                        <Typography variant="h6" sx={{color: 'yellow', mt: 2}}>
                                            {productPricesIos.length > 0 ? (
                                                (() => {
                                                    const aiPlanIos = productPricesIos.find(product => product.id === "ai_custom_plan");
                                                    return aiPlanIos ? (
                                                        <p>
                                                            <strong> {aiPlanIos.price} {aiPlanIos.currency}</strong>
                                                        </p>
                                                    ) : (
                                                        <p>{t('productNotFind')}</p>
                                                    );
                                                })()
                                            ) : (

                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "47px"
                                                }}>
                                                    <CircularProgress size={30}/>


                                                </div>
                                            )}
                                        </Typography>

                                    </Typography>

                                </Box>
                            </Grid>


                        </Grid>
                        </Fade>

                    )}
                </Container>
            </Box>
        </Box>
    );
}

export default withAuth(Index);