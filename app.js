const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

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
  res.status(404).send({ message: 'Page Not found 404' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
