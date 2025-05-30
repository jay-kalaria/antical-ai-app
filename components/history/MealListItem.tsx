import Colors from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Meal } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NutriScoreBadge from "../home/NutriScoreBadge";

interface MealListItemProps {
    meal: Meal;
    onPress: (meal: Meal) => void;
}

export default function MealListItem({ meal, onPress }: MealListItemProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={() => onPress(meal)}
        >
            <View style={styles.content}>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{formatTime(meal.dateTime)}</Text>
                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>{meal.name}</Text>
                    <View style={styles.tagsContainer}>
                        {meal.isHomemade && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Homemade</Text>
                            </View>
                        )}
                        {meal.protein >= 20 && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>High Protein</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.scoreContainer}>
                    <NutriScoreBadge grade={meal.nutriScore} size="small" />
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#9ca3af"
                        style={{ marginLeft: 8 }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Layout.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeContainer: {
        marginRight: Layout.spacing.md,
    },
    time: {
        fontSize: 14,
        color: Colors.gray[500],
        fontWeight: "500",
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.gray[800],
        marginBottom: 4,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tag: {
        backgroundColor: Colors.gray[100],
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.full,
        marginRight: Layout.spacing.xs,
        marginBottom: Layout.spacing.xs,
    },
    tagText: {
        fontSize: 12,
        color: Colors.gray[600],
    },
    scoreContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
