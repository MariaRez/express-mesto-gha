const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // GET /cards — возвращает все карточки

router.post('/', celebrate({ // POST /cards — создаёт карточку
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30), // валидация имени карточки,
    // строка, обязательное поле, минимальное кол-во символов 2, макс 30
    link: Joi.string().required().regex(), // валидация ссылки - необходимо вписать выражение
  }),
}), createCard);

router.delete('/:cardId', celebrate({ // DELETE /cards/:cardId — удаляет карточку по идентификатору
  params: Joi.object().keys({ // валидируем параметры
    userId: Joi.string().alphanum().length(24), // id пользователя строчный,
    // состоит из цифр и букв, длинной 24 символа
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({ // PUT /cards/:cardId/likes — поставить лайк карточке
  params: Joi.object().keys({ // валидируем параметры
    userId: Joi.string().alphanum().length(24), // id пользователя строчный,
    // состоит из цифр и букв, длинной 24 символа
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({ // DELETE /cards/:cardId/likes — убрать лайк с карточки
  params: Joi.object().keys({ // валидируем параметры
    userId: Joi.string().alphanum().length(24), // id пользователя строчный,
    // состоит из цифр и букв, длинной 24 символа
  }),
}), dislikeCard);

module.exports = router;
