import { useRealtimeStatus } from "@/hooks/useRealtime";
import React from "react";
import { Text, View } from "react-native";

export function RealtimeStatus({ visible = __DEV__ }) {
    const status = useRealtimeStatus();

    if (!visible) return null;

    const getStatusColor = () => {
        switch (status) {
            case "CONNECTED":
                return "#10B981"; // green
            case "DISCONNECTED":
                return "#EF4444"; // red
            case "CONNECTING":
                return "#F59E0B"; // amber
            default:
                return "#6B7280"; // gray
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "CONNECTED":
                return "🟢 Real-time";
            case "DISCONNECTED":
                return "🔴 Offline";
            case "CONNECTING":
                return "🟡 Connecting...";
            case "NOT_INITIALIZED":
                return "⚪ Not initialized";
            default:
                return "⚪ Unknown";
        }
    };

    return (
        <View className="absolute top-12 right-4 z-50 bg-black/80 px-3 py-1 rounded-full">
            <Text
                className="text-white text-xs font-medium"
                style={{ color: getStatusColor() }}
            >
                {getStatusText()}
            </Text>
        </View>
    );
}

// Simple dot indicator for production use
export function RealtimeIndicator({ className = "" }) {
    const status = useRealtimeStatus();

    const getStatusColor = () => {
        switch (status) {
            case "CONNECTED":
                return "bg-green-500";
            case "DISCONNECTED":
                return "bg-red-500";
            case "CONNECTING":
                return "bg-yellow-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <View
            className={`w-2 h-2 rounded-full ${getStatusColor()} ${className}`}
        />
    );
}
