class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.errorCode = 401;
  }
}

module.exports = UnauthorizedError;
