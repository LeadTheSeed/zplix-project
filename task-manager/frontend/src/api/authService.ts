import api from './axios';

// نوع بيانات المستخدم
export interface User {
  id: string;
  username: string;
  email: string;
  language: string;
}

// نوع بيانات تسجيل الدخول
export interface LoginData {
  email: string;
  password: string;
  language?: string;
}

// نوع بيانات التسجيل
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  language?: string;
}

// نوع استجابة التوثيق
export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

const authService = {
  // دالة تسجيل الدخول
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // دالة تسجيل مستخدم جديد
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // دالة جلب بيانات المستخدم الحالي
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // دالة تسجيل الخروج
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
