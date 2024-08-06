export interface User {
  id: string;
  email: string;
  token: string;
  role: string;
}

export interface UserFormValues {
  email: string;
  password: string;
}
