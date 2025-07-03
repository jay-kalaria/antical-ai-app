import { config } from "dotenv";

// Load environment variables
config();

export default {
    expo: {
        name: "Nutricado",
        slug: "Nutricado",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/app_images/icon.png",
        scheme: "nutricado",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.nutricado.app",
            icon: "./assets/app_images/icon.png",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/app_images/icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.nutricado.app",
            edgeToEdgeEnabled: true,
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/app_images/icon.png",
        },
        plugins: [
            "expo-router",
            "expo-web-browser",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
            [
                "expo-audio",
                {
                    microphonePermission:
                        "Allow $(PRODUCT_NAME) to access your microphone.",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            openaiApiKey: process.env.OPENAI_API_KEY,
            eas: {
                projectId: "d98f4252-ee39-47c9-b040-acba707abe55",
            },
        },
    },
};
