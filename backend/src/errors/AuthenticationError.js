export default class AuthenticationError extends Error {
  constructor(message, field, code = 500) {
    super(message);

    this.code = code;
    this.field = field;
  }
}
