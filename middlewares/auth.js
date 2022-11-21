const jwt = require('jsonwebtoken');
const { UnauthorizedCode } = require('../constants'); // добавить ошибку

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(UnauthorizedCode).send({ message: 'Необходима авторизация' }); // скорретировать
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(UnauthorizedCode).send({ message: 'Необходима авторизация' }); // скорретировать
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
