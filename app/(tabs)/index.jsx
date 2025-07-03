import CaptureButton from "@/components/home/CaptureButton";
import CustomAlert from "@/components/home/CustomAlert";
import ErrorBanner from "@/components/home/ErrorBanner";
import FeedbackModal from "@/components/home/FeedbackModal";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import { useMeal } from "@/contexts/MealContext";
import { useRecording } from "@/contexts/RecordingContext";
import { AudioModule } from "expo-audio";
import React, { useEffect } from "react";
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import "../../global.css";

// Speech bubble component
const SpeechBubble = ({ text }) => (
    <View className="absolute -top-12 -left-8 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <Text className="text-gray-700 font-medium text-sm">{text}</Text>
        {/* Speech bubble tail */}
        <View className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-200 transform rotate-45" />
    </View>
);

export default function HomeScreen() {
    const {
        transcript,
        setTranscript,
        mealScore,
        cycleMealScore,
        isProcessing,
        saveMeal,
        getMealMetrics,
        setMealData,
        showCustomAlert,
        alertConfig,
    } = useMeal();

    // Use only recording context for recording state
    const {
        showFeedback,
        setShowFeedback,
        isRecording,
        record,
        stopRecording,
    } = useRecording();

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission to access microphone was denied");
            }
        })();
    }, []);

    // Get current time for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with greeting and streak */}
            <View className="flex-row items-center justify-between p-4 pt-6">
                <View className="flex-1">
                    <Text className="text-2xl font-semibold text-gray-800">
                        {getGreeting()}, Max
                    </Text>
                </View>
                <View className="border border-orange-300 rounded-xl flex-row p-2 min-w-[80px] items-center">
                    <Text className="text-white font-bold text-lg">🔥</Text>
                    <Text className="text-orange-500 font-semibold text-sm">
                        7 days
                    </Text>
                    <Text className="text-orange-500 ml-1 text-xs opacity-90">
                        streak
                    </Text>
                </View>
            </View>

            {/* Error Banner - Shows when there are meal parsing errors */}
            <ErrorBanner />

            {/* Daily Grade Display Demo */}
            {/* <View className="px-4 py-2">
                <DailyGradeDisplay
                    currentGrade="A"
                    size="medium"
                    showLabel={true}
                />
            </View> */}

            <View className="flex-1 items-center justify-end">
                <RecentlyAdded />
                {/* 
                <View className="mb-28" activeOpacity={0.8}>
                    <MealGauge />
                </View> */}

                <TouchableOpacity className=" p-5">
                    <View className="relative">
                        <CaptureButton
                            size={260}
                            isRecording={isRecording}
                            isProcessing={isProcessing}
                            onPress={
                                isProcessing
                                    ? null
                                    : isRecording
                                    ? stopRecording
                                    : record
                            }
                        />
                        { !isProcessing && <SpeechBubble text="What did you eat today?" />}
                    </View>
                </TouchableOpacity>

                {/* <View className="w-full bg-white rounded-t-3xl shadow-lg pt-4 pb-14 px-2">
                    <InsightsPanel />
                </View> */}
            </View>

            {/* Custom Alert - Alternative to ErrorBanner */}
            <CustomAlert
                visible={showCustomAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                showCancel={alertConfig.showCancel}
            />

            <FeedbackModal
                visible={showFeedback}
                tip={null}
                onClose={() => setShowFeedback(false)}
                onEdit={() => setShowFeedback(false)}
            />
        </SafeAreaView>
    );
}
