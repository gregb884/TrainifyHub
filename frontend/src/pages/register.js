import dynamic from 'next/dynamic';

const RegisterComponent = dynamic(() => import('../components/Register'), {
    ssr: false,
});

export default function RegisterPage() {
    return <RegisterComponent />;
}