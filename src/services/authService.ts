
import { authAPI, profileAPI } from "./api";
import IUser from "@/interfaces/IUser";
import IRegister from "@/interfaces/IRegister";
import ILogin from "@/interfaces/ILogin";

export const authService = {
  // Registration service
  register: async (data: IRegister) => {
    const response = await authAPI.register(data);
    const userData = response.data["user"];
    
    const user: IUser = {
      id: userData["id"],
      name: userData["name"],
      email: userData["email"],
      user_type: userData["user_type"],
      token: response.data["access_token"],
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    return { user, userData };
  },

  // Login service
  login: async (data: ILogin) => {
    const response = await authAPI.login(data);
    const userData = response.data["user"];
    
    const user: IUser = {
      id: userData["id"],
      name: userData["name"],
      email: userData["email"],
      user_type: userData["user_type"],
      token: response.data["access_token"],
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    return { user, userData };
  },

  // Seller profile creation service
  createSellerProfile: async (profileData: {
    phone?: string;
    location?: string;
    company_name?: string;
    license_number?: string;
    user_id: number;
  }) => {
    console.log("Submitting profile data:", profileData);
    return await profileAPI.createSeller(profileData);
  },

  // Logout service
  logout: async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.token) {
          await authAPI.logout(user.token);
        }
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("user");
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): IUser | null => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user?.token;
  }
};
