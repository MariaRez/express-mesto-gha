const validator = require('validator');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({ // схема карточки
  name: { // имя карточки, строка от 2 до 30 символов, обязательное поле
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: { // ссылка на картинку, строка, обязательно поле
    type: String,
    required: true,
    validate(value) { // валидация для ссылки на картинку
      // в случае передачи не подходящих данных будет создана ошибка
      if (!validator.isUrl(value)) {
        throw new Error('Передан некорректный формат ссылки');
      }
    },
  },
  owner: { // ссылка на модель автора карточки, тип ObjectId, обязательное поле
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ // список, массив ObjectId, по умолчанию — пустой массив (поле default);
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: { // дата создания, тип Date, значение по умолчанию Date.now.
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
