const router = require('express').Router();
const User = require('../models/User');

// ✅ البحث عن مستخدم بالاسم
router.get('/search', async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' }, // بحث جزئي وغير حساس لحالة الأحرف
    }).select('-password'); // إخفاء كلمة المرور من النتائج
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء البحث' });
  }
});

module.exports = router;
