interface RegisterWithAppleRequest {
  name: string;
  surname: string;
  birthDate: string | null;
  gender: Gender;
  timeZone: string;
  notificationDeviceId: string;
  appleId?: string;
}
