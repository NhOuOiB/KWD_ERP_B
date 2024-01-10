const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const jwtoken = req.cookies.token;

  if (!jwtoken) {
    return res.status(401).json({ message: '尚未登入' });
  }
  try {
    let { id, name, permission } = jwt.verify(jwtoken, process.env.JWT_SECRET);
    return res.json({ id: id, name: name, permission: permission });
  } catch (err) {
    console.log(err);
    if (err === 'TokenExpiredError: jwt expired') return res.status(401).json({ message: '憑證過期，請重新登入' });
  }
};
