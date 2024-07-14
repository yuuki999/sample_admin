import BaseException from "./BaseException";

export default class TwoFactorAuthNotConfiguredException extends BaseException {
  constructor(
    message?: string,
    errorCode: string = "two_factor_auth_not_configured",
    statusCode: number = 400,
  ) {
    super(message, errorCode, statusCode);
  }
}
