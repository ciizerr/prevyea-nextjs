import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        Google,
        GitHub,
        Credentials({
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // In a real app, you would query the DB for the user by email/username
                // and then verify the hashed password using bcrypt.
                // For this MVP, we will mock a successful credential login if fields are provided.
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                return {
                    id: "mock-user-id",
                    email: String(credentials.identifier).includes("@") ? String(credentials.identifier) : `${credentials.identifier}@example.com`,
                    name: "Demo User",
                    role: "USER"
                } as Record<string, unknown>;
            }
        })
    ],
    pages: {
        signIn: "/login",
        newUser: "/signup", // New users will be directed here on oauth first login if desired
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // Initial sign in or manual trigger
            if (user || trigger === "update") {
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.id, token.sub as string)
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                    token.course = dbUser.course;
                    token.semester = dbUser.semester;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Forward JWT properties to the resulting client session
            if (session.user && token.sub) {
                // @ts-expect-error - Adding custom id property to NextAuth session user
                session.user.id = token.id;
                // @ts-expect-error - Adding custom role property to NextAuth session user
                session.user.role = token.role;
                // @ts-expect-error - Adding custom username property to NextAuth session user
                session.user.username = token.username;
                // @ts-expect-error - Adding custom course property to NextAuth session user
                session.user.course = token.course;
                // @ts-expect-error - Adding custom semester property to NextAuth session user
                session.user.semester = token.semester;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt", // Required if using Credentials provider with Drizzle
    }
});
