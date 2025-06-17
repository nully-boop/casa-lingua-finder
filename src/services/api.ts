import ILogin from "@/interfaces/ILogin";
import IRegister from "@/interfaces/IRegister";
import ISellerProfile from "@/interfaces/ISellerProfile";
import IUpdateProfile from "@/interfaces/IUpdateProfile";
import axios from "axios";

// إنشاء نسخة من axios بإعدادات أساسية
const api = axios.create({
  baseURL: "http://192.168.1.5:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// طلب Interceptor لإضافة التوكن
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
      console.error("Error parsing user token:", error);
      localStorage.removeItem("user");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request, removing user data");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    console.error("API Error:", error); // عرض الخطأ في الكونسول لمساعدتك في التصحيح
    return Promise.reject(error);
  }
);

// استدعاءات المصادقة
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

// استدعاءات العقارات
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

  addToFavorite: (propertyId: number) => api.post("/user/addToFavorite", { property_id: propertyId }),
};

// استدعاءات لوحة التحكم
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentProperties: () => api.get("/dashboard/recent-properties"),
};

// استدعاءات الملف الشخصي
export const profileAPI = {
  getProfile: () => {
    console.log("Fetching profile data with token...");
    return api.get("/user/getProfile").then((response) => {
      // Extract user data from nested response
      console.log("Raw API response:", response.data);
      return {
        ...response,
        data: response.data.user,
        seller: response.data.seller,
      };
    });
  },
  updateProfile: (data: IUpdateProfile) => {
    console.log("Updating profile data with token...");

    // Check if data is FormData (contains file)
    const isFormData = data instanceof FormData;
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    console.log("Update profile request:", { isFormData, data });

    return api.post("/user/updateProfile", data, config).then((response) => {
      console.log("Profile update response:", response.data);
      // Extract user data from nested response if needed
      return response.data.user
        ? { ...response, data: response.data.user }
        : response;
    });
  },

  createSeller: (data: ISellerProfile) => {
    console.log("Updating profile data with token...");
    return api.post("/auth/create-seller", data).then((response) => {
      // Extract user data from nested response if needed
      return response.data.user && response.data.seller
        ? {
            ...response,
            data: { user: response.data.user, seller: response.data.seller },
          }
        : response;
    });
  },
};

export default api;
