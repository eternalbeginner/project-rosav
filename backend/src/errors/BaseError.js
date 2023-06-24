export default class BaseError extends Error {
  name = 'BaseError';
  type = 'field';
  path = null;

  constructor(message, code = 500, options = {}) {
    super(message);

    this.code = code;
    this.name = options.name ?? this.name;
    this.type = options.type ?? this.type; // field | param | query
    this.path = options.path ?? this.path;
  }
}
