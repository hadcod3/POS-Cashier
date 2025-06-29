import { createAuthClient } from "better-auth/react"
// import { useRouter } from "next/navigation";
// const router = useRouter()

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
})

// await authClient.signOut({
//   fetchOptions: {
//     onSuccess: () => {
//       router.push("/login");
//     },
//   },
// });

export const { signIn, signUp, useSession } = createAuthClient()

// const { data, error } = await authClient.signUp.email({
//   email: "test@example.com",
//   password: "password1234",
//   name: "test",
//   image: "https://example.com/image.png",
// });

// const { data, error } = await authClient.signIn.email({
//   email: "test@example.com",
//   password: "password1234",
// });
