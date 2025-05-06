import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey); // Verify JWT

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userid", payload.id as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("JWT Verification Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

// Specify which routes to protect
export const config = {
  matcher: ["/api/auth/addinfo/:path*" , "/api/book/addbook/:path*" , "/api/book/getrecent/:path*","/api/book/getmybooks/:path*" ,
    "/api/book/editbook/:path*"   , "/api/profile/:path*" , "/api/userdetails/:path*" , "/api/book/recepientbooks/:path","/api/book/bookdeletbyid/:path*","/api/book/getdonorrecent/:path*",
    "/api/book/getreceipentrecent/:path*" ,  "/api/auth/emailvarification/:path*" ,
    "/api/request/bookrequest/:path*", "/api/donation/request/:path*","/api/donation/myrequest/:path*",
    "/api/donation/donationhistory/:path*",
    "/api/book/getallbooks/:path*",  "/api/allfav/:path*"
   ] // Add protected routes
};
