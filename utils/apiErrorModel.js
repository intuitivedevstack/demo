class ApiErrorModel extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4")
      ? "Please check your request"
      : "Server error";

    Error.captureStackTrace(this);
  }
}

export default ApiErrorModel;
