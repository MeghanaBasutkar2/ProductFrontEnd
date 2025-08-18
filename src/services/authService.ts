import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '../config/socialKeys';

export const loginWithFacebook = async () => {
    try {
        const response = await fetch(`https://graph.facebook.com/v10.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=YOUR_REDIRECT_URI&client_secret=YOUR_CLIENT_SECRET&code=YOUR_CODE`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Facebook login error:', error);
        throw error;
    }
};

export const loginWithGoogle = async () => {
    try {
        const response = await fetch(`https://oauth2.googleapis.com/token?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=YOUR_REDIRECT_URI&client_secret=YOUR_CLIENT_SECRET&code=YOUR_CODE&grant_type=authorization_code`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};