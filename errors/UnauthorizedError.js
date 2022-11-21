class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.errorCode = 401;
  }
}

module.exports = UnauthorizedError;
