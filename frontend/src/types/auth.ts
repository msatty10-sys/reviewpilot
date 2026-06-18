export interface User {
  id: string;
  email: string;
  businessName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
