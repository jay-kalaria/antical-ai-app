import { supabase } from "@/utils/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession(); // required for web only

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session (this handles session persistence)
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
                console.log(
                    "Initial session check:",
                    session ? "User logged in" : "No session"
                );
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error getting session:", error);
                setLoading(false);
            });

        // Listen for auth changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(
                "Auth state change:",
                event,
                session ? "User logged in" : "User logged out"
            );
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, options = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options,
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email
        );
        return { data, error };
    };

    const updateProfile = async (updates) => {
        const { data, error } = await supabase.auth.updateUser(updates);
        return { data, error };
    };

    const signInWithGoogle = async () => {
        const redirectTo = makeRedirectUri({
            scheme: "nutricado",
            path: "auth/callback",
        });

        console.log("Google OAuth Redirect URI:", redirectTo);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        });

        if (error) return { data, error };

        const res = await WebBrowser.openAuthSessionAsync(
            data?.url ?? "",
            redirectTo
        );

        console.log("Google OAuth result:", res);

        if (res.type === "success") {
            const { url } = res;
            await supabase.auth.getSessionFromUrl(url);
        } else if (res.type === "cancel") {
            // User cancelled the authentication
            return {
                data: null,
                error: { message: "Authentication cancelled" },
            };
        }

        return { data, error };
    };

    const signInWithApple = async () => {
        const redirectTo = makeRedirectUri({
            scheme: "nutricado",
            path: "auth/callback",
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        });

        if (error) return { data, error };

        const res = await WebBrowser.openAuthSessionAsync(
            data?.url ?? "",
            redirectTo
        );

        console.log("Apple OAuth result:", res);

        if (res.type === "success") {
            const { url } = res;
            await supabase.auth.getSessionFromUrl(url);
        } else if (res.type === "cancel") {
            // User cancelled the authentication
            return {
                data: null,
                error: { message: "Authentication cancelled" },
            };
        }

        return { data, error };
    };

    const signInWithFacebook = async () => {
        const redirectTo = makeRedirectUri({
            scheme: "nutricado",
            path: "auth/callback",
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "facebook",
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        });

        if (error) return { data, error };

        const res = await WebBrowser.openAuthSessionAsync(
            data?.url ?? "",
            redirectTo
        );

        console.log("Facebook OAuth result:", res);

        if (res.type === "success") {
            const { url } = res;
            await supabase.auth.getSessionFromUrl(url);
        } else if (res.type === "cancel") {
            // User cancelled the authentication
            return {
                data: null,
                error: { message: "Authentication cancelled" },
            };
        }

        return { data, error };
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        signInWithGoogle,
        signInWithApple,
        signInWithFacebook,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
