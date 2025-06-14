import user from "models/user";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);

    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Authentication data doesn't match.",
        action: "Check if the provided data are correct.",
        cause: error,
      });
    }

    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email doesn't match.",
          action: "Check if this data are correct.",
        });
      }

      throw error;
    }

    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Password doesn't match.",
        action: "Check if this data are correct.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
