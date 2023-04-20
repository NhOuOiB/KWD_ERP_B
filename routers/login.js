const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
    let [users] = await pool.execute('SELECT * FROM account WHERE account = ?', [req.body.account]);
    //確認資料庫有無此信箱
    console.log(users);
    if (users.length == 0) {
        return res.status(401).json({ message: '信箱或密碼錯誤' });
    }
    let user = users[0];
    let verifyResult = await pool.execute('SELECT * FROM account WHERE id = ? AND password = ?', [
        user.id,
        req.body.password,
    ]);
    // let verifyResult = await argon2.verify(user.password, req.body.password);
    if (verifyResult[0].length == 0) {
        return res.status(401).json({ message: '信箱或密碼錯誤' });
    }

    let payload = {
        id: user.id,
        name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token, {
        httpOnly: true, // 防止 XSS 攻擊
        // secure: true, // 只有在 HTTPS 連線時才可以發送 cookie
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 天
    });

    res.json({
        id: user.id,
        name: user.account,
    });
});

// logout
router.get('/logout', async (req, res) => {
    res.json({ message: ' 登出成功' });
    res.cookie('token');
});
module.exports = router;
