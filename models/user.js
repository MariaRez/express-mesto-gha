const validator = require('validator');
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
  email: { // почта пользователя, уникальное значение
    type: String,
    required: true,
    unique: true,
    validate(value) { // валидация для почты пользователя
      // в случае передачи не подходящих данных будет создана ошибка
      if (!validator.isEmail(value)) {
        throw new Error('Передан некорректный формат электронной почты');
      }
    },
  },
  password: { // пароль пользователя для входа
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
