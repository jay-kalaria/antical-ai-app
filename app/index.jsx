import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function IndexScreen() {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/login");
            }
        }
    }, [isAuthenticated, loading]);

    // Show loading screen while checking auth status
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text className="text-gray-600 mt-4 text-base">
                Loading your session...
            </Text>
        </View>
    );
}
