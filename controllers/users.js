const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  Ok, Created, SALT, DuplicateKeyError,
} = require('../constants'); // 200, 201, соль для пароля, ошибка дублирования ключа

module.exports.getUsers = (req, res, next) => { // возвращает всех пользователей
  User.find({})
    .then((users) => res.status(Ok).send({ data: users }))
    .catch(next); // создаст 500
};

module.exports.getUser = (req, res, next) => { // возвращает пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при запросе пользователя'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.createUser = (req, res, next) => { // создаёт пользователя
  bcrypt.hash(req.body.password, SALT) // хешируем пароль - вынести в константу salt
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(Created).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === DuplicateKeyError) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
      } if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      if (!user) { // хеши не совпали — отклоняем промис
        Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign( // создание токена если была произведена успешная авторизация
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
      res.status(Created).send({ token });
    })
    .catch(next); // создаст 500
};

module.exports.updateProfile = (req, res, next) => { // обновляет профиль
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при изменении данных пользователя'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.updateAvatar = (req, res, next) => { // обновляет аватар
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при изменении аватара пользователя'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.getInfoAboutCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new NotFoundError(`Пользователь с указанным id '${req.user._id}' не найден`));
      }
      res.status(Ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при запросе данных текущего пользователя'));
      } else {
        next(err); // создаст 500
      }
    });
};
