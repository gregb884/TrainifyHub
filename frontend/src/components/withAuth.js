import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';

const withAuth = (WrappedComponent) => {
    const WithAuthComponent = (props) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login');
            }
        }, [loading, user, router]);

        if (loading) {
            return <p>Loading...</p>;
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthComponent;
};

export default withAuth;