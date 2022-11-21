const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateProfile, updateAvatar, getInfoAboutCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // GET /users — возвращает всех пользователей

router.get('/:userId', celebrate({ // GET /users/:userId - возвращает пользователя по _id
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({ // PATCH /users/me — обновляет профиль
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({ // PATCH /users/me — обновляет профиль
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(),
  }),
}), updateAvatar); // PATCH /users/me/avatar — обновляет аватар

router.get('/me', getInfoAboutCurrentUser);// GET /users/me - возвращает информацию о текущем пользователе

module.exports = router;
