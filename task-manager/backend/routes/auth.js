const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, language } = req.body;

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: language === 'ar' ? 'المستخدم موجود بالفعل' : 'User already exists' 
      });
    }

    // إنشاء مستخدم جديد
    const newUser = new User({
      username,
      email,
      password,
      language: language || 'en'
    });

    await newUser.save();

    // إنشاء رمز JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        language: newUser.language
      },
      message: language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully'
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      message: req.body.language === 'ar' ? 'خطأ في الخادم' : 'Server error' 
    });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password, language } = req.body;

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: language === 'ar' ? 'المستخدم غير موجود' : 'User not found' 
      });
    }

    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Invalid password' 
      });
    }

    // تحديث اللغة المفضلة إذا تم تغييرها
    if (language && user.language !== language) {
      user.language = language;
      await user.save();
    }

    // إنشاء رمز JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        language: user.language
      },
      message: user.language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful'
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      message: req.body.language === 'ar' ? 'خطأ في الخادم' : 'Server error' 
    });
  }
});

// الحصول على معلومات المستخدم الحالي
router.get('/me', async (req, res) => {
  try {
    // التحقق من وجود رمز التوثيق
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // التحقق من صحة الرمز
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Error in get me:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
