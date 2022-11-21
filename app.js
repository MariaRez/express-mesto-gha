const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

app.post('/signin', login); // POST /signin — авториззация пользователя
app.post('/signup', createUser); // POST /signup — создаёт пользователя

app.use(auth); // авторизация

// роуты, которым авторизация нужна
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

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
