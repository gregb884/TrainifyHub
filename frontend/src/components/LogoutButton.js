import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { signOut } from "next-auth/react";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {

            await signOut({ redirect: false });

            await axios.post('/api/logout');

            router.push("/login");
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        }
    };

    return (
        <Button onClick={handleLogout} color="primary" variant="contained">
            Logout
        </Button>
    );
};

export default LogoutButton;