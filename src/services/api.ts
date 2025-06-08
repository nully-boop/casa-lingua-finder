import ILogin from "@/interfaces/ILogin";
import IRegister from "@/interfaces/IRegister";
import axios from "axios";

// إنشاء نسخة من axios بإعدادات أساسية
const api = axios.create({
  baseURL: "http://192.168.1.6:8000/api",
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
        }
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
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    console.error("API Error:", error); // عرض الخطأ في الكونسول لمساعدتك في التصحيح
    return Promise.reject(error);
  }
);

// استدعاءات المصادقة
export const authAPI = {
  login: (data: ILogin) => api.post("/auth/login", data),

  register: (data: IRegister) => api.post("/auth/register", data),

  logout: (token: string) =>
    api.post(
      "/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),

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
  getProperties: (params?: { name: string }) =>
    api.get("/properties", { params }),

  getProperty: (id: string) => api.get(`/properties/${id}`),

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
};

// استدعاءات لوحة التحكم
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentProperties: () => api.get("/dashboard/recent-properties"),
};

export default api;
