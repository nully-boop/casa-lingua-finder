import IUser from "./IUser";

// Interface for seller profile data extending user profile
interface ISellerProfile extends IUser {
  companyName?: string;
  license?: string;
  rating?: number;
  totalSales?: number;
  activeListings?: number;
  totalReviews?: number;
  yearsExperience?: number;
}
export default ISellerProfile;
