const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization'];
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = jwt.verify(bearerToken, process.env.skey);
      req.user = decoded;
      next();
  }catch (error) {
    res.send('invalid tkn');
    //  next();
  }
}
module.exports = {verifyToken};