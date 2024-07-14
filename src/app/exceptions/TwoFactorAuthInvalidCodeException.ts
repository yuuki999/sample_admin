import BaseException from "./BaseException";

export default class TwoFactorAuthInvalidCodeException extends BaseException {
  constructor(
    message?: string,
    errorCode: string = "two_factor_auth_invalid_code",
    statusCode: number = 400,
  ) {
    super(message, errorCode, statusCode);
  }
}
