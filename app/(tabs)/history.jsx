import Colors from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { mockMeals } from "@/utils/archive/mockData_old";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const FILTERS = [
    { id: "all", label: "All" },
    { id: "high-protein", label: "High protein" },
    { id: "low-sugar", label: "Low sugar" },
    { id: "homemade", label: "Homemade" },
];

// Mock data for the new design
const WEEKLY_FEEDBACK = [
    {
        day: "Mon",
        feedback: "Great mix of **veggies and lentils** — balanced and fresh!",
        grade: "A",
        color: Colors.nutriScore.A,
    },
    {
        day: "Tue",
        feedback:
            "**Eggs and salad** kept things clean and filling. Well done!",
        grade: "A",
        color: Colors.nutriScore.A,
    },
    {
        day: "Wed",
        feedback: "Too much **white bread, not enough fiber**-rich foods.",
        grade: "C",
        color: Colors.nutriScore.C,
    },
    {
        day: "Thu",
        feedback: "The **noodles** — try adding some veggies next time.",
        grade: "E",
        color: Colors.nutriScore.E,
    },
    {
        day: "Fri",
        feedback:
            "Meals were complete! Just a bit **heavy with the pastry and chips**.",
        grade: "B",
        color: Colors.nutriScore.B,
    },
    // Add Sat/Sun as needed
];

export default function HistoryScreen() {
    const [selectedFilter, setSelectedFilter] = useState("all");

    const getFilteredMeals = () => {
        switch (selectedFilter) {
            case "high-protein":
                return mockMeals.filter((meal) => meal.protein >= 20);
            case "low-sugar":
                // For mock purposes, we'll just use a subset of meals
                return mockMeals.filter((_, index) => index % 3 === 0);
            case "homemade":
                return mockMeals.filter((meal) => meal.isHomemade);
            default:
                return mockMeals;
        }
    };

    const filteredMeals = getFilteredMeals();

    const handleMealPress = (meal) => {
        // Handle meal selection
        console.log("Selected meal:", meal.name);
    };

    // Optionally, determine the current day to highlight
    const todayIndex = new Date().getDay() - 1; // 0 = Monday

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {WEEKLY_FEEDBACK.map((item, idx) => (
                    <View key={item.day} style={{ marginBottom: 16 }}>
                        <Text
                            style={[
                                styles.dayLabel,
                                idx === todayIndex && styles.dayLabelActive,
                            ]}
                        >
                            {item.day}
                        </Text>
                        <View style={styles.card}>
                            <Text style={styles.feedbackText}>
                                {item.feedback.replace(
                                    /\*\*(.*?)\*\*/g,
                                    (m, p1) => p1
                                )}
                            </Text>
                            <View
                                style={[
                                    styles.gradeCircle,
                                    { backgroundColor: item.color },
                                ]}
                            >
                                <Text style={styles.gradeText}>
                                    {item.grade}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
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
        color: Colors.gray[900],
    },
    listContent: {
        paddingHorizontal: Layout.spacing.lg,
        paddingBottom: Layout.spacing.xxl,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.gray[800],
        marginBottom: 4,
    },
    dayLabelActive: {
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
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
    feedbackText: {
        flex: 1,
        fontSize: 16,
        color: Colors.gray[900],
        fontWeight: "400",
    },
    gradeCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 16,
    },
    gradeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 22,
    },
});
