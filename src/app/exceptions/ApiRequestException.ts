import BaseException from "./BaseException";

export default class ApiRequestException extends BaseException {
  constructor(
    message?: string,
    errorCode: string = "api_request_error",
    statusCode: number = 500,
  ) {
    super(message, errorCode, statusCode);
  }
}
