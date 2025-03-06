# AI Chat App Template

## Introduction

This project is a chat application built with Next.js, utilizing Firebase for authentication and Firestore for data storage. The application allows users to create and manage chat sessions, interact with an AI assistant, and maintain a history of their conversations.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed. Then, run:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root of your project and add your API keys and other environment variables:

   ```plaintext
   
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key
   ```

4. **Run the Development Server**:
   Start the application with:
   ```bash
   npm run dev
   ```
   Your application will be available at `http://localhost:3000`.

## API Keys

- **LLM API Keys**: These keys are required to interact with various LLM APIs. Make sure to keep them secure and do not expose them in your client-side code. Use environment variables to manage sensitive information:

  ```plaintext
  NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key # Get from https://console.groq.com/keys
  NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key # Get from https://console.mistral.ai/
  ```

- **Firebase Config**: These keys are required for Firebase authentication and Firestore. Get them from your Firebase Console (https://console.firebase.google.com/):
  ```plaintext
  NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
  ```

## Features

✅ AI Chat with Groq and Mistral
✅ Firebase Authentication (Google Login)
✅ Markdown Support (Headings, Lists, Tables, Links)
✅ Speech-to-Text Input
✅ Dark/Light Mode Toggle
✅ Chat Sidebar with Session History
✅ Copy and Rerun Messages
✅ Fully Responsive

## Folder Structure

### 1. `pages/`

This directory contains the application's pages. Each file corresponds to a route in the application.

- **`index.js`**: The main landing page of the application.
- **`chat/[id].js`**: A dynamic route for individual chat sessions, where `[id]` corresponds to the chat ID.

### 2. `components/`

This folder contains reusable React components used throughout the application.

- **`Chat.jsx`**: The main chat interface component that handles displaying messages and user input.
- **`Message.jsx`**: A component for rendering individual messages in the chat.
- **`Navbar.jsx`**: The navigation bar component that includes user authentication options.
- **`Sidebar.jsx`**: The sidebar component for navigating between different chat sessions.

### 3. `modules/`

This directory contains modules that encapsulate specific functionalities or features of the application.

- **`Layout/`**: Contains the layout wrapper for the application, which includes the sidebar and navbar.
- **`Navbar/`**: Contains the navbar component and related functionalities.
- **`Sidebar/`**: Contains the sidebar component for chat navigation.

### 4. `redux/`

This folder contains Redux slices and store configuration for state management.

- **`slices/`**: Contains individual slices for managing different parts of the application state, such as authentication and chat data.

### 5. `lib/`

This directory contains utility functions and configurations.

- **`utils/`**: Contains utility functions for Firebase configuration and other helper functions.

### 6. `public/`

This folder is used for static assets such as images, icons, and other files that need to be served directly.

### 7. `styles/`

This directory contains global styles and CSS files for the application.

### 8. `README.md`

This file provides an overview of the project, installation instructions, and other relevant information.

## Deploy on Vercel

You can deploy this project easily on Vercel.

1. Create a Vercel account at [vercel.com](https://vercel.com).
2. Click New Project → Select your GitHub repository.
3. Set your Environment Variables in Vercel's dashboard.
4. Click Deploy – Your app will be live in a few minutes! 🎉

## Tech Stack

The application is built with the following technologies:

### Core Technologies

- **Next.js 13**: React framework for production-grade applications
- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript for enhanced development

### State Management & Authentication

- **Redux Toolkit**: State management with simplified Redux configuration
- **Firebase**: Authentication and backend services
- **js-cookie**: Client-side cookie handling

### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Icons**: Comprehensive icon library
- **React Toastify**: Toast notifications

### AI & API Integration

- **GROQ**: AI model integration
- **Mistral AI**: AI model integration

### Development Tools

- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **PostCSS**: CSS transformation tool
- **Autoprefixer**: CSS vendor prefixing

This modern tech stack ensures a robust, scalable, and maintainable application with a focus on developer experience and code quality.

## Firebase Authentication Setup
To enable authentication methods such as Google, GitHub, and Email/Password in your Firebase project, follow these steps:

1. **Go to Firebase Console**:
   Navigate to your Firebase project in the [Firebase Console](https://console.firebase.google.com/).

2. **Select Authentication**:
   In the left sidebar, click on "Authentication" and then click on the "Get Started" button if you haven't already set it up.

3. **Add Sign-in Methods**:

   - Click on the "Sign-in method" tab.
   - You will see a list of sign-in providers. Click on the toggle to enable the following methods:

   ### Google

   - Click on "Google" and toggle the switch to enable it.
   - You may need to provide a project support email.
   - Click "Save".

   ### GitHub

   - Click on "GitHub" and toggle the switch to enable it.
   - You will need to provide your GitHub OAuth Client ID and Client Secret. To obtain these:
     - Go to [GitHub Developer Settings](https://github.com/settings/developers).
     - Click on "New OAuth App".
     - Fill in the required fields:
       - **Application Name**: Your app's name.
       - **Homepage URL**: Your app's URL (e.g., `http://localhost:3000` for local development).
       - **Authorization callback URL**: This should be your Firebase project's OAuth redirect URL (found in the Firebase console).
     - After creating the app, copy the Client ID and Client Secret and paste them into the Firebase console.
   - Click "Save".

   ### Email/Password

   - Click on "Email/Password" and toggle the switch to enable it.
   - Click "Save".

4. **Add Users** (Optional):

   - You can manually add users by clicking on the "Users" tab and then "Add user". Enter the email and password for the new user.

5. **Update Your Environment Variables**:
   Ensure that your `.env` file contains the necessary keys for Firebase authentication.

   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   ```

Now your Firebase project is set up to use Google, GitHub, and Email/Password authentication methods!
