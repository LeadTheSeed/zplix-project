import axios from 'axios';

// تحديد عنوان الخادم الخلفي
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// إنشاء نسخة من axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة معترض للطلبات لتضمين رمز التوثيق في كل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// إضافة معترض للاستجابات للتعامل مع الأخطاء الشائعة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // التعامل مع أخطاء انتهاء صلاحية الرمز
    if (error.response && error.response.status === 401) {
      // يمكن تسجيل خروج المستخدم هنا في حالة انتهاء صلاحية الرمز
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
