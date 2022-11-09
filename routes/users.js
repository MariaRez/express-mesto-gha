const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

router.get('/users', getUsers); // GET /users — возвращает всех пользователей
router.get('/:userId', getUser); // GET /users/:userId - возвращает пользователя по _id
router.post('/users', createUser); // POST /users — создаёт пользователя

module.exports = router;
