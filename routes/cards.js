const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards); // GET /cards — возвращает все карточки
router.post('/', createCard); // POST /cards — создаёт карточку
router.delete('/:cardId', deleteCard); // DELETE /cards/:cardId — удаляет карточку по идентификатору

module.exports = router;
