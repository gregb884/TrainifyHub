import dynamic from 'next/dynamic';

const LoginComponent = dynamic(() => import('../components/Login'), {
    ssr: false,
});

export default function LoginPage() {
    return <LoginComponent />;
}