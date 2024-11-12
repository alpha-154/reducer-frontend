import { NextResponse , NextRequest} from "next/server";



export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
 //console.log("middleware -> path:", path);

  const authenticationRoute = ["/register", "/login",];

  const landingPage = "/";

  const token = request.cookies.get("accessToken")?.value || null;
//  console.log("middleware -> token:", token);

  

  // If the user is authenticated and tries to access auth pages, redirect them to the dashboard
  if (authenticationRoute.includes(path) && token) {
    return NextResponse.redirect(new URL("/chat", request.nextUrl));
  }

  //If the user is already logged in the app & tries to access the
  //landing page then user should redirect to `/chat` field since we're making it default
  if(path === landingPage && token){
    return NextResponse.redirect(new URL("/chat", request.nextUrl));
  }

  const privateRoutes = [
   
    "/mail",
    "/group",
    "/chat",
    "/notification",
   ];

  // If the user tries to access private routes without authentication, redirect to sign-in
  if (privateRoutes.includes(path) && !token) {
    const signInUrl = new URL("/login", request.nextUrl);
    signInUrl.searchParams.set("redirect", path); // Pass the original path as a query parameter
    return NextResponse.redirect(signInUrl);

  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/register",
    "/login",
    "/mail",
    "/group",
    "/chat",
    "/notification",
  ],
};

// export function middleware() {
 
// }