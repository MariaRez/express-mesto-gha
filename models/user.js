const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // схема карточки
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
