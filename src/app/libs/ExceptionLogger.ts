export default class ExceptionLogger {
  static details(error: any) {
    if (error.statusCode) {
      console.log("StatusCode:", error.statusCode);
    }

    if (error.errorCode) {
      console.log("ErrorCode:", error.errorCode);
    }

    if (error.stack) {
      console.log("Stack:", error.stack);
    }
  }
}
