# Social Login App

This project implements a login page with social login options for Facebook and Google. It provides a user-friendly interface for authentication using popular social media accounts.

## Project Structure

```
social-login-app
├── src
│   ├── components
│   │   ├── LoginPage.tsx
│   │   └── SocialLoginButtons.tsx
│   ├── services
│   │   └── authService.ts
│   ├── config
│   │   └── socialKeys.ts
│   ├── App.tsx
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- Login with Facebook
- Login with Google
- Secure handling of authentication keys

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd social-login-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

This will launch the application in your default web browser.

## Configuration

Make sure to set up your Facebook and Google applications to obtain the necessary secure keys. Update the `src/config/socialKeys.ts` file with your keys:

```typescript
export const FACEBOOK_APP_ID = 'your_facebook_app_id';
export const GOOGLE_CLIENT_ID = 'your_google_client_id';
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.