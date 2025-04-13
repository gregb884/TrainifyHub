import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

export const fetchSumPlans = async () => {

    const token = Cookies.get('token');

    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${apiUrl}/api/trainingPlan/sumPlans`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching sum plans:', error);
        throw error;
    }
};

export const fetchSumMyPlans = async () => {

    const token = Cookies.get('token');

    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${apiUrl}/api/trainingPlan/myPlans`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching sum plans:', error);
        throw error;
    }
};

export const fetchTrainingPlans = async () => {

    const token = Cookies.get('token');


    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${apiUrl}/api/trainingPlan/viewAllTrainingPlans`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching sum plans:', error);
        throw error;
    }
};


export const createNewPlanForUser = async (values) => {
    const { email, ...bodyData } = values;
    const token = Cookies.get('token');

    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    try {
        const response = await axios.post(
            `${apiUrl}/api/trainingPlan/newPlanForUser?email=${values.traineeEmail}`,
            bodyData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {



        throw error;
    }
};

export const createNewPlanForYourself = async (values) => {
    const { email, ...bodyData } = values;

    const token = Cookies.get('token');

    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    try {
        const response = await axios.post(
            `${apiUrl}/api/trainingPlan/create`,
            bodyData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );


        return response.data;
    } catch (error) {
        console.error('Error creating plan for user:', error);
        throw error;
    }
};