export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected internal error happened.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact the support team.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service currently unavailable.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Check if the service is available.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed for this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Check if the HTTP method sent is valid for this endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "A validation error has occurred.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Adjust the sent data and try again.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Resource not found in the system.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action || "Check if the parameters sent on the request are correct.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
