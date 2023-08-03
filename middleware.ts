import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"


export async function middleware(req: NextRequest) {

    const validarCookieToken = async ()=>{
        const session: any = await getToken({req,secret:process.env.NEXTAUTH_URL})

       
        if(!session){
            const requestedPage = req.nextUrl.pathname;
            const url = req.nextUrl.clone();
            url.pathname=`/auth/login`
            url.search = `p=${requestedPage}`
            return NextResponse.redirect(url)
        }

        return session
    }

    
    if (req.nextUrl.pathname.startsWith("/checkout")) {
       
        // try {
        //     const token  = req.cookies.get("token")?.value
          
        //     if(!token){
        //         return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?p=${req.nextUrl.pathname}`)
        //     }
        // } catch (error) {
        //     return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?p=${req.nextUrl.pathname}`)
            
        // }
    
        // return NextResponse.next()

       await validarCookieToken()


        return NextResponse.next()
      
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {

            const session = await validarCookieToken()
            
            const validRoles = ["admin","super-user","SEO"]

            if(!validRoles.includes(session.user?.role)){
                return NextResponse.redirect(`${req.nextUrl.origin}/`)
            }


            return NextResponse.next()

        }

        if (req.nextUrl.pathname.startsWith("/api/admin/dashboard")) {
            const session: any = await getToken({req,secret:process.env.NEXTAUTH_URL})

            if(!session){
                return new Response(JSON.stringify({message:"No autorizado"}),{
                    status:401,
                    headers:{
                        "content-Type":"application/json"
                    }
                })
            }


            const validRoles = ["admin","super-user","SEO"]

            if(!validRoles.includes(session.user?.role)){
                return new Response(JSON.stringify({message:"No autorizado"}),{
                    status:401,
                    headers:{
                        "content-Type":"application/json"
                    }
                })
            }


        }

       
    
   
        
        return NextResponse.next()
  
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/:path*']
}