
import { toast } from "sonner";
import { authAPI, profileAPI } from "./api";
import IUser from "@/interfaces/IUser";
import IRegister from "@/interfaces/IRegister";
import ILogin from "@/interfaces/ILogin";
// Removed ISellerProfile import

export const authService = {
  // Registration service
  register: async (data: IRegister) => {
    const response = await authAPI.register(data);
    const token = response.data?.token?.original;
    const userData = token?.user;
    const accessToken = token?.access_token;

    if (!userData || typeof userData !== 'object') {
      throw new Error("Invalid user data structure received from server during registration.");
    }
    if (!accessToken) {
      throw new Error("Missing access token from server during registration.");
    }

    const { id, name, email, phone: rawPhone, user_type: rawUserType, created_at: rawCreatedAt } = userData;

    if (!id || !name || !email) {
      console.error("Missing critical user fields:", { id, name, email });
      throw new Error("Missing critical user information (id, name, or email) received from server during registration.");
    }

    let user_type = 'buyer'; // Default user_type
    if (rawUserType) {
      user_type = String(rawUserType);
    } else {
      console.warn("user_type not found in registration response, defaulting to 'buyer'. User data:", userData);
    }

    const user: IUser = {
      id: Number(id),
      name: String(name),
      email: String(email),
      user_type: user_type,
      token: accessToken,
      created_at: rawCreatedAt ? String(rawCreatedAt) : new Date().toISOString(),
    };

    if (rawPhone !== undefined && rawPhone !== null) {
      user.phone = String(rawPhone);
    }

    localStorage.setItem("user", JSON.stringify(user));
    return { user, userData };
  },

  // Login service
  login: async (data: ILogin) => {
    const response = await authAPI.login(data);
    const apiResponseData = response.data;

    if (!apiResponseData || typeof apiResponseData !== 'object') {
      throw new Error("Invalid response structure received from server during login.");
    }

    const userData = apiResponseData.user;
    const accessToken = apiResponseData.access_token;

    if (!userData || typeof userData !== 'object') {
      throw new Error("Invalid user data structure received from server during login.");
    }
    if (!accessToken) {
      throw new Error("Missing access token from server during login.");
    }

    const { id, name, email, phone: rawPhone, user_type: rawUserType, created_at: rawCreatedAt } = userData;

    if (!id || !name || !email) {
      console.error("Missing critical user fields during login:", { id, name, email });
      throw new Error("Missing critical user information (id, name, or email) received from server during login.");
    }

    let user_type = 'buyer'; // Default user_type
    if (rawUserType) {
      user_type = String(rawUserType);
    } else {
      console.warn("user_type not found in login response, defaulting to 'buyer'. User data:", userData);
    }

    const user: IUser = {
      id: Number(id),
      name: String(name),
      email: String(email),
      user_type: user_type,
      token: accessToken,
      created_at: rawCreatedAt ? String(rawCreatedAt) : new Date().toISOString(),
    };

    if (rawPhone !== undefined && rawPhone !== null) {
      user.phone = String(rawPhone);
    }

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
      // Inform the user about the server-side logout failure.
      // The client-side logout (localStorage removal) will still proceed in the finally block.
      toast.error(
        "Server logout failed. Your session might still be active on the server. Please clear browser data if issues persist."
      );
    } finally {
      localStorage.removeItem("user");
      // Optionally, redirect to login page after logout, regardless of server success/failure
      // window.location.href = "/login";
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
  },
};
