interface IUser {
  id: number;
  name: string;
  email: string; // Added email as a non-optional field
  phone?: string; // Made phone optional
  user_type: string;
  token: string;
  image?: { url: string };
  location?: string;
  bio?: string;
  created_at: string;
}
export default IUser;
