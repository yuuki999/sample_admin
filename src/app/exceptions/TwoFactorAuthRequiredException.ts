import BaseException from "./BaseException";

export default class TwoFactorAuthRequiredException extends BaseException {
  constructor(
    message?: string,
    errorCode: string = "two_factor_auth_required",
    statusCode: number = 400,
  ) {
    super(message, errorCode, statusCode);
  }
}
