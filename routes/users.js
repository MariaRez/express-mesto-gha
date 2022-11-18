const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateProfile, updateAvatar, getInfoAboutCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // GET /users — возвращает всех пользователей

router.get('/:userId', celebrate({ // GET /users/:userId - возвращает пользователя по _id
  params: Joi.object().keys({ // валидируем параметры
    userId: Joi.string().alphanum().length(24), // id пользователя строчный,
    // состоит из цифр и букв, длинной 24 символа
  }),
}), getUser);

router.patch('/me', celebrate({ // PATCH /users/me — обновляет профиль
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30), // валидация имени пользователя,
    // строка, обязательное поле, минимальное кол-во символов 2, макс 30
    about: Joi.string().required().min(2).max(30), // валидация описания пользователя,
    // строка, обязательное поле, минимальное кол-во символов 2, макс 30
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({ // PATCH /users/me — обновляет профиль
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(), // валидация аватара - необходимо вписать выражение
  }),
}), updateAvatar); // PATCH /users/me/avatar — обновляет аватар

router.get('/me', getInfoAboutCurrentUser);// GET /users/me - возвращает информацию о текущем пользователе

module.exports = router;
