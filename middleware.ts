

import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/api/webhook", "/api/uploadthing" ],
  ignoredRoutes : ['/api/uploadthing' , '/api/webhook']
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 