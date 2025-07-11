// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      isAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    username: string
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    username: string
    isAdmin: boolean
  }
}
