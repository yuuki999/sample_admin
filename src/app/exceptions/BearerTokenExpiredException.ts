import BaseException from "./BaseException";

export default class BearerTokenExpiredException extends BaseException {
  static errorCode = "jwt_access_token_expired";
  constructor(
    message?: string,
    errorCode: string = BearerTokenExpiredException.errorCode,
    statusCode: number = 401,
  ) {
    super(message, errorCode, statusCode);
  }
}
