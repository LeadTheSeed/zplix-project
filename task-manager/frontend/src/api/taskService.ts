import api from './axios';

// نوع بيانات المهمة
export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// نوع بيانات إنشاء/تحديث المهمة
export interface TaskData {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

const taskService = {
  // جلب جميع المهام
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // جلب مهمة محددة
  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // إنشاء مهمة جديدة
  createTask: async (taskData: TaskData): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // تحديث مهمة
  updateTask: async (taskId: string, taskData: TaskData): Promise<Task> => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // حذف مهمة
  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // تبديل حالة الاكتمال
  toggleComplete: async (taskId: string, completed: boolean): Promise<Task> => {
    const response = await api.put(`/tasks/${taskId}`, { completed });
    return response.data;
  }
};

export default taskService;
