import ILogin from "@/interfaces/ILogin";
import IRegister from "@/interfaces/IRegister";
import IUpdateProfile from "@/interfaces/IUpdateProfile";
import axios from "axios";

const DEFAULT_API_URL = "https://89b99eb07c77.ngrok-free.app/api";

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  // timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add ngrok-skip-browser-warning header for ngrok tunnels
    "ngrok-skip-browser-warning": "true",
    // Add CORS headers
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

      window.location.href =
        "/login?session_expired=true&reason=token_parse_error";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information for debugging
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle specific error cases
    if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
      console.error(
        "Network error - check if ngrok tunnel is running and accessible"
      );
    }

    if (error.response?.status === 401) {
      console.error("Unauthorized request, removing user data");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle CORS errors
    if (
      error.message?.includes("CORS") ||
      error.code === "ERR_BLOCKED_BY_CLIENT"
    ) {
      console.error("CORS error detected - check server CORS configuration");
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: ILogin) => api.post("/login", data),

  register: (data: IRegister) => api.post("/registerUser", data),

  logout: (token: string) =>
    api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } }),

  forgotPassword: (phone: string) =>
    api.post("/auth/forgot-password", { phone }),

  resetPassword: (data: {
    token: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => api.post("/auth/reset-password", data),
};

export const propertiesAPI = {
  getProperties: () => api.get("/visitor/getAllproperty"),

  getProperty: (id: string) => api.get(`/user/showProperty/${id}`),

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

  getFavorites: () => api.get("/user/getFavorites"),

  addToFavorite: (propertyId: number, favType: string) =>
    api.post("/user/addToFavorites", {
      id: propertyId,
      type: favType,
    }),

  removeFromFavorite: (propertyId: number, favType: string) =>
    api.post("/user/removeFromFavorites", {
      id: propertyId,
      type: favType,
    }),

  isFavorited: (propertyId: number, type: string) =>
    api.get(`/user/is-favorited?property_id=${propertyId}&type=${type}`),
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentProperties: () => api.get("/dashboard/recent-properties"),
};

export const office = {
  getOffice: () => {
    console.log("Fetching office data with token...");
    return api.get("/office/getOffice").then((response) => {
      const responseData = response.data;
      console.log("Raw getOffice API response:", responseData);

      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response structure received from getOffice.");
      }

      const office = responseData.data;
      if (
        !office ||
        typeof office !== "object" ||
        !office.id ||
        !office.name ||
        !office.phone
      ) {
        console.error(
          "getOffice response missing critical office fields:",
          office
        );
        throw new Error(
          "Invalid or incomplete office profile data received from server."
        );
      }
      return {
        ...response,
        office: office,
      };
    });
  },

  getProperties: () => api.get(`/office/getAllProperties`),

  createProperty: (propertyData: {
    title: string;
    description: string;
    location: string;
    price: number;
    currency: string;
    latitude: number;
    longitude: number;
    area: number;
    floor_number: number;
    ad_type: string;
    type: string;
    position: string;
    bathrooms: number;
    rooms: number;
    seller_type: string;
    furnishing: string;
    governorate: string;
    features: string[];
    url: File[];
    Vurl: File[];
  }) => {
    console.log("Creating property with office account...");

    // Create FormData and map fields to API expected names
    const formDataToSend = new FormData();

    // Add images
    propertyData.url.forEach((image) => {
      formDataToSend.append("url", image);
    });

    // Add videos
    propertyData.Vurl.forEach((video) => {
      formDataToSend.append("Vurl", video);
    });

    // Map form data to API field names
    formDataToSend.append("title", propertyData.title);
    formDataToSend.append("description", propertyData.description);
    formDataToSend.append("location", propertyData.location);
    formDataToSend.append("price", propertyData.price.toString());
    formDataToSend.append("currency", propertyData.currency);
    formDataToSend.append("latitude", propertyData.latitude.toString());
    formDataToSend.append("longitude", propertyData.longitude.toString());
    formDataToSend.append("area", propertyData.area.toString());
    formDataToSend.append("floor_number", propertyData.floor_number.toString());
    formDataToSend.append("ad_type", propertyData.ad_type);
    formDataToSend.append("type", propertyData.type);
    formDataToSend.append("position", propertyData.position);
    formDataToSend.append("bathrooms", propertyData.bathrooms.toString());
    formDataToSend.append("rooms", propertyData.rooms.toString());
    formDataToSend.append("seller_type", propertyData.seller_type);
    formDataToSend.append("direction", propertyData.location); // Using location as direction
    formDataToSend.append("furnishing", propertyData.furnishing);
    formDataToSend.append("governorate", propertyData.governorate);

    // Add features as comma-separated string
    if (propertyData.features.length > 0) {
      formDataToSend.append("features", propertyData.features.join(","));
    }

    return api.post("/office/propertyStore", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getPropertyCount: () => api.get("/office/getOfficePropertyCount"),
  getOfficeViews: () => api.get("/office/getOfficeViews"),
  getOfficeFollowers: () => api.get("/office/getOfficeFollowers"),
  changePropertyStatus: (id: number, status: string) =>
    api.post(`/office/changePropertyStatus/${id}`, { status }),

  // Office Property Requests
  getPendingRequestsOffice: () => api.get("/office/getPendingRequestsOffice"),
  getRejectedRequestsOffice: () => api.get("/office/getRejectedRequestsOffice"),
  getAcceptedRequestsOffice: () => api.get("/office/getAcceptedRequestsOffice"),

  registerOffice: (data: FormData) =>
    api.post("/registerOffice", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Subscription APIs
  getActiveSubscriptions: () => api.get("/office/getActiveSubscriptionsOffice"),

  getPendingSubscriptions: () =>
    api.get("/office/getPendingSubscriptionsOffice"),

  getRejectedSubscriptions: () =>
    api.get("/office/getRejectedSubscriptionsOffice"),

  requestSubscription: (data: {
    subscription_type: "monthly" | "yearly";
    price: number;
  }) => api.post("/office/requestSubscription", data),

  // Get office by ID (for public viewing)
  getOfficeById: (id: string) => api.get(`/user/showOffice/${id}`),

  // Get all properties from an office
  getAllOfficeProperties: (id: string) =>
    api.get(`/user/getAllOfficeProperties/${id}`),

  followOffice: (officeId: string) => api.get(`/user/followOffice/${officeId}`),
};

export const profileAPI = {
  getProfile: () => {
    console.log("Fetching profile data with token...");
    return api.get("/user/getProfile").then((response) => {
      const responseData = response.data;
      console.log("Raw getProfile API response:", responseData);

      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response structure received from getProfile.");
      }

      const user = responseData.user;

      if (
        !user ||
        typeof user !== "object" ||
        !user.id ||
        !user.name ||
        !user.phone
      ) {
        console.error(
          "getProfile response missing critical user fields:",
          user
        );
        throw new Error(
          "Invalid or incomplete user profile data received from server."
        );
      }

      return {
        ...response,
        user: response.data.user,
      };
    });
  },

  updateProfile: (data: FormData | IUpdateProfile) => {
    console.log("Updating profile data with token...");

    const isFormData = data instanceof FormData;
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    return api.post("/user/updateProfile", data, config).then((response) => {
      const responseData = response.data;

      if (!responseData || typeof responseData !== "object") {
        // This case might mean the server responded with an empty body or non-JSON,
        // which could be valid for a 204 No Content, but here we expect user data.
        console.warn(
          "updateProfile response did not include expected data structure."
        );
        // Depending on API contract, this might be an error or just an empty successful response.
        // For now, returning the potentially empty/malformed response for react-query to handle.
        return response;
      }

      const updatedUser = responseData.user;

      if (updatedUser && typeof updatedUser === "object") {
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
        console.warn(
          "updateProfile response did not contain a 'user' object, but had other data.",
          responseData
        );
        // If the API contract is that it *might* not return user, this could be fine.
        // If it *should* always return user, this is a warning.
        return response; // Return original response if no user object to reshape
      }

      // If no user object at all, return the original response
      console.warn(
        "updateProfile response did not include a 'user' object.",
        responseData
      );
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

      if (!responseData || typeof responseData !== "object") {
        throw new Error(
          "Invalid response structure received from createSeller."
        );
      }

      const user = responseData.user;
      const seller = responseData.seller;

      if (
        !user ||
        typeof user !== "object" ||
        !user.id ||
        !user.name ||
        !user.email
      ) {
        console.error(
          "createSeller response missing critical user fields:",
          user
        );
        throw new Error(
          "Invalid or incomplete user data received from server after creating seller."
        );
      }

      if (
        !seller ||
        typeof seller !==
          "object" /* Add checks for essential seller fields here if any, e.g. !seller.id */
      ) {
        console.error(
          "createSeller response missing critical seller fields:",
          seller
        );
        throw new Error(
          "Invalid or incomplete seller data received from server after creating seller."
        );
      }

      // Assuming the response structure is { user: {...}, seller: {...} } directly in response.data
      return { ...response, data: { user, seller } };
    });
  },
};

// Admin API functions
export const admin = {
  // Get all pending requests (offices and properties)
  getPendingRequests: () => {
    return api.get("/admin/pendingRequest");
  },

  // Office management
  approveOfficeRequest: (requestId: number) => {
    return api.get(`/admin/approveOfficeRequest/${requestId}`);
  },

  rejectOfficeRequest: (requestId: number) => {
    return api.get(`/admin/rejectOfficeRequest/${requestId}`);
  },

  // Property management
  approveProperty: (requestId: number) => {
    return api.get(`/admin/approveProperty/${requestId}`);
  },

  rejectProperty: (requestId: number) => {
    return api.get(`/admin/rejectProperty/${requestId}`);
  },

  // Subscription management
  getPendingSubscriptions: () => {
    return api.get("/admin/pendingSubscription");
  },

  approveSubscription: (subscriptionId: number) => {
    return api.get(`/admin/approveSubscription/${subscriptionId}`);
  },

  rejectSubscription: (subscriptionId: number) => {
    return api.get(`/admin/rejectSubscription/${subscriptionId}`);
  },
};

export default api;
