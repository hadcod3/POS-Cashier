import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "https://pos-cashier-lovat.vercel.app/"
})

export const { signIn, signUp, useSession } = createAuthClient()
