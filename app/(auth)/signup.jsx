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
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const { signUp, signInWithGoogle, signInWithApple, signInWithFacebook } =
        useAuth();

    const handleSignup = async () => {
        if (
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            !name.trim()
        ) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        const { data, error } = await signUp(email.trim(), password, {
            data: {
                name: name.trim(),
            },
        });

        if (error) {
            Alert.alert("Signup Failed", error.message);
        } else {
            // With email confirmation disabled, user is automatically signed in
            Alert.alert(
                "Account Created!",
                "Welcome to Nutricado! You can now start tracking your meals.",
                [
                    {
                        text: "Get Started",
                        onPress: () => router.replace("/(tabs)"),
                    },
                ]
            );
        }
        setLoading(false);
    };

    const handleSocialSignIn = async (provider, signInFunction) => {
        setSocialLoading(provider);
        try {
            const { error } = await signInFunction();
            if (error) {
                // Don't show error alert if user cancelled authentication
                if (error.message !== "Authentication cancelled") {
                    Alert.alert("Sign Up Failed", error.message);
                }
            } else {
                router.replace("/(tabs)");
            }
        } catch (error) {
            Alert.alert("Sign Up Failed", "An unexpected error occurred");
        } finally {
            setSocialLoading(null);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-16">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </Text>
                        <Text className="text-lg text-gray-600">
                            Join Nutricado to start tracking your nutrition
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
                        loadingProvider={socialLoading}
                    />

                    {/* Form */}
                    <View className="mb-8">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Full Name
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-4 text-base"
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoComplete="name"
                            />
                        </View>

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

                        <View className="mb-4">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Password
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-4 text-base"
                                placeholder="Create a password (min. 6 characters)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Confirm Password
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-4 text-base"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-primary py-4 rounded-lg items-center mb-4"
                            onPress={handleSignup}
                            disabled={loading || socialLoading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-base">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center mb-8">
                        <Text className="text-gray-600">
                            Already have an account?{" "}
                        </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-primary font-semibold">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
