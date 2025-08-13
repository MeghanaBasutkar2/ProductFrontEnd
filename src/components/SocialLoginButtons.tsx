import React from 'react';
import { loginWithFacebook, loginWithGoogle } from '../services/authService';

const SocialLoginButtons: React.FC = () => {
    const handleFacebookLogin = () => {
        loginWithFacebook();
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
    };

    return (
        <div>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default SocialLoginButtons;