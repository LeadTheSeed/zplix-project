import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import { Task, TaskData } from '../../api/taskService';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData) => void;
  initialData?: Task;
  isEditMode: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode
}) => {
  const { t, i18n } = useTranslation();
  
  // حالات النموذج
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  
  // أخطاء النموذج
  const [errors, setErrors] = useState({
    title: ''
  });

  // تعيين البيانات الأولية عند فتح النموذج
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : null);
    } else {
      // إعادة تعيين النموذج إذا كان في وضع الإضافة
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(null);
    }
  }, [initialData, open]);

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    const newErrors = { title: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = t('validation.titleRequired');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // معالجة تقديم النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData: TaskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate?.toISOString()
    };

    onSubmit(taskData);
  };

  // اختيار تنسيق التاريخ المناسب للغة
  const localeMap = {
    ar: arLocale,
    en: enLocale
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <DialogTitle>
        {isEditMode ? t('tasks.edit') : t('tasks.addNew')}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label={t('task.title')}
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          
          <TextField
            margin="dense"
            id="description"
            label={t('task.description')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="priority-label">{t('task.priority')}</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={priority}
              label={t('task.priority')}
              onChange={(e: SelectChangeEvent) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <MenuItem value="low">{t('priority.low')}</MenuItem>
              <MenuItem value="medium">{t('priority.medium')}</MenuItem>
              <MenuItem value="high">{t('priority.high')}</MenuItem>
            </Select>
          </FormControl>
          
          <LocalizationProvider 
            dateAdapter={AdapterDateFns} 
            adapterLocale={localeMap[i18n.language as keyof typeof localeMap]}
          >
            <DatePicker
              label={t('task.dueDate')}
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              sx={{ mt: 2, width: '100%' }}
            />
          </LocalizationProvider>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            {t('buttons.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {isEditMode ? t('buttons.save') : t('buttons.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
