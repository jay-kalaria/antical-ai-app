import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
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

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { resetPassword } = useAuth();

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        setLoading(true);
        const { error } = await resetPassword(email.trim());

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            setEmailSent(true);
        }
        setLoading(false);
    };

    if (emailSent) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 px-6 pt-20 items-center justify-center">
                    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
                        <Ionicons
                            name="checkmark"
                            size={40}
                            color={Colors.green?.[600] || "#16a34a"}
                        />
                    </View>

                    <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        Check your email
                    </Text>

                    <Text className="text-base text-gray-600 text-center mb-8 leading-6">
                        We sent a password reset link to{"\n"}
                        <Text className="font-semibold">{email}</Text>
                    </Text>

                    <TouchableOpacity
                        className="bg-primary py-4 px-8 rounded-lg items-center mb-4"
                        onPress={() => router.replace("/(auth)/login")}
                    >
                        <Text className="text-white font-semibold text-base">
                            Back to Sign In
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setEmailSent(false)}
                        className="py-2"
                    >
                        <Text className="text-primary font-medium">
                            Didn't receive email? Try again
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-20">
                    {/* Header */}
                    <TouchableOpacity
                        className="mb-8"
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={Colors.gray?.[600] || "#4b5563"}
                        />
                    </TouchableOpacity>

                    <View className="mb-12">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Reset Password
                        </Text>
                        <Text className="text-lg text-gray-600">
                            Enter your email and we'll send you a link to reset
                            your password
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-8">
                        <View className="mb-6">
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

                        <TouchableOpacity
                            className="bg-primary py-4 rounded-lg items-center mb-6"
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-base">
                                    Send Reset Link
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View className="items-center">
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary font-medium">
                                        Back to Sign In
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
