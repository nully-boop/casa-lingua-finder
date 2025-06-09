
import IUser from "./IUser";

// Interface for seller profile data extending user profile
interface ISellerProfile extends IUser {
  phone?: string;
  location?: string;
  workplace?: string;
  companyName?: string;
  company_name?: string;
  license?: string;
  rating?: number;
  totalSales?: number;
  activeListings?: number;
  totalReviews?: number;
  yearsExperience?: number;
}
export default ISellerProfile;
