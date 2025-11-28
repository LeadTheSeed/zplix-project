import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Task } from '../../api/taskService';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // تنسيق التاريخ حسب اللغة
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // فتح قائمة الإجراءات
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق قائمة الإجراءات
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // تعديل المهمة
  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  // حذف المهمة
  const handleDelete = () => {
    onDelete(task._id);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        opacity: task.completed ? 0.7 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        },
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, !task.completed)}
            sx={{ mr: 1, mt: -0.5, ml: i18n.language === 'ar' ? 1 : 0 }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                mb: 1
              }}
            >
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  mb: 2
                }}
              >
                {task.description}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip
                icon={<FlagIcon fontSize="small" />}
                label={t(`priority.${task.priority}`)}
                size="small"
                color={getPriorityColor(task.priority) as any}
                variant="outlined"
              />
              
              {task.dueDate && (
                <Chip
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={formatDate(task.dueDate)}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          <IconButton
            aria-label="task-options"
            onClick={handleMenuOpen}
            sx={{ ml: 1, mt: -1 }}
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('buttons.edit')} />
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('buttons.delete')} />
            </MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
