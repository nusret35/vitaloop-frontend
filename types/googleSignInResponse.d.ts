interface GoogleSignInResponse {
  isExistingUser: boolean;
  profileDetails: Record<string, string>;
  authToken: string;
}
