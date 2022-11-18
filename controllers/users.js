const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');
const {
  InternalServerErrorCode, BadRequestCode, NotFoundCode,
} = require('../constants');

const validationError = new ValidationError('Переданы некорректные данные в методы создания пользователя, обновления аватара пользователя или профиля');
const notFoundError = new NotFoundError('Пользователь не найден');
const defaultError = new DefaultError('Ошибка по-умолчанию');

module.exports.getUsers = (req, res) => { // возвращает всех пользователей
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(InternalServerErrorCode).send({ message: defaultError.message }));
};

module.exports.getUser = (req, res) => { // возвращает пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestCode).send({ message: validationError.message });
      } if (err.errorCode === NotFoundCode) {
        res.status(NotFoundCode).send({ message: notFoundError.message });
      } else {
        res.status(InternalServerErrorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.createUser = (req, res) => { // создаёт пользователя
  bcrypt.hash(req.body.password, 10) // хешируем пароль - вынести в константу salt
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestCode).send({ message: validationError.message });
      } else {
        res.status(InternalServerErrorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.login = (req, res) => {
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
        'some-secret-key', // заменить на актуальный по заданию - из тренажера - возможно стоит сохранить в константу
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message }); // скорретировать
    });
};

module.exports.updateProfile = (req, res) => { // обновляет профиль
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.params.userId}' не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NotFoundCode).send({ message: notFoundError.message });
      } if (err.name === 'ValidationError') {
        res.status(BadRequestCode).send({ message: validationError.message });
      } else {
        res.status(InternalServerErrorCode).send({ message: defaultError.message });
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
        res.status(NotFoundCode).send({ message: notFoundError.message });
      } if (err.name === 'ValidationError') {
        res.status(BadRequestCode).send({ message: validationError.message });
      } else {
        res.status(InternalServerErrorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.getInfoAboutCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new NotFoundError(`Пользователь с указанным id '${req.user._id}' не найден`));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestCode).send({ message: validationError.message });
      } else {
        next(err);
      }
    });
};
