class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.errorCode = 403;
  }
}

module.exports = ForbiddenError;
