export default class BaseException extends Error {
  statusCode?: number;
  errorCode?: string;

  constructor(message?: string, errorCode?: string, statusCode: number = 500) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
