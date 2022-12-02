const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const userSchema = new mongoose.Schema({ // схема карточки
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: { // почта пользователя, уникальное значение
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Почта не проходит условия валидации. Проверьте формат!',
    },
  },
  password: { // пароль пользователя для входа
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
});

userSchema.path('avatar').validate((value) => { // проверка - валидация ссылки
  const regExpForLink = /http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/;
  return regExpForLink.test(value);
}, 'Данная ссылка не проходит условия вадидации. Проверьте формат!');

userSchema.statics.findUserByCredentials = function findUserByCredentials({ email, password }) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные данные'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные данные'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
