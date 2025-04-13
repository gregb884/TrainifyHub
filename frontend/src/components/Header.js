import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
    ExitToApp as ExitToAppIcon,
    ListAlt as ListAltIcon,
    Menu as MenuIcon
} from "@mui/icons-material";

const Header = ({ pageName , language }) => {
    const title = 'TrainifyHub';
    const drawerWidth = 240;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const [home , setHome] = useState('');
    const [more , setMore] = useState('');
    const [logIn, setLogIn] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [cookie, setCookie] = useState('');
    const [terms, setTerms] = useState('');
    const [contact , setContact] = useState('');

    useEffect(() => {

        if (language === 'pl') {
            setHome('Strona główna');
            setMore('Więcej');
            setLogIn('Zaloguj się');
            setPrivacy('Polityka Prywatności');
            setCookie('Wykorzystanie plików cookie');
            setTerms('Regulamin');
            setContact('Kontakt');
        }

        if (language === 'en') {
            setHome('Home');
            setMore('More');
            setLogIn('Log In');
            setPrivacy('Privacy Policy');
            setCookie('Cookie Usage');
            setTerms('Terms of Service');
            setContact('Contact');
        }

        if (language === 'de') {
            setHome('Startseite');
            setMore('Mehr');
            setLogIn('Anmelden');
            setPrivacy('Datenschutzbestimmungen');
            setCookie('Verwendung von Cookies');
            setTerms('Nutzungsbedingungen');
            setContact('Kontakt');
        }


    }, [language]);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgb(50,47,43)', boxShadow: 'none' }}>
                <Toolbar>
                    {isMobile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <IconButton
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ color: '#b4ca3f' }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: 'Russo One',
                                    fontSize: '24px',
                                    color: 'white',
                                    flexGrow: 1,
                                    userSelect: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <Link href="/pl" passHref legacyBehavior>
                                    <a style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Trainify
                                        <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                                        ub
                                    </a>
                                </Link>
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: 'Russo One',
                                    fontSize: '24px',
                                    color: 'white',
                                    flexGrow: 1,
                                    userSelect: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <Link  href={
                                    language === 'pl'
                                        ? '/pl'
                                        : language === 'de'
                                            ? '/de'
                                            : '/'
                                }  passHref legacyBehavior>
                                    <a style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Trainify
                                        <Box component="span" sx={{ color: '#b4ca3f' }}>H</Box>
                                        ub
                                    </a>
                                </Link>
                            </Typography>

                            <Button
                                sx={{
                                    ml: { md: 20, xs: 0 },
                                    backgroundColor: pageName === "Home" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }
                                }}
                                component={Link}
                                href={
                                    language === 'pl'
                                        ? '/pl'
                                        : language === 'de'
                                            ? '/de'
                                            : '/'
                                }
                            >
                                {home}
                            </Button>

                            {/* Rozwijane menu po najechaniu */}
                            <Box
                                onMouseEnter={handleMenuOpen}
                                onMouseLeave={handleMenuClose}
                            >
                                <Button
                                    sx={{
                                        backgroundColor: pageName === "Więcej" ? 'rgba(0,0,0,0.1)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }
                                    }}
                                    aria-controls="more-menu"
                                    aria-haspopup="true"
                                >
                                    {more}
                                </Button>
                                <Menu
                                    id="more-menu"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    MenuListProps={{ onMouseLeave: handleMenuClose }}
                                >
                                    <MenuItem sx={{borderRadius: '0px',backgroundColor: pageName === "Privacy" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }}} component={Link} href={
                                        language === 'pl'
                                            ? '/pl/privacy'
                                            : language === 'de'
                                                ? '/de/privacy'
                                                : '/privacy'
                                    }>
                                        {privacy}
                                    </MenuItem>
                                    <MenuItem sx={{borderRadius: '0px',backgroundColor: pageName === "Cookie" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }}} component={Link} href={
                                        language === 'pl'
                                            ? '/pl/cookie'
                                            : language === 'de'
                                                ? '/de/cookie'
                                                : '/cookie'
                                    }>
                                        {cookie}
                                    </MenuItem>
                                    <MenuItem  sx={{borderRadius: '0px',backgroundColor: pageName === "Terms" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }}} component={Link} href={
                                        language === 'pl'
                                            ? '/pl/terms'
                                            : language === 'de'
                                                ? '/de/terms'
                                                : '/terms'
                                    }>
                                        {terms}
                                    </MenuItem>
                                    <MenuItem sx={{borderRadius: '0px',backgroundColor: pageName === "Faq" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }}} component={Link} href={
                                        language === 'pl'
                                            ? '/pl/faq'
                                            : language === 'de'
                                                ? '/de/faq'
                                                : '/faq'
                                    }>
                                        FAQ
                                    </MenuItem>
                                    <MenuItem sx={{borderRadius: '0px',backgroundColor: pageName === "Contact" ? 'rgba(0,0,0,0.5)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }}} component={Link} href={
                                        language === 'pl'
                                            ? '/pl/contact'
                                            : language === 'de'
                                                ? '/de/contact'
                                                : '/contact'
                                    }>
                                        {contact}
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Button
                                sx={{
                                    backgroundColor: pageName === "Zaloguj się" ? 'rgba(0,0,0,0.1)' : 'transparent',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }
                                }}
                                component={Link}
                                href="/login"
                            >
                                {logIn}
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(180, 202, 63, 1)',
                        marginTop: { xs: '55px', md: '64px' },
                        maxHeight: 'calc(100vh - 55px)',
                        overflowY: 'auto',
                    },
                }}
            >
                <List>
                    <ListItem sx={{ backgroundColor: pageName === "Home" ? 'rgb(163,161,158)' : 'inherit' }} button component={Link} href={
                        language === 'pl'
                            ? '/pl'
                            : language === 'de'
                                ? '/de'
                                : '/'
                    }>
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText primary={home} />
                    </ListItem>
                    <ListItem sx={{ backgroundColor: pageName === "LogIn" ? 'rgb(163,161,158)' : 'inherit' }} button component={Link} href="/login">
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={logIn} />
                    </ListItem>

                    {/* Sekcja dla telefonów */}
                    <ListItem>
                        <ListItemText primary={more} />
                    </ListItem>
                    <ListItem button sx={{ backgroundColor: pageName === "Privacy" ? 'rgb(163,161,158)' : 'inherit' }} component={Link} href={
                        language === 'pl'
                            ? '/pl/privacy'
                            : language === 'de'
                                ? '/de/privacy'
                                : '/privacy'
                    }>
                        <ListItemText primary={privacy} />
                    </ListItem>
                    <ListItem button sx={{ backgroundColor: pageName === "Cookie" ? 'rgb(163,161,158)' : 'inherit' }} component={Link} href={
                        language === 'pl'
                            ? '/pl/cookie'
                            : language === 'de'
                                ? '/de/cookie'
                                : '/cookie'
                    }>
                        <ListItemText primary={cookie} />
                    </ListItem>
                    <ListItem button sx={{ backgroundColor: pageName === "Terms" ? 'rgb(163,161,158)' : 'inherit' }} component={Link} href={
                        language === 'pl'
                            ? '/pl/terms'
                            : language === 'de'
                                ? '/de/terms'
                                : '/terms'
                    }>
                        <ListItemText primary={terms} />
                    </ListItem>
                    <ListItem button sx={{ backgroundColor: pageName === "Faq" ? 'rgb(163,161,158)' : 'inherit' }} component={Link} href={
                        language === 'pl'
                            ? '/pl/faq'
                            : language === 'de'
                                ? '/de/faq'
                                : '/faq'
                    }>
                        <ListItemText primary="FAQ" />
                    </ListItem>
                    <ListItem button sx={{ backgroundColor: pageName === "Contact" ? 'rgb(163,161,158)' : 'inherit' }} component={Link} href={
                        language === 'pl'
                            ? '/pl/contact'
                            : language === 'de'
                                ? '/de/contact'
                                : '/contact'
                    }>
                        <ListItemText primary={contact} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Header;