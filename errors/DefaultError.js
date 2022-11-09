class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultError';
    this.errorCode = 500;
  }
}

module.exports = DefaultError;
