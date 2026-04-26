import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from 'jwt-decode';
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    tokenCredentials?: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    routeToken?: string;
    id?: string;
  }
}

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Fresh Cart credentials",
      credentials: {
        email: {},
        password: {}
      },
  
      authorize: async function (credentials) {

        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
          method: "post",
          // body: JSON.stringify(credentials),
          body: JSON.stringify({
  email: credentials?.email,
  password: credentials?.password,
}),
          headers: { 'content-type': 'application/json' }
        });

        const finalRes = await res.json();
        console.log('finalRes from authorize function', finalRes);
        if (res.ok) {
          const { name, email } = finalRes.user;
          const data: { id: string } = jwtDecode(finalRes.token);

          return {
            name,
            email,
            id: data.id,
            tokenCredentials: finalRes.token,
          };
        }
        return null;
      }
// async authorize(credentials) {
//   try {
//     console.log("STEP 1: credentials", credentials);

//     const res = await fetch(
//       "https://ecommerce.routemisr.com/api/v1/auth/signin",
//       {
//         method: "POST",
//         body: JSON.stringify({
//           email: credentials?.email,
//           password: credentials?.password,
//         }),
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     console.log("STEP 2: response status", res.status);

//     const finalRes = await res.json();
//     console.log("STEP 3: API RESPONSE", finalRes);

//     if (!res.ok) {
//       console.log("STEP 4: LOGIN FAILED");
//       return null;
//     }

//     if (!finalRes.token) {
//       console.log("STEP 5: NO TOKEN");
//       return null;
//     }

//     const decoded: any = jwtDecode(finalRes.token);
//     console.log("STEP 6: decoded", decoded);

//     return {
//       id: decoded.id,
//       name: finalRes.user?.name,
//       email: finalRes.user?.email,
//       tokenCredentials: finalRes.token,
//     };

//   } catch (error) {
//     console.log("🔥 AUTH CRASH:", error);
//     return null;
//   }
// }
    }),
  ],
  callbacks: {
    jwt: function (param) {

      if (param.user) {
        param.token.routeToken = param.user.tokenCredentials;
        param.token.id= param.user.id;
      }

      return param.token;
    },
    // session: function (param) {
    //   param.session.user.id = param.token;
    //   return param.session;
    // },
    session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
  }
  return session;
}
  },
  pages: { signIn: '/login' },
  jwt: { maxAge: 60 * 60 * 24 * 3 },
  secret: process.env.NEXTAUTH_SECRET,
}