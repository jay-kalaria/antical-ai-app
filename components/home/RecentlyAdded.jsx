import { useMeals } from "@/hooks/useMeals";
import { useMemo } from "react";
import { Text, View } from "react-native";

// Nutriscore color mapping
const NUTRISCORE_COLORS = {
    A: "bg-green-500",
    B: "bg-lime-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    E: "bg-red-500",
};

// Background and border colors for meal cards
const MEAL_CARD_STYLES = {
    A: { bg: "bg-green-50", border: "border-green-100" },
    B: { bg: "bg-lime-50", border: "border-lime-100" },
    C: { bg: "bg-yellow-50", border: "border-yellow-100" },
    D: { bg: "bg-orange-50", border: "border-orange-100" },
    E: { bg: "bg-red-50", border: "border-red-100" },
};

// Helper function to format time from meal date
const formatMealTime = (mealDate) => {
    const date = new Date(mealDate);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
    });
};

// Helper function to parse meal name into items with emojis
const parseMealItems = (mealName) => {
    if (!mealName) return null; // Return null if no meal name

    // Split by common delimiters and create items
    const items = mealName
        .split(/,|;|\sand\s|\+/)
        .map((item) => item.trim())
        .filter(Boolean);

    // Simple emoji mapping based on keywords
    const getEmoji = (item) => {
        const lowerItem = item.toLowerCase();
        if (lowerItem.includes("salmon") || lowerItem.includes("fish"))
            return "🐟";
        if (lowerItem.includes("chicken") || lowerItem.includes("turkey"))
            return "🍗";
        if (lowerItem.includes("beef") || lowerItem.includes("steak"))
            return "🥩";
        if (lowerItem.includes("egg")) return "🥚";
        if (lowerItem.includes("salad") || lowerItem.includes("lettuce"))
            return "🥗";
        if (lowerItem.includes("rice") || lowerItem.includes("quinoa"))
            return "🍚";
        if (lowerItem.includes("bread") || lowerItem.includes("toast"))
            return "🍞";
        if (lowerItem.includes("pizza")) return "🍕";
        if (lowerItem.includes("pasta")) return "🍝";
        if (lowerItem.includes("yogurt")) return "🥣";
        if (lowerItem.includes("banana")) return "🍌";
        if (lowerItem.includes("apple")) return "🍎";
        if (lowerItem.includes("orange")) return "🍊";
        if (lowerItem.includes("berries") || lowerItem.includes("strawberry"))
            return "🍓";
        if (lowerItem.includes("avocado")) return "🥑";
        if (lowerItem.includes("broccoli")) return "🥦";
        if (lowerItem.includes("carrot")) return "🥕";
        if (lowerItem.includes("juice")) return "🧃";
        if (lowerItem.includes("coffee")) return "☕";
        if (lowerItem.includes("water")) return "💧";
        return "🍽️"; // Default food emoji
    };

    return items.slice(0, 3).map((item) => ({
        emoji: getEmoji(item),
        text: item,
    }));
};

export default function RecentlyAdded() {
    const { data: meals, isLoading, error } = useMeals();

    // Get the 2 most recent meals
    const recentMeals = useMemo(() => {
        if (!meals || meals.length === 0) return [];
        return meals
            .filter((meal) => meal.meal_name && meal.meal_name.trim()) // Filter out meals without names
            .slice(0, 3)
            .map((meal) => {
                const grade = meal.meal_grade || "NA";
                const cardStyle = MEAL_CARD_STYLES[grade] || MEAL_CARD_STYLES.C;
                const items = parseMealItems(meal.meal_name);

                // Skip if parseMealItems returns null
                if (!items) return null;

                return {
                    id: meal.id,
                    grade,
                    color: NUTRISCORE_COLORS[grade] || NUTRISCORE_COLORS.C,
                    time: formatMealTime(meal.meal_date),
                    items,
                    bg: cardStyle.bg,
                    border: cardStyle.border,
                };
            })
            .filter(Boolean); // Remove any null entries
    }, [meals]);

    if (isLoading) {
        return (
            <View className="absolute top-0 w-full p-6 mb-6">
                <Text className="text-md font-bold text-gray-800 mb-3">
                    Recently Added
                </Text>
                <View className="flex-row items-center shadow-sm rounded-2xl border bg-gray-50 border-gray-100 px-4 py-4 mb-4">
                    <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center mr-4">
                        <Text className="text-white font-bold text-3xl">
                            ...
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-500 font-poppins">
                            Loading recent meals...
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="absolute top-0 w-full p-6 mb-6">
                <Text className="text-md font-bold text-gray-800 mb-3">
                    Recently Added
                </Text>
                <View className="flex-row items-center shadow-sm rounded-2xl border bg-red-50 border-red-100 px-4 py-4 mb-4">
                    <Text className="text-sm text-red-600 font-poppins">
                        Error loading meals
                    </Text>
                </View>
            </View>
        );
    }

    if (recentMeals.length === 0) {
        return (
            <View className="absolute top-0 w-full p-6 mb-6">
                <Text className="text-md font-bold text-gray-800 mb-3">
                    Recently Added
                </Text>
                <View className="flex-row items-center shadow-sm rounded-2xl border bg-blue-50 border-blue-100 px-4 py-4 mb-4">
                    <View className="w-16 h-16 rounded-full bg-blue-200 items-center justify-center mr-4">
                        <Text className="text-blue-600 font-bold text-2xl">
                            +
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-blue-700 font-poppins font-medium">
                            No meals logged yet
                        </Text>
                        <Text className="text-xs text-blue-600 font-poppins">
                            Start by recording your first meal!
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="absolute top-0 w-full p-6 mb-6">
            <Text className="text-md font-bold text-gray-800 mb-3">
                Recently Added
            </Text>
            {recentMeals.map((meal, idx) => (
                <View
                    key={meal.id}
                    className={`flex-row items-center shadow-sm rounded-2xl border ${meal.bg} ${meal.border} px-4 py-4 mb-4`}
                >
                    <View
                        className={`w-16 h-16 rounded-full ${meal.color} items-center justify-center mr-4`}
                    >
                        <Text className="text-white font-bold text-3xl">
                            {meal.grade}
                        </Text>
                    </View>
                    <View className="flex-1">
                        {meal.items.map((item, i) => (
                            <Text
                                key={i}
                                className="text-sm text-gray-800 font-poppins"
                            >
                                {item.emoji} {item.text}
                            </Text>
                        ))}
                    </View>
                    <Text className="text-sm text-gray-500 font-semibold">
                        {meal.time}
                    </Text>
                </View>
            ))}
        </View>
    );
}
