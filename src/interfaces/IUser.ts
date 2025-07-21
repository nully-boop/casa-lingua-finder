interface IUser {
  id: number;
  name: string;
  phone: string;
  type: string;
  token: string;
  image?: { url: string };
  location?: string;
  bio?: string;
  created_at: string;
}
export default IUser;
