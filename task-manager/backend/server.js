const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// استيراد المسارات
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// إنشاء تطبيق Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// تسجيل الوصول البسيط
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// المسارات الرئيسية
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// مسار الاختبار
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// التعامل مع المسارات غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// الاتصال بقاعدة البيانات والبدء بالاستماع
const startServer = async () => {
  try {
    // استخدام قاعدة بيانات محلية للتطوير في حال عدم وجود رابط MongoDB
    const dbUri = config.MONGODB_URI.includes('YOUR_USERNAME') 
      ? 'mongodb://localhost:27017/taskmanager' 
      : config.MONGODB_URI;
    
    // محاولة الاتصال بقاعدة البيانات
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
    
    // تشغيل الخادم
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
