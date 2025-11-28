import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TaskItem from '../components/Task/TaskItem';
import TaskForm from '../components/Task/TaskForm';
import taskService, { Task, TaskData } from '../api/taskService';
import { useAuth } from '../contexts/AuthContext';

const TasksPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  // حالات الصفحة
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // حالات النموذج
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  
  // حالات حذف المهمة
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // جلب المهام عند تحميل الصفحة
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  // جلب المهام من الخادم
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.serverError'));
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء أو تحديث مهمة
  const handleTaskSubmit = async (taskData: TaskData) => {
    try {
      setLoading(true);
      
      if (editTask) {
        // تحديث مهمة موجودة
        const updatedTask = await taskService.updateTask(editTask._id, taskData);
        setTasks(tasks.map(task => task._id === editTask._id ? updatedTask : task));
      } else {
        // إنشاء مهمة جديدة
        const newTask = await taskService.createTask(taskData);
        setTasks([newTask, ...tasks]);
      }
      
      setIsFormOpen(false);
      setEditTask(undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.serverError'));
      console.error('Error submitting task:', err);
    } finally {
      setLoading(false);
    }
  };

  // تبديل حالة اكتمال المهمة
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId, completed);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.serverError'));
      console.error('Error toggling task completion:', err);
    }
  };

  // فتح نموذج تعديل المهمة
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  // فتح مربع حوار تأكيد الحذف
  const handleDeleteConfirmation = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  // تنفيذ حذف المهمة
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await taskService.deleteTask(taskToDelete);
      setTasks(tasks.filter(task => task._id !== taskToDelete));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.serverError'));
      console.error('Error deleting task:', err);
    }
  };

  // تصفية المهام حسب حالة الاكتمال
  const filterTasks = () => {
    switch (activeTab) {
      case 0: // All
        return tasks;
      case 1: // Active
        return tasks.filter(task => !task.completed);
      case 2: // Completed
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  // ترتيب المهام حسب الأولوية وتاريخ الاستحقاق
  const sortTasks = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      // ترتيب حسب الاكتمال
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // ترتيب حسب الأولوية
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // ترتيب حسب تاريخ الاستحقاق
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // ترتيب حسب تاريخ الإنشاء
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  // الحصول على المهام المصفاة والمرتبة
  const filteredAndSortedTasks = sortTasks(filterTasks());

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('tasks.title')}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditTask(undefined);
            setIsFormOpen(true);
          }}
        >
          {t('tasks.addNew')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('tabs.all')} />
          <Tab label={t('tabs.active')} />
          <Tab label={t('tabs.completed')} />
        </Tabs>
      </Paper>

      {loading && !tasks.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAndSortedTasks.length > 0 ? (
        <Box>
          {filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteConfirmation}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {t('tasks.noTasks')}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t('tasks.createFirst')}
          </Typography>
        </Box>
      )}

      {/* زر عائم لإضافة مهمة جديدة */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => {
          setEditTask(undefined);
          setIsFormOpen(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* نموذج إنشاء/تعديل المهمة */}
      <TaskForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
        initialData={editTask}
        isEditMode={!!editTask}
      />

      {/* مربع حوار تأكيد الحذف */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('tasks.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('dialog.deleteConfirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t('buttons.cancel')}
          </Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained" autoFocus>
            {t('buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksPage;
