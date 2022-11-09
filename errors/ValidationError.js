class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.errorCode = 400;
  }
}

module.exports = ValidationError;
