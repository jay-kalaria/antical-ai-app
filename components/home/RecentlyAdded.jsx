import { Text, View } from "react-native";

const RECENT_MEALS = [
    {
        grade: "C",
        color: "bg-nutriscore-c",
        time: "9:40",
        items: [
            { emoji: "🥣", text: "Granola with yogurt" },
            { emoji: "🍌", text: "Banana" },
            { emoji: "🧃", text: "Orange juice" },
        ],
        bg: "bg-yellow-50",
        border: "border-yellow-100",
    },
    {
        grade: "B",
        color: "bg-nutriscore-b",
        time: "13:20",
        items: [
            { emoji: "🥯", text: "Bagel" },
            { emoji: "🧀", text: "Cream cheese" },
            { emoji: "🧃", text: "Apple juice" },
        ],
        bg: "bg-lime-50",
        border: "border-lime-100",
    },
];

export default function RecentlyAdded() {
    return (
        <View className="absolute top-0 w-full p-6 mb-6">
            <Text className="text-md font-bold text-gray-800 mb-3">
                Recently Added
            </Text>
            {RECENT_MEALS.map((meal, idx) => (
                <View
                    key={idx}
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
