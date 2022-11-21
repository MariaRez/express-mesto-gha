const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NotFoundCode, InternalServerErrorCode } = require('./constants'); // 404 500

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.post('/signin', celebrate({ // POST /signin — авторизация пользователя
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({ // POST /signup — создаёт пользователя
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(/http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth); // авторизация

// роуты, которым авторизация нужна
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// celebrate error handler
app.use(errors());

app.use((req, res) => {
  res.status(NotFoundCode).send({ message: 'Page Not found 404' });
});

app.use((err, req, res, next) => {
  if (err.errorCode === InternalServerErrorCode) {
    // если любая возникшая ошибка с кодом 500, сообщи от этом
    res.status(InternalServerErrorCode).send({ message: 'Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос' });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
