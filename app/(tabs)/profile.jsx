import Colors from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
    const [showMacros, setShowMacros] = useState(false);
    const { user, signOut } = useAuth();

    const toggleShowMacros = () => {
        setShowMacros(!showMacros);
    };

    const handleSignOut = async () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    const { error } = await signOut();
                    if (error) {
                        Alert.alert("Error", "Failed to sign out");
                    } else {
                        router.replace("/(auth)/login");
                    }
                },
            },
        ]);
    };

    const getUserDisplayName = () => {
        if (user?.user_metadata?.name) {
            return user.user_metadata.name;
        }
        if (user?.email) {
            return user.email.split("@")[0]; // Use part before @ as display name
        }
        return "User"; // Default fallback
    };

    const MenuItem = ({ icon, title, onPress }) => {
        return (
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    {icon}
                    <Text style={styles.menuItemTitle}>{title}</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.gray[400]}
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
                            }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.name}>{getUserDisplayName()}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.toggleItem}>
                        <View style={styles.toggleItemLeft}>
                            <View style={styles.toggleIcon}>
                                <Ionicons
                                    name="heart"
                                    size={20}
                                    color={Colors.primary}
                                />
                            </View>
                            <View>
                                <Text style={styles.toggleItemTitle}>
                                    Show calories & macros
                                </Text>
                                <View style={styles.proBadge}>
                                    <Text style={styles.proBadgeText}>PRO</Text>
                                </View>
                            </View>
                        </View>
                        <Switch
                            value={showMacros}
                            onValueChange={toggleShowMacros}
                            trackColor={{
                                false: Colors.gray[300],
                                true: Colors.primaryLight,
                            }}
                            thumbColor={
                                showMacros ? Colors.primary : Colors.gray[100]
                            }
                            disabled={true} // Disabled for now since we don't have pro logic
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <MenuItem
                        icon={
                            <Ionicons
                                name="target"
                                size={20}
                                color={Colors.primary}
                            />
                        }
                        title="Nutrition Goals"
                        onPress={() => {}}
                    />

                    <MenuItem
                        icon={
                            <Ionicons
                                name="phone-portrait"
                                size={20}
                                color={Colors.primary}
                            />
                        }
                        title="Connected Devices"
                        onPress={() => {}}
                    />

                    <MenuItem
                        icon={
                            <Ionicons
                                name="globe"
                                size={20}
                                color={Colors.primary}
                            />
                        }
                        title="Language"
                        onPress={() => {}}
                    />

                    <MenuItem
                        icon={
                            <Ionicons
                                name="notifications"
                                size={20}
                                color={Colors.primary}
                            />
                        }
                        title="Notifications"
                        onPress={() => {}}
                    />

                    <MenuItem
                        icon={
                            <Ionicons
                                name="settings"
                                size={20}
                                color={Colors.primary}
                            />
                        }
                        title="App Settings"
                        onPress={() => {}}
                    />
                </View>

                <View style={styles.section}>
                    <MenuItem
                        icon={
                            <Ionicons
                                name="log-out"
                                size={20}
                                color={Colors.red?.[500] || "#ef4444"}
                            />
                        }
                        title="Sign Out"
                        onPress={handleSignOut}
                    />
                </View>

                {!showMacros && (
                    <TouchableOpacity style={styles.proCard}>
                        <View style={styles.proCardContent}>
                            <View style={styles.proIcon}>
                                <Text style={styles.proIconText}>✨</Text>
                            </View>
                            <View style={styles.proTextContainer}>
                                <Text style={styles.proTitle}>
                                    Upgrade to VitalBite Pro
                                </Text>
                                <Text style={styles.proDescription}>
                                    Unlock deeper insights and personalized
                                    recommendations
                                </Text>
                            </View>
                        </View>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceText}>$4/mo</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.xl,
        paddingBottom: Layout.spacing.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.gray[900],
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: Layout.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: "hidden",
        marginBottom: Layout.spacing.md,
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    avatar: {
        width: "100%",
        height: "100%",
    },
    name: {
        fontSize: 20,
        fontWeight: "600",
        color: Colors.gray[900],
    },
    section: {
        paddingHorizontal: Layout.spacing.lg,
        paddingVertical: Layout.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.gray[700],
        marginBottom: Layout.spacing.md,
    },
    toggleItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Layout.spacing.sm,
    },
    toggleItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggleIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Layout.spacing.md,
    },
    toggleItemTitle: {
        fontSize: 16,
        color: Colors.gray[800],
    },
    proBadge: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    proBadgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: "700",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Layout.spacing.md,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemTitle: {
        fontSize: 16,
        color: Colors.gray[800],
        marginLeft: Layout.spacing.md,
    },
    proCard: {
        margin: Layout.spacing.lg,
        padding: Layout.spacing.lg,
        backgroundColor: Colors.gray[50],
        borderRadius: Layout.radius.xl,
        borderWidth: 1,
        borderColor: Colors.gray[200],
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    proCardContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    proIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.accentLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Layout.spacing.md,
    },
    proIconText: {
        fontSize: 18,
    },
    proTextContainer: {
        flex: 1,
    },
    proTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.gray[900],
        marginBottom: 4,
    },
    proDescription: {
        fontSize: 13,
        color: Colors.gray[600],
    },
    priceTag: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: Layout.radius.md,
    },
    priceText: {
        color: Colors.white,
        fontWeight: "700",
        fontSize: 14,
    },
});
