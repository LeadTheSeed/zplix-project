import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import authService, { User, LoginData, RegisterData } from '../api/authService';
import { useTranslation } from 'react-i18next';

// نوع بيانات سياق التوثيق
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// إنشاء سياق التوثيق
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// مزود سياق التوثيق
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // جلب بيانات المستخدم الحالي
        const userData = await authService.getCurrentUser();
        setUser(userData);

        // ضبط لغة التطبيق حسب تفضيل المستخدم
        if (userData.language) {
          i18n.changeLanguage(userData.language);
        }
      } catch (err) {
        // في حالة وجود مشكلة، قم بتسجيل خروج المستخدم
        console.error('Error checking auth state', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [i18n]);

  // دالة تسجيل الدخول
  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      // إضافة اللغة الحالية إلى طلب تسجيل الدخول
      const loginData = {
        ...data,
        language: i18n.language
      };
      
      const response = await authService.login(loginData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      // تعيين اللغة المفضلة
      if (response.user.language) {
        i18n.changeLanguage(response.user.language);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // دالة التسجيل
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      // إضافة اللغة الحالية إلى طلب التسجيل
      const registerData = {
        ...data,
        language: i18n.language
      };
      
      const response = await authService.register(registerData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      // تعيين اللغة المفضلة
      if (response.user.language) {
        i18n.changeLanguage(response.user.language);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الخروج
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // دالة لمسح رسائل الخطأ
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook لاستخدام سياق التوثيق
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
