import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { MealProvider } from "@/contexts/MealContext";
import { RecordingProvider } from "@/contexts/RecordingContext";
import { useColorScheme } from "@/hooks/archive/useColorScheme";

// Create a client
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
            <MealProvider>
                <RecordingProvider>
                    <ThemeProvider
                        value={
                            colorScheme === "dark" ? DarkTheme : DefaultTheme
                        }
                    >
                        <Stack>
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </RecordingProvider>
            </MealProvider>
        </QueryClientProvider>
    );
}
