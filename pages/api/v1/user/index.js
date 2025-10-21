import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const foundSession = await session.findOneValidByToken(sessionToken);
  await session.renew(foundSession.id);

  controller.setSessionCookie(foundSession.token, response);

  const foundUser = await user.findOneById(foundSession.user_id);

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
  return response.status(200).json(foundUser);
}
