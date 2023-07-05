import { NextRequest, NextResponse } from "next/server"


export async function middleware(req: NextRequest) {

    
    if (req.nextUrl.pathname.startsWith("/checkout")) {
       
        try {
            const token  = req.cookies.get("token")?.value
          
            if(!token){
                return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?p=${req.nextUrl.pathname}`)
            }
        } catch (error) {
            return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?p=${req.nextUrl.pathname}`)
            
        }
    
        return NextResponse.next()
       
      
        }
    
   
        

  
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/checkout/:path*']
}