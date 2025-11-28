// تكوين التطبيق
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://taskmanager:taskmanager123@cluster0.mongodb.net/taskmanager',
  JWT_SECRET: process.env.JWT_SECRET || 'zplix_task_manager_secret_key_2025',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
