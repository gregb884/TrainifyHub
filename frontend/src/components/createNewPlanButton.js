import { useRouter } from 'next/router';
import { Button } from '@mui/material';

const CreateNewPlanButton = () => {
    const router = useRouter();

    const handleCreateNewPlan = () => {
        router.push('/createNewPlan');
    };

    return (
        <Button onClick={handleCreateNewPlan} color="primary" variant="contained">
            Create New Plan
        </Button>
    );
};

export default CreateNewPlanButton;