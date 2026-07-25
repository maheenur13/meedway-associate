import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API, Next internals, admin, and static files
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
