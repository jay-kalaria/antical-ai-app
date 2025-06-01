import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { MealProvider } from "@/contexts/MealContext";
import { RecordingProvider } from "@/contexts/RecordingContext";
import { useColorScheme } from "@/hooks/archive/useColorScheme";
import { useRealtime } from "@/hooks/useRealtime";
import { QueryProvider } from "@/utils/QueryProvider";

// Component that uses the realtime hook after QueryProvider is available
function AppContent() {
    // Initialize real-time subscriptions
    const realtimeStatus = useRealtime({
        pauseOnBackground: true, // Pause real-time when app is backgrounded
        autoConnect: true, // Auto-connect on app start
    });

    return (
        <MealProvider>
            <RecordingProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </RecordingProvider>
        </MealProvider>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <QueryProvider>
            <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <AppContent />
            </ThemeProvider>
        </QueryProvider>
    );
}
