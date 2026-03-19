import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password as string);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }

      // Handle Google OAuth sign-in
      if (account?.provider === "google" && user) {
        await dbConnect();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            provider: "google",
            isActive: true,
            lastLoginAt: new Date(),
          });

          // Create default dashboard for new user
          const Dashboard = (await import("@/models/Dashboard")).default;
          await Dashboard.create({
            userId: dbUser._id,
            name: "My Dashboard",
            description: "Your personal dashboard",
            isDefault: true,
            layout: "[]",
          });

          // Log user registration
          await AuditLog.create({
            userId: dbUser._id,
            action: "user.register",
            details: `New user registered via Google OAuth: ${user.email}`,
          });
        } else {
          dbUser.lastLoginAt = new Date();
          await dbUser.save();
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.image = dbUser.image as string | null | undefined;

        // Log login
        await AuditLog.create({
          userId: dbUser._id,
          action: "user.login",
          details: `User logged in via Google OAuth: ${user.email}`,
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image as string | null | undefined;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        await dbConnect();

        const dbUser = await User.findById(user.id);
        if (dbUser) {
          dbUser.lastLoginAt = new Date();
          await dbUser.save();

          // Log login
          await AuditLog.create({
            userId: dbUser._id,
            action: "user.login",
            details: `User logged in via credentials: ${user.email}`,
          });
        }
      }
      return true;
    },
  },
});
