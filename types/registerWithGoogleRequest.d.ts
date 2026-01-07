interface RegisterWithGoogleRequest {
  name: string;
  surname: string;
  username: string;
  birthDate: string | null;
  gender: Gender;
  language: string | null;
  timeZone: string;
  notificationDeviceId: string;
  googleId: string;
}
