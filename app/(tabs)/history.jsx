import Colors from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useStoredExplanationsHistory } from "@/hooks/useStoredExplanations";
import React, { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function HistoryScreen() {
    const [refreshing, setRefreshing] = useState(false);

    // Fetch daily explanations for the past 7 days
    const {
        data: dailyExplanations,
        isLoading,
        error,
        refetch,
    } = useStoredExplanationsHistory(7);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Get grade color from your existing color system
    const getGradeColor = (grade) => {
        switch (grade) {
            case "A":
                return Colors.nutriScore?.A || "#24C08B";
            case "B":
                return Colors.nutriScore?.B || "#8BC34A";
            case "C":
                return Colors.nutriScore?.C || "#FFC107";
            case "D":
                return Colors.nutriScore?.D || "#FF9800";
            case "E":
                return Colors.nutriScore?.E || "#F44336";
            default:
                return "#9CA3AF"; // Gray for no data
        }
    };

    // Format the statement to highlight key terms (remove ** formatting)
    const formatStatement = (statement) => {
        return statement?.replace(/\*\*(.*?)\*\*/g, "$1") || "";
    };

    // Determine current day for highlighting
    const todayIndex = 0; // Today is always the first item (index 0)

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>History</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary || "#24C08B"}
                    />
                    <Text style={styles.loadingText}>
                        Loading your nutrition history...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>History</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Unable to load history</Text>
                    <Text style={styles.errorSubtext}>
                        Please check your connection and try again
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
                <Text style={styles.subtitle}>
                    Your daily nutrition grades and insights
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.primary || "#24C08B"}
                    />
                }
            >
                {dailyExplanations?.map((item, idx) => (
                    <View key={item.date} style={{ marginBottom: 16 }}>
                        <Text
                            style={[
                                styles.dayLabel,
                                idx === todayIndex && styles.dayLabelActive,
                            ]}
                        >
                            {item.dayName}
                            {idx === todayIndex && (
                                <Text style={styles.todayIndicator}>
                                    {" "}
                                    (Today)
                                </Text>
                            )}
                        </Text>
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Text style={styles.feedbackText}>
                                    {formatStatement(item.statement)}
                                </Text>

                                {/* Show key factors if available */}
                                {item.keyFactors &&
                                    item.keyFactors.length > 0 && (
                                        <View style={styles.factorsContainer}>
                                            {item.keyFactors
                                                .slice(0, 2)
                                                .map((factor, factorIdx) => (
                                                    <View
                                                        key={factorIdx}
                                                        style={[
                                                            styles.factorChip,
                                                            factor.type ===
                                                                "positive" &&
                                                                styles.factorPositive,
                                                            factor.type ===
                                                                "negative" &&
                                                                styles.factorNegative,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.factorText,
                                                                factor.type ===
                                                                    "positive" &&
                                                                    styles.factorTextPositive,
                                                                factor.type ===
                                                                    "negative" &&
                                                                    styles.factorTextNegative,
                                                            ]}
                                                        >
                                                            {factor.text}
                                                        </Text>
                                                    </View>
                                                ))}
                                        </View>
                                    )}
                            </View>

                            <View
                                style={[
                                    styles.gradeCircle,
                                    {
                                        backgroundColor: getGradeColor(
                                            item.grade
                                        ),
                                    },
                                ]}
                            >
                                <Text style={styles.gradeText}>
                                    {item.grade || "?"}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Show empty state if no data */}
                {(!dailyExplanations || dailyExplanations.length === 0) && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            Start logging meals to see your history
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            Your daily grades and insights will appear here
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fcf7",
    },
    header: {
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.xl,
        paddingBottom: Layout.spacing.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.gray?.[900] || "#1F2937",
    },
    subtitle: {
        fontSize: 14,
        color: Colors.gray?.[600] || "#6B7280",
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Layout.spacing.lg,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.gray?.[600] || "#6B7280",
        textAlign: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Layout.spacing.lg,
    },
    errorText: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.gray?.[900] || "#1F2937",
        textAlign: "center",
    },
    errorSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.gray?.[600] || "#6B7280",
        textAlign: "center",
    },
    listContent: {
        paddingHorizontal: Layout.spacing.lg,
        paddingBottom: Layout.spacing.xxl,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.gray?.[800] || "#374151",
        marginBottom: 4,
    },
    dayLabelActive: {
        fontWeight: "700",
        color: Colors.primary || "#24C08B",
    },
    todayIndicator: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.gray?.[600] || "#6B7280",
    },
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#d6f5c9",
        marginBottom: 4,
    },
    cardContent: {
        flex: 1,
        marginRight: 16,
    },
    feedbackText: {
        fontSize: 16,
        color: Colors.gray?.[900] || "#1F2937",
        fontWeight: "400",
        lineHeight: 22,
    },
    factorsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
        gap: 6,
    },
    factorChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.gray?.[100] || "#F3F4F6",
    },
    factorPositive: {
        backgroundColor: "#DCFCE7", // Light green
    },
    factorNegative: {
        backgroundColor: "#FEE2E2", // Light red
    },
    factorText: {
        fontSize: 12,
        fontWeight: "500",
        color: Colors.gray?.[700] || "#374151",
    },
    factorTextPositive: {
        color: "#166534", // Dark green
    },
    factorTextNegative: {
        color: "#991B1B", // Dark red
    },
    gradeCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    gradeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 22,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.gray?.[900] || "#1F2937",
        textAlign: "center",
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.gray?.[600] || "#6B7280",
        textAlign: "center",
    },
});
