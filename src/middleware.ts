import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const validPaths = [
  "/",
  "/trips",
  "/itinerary",
  "/discover",
  "/invite",
  "/profile",
  "/settings",
  "/credits",
  // Add all other valid paths here
];

const isValidPath = (path: string) => {
  return validPaths.includes(path) || validPaths.some(validPath => path.startsWith(validPath + '/'));
};


const publicPaths = ["/", "/trips*", "/itinerary*", "/discover", "/api*", "/invite*"];

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};
 
export default withClerkMiddleware((req: NextRequest) => {
  if (isPublic(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If the path is not valid, redirect to the homepage
  if (!isValidPath(req.nextUrl.pathname)) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(req);

  if (!userId) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!static|.*\\..*|_next|favicon.ico).*)",
    "/",
  ],
}
