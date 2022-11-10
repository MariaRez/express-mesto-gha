const Card = require('../models/card');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

const validationError = new ValidationError('Переданы некорректные данные в методы создания карточки, удаления карточки, простановке лайка/дизлайка');
const notFoundError = new NotFoundError('Карточка не найдена');
const defaultError = new DefaultError('Ошибка по-умолчанию');

module.exports.getCards = (req, res) => { // возвращает все карточки
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: defaultError.message }));
};

module.exports.createCard = (req, res) => { // создаёт карточку
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};
// авто - неправильный код ответа и сообшение об ошибки при удалении не существующней карточки
module.exports.deleteCard = (req, res) => { // удаляет карточку по идентификатору
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === 404) {
        res.status(404).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};
// авто - неправильный код ответа и сообшение об ошибки при лайке не существующней карточки
module.exports.likeCard = (req, res) => { // поставить лайк карточке
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === 404) {
        res.status(404).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};
// авто - неправильный код ответа и сообшение об ошибки при удалении лайка не существующней карточки
module.exports.dislikeCard = (req, res) => { // убрать лайк с карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError(`Карточка указанным с id '${req.params.cardId}' не найдена`))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errorCode === 404) {
        res.status(404).send({ message: notFoundError.message });
      } if (err.name === 'CastError') {
        res.status(400).send({ message: validationError.message });
      } else {
        res.status(500).send({ message: defaultError.message });
      }
    });
};
