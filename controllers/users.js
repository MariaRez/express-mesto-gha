const User = require('../models/user');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

const validationError = new ValidationError('Переданы некорректные данные в методы создания пользователя, обновления аватара пользователя или профиля');
const notFoundError = new NotFoundError('Пользователь не найден');
const defaultError = new DefaultError('Ошибка по-умолчанию');

module.exports.getUsers = (req, res) => { // возвращает всех пользователей
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: defaultError.message }));
};
// автотесты - неправильный код ответа и сообщение когда получаем несуществующего пользователя
module.exports.getUser = (req, res) => { // возвращает пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: validationError.message });
      } if (err.errorCode === 404) {
        res.status(404).send({ message: notFoundError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};

module.exports.createUser = (req, res) => { // создаёт пользователя
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};

module.exports.updateProfile = (req, res) => { // обновляет профиль
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(404).send({ message: notFoundError.message });
      } if (err.name === 'ValidationError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => { // обновляет аватар
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(404).send({ message: notFoundError.message });
      } if (err.name === 'ValidationError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};
