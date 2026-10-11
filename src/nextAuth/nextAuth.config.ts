import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode"

declare module "next-auth" {
  interface User {
    tokenCredentials?: string
    id: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Fresh Cart credentials",
      credentials: {
        email: {},
        password: {},
      },

      authorize: async function (credentials) {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
          method: "post",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "content-type": "application/json" },
        })

        const finalRes = await res.json()

        if (res.ok) {
          const { name, email } = finalRes.user
          const data: { id: string } = jwtDecode(finalRes.token)

          return {
            name,
            email,
            id: data.id,
            tokenCredentials: finalRes.token,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.routeToken = user.tokenCredentials
        token.id = user.id
      }

      // Lets the profile page refresh the name/email without signing in again:
      // useSession().update({ name, email })
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.email) token.email = session.email
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: { signIn: "/login" },
  jwt: { maxAge: 60 * 60 * 24 * 3 },
  secret: process.env.NEXTAUTH_SECRET,
}