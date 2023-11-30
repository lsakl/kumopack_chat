const jwt = require('jsonwebtoken');

exports.decodeToken = function(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

exports.generateAccessToken = function(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}


exports.checkToken = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (!err && new Date().getTime() < (user.exp * 1000)) {
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  }
}

exports.socketCheckToken = async function(authorization) {
  const authHeader = authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return false;
  } else {
    try {
      const user = await jwt.verify(token, process.env.TOKEN_SECRET);
      if (new Date().getTime() < (user.exp * 1000)) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}