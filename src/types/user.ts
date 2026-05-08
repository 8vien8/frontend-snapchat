export interface User {
  _id: string;

  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: number;

  createdAt: string;
  updatedAt: string;
}
