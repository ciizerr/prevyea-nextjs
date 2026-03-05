import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

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
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // Initial sign in or manual trigger
            if (user || trigger === "update") {
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.id, token.sub as string)
                });

                if (dbUser) {
                    // Auto-assign ADMIN role based on environment variable
                    if (dbUser.email && process.env.ADMIN_EMAIL && dbUser.email === process.env.ADMIN_EMAIL) {
                        if (dbUser.role !== "ADMIN") {
                            await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, dbUser.id));
                            dbUser.role = "ADMIN";
                        }
                    }

                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                    token.course = dbUser.course;
                    token.session = dbUser.session;
                    token.collegeId = dbUser.collegeId;
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
                // @ts-expect-error - Adding custom session property to NextAuth session user
                session.user.session = token.session;
                // @ts-expect-error - Adding custom collegeId property to NextAuth session user
                session.user.collegeId = token.collegeId;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt", // Required if using Credentials provider with Drizzle, still useful for JWT sessions
    }
});
