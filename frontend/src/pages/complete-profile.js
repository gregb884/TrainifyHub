import dynamic from 'next/dynamic';

const CompleteProfileComponent = dynamic(() => import('../components/CompleteProfileComponent'), {
    ssr: false,
});

export default function LoginPage() {
    return <CompleteProfileComponent />;
}