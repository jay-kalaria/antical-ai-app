import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export function SocialSignInButton({
    provider,
    onPress,
    loading = false,
    disabled = false,
}) {
    const getProviderConfig = () => {
        switch (provider) {
            case "google":
                return {
                    backgroundColor: "bg-white",
                    borderColor: "border-gray-300",
                    textColor: "text-gray-700",
                    icon: "logo-google",
                    text: "Continue with Google",
                };
            case "apple":
                return {
                    backgroundColor: "bg-black",
                    borderColor: "border-black",
                    textColor: "text-white",
                    icon: "logo-apple",
                    text: "Continue with Apple",
                };
            case "facebook":
                return {
                    backgroundColor: "bg-blue-600",
                    borderColor: "border-blue-600",
                    textColor: "text-white",
                    icon: "logo-facebook",
                    text: "Continue with Facebook",
                };
            default:
                return {};
        }
    };

    const config = getProviderConfig();

    // Don't show Apple Sign In on Android
    if (provider === "apple" && Platform.OS === "android") {
        return null;
    }

    return (
        <TouchableOpacity
            className={`${config.backgroundColor} border ${config.borderColor} py-4 rounded-lg items-center mb-3 flex-row justify-center`}
            onPress={onPress}
            disabled={loading || disabled}
            style={{ opacity: loading || disabled ? 0.6 : 1 }}
        >
            {loading ? (
                <ActivityIndicator
                    color={provider === "google" ? "#666" : "white"}
                    size="small"
                />
            ) : (
                <>
                    <Ionicons
                        name={config.icon}
                        size={20}
                        color={provider === "google" ? "#666" : "white"}
                        style={{ marginRight: 12 }}
                    />
                    <Text
                        className={`${config.textColor} font-semibold text-base`}
                    >
                        {config.text}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

export function SocialSignInSection({
    onGooglePress,
    onApplePress,
    onFacebookPress,
    loadingProvider = null,
}) {
    return (
        <View className="mb-6">
            <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500">Or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            <SocialSignInButton
                provider="google"
                onPress={onGooglePress}
                loading={loadingProvider === "google"}
                disabled={loadingProvider !== null}
            />

            <SocialSignInButton
                provider="apple"
                onPress={onApplePress}
                loading={loadingProvider === "apple"}
                disabled={loadingProvider !== null}
            />

            <SocialSignInButton
                provider="facebook"
                onPress={onFacebookPress}
                loading={loadingProvider === "facebook"}
                disabled={loadingProvider !== null}
            />
        </View>
    );
}
