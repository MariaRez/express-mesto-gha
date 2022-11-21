const Card = require('../models/card');

const ValidationError = require('../errors/ValidationError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenError = require('../errors/ForbiddenError'); // 403

const { Ok, Created } = require('../constants'); // 200 201

module.exports.getCards = (req, res, next) => { // возвращает все карточки
  Card.find({})
    .then((cards) => res.status(Ok).send({ data: cards })) // 200
    .catch(next); // создаст 500
};

module.exports.createCard = (req, res, next) => { // создаёт карточку
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(Created).send({ data: card })) // 201
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.deleteCard = (req, res, next) => { // удаляет карточку по идентификатору
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => {
      if (!req.user._id === card.owner) { // если пользователь не является владельцем карточки
        return new ForbiddenError(`У пользователя с id '${req.user._id}' нет прав для удаления данной карточки!`);
      }
      return card.remove()
        .then(() => res.status(Ok).send({ message: 'Карточка успешно удалена' }));// выставляем статус и сообщаем что карточка удалена
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при удалении карточки'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.likeCard = (req, res, next) => { // поставить лайк карточке
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => res.status(Ok).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при простановке лайка карточке'));
      } else {
        next(err); // создаст 500
      }
    });
};

module.exports.dislikeCard = (req, res, next) => { // убрать лайк с карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => res.status(Ok).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при удаления лайка у карточки'));
      } else {
        next(err); // создаст 500
      }
    });
};
