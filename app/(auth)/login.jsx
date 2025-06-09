import { SocialSignInSection } from "@/components/auth/SocialSignInButtons";
import { useAuth } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [loadingProvider, setLoadingProvider] = useState(null);
    const { signIn, signInWithGoogle, signInWithApple, signInWithFacebook } =
        useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const { error } = await signIn(email.trim(), password);

        if (error) {
            Alert.alert("Login Failed", error.message);
        } else {
            router.replace("/(tabs)");
        }
        setLoading(false);
    };

    const handleSocialSignIn = async (provider, signInFunction) => {
        setLoadingProvider(provider);
        setSocialLoading(true);
        try {
            const { error } = await signInFunction();
            if (error) {
                if (error.message !== "Authentication cancelled") {
                    Alert.alert("Sign In Failed", error.message);
                }
            } else {
                router.replace("/(tabs)");
            }
        } catch (error) {
            Alert.alert("Sign In Failed", "An unexpected error occurred");
        } finally {
            setSocialLoading(false);
            setLoadingProvider(null);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-20">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back
                        </Text>
                        <Text className="text-lg text-gray-600">
                            Sign in to continue tracking your meals
                        </Text>
                    </View>

                    {/* Social Sign In */}
                    <SocialSignInSection
                        onGooglePress={() =>
                            handleSocialSignIn("google", signInWithGoogle)
                        }
                        onApplePress={() =>
                            handleSocialSignIn("apple", signInWithApple)
                        }
                        onFacebookPress={() =>
                            handleSocialSignIn("facebook", signInWithFacebook)
                        }
                        loadingProvider={loadingProvider}
                    />

                    {/* Form */}
                    <View className="mb-8">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Email
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-4 text-base"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Password
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-4 text-base"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-primary py-4 rounded-lg items-center mb-4"
                            onPress={handleLogin}
                            disabled={loading || socialLoading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-base">
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            <Link href="/(auth)/forgot-password" asChild>
                                <Text className="text-primary font-medium">
                                    Forgot your password?
                                </Text>
                            </Link>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center mt-auto mb-8">
                        <Text className="text-gray-600">
                            Don't have an account?{" "}
                        </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text className="text-primary font-semibold">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
