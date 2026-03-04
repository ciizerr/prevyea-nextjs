"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
    try {
        await signIn("credentials", Object.fromEntries(formData));
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." };
                case "CallbackRouteError": // Added to handle redirects from AuthError
                    if (error.cause?.err instanceof Error && error.cause.err.message.includes("NEXT_REDIRECT")) {
                        throw error.cause.err; // Re-throw the underlying redirect error
                    }
                    return { error: "Something went wrong during callback." };
                default:
                    return { error: "Something went wrong." };
            }
        }
        // If it's not an AuthError, and it's a redirect, re-throw it.
        // This handles cases where signIn might directly throw a redirect error
        // before AuthError wraps it, or if another part of the code throws one.
        // The `redirect` function from `next/navigation` throws an error that Next.js handles.
        // We don't need `isRedirectError` if we're just re-throwing any non-AuthError.
        throw error;
    }
}

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" });
}

export async function logoutAction() {
    await signOut({ redirectTo: "/login" });
}
