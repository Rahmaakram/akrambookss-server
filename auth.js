const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // تحقق من وجود المستخدم مسبقًا
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل.' });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح.' });

  } catch (err) {
    console.error('❌ خطأ في السيرفر:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب.' });
  }
});

module.exports = router;
