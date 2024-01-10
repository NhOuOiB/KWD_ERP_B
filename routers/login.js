const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  let [users] = await pool.execute('SELECT * FROM account WHERE account = ?', [req.body.account]);
  //確認資料庫有無此信箱
  if (users.length == 0) {
    return res.status(401).json({ message: '帳號或密碼錯誤' });
  }
  let user = users[0];
  let verifyResult = await pool.execute(
    'SELECT a.id, a.permission, e.name FROM account a INNER JOIN employee e ON a.employee_id = e.employee_id WHERE a.id = ? AND a.password = ? AND e.status = 2',
    [user.id, req.body.password]
  );
  // let verifyResult = await argon2.verify(user.password, req.body.password);
  if (verifyResult[0].length == 0) {
    return res.status(401).json({ message: '帳號或密碼錯誤' });
  }

  const { id, name, permission } = verifyResult[0][0];
  let payload = {
    id: id,
    name: name,
    permission: permission,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
  res.cookie('token', token, {
    // domain: '192.168.1.106',
    // path: '/',
    httpOnly: true, // 防止 XSS 攻擊
    // sameSite: 'none',
    // secure: true, // 只有在 HTTPS 連線時才可以發送 cookie
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 天
  });

  res.json({
    id: id,
    name: name,
    permission: permission,
  });
});

// logout
router.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.json({ message: ' 登出成功' });
});
module.exports = router;
