import Cookies from "js-cookie";
import axios from "axios";

const getToken = () => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

const apiUrl = process.env.NEXT_PUBLIC_API_TRAINING_MANAGER;

export const fetchSumUsers = async () => {

    try {
        const response = await axios.get(`${apiUrl}/api/user/countClient`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "ngrok-skip-browser-warning":"any"
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching sum plans:', error);
        throw error;
    }
};