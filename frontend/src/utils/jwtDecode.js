
import {decode} from "jsonwebtoken";

export const getUserRole = (token) => {
    try {
        const decodedToken = decode(token);
        return decodedToken.roles || decodedToken.role;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }

};

export const getUserInfo = (token) => {
    try {
        const decodedToken = decode(token);
        return {
            id: decodedToken.id,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            email: decodedToken.sub
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserLang = (token) => {
    try {
        const decodedToken = decode(token);
        return decodedToken.lang || decodedToken.lang;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }

};


export const getUserId = (token) => {
    try {
        const decodedToken = decode(token);
        return decodedToken.id || decodedToken.id;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }

};