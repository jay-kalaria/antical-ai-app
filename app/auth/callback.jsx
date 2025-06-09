import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthCallback() {
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            router.replace("/(tabs)");
        }
    }, [session]);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text className="text-gray-600 mt-4 text-base">
                Completing authentication...
            </Text>
        </View>
    );
}
