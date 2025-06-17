import ILogin from "@/interfaces/ILogin";
import IRegister from "@/interfaces/IRegister";
import IUpdateProfile from "@/interfaces/IUpdateProfile";
import axios from "axios";

// Use environment variable for API base URL with a fallback for local development
const DEFAULT_API_URL = "http://192.168.1.5:8000/api";
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

if (API_URL === DEFAULT_API_URL && !import.meta.env.VITE_API_URL) {
  console.warn(
    `VITE_API_URL is not set. Using default fallback URL: ${DEFAULT_API_URL}. ` +
    "Please create a .env file in the project root with VITE_API_URL set to your backend API URL. " +
    "Example: VITE_API_URL=http://localhost:8000/api"
  );
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData?.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
          console.log("Token added to request:", config.url);
        } else {
          console.warn("No token found in user data");
        }
      } else {
        console.warn("No user found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user token from localStorage:", error);
      localStorage.removeItem("user");
      // Redirect to login page because the stored user data is corrupted/invalid
      // and further authenticated requests are likely to fail or be incorrect.
      window.location.href = "/login?session_expired=true&reason=token_parse_error";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request, removing user data");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: ILogin) => api.post("/login", data),

  register: (data: IRegister) => api.post("/register", data),

  logout: (token: string) =>
    api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } }),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post("/auth/reset-password", data),
};

export const propertiesAPI = {
  getProperties: () => api.get("/user/properties"),

  getProperty: (id: string) => api.get(`/user/properties/show/${id}`),

  createProperty: (data: FormData) =>
    api.post("/properties", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProperty: (id: string, data: FormData) =>
    api.put(`/properties/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteProperty: (id: string) => api.delete(`/properties/${id}`),

  getMyProperties: () => api.get("/my-properties"),

  addToFavorite: (propertyId: number) =>
    api.post("/user/addToFavorites", { property_id: propertyId }),

  removeFromFavorite: (propertyId: number) =>
    api.post("/user/removeFromFavorites", { property_id: propertyId }),

  isFavorited: (propertyId: number) =>
    api.get(`/user/is-favorited?property_id=${propertyId}`),
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentProperties: () => api.get("/dashboard/recent-properties"),
};

export const profileAPI = {
  getProfile: () => {
    console.log("Fetching profile data with token...");
    return api.get("/user/getProfile").then((response) => {
      const responseData = response.data;
      // console.log("Raw getProfile API response:", responseData);

      if (!responseData || typeof responseData !== 'object') {
        throw new Error("Invalid response structure received from getProfile.");
      }

      const user = responseData.user;
      const seller = responseData.seller;

      if (!user || typeof user !== 'object' || !user.id || !user.name || !user.email) {
        console.error("getProfile response missing critical user fields:", user);
        throw new Error("Invalid or incomplete user profile data received from server.");
      }

      if (seller !== undefined && (seller === null || typeof seller !== 'object')) {
        // If seller is present but not a valid object (e.g. null, or not an object type)
        console.warn("getProfile response received invalid seller data, treating as no seller.", seller);
        return { ...response, data: user, seller: undefined }; // Or null, depending on desired handling
      }

      // At this point, user is valid, and seller is either undefined or a valid object (or null if API can return that)
      return { ...response, data: user, seller: seller };
    });
  },

  updateProfile: (data: IUpdateProfile) => {
    console.log("Updating profile data with token...");

    const isFormData = data instanceof FormData;
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    // console.log("Update profile request:", { isFormData, data });

    return api.post("/user/updateProfile", data, config).then((response) => {
      const responseData = response.data;
      // console.log("Profile update response:", responseData);

      if (!responseData || typeof responseData !== 'object') {
        // This case might mean the server responded with an empty body or non-JSON,
        // which could be valid for a 204 No Content, but here we expect user data.
        console.warn("updateProfile response did not include expected data structure.");
        // Depending on API contract, this might be an error or just an empty successful response.
        // For now, returning the potentially empty/malformed response for react-query to handle.
        return response;
      }

      const updatedUser = responseData.user;

      if (updatedUser && typeof updatedUser === 'object') {
        if (!updatedUser.id || !updatedUser.name || !updatedUser.email) {
          console.warn(
            "updateProfile response returned a user object with missing critical fields (id, name, or email). Client-side data might be stale.",
            updatedUser
          );
        }
        // Even if some fields are missing, we pass along what we got.
        // The calling component/hook should be aware of this possibility.
        return { ...response, data: updatedUser };
      } else if (updatedUser === undefined && responseData) {
         // It's possible the API returns the updated user data directly in response.data, not response.data.user
         // This check is an example if the structure varies. For this task, sticking to response.data.user.
         console.warn("updateProfile response did not contain a 'user' object, but had other data.", responseData);
         // If the API contract is that it *might* not return user, this could be fine.
         // If it *should* always return user, this is a warning.
         return response; // Return original response if no user object to reshape
      }

      // If no user object at all, return the original response
      console.warn("updateProfile response did not include a 'user' object.", responseData);
      return response;
    });
  },

  createSeller: (data: {
    phone?: string;
    location?: string;
    company_name?: string;
    license_number?: string;
    user_id: number; // Assuming user_id is part of the payload to link/create seller
  }) => {
    // console.log("Creating seller profile with data:", data);
    return api.post("/auth/create-seller", data).then((response) => {
      const responseData = response.data;
      // console.log("Create seller response:", responseData);

      if (!responseData || typeof responseData !== 'object') {
        throw new Error("Invalid response structure received from createSeller.");
      }

      const user = responseData.user;
      const seller = responseData.seller;

      if (!user || typeof user !== 'object' || !user.id || !user.name || !user.email) {
        console.error("createSeller response missing critical user fields:", user);
        throw new Error("Invalid or incomplete user data received from server after creating seller.");
      }

      if (!seller || typeof seller !== 'object' /* Add checks for essential seller fields here if any, e.g. !seller.id */) {
        console.error("createSeller response missing critical seller fields:", seller);
        throw new Error("Invalid or incomplete seller data received from server after creating seller.");
      }

      // Assuming the response structure is { user: {...}, seller: {...} } directly in response.data
      return { ...response, data: { user, seller } };
    });
  },
};

export default api;
