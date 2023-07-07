import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "@/database"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [

    // ...add more providers here

    Credentials({
        name:"Custom Login",
        credentials:{
            email:{label:"Correo:",type:"email",placeholder:"correo@google.com"},
            password:{label:"Contraseña:",type:"password",placeholder:"Contraseña"},
        },

        async authorize(credentials)  {
            console.log(credentials)
            const res = await dbUsers.checkUserEmailPassword(credentials?.email!,credentials?.password!)
            console.log(res )
            return res
        }
    }),


    GithubProvider({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || "",
      })
  ],

  //Custom pages

  pages:{
    signIn: "/auth/login",
    newUser: "/auth/register"
  },

  //Callbacks

  jwt:{

  },

  session:{
    maxAge:2592000,
    strategy:"jwt",
    updateAge:86400
  },

  callbacks:{

    async jwt({token,account,user}){
        console.log(token,account,user)

        if(account){
            token.accessToken = account.access_token;

            switch(account.type){

                case "oauth":
                const {email = "",name = ""} = user
                token.user = await dbUsers.oAuthToDbUser(email,name)
                break;

                case "credentials":
                token.user = user
                break;
            }

        }
        return token
    },

    async session ({session,token , user } )  {
        // console.log(session,token,user)

        session.accesToken = token.accessToken;
        session.user = token.user ;

        return session
    }
  }
  
}
export default NextAuth(authOptions)