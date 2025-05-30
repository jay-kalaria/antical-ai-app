import Colors from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Tip } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TipCardProps {
    tip: Tip;
    onPress?: () => void;
}

export default function TipCard({ tip, onPress }: TipCardProps) {
    return (
        <TouchableOpacity
            className="flex-row
            
            rounded-2xl
            p-4
            mr-4
            mb-4
            w-72
            shadow-sm ml-1 mt-1 bg-[#F6FFF4] "
            //style={{ backgroundColor: "red" }}
            activeOpacity={0.9}
            onPress={onPress}
        >
            {/* <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{tip.emoji}</Text>
            </View> */}
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-semibold text-gray-900 mr-1">
                        {tip.title}
                    </Text>
                    <Text className="text-lg">{tip.emoji}</Text>
                </View>
                <Text className="text-md text-gray-600 leading-5">
                    {tip.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: Layout.radius.xl,
        padding: Layout.spacing.md,
        marginRight: Layout.spacing.md,
        marginBottom: Layout.spacing.md,
        width: 280,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    emojiContainer: {
        width: 44,
        height: 44,
        borderRadius: Layout.radius.md,
        backgroundColor: Colors.gray[100],
        alignItems: "center",
        justifyContent: "center",
        marginRight: Layout.spacing.md,
    },
    emoji: {
        fontSize: 20,
    },
});
