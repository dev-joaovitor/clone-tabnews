import * as cookie from "cookie";
import session from "models/session";

import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";

async function onNoMatchHandler(_request, response) {
  const publicErrorObject = new MethodNotAllowedError();

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, _request, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function setSessionCookie(token, response) {
  const setCookie = cookie.serialize("session_id", token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
};

export default controller;
