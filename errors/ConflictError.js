class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.errorCode = 409;
  }
}

module.exports = ConflictError;
