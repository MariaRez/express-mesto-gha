const Card = require('../models/card');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

const validationError = new ValidationError('Переданы некорректные данные в методы создания карточки, удаления карточки, простановке лайка/дизлайка');
const notFoundError = new NotFoundError('Карточка не найдена');
const defaultError = new DefaultError('Ошибка по-умолчанию');

const VALIDATION_ERROR_CODE = 400; // переданы некорректные данные в методы создания карточки и др
const NOT_FOUND_ERROR_CODE = 404; //  карточка или пользователь не найден
const DEFAULT_ERROR_CODE = 500; // ошибка по-умолчанию

module.exports.getCards = (req, res) => { // возвращает все карточки
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: defaultError.message }));
};

module.exports.createCard = (req, res) => { // создаёт карточку
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: validationError.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: defaultError.message });
      }
    });
};

module.exports.deleteCard = (req, res) => { // удаляет карточку по идентификатору
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: validationError.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: defaultError.message });
      }
    });
};

module.exports.likeCard = (req, res) => { // поставить лайк карточке
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: validationError.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: defaultError.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => { // убрать лайк с карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: validationError.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: defaultError.message });
      }
    });
};
