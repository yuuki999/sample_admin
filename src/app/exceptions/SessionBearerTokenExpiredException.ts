import BaseException from "./BaseException";

export default class SessionBearerTokenExpiredException extends BaseException {
  static errorCode = "jwt_session_token_expired";
  constructor(
    message?: string,
    errorCode: string = SessionBearerTokenExpiredException.errorCode,
    statusCode: number = 401,
  ) {
    super(message, errorCode, statusCode);
  }
}
