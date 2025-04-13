import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get('/api/checkAuth', { withCredentials: true });
                    console.log('Auth check response:', response);
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    router.push('/login');
                }
            };
            checkAuth();
        }, []);

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;