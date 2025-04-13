import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {

        error: {
            main: '#ffd607', // Zmieniamy kolor błędu na żółty
        },
        mode: 'light', // Zmieniamy tryb na jasny
        primary: {
            main: '#b4ca3f', //  jako kolor główny
        },
        secondary: {
            main: 'rgba(180, 202, 63, 0.5)'
        },
        background: {
            default: '#ffffff', // Jasne tło
            paper: '#b4ca3f', // Jasny kolor dla kart i komponentów Paper
        },
        text: {
            primary: '#000000', // Czarny kolor dla tekstu głównego
            secondary: '#4f4f4f', // Ciemnoszary kolor dla tekstu pomocniczego
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h6: {
            fontWeight: 600,
            color: '#000000', // Czarny kolor dla nagłówków
        },
        h4: {
            fontWeight: 600,
            color: '#f4f2f2', // Czarny kolor dla nagłówków
        },
        body1: {
            color: '#000000', // Czarny kolor dla tekstu głównego
        },
        body2: {
            color: '#171717', // Biały kolor dla tekstu pomocniczego
        },
    },
    components: {

        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#aaaaaa', // domyślny kolor
                    '&.Mui-checked': {
                        color: '#b4ca3f', // limonkowy kolor po zaznaczeniu
                    },
                    '&.Mui-disabled': {
                        color: '#afadad', // zmień kolor checkboxa, gdy jest wyłączony
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage: 'linear-gradient(0deg, rgba(4,9,9,1) 0%, rgba(52,50,46,1) 100%)',
                    // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/indexBackground.jpeg')`,

                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    color: '#fff',
                },

            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: '16px',
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    height: '45px',
                    padding: '10px',
                },
                outlined: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 16px',
                    height: '40px',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Styl przy najechaniu
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)', // Styl dla zaznaczonego elementu
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)', // Hover dla zaznaczonego elementu
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Jasny kolor tła dla kart (Paper)
                    color: '#000000', // Czarny kolor dla tekstu w kartach
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px', // Zaokrąglenie
                        height: '45px', // Wysokość pola


                    },
                },
            },
        },

        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#0e0e0e', // Biały kolor dla typografii
                },
            },
        },
        MuiListItemText: { // Dodane, aby zmienić kolor tekstu w pasku bocznym
            styleOverrides: {
                primary: {

                    color: '#000000', // Czarny kolor dla głównego tekstu w elemencie listy
                },
                secondary: {
                    color: '#4f4f4f', // Ciemnoszary kolor dla pomocniczego tekstu w elemencie listy
                },
            },
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255,255,255,0.5)', // Białe tło pól formularza
                    color: '#000000', // Czarny kolor tekstu w polach formularza

                },
                input: {

                    '&::placeholder': {
                        color: '#4f4f4f', // Szary kolor dla placeholderów
                    },
                },
            },
        },



        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e88e5', // Niebieski kolor obramowania na fokus
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff0000', // Kolor obramowania przy błędzie
                    },

                    input: {
                        '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0px 1000px rgba(255, 255, 255, 0.5) inset', // Zmiana koloru tła
                            WebkitTextFillColor: '#000000', // Zmiana koloru tekstu
                            borderRadius: '12px',
                            height: '12px'
                        },
                    },

                },
                notchedOutline: {
                    borderColor: '#a0a0a0', // Szary kolor obramowania w stanie normalnym
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    color: '#f3ecec', // Kolor tekstu w paginacji
                },
                actions: {
                    color: '#ffffff', // Kolor przycisków paginacji
                },
                selectIcon: {
                    color: '#ffffff', // Kolor ikony rozwijania
                },
                selectLabel: {
                    color: '#f3ecec', // Kolor tekstu obok selecta
                },
                displayedRows: {
                    color: '#f3ecec', // Kolor tekstu pokazującego zakres stron
                },
                menuItem: {
                    color: '#000000', // Kolor opcji w rozwijanym menu
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // Kolor etykiety
                    transform: 'translate(0, -25px)',
                    fontSize: '12px',


                    '&.Mui-focused': {
                        color: '#ffffff', // Kolor w stanie focused
                        transform: 'translate(0, -20px)', // Przesunięcie wyżej w stanie focused
                    },
                },
            },
        },

        typography: {
            fontFamily: 'Roboto, Russo One, Arial, sans-serif', // Kolejność fallbacków
        },
    },
});

export default theme;