# Vitaloop - Recovery & Wellness App 🌱

Vitaloop is a comprehensive React Native mobile application designed to support users in their recovery journey from addictions and help build healthy habits. The app features AI-powered chat assistance, progress tracking, goal setting, and community support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio (for Android development)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd recoverAiFrontend
   npm install
   ```

2. Set up environment variables:
   - Configure `EXPO_PUBLIC_API_URL` for your backend API
   - Set up `EXPO_PUBLIC_GOOGLE_LOGIN_URL` for Google OAuth

3. Start the development server:
   ```bash
   npm start
   ```

### Development Commands

**Core Commands:**
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run test` - Run Jest tests in watch mode
- `npm run lint` - Run ESLint

**Build Commands:**
- `eas build --platform ios --profile development` - Development iOS build
- `eas build --platform android --profile development` - Development Android build
- `eas build --platform all --profile production` - Production builds

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: Expo Router (file-based routing)
- **Forms**: Formik + Yup validation
- **Authentication**: Multi-provider (Email, Apple Sign-In, Google OAuth)
- **Internationalization**: React i18next (English/Turkish)

### Key Features
- **AI Assistant "Vita"**: Chat-based support system
- **Addiction Tracking**: Monitor recovery progress and milestones
- **Goal Management**: Set and track personal wellness goals
- **Daily Check-ins**: Mood and feeling tracking
- **Achievement System**: Celebrate recovery milestones
- **Routine Builder**: Create healthy daily routines
- **Push Notifications**: Reminders and encouragement
- **Secure Authentication**: JWT tokens with biometric support

### Project Structure
```
app/
├── (app)/                 # Protected app routes
│   ├── (drawer)/         # Drawer navigation
│   │   └── (tabs)/       # Tab navigation (Home, Journey)
│   ├── chat/             # AI assistant chat screens
│   ├── addiction/        # Addiction tracking & management
│   ├── goal/             # Goal setting & tracking
│   └── profile/          # User profile & settings
├── create-account/       # Account creation flow
├── sign-in.tsx          # Authentication screen
└── _layout.tsx          # Root layout with providers

components/
├── chat/                 # AI chat components
├── journey/              # Progress tracking UI
└── themed/               # Themed UI components

redux/
├── slices/               # Feature-based Redux slices
└── store.ts              # Redux store configuration

services/                 # API services with RTK Query
```

## 🔐 Authentication Flow

The app supports multiple authentication methods:
- Email/password authentication
- Apple Sign-In (iOS only)
- Google OAuth with deep linking

JWT tokens are securely stored using Expo Secure Store with biometric protection when available.

## 🔧 Configuration

### Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API endpoint (default: `https://api.vitaloop.app`)
- `EXPO_PUBLIC_GOOGLE_LOGIN_URL`: Google OAuth redirect URL

### Deep Linking
The app is configured with the `vitaloop://` URL scheme for deep linking and OAuth callbacks.

### Push Notifications
Firebase Cloud Messaging is integrated for iOS and Android push notifications.

**Required Configuration:**
- `google-services.json` file is required for Android builds and Firebase integration

## 📱 Platform Support

- **iOS**: Supports iPhone (portrait only), includes Apple Sign-In integration
- **Android**: Full Android support with adaptive icons
- **Required Permissions**:
  - Microphone access (for voice features)
  - Push notifications
  - Biometric authentication (Face ID/Touch ID)

## 🧪 Testing

The project uses Jest with the `jest-expo` preset:
```bash
npm run test
```

## 🚀 Deployment

### Development Builds
```bash
# iOS development build
eas build --platform ios --profile development

# Android development build
eas build --platform android --profile development
```

### Production Builds
```bash
# Build for both platforms
eas build --platform all --profile production
```

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Use the established patterns for navigation, state management, and API calls
3. Add appropriate TypeScript types
4. Test on both iOS and Android platforms
5. Run linting before committing: `npm run lint`

## 📄 License

This project is private and proprietary.

---

## App Screens
<p align="center">
  <img src="https://github.com/user-attachments/assets/7d996375-5203-46d3-ae1b-4468166883c0" width="250" />
  <img src="https://github.com/user-attachments/assets/91293c83-6544-4926-83d9-a85055f8486e" width="250" />
  <img src="https://github.com/user-attachments/assets/fb5a2e93-d71d-40eb-aa31-7ed94e9f295f" width="250" />
  <img width="250" src="https://github.com/user-attachments/assets/fe60ea9f-f192-4a74-b38d-717fff87c2ee" />
  <img width="250" src="https://github.com/user-attachments/assets/425fe292-cb06-484e-9bba-a46e4bc61083" />
  <img width="250" height="2556" src="https://github.com/user-attachments/assets/0004d21b-26fd-44e4-aa4b-f67685315c6a" />

</p>



**App Store**: com.nusret35.recoverai
**Version**: 1.0.4
**Minimum Requirements**: iOS 13+, Android API 21+
