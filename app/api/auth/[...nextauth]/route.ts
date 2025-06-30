import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/database";
import User, { IUser } from "@/lib/database/models/user.model";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('Authorization attempt with credentials:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          await connectToDatabase();
          console.log('Database connected successfully');
          
          const user = await User.findOne({ email: credentials.email }).lean<IUser>().exec();
          console.log('User found:', user ? user.email : 'none');
          
          if (!user) {
            console.log('User not found');
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password validation result:', isValid);
          
          if (!isValid) {
            console.log('Invalid password');
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
