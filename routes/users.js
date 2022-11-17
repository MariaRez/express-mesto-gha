const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // GET /users — возвращает всех пользователей
router.get('/:userId', getUser); // GET /users/:userId - возвращает пользователя по _id
router.patch('/me', updateProfile); // PATCH /users/me — обновляет профиль
router.patch('/me/avatar', updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = router;
