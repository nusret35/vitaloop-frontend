type User = {
  id?: string;
  name?: string;
  surname?: string;
  birthDate?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  isPremium: boolean;
  isChattingFirstTime: boolean;
};

interface LoginUserRequestBody {
  username: string;
  password: string;
}

interface UpdateUserRequest {
  id?: string;
  name?: string;
  surname?: string;
  birthDate?: string | null;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
}
