interface RegisterRequest {
  name: string;
  surname: string;
  username: string;
  password: string;
  birthDate: string | null;
  gender: Gender;
  timeZone: string;
  notificationDeviceId: string;
  appleId?: string;
}
