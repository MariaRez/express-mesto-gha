const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.post('/signin', login); // POST /signin — авториззация пользователя
app.post('/signup', createUser); // POST /signup — создаёт пользователя

app.use((req, res, next) => {
  req.user = {
    _id: '636bb994c2682eba6a6e823e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Page Not found 404' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
