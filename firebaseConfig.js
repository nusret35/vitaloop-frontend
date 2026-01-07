import { getAnalytics, initializeAnalytics } from "@react-native-firebase/analytics";



const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  appId: "1:676211847678:ios:6df32082da71753eb090af",
  projectId: "recoverai-933d6"
};

const app = initializeAnalytics(firebaseConfig);

const analytics = getAnalytics(app);

export { analytics };