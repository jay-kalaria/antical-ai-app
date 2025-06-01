import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { getRealtimeManager } from "../services/realtime";

/**
 * Hook to manage real-time subscriptions across the app
 * This should be used once at the app root level
 */
export function useRealtime(options = {}) {
    const { pauseOnBackground = true, autoConnect = true } = options;

    const queryClient = useQueryClient();
    const [connectionStatus, setConnectionStatus] = useState("DISCONNECTED");
    const [realtimeManager, setRealtimeManager] = useState(null);

    useEffect(() => {
        if (!autoConnect) return;

        const manager = getRealtimeManager(queryClient);
        setRealtimeManager(manager);

        // Connect immediately
        manager.connect();
        setConnectionStatus("CONNECTING");

        // Monitor connection status
        const checkStatus = () => {
            const status = manager.getConnectionStatus();
            setConnectionStatus(
                status.isConnected ? "CONNECTED" : "DISCONNECTED"
            );
        };

        const statusInterval = setInterval(checkStatus, 2000);

        return () => {
            clearInterval(statusInterval);
            if (manager) {
                manager.disconnect();
            }
        };
    }, [queryClient, autoConnect]);

    useEffect(() => {
        if (!pauseOnBackground || !realtimeManager) return;

        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === "background") {
                console.log("App backgrounded - pausing real-time");
                realtimeManager.disconnect();
                setConnectionStatus("DISCONNECTED");
            } else if (nextAppState === "active") {
                console.log("App foregrounded - resuming real-time");
                realtimeManager.connect();
                setConnectionStatus("CONNECTING");
            }
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        return () => {
            subscription?.remove();
        };
    }, [pauseOnBackground, realtimeManager]);

    const manualConnect = () => {
        if (realtimeManager) {
            realtimeManager.connect();
            setConnectionStatus("CONNECTING");
        }
    };

    const manualDisconnect = () => {
        if (realtimeManager) {
            realtimeManager.disconnect();
            setConnectionStatus("DISCONNECTED");
        }
    };

    return {
        connectionStatus,
        isConnected: connectionStatus === "CONNECTED",
        connect: manualConnect,
        disconnect: manualDisconnect,
        manager: realtimeManager,
    };
}

/**
 * Simple hook to check real-time connection status
 * Can be used in components to show connection indicators
 */
export function useRealtimeStatus() {
    const [status, setStatus] = useState("UNKNOWN");

    useEffect(() => {
        const manager = getRealtimeManager();
        if (!manager) {
            setStatus("NOT_INITIALIZED");
            return;
        }

        const checkStatus = () => {
            const { isConnected } = manager.getConnectionStatus();
            setStatus(isConnected ? "CONNECTED" : "DISCONNECTED");
        };

        checkStatus();
        const interval = setInterval(checkStatus, 3000);

        return () => clearInterval(interval);
    }, []);

    return status;
}
