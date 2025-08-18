import React from 'react';
import SocialLoginButtons from './SocialLoginButtons';

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <h2>Login</h2>
            <SocialLoginButtons />
        </div>
    );
};

export default LoginPage;