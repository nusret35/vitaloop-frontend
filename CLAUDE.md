# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Commands:**
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator  
- `npm run android` - Run on Android emulator
- `npm run test` - Run Jest tests in watch mode
- `npm run lint` - Run ESLint
- `expo install` - Install Expo-compatible package versions

**Build Commands:**
- `eas build --platform ios --profile development` - Development iOS build
- `eas build --platform android --profile development` - Development Android build
- `eas build --platform all --profile production` - Production builds

## Architecture Overview

**Stack:** React Native + Expo SDK with TypeScript, Redux Toolkit, and Expo Router

**State Management:**
- Redux Toolkit with RTK Query for API calls
- `redux/slices/` contains feature-based slices (auth, createAccount, dailyFeeling)
- API services in `services/` use RTK Query with automatic token injection
- Custom `fetchWithAuthBaseQuery` handles 401 responses and token refresh

**Navigation Structure:**
- File-based routing with Expo Router in `app/` directory
- Nested navigation: Root → (app) → (drawer) → (tabs)
- Protected routes require authentication token
- Deep linking configured with `vitaloop://` scheme

**Authentication Flow:**
- Multi-provider: email/password, Apple Sign-In, Google OAuth
- JWT tokens stored in Expo Secure Store
- Authentication state managed in `redux/slices/authTokenSlice.ts`
- Google OAuth uses deep linking with `EXPO_PUBLIC_GOOGLE_LOGIN_URL`

## Key Patterns

**Component Architecture:**
- Themed components in `components/ThemedText.tsx`, `components/ThemedView.tsx`
- Custom hooks for theme and color management in `hooks/`
- Reusable UI components follow naming convention: `PrimaryButton`, `CommonTextInput`

**Form Handling:**
- Formik + Yup for all forms
- Redux state for multi-step flows (create account uses `createAccountSlice`)
- Form validation with internationalized error messages

**API Integration:**
- Each feature domain has its own API slice in `services/`
- Base URL configured via `EXPO_PUBLIC_API_URL` environment variable
- Error handling includes automatic retry and logout on auth failure

## Important Files & Directories

**Core Configuration:**
- `app/_layout.tsx` - Root layout with providers and auth logic
- `redux/store.ts` - Redux store with persistence configuration  
- `metro.config.js` - Metro bundler config with SVG support
- `app.json` - Expo configuration with build profiles

**Feature Areas:**
- `app/(app)/(drawer)/(tabs)/` - Main app navigation structure
- `components/chat/` - AI assistant "Vita" chat components
- `components/journey/` - Progress tracking and achievements
- `services/auth.ts` - Authentication API endpoints

**State Management:**
- Use `redux/hooks.ts` for typed useSelector/useDispatch
- Create account flow stores name/surname in Redux for cross-screen persistence
- Daily feeling tracking uses separate slice with date management

## Development Notes

**Environment Variables:**
- API URL should be `https://api.vitaloop.app` for production
- Google OAuth requires proper redirect URI configuration
- Apple Sign-In needs proper bundle ID and capabilities

**Testing:**
- Limited test coverage currently exists
- Use `jest-expo` preset for testing React Native components
- Component tests should use React Test Renderer

**Internationalization:**
- React i18next with English/Turkish support
- Translation keys use dot notation: `t("login.title")`
- Language preference persisted in AsyncStorage

**Platform Considerations:**
- Apple Sign-In only available on iOS platform
- Push notifications require platform-specific configuration
- Deep linking works differently between platforms

## Common Development Tasks

**Adding New Screens:**
- Create file in appropriate `app/` subdirectory for routing
- Use existing layout patterns and themed components
- Add navigation types if using typed navigation

**API Integration:**
- Add new endpoints to appropriate service file in `services/`
- Use RTK Query mutations for data modification
- Handle loading/error states in components

**State Management:**
- Create new slices in `redux/slices/` for feature-specific state
- Export selectors from `redux/hooks.ts` for type safety
- Use Redux DevTools for debugging state changes