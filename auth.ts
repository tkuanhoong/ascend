import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db";
import authConfig from "./auth.config";
import type { Adapter } from 'next-auth/adapters';
import { UserRole } from "@prisma/client";

const adapter = PrismaAdapter(db) as Adapter;

export const { handlers, signIn, signOut, auth } = NextAuth({
    // debug: true,
    adapter,
    session: {
        strategy: "jwt",
        // maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        // This callback is called whenever a JSON Web Token is created (i.e. at sign-in)
        // Add the JWT token to the session
        async jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        // The session callback is called whenever a session is checked
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
            }
            return session;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
    ...authConfig,
})